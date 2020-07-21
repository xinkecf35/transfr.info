<template>
  <div id="card">
    <!-- Regular View -->
    <div v-if="!edit" class="grid card-main level-2">
      <div id="header" class="row">
        <span>{{firstName}} {{lastName}}</span>
        <div id="edit">
          <div id="share-button-container">
            <button id="share-modal" class="level-1 share-button"
              @click="presentShareModal()">
              Share
            </button>
            <div id="share-popover" class="level-1">
              <h4>Link to Card:</h4>
              <div id="share-link-row">
                <input type="text" class="share-link-text" readonly
                   v-model="shareURL">
                <button id="copyLink" class="share-link-button">
                  <img src="../assets/clipboard.svg">
                </button>
              </div>
            </div>
          </div>
          <button @click="edit = !edit" class="level-1 editing-button">
            Edit
          </button>
        </div>
      </div>
      <div class="row" v-for="key in Object.keys(objectOptionals)" :key="key">
        <div class="column-props">{{key}}</div>
        <div class="column-values column-list">
          <ul>
            <li v-for="item in objectOptionals[key]" :key="item.id">
              <div class="column-list-label" >{{item.type}}</div>
              <div class="column-list-value" v-if="key !== 'address'">
                <span>{{item.value}}</span>
              </div>
              <div v-else>
                <ul style="min-width: 50%; float:right">
                  <li v-for="address in extractLexicalArray(item.value)"
                    :key="address.id" class="address-list">
                    <span>{{address}}</span>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="row" v-for="key in Object.keys(simpleOptionals)" :key="key">
        <div class="column-props">{{key}}</div>
        <div class="column-values">{{simpleOptionals[key]}}</div>
      </div>
    </div>
    <div v-else class="grid card-main level-2">
      <Error v-if="presentError">
        {{errors[0].message}}
      </Error>
      <div id="header" class="row">
        <span>Editing</span>
        <div id="edit">
          <button @click="abort()" class="level-1 editing-button-error">
            Cancel
          </button>
          <button @click="commitEdits()" class="level-1 editing-button">
            Done
          </button>
        </div>
      </div>
      <edit-input
        v-for="item in editInputValues"
        :profileId="profileId"
        :displayText="item.displayText"
        :attribute="item.attribute"
        :isComplex="item.complex"
        :key="item.id"/>
      <div id="footer" class="row">
        <div id="edit">
          <button @click="deleteCard()" class="level-1 editing-button-error">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex';
import EditInput from '@/components/EditInputs/EditInput';
import Error from '@/components/Error';
import {capitalize, isEmptyOrNull} from '@/functions';

const requiredAttributes = ['description'];
const optionalAttributes = [
  'telephone',
  'email',
  'organization',
  'address',
  'nickname',
  'note',
  'birthday',
  // 'impp', Future development
];
const cardAttributes = requiredAttributes.concat(optionalAttributes);
const complexAttributes = ['address', 'email', 'telephone'];
const textForAttribute = (attr) => attr !== 'IMPP' ? capitalize(attr) : 'IMPP';

/**
 * Function to create a patch object for JSON patch (RFC 6902)
 * @param {String} attribute path to be patched
 * @param {any} currentValue value that is currently assigned
 * @param {any} newValue New value that is to be patched
 * @return {Object} dictionary of items in line with JSON Patch
 */
function generatePatchObject(attribute, currentValue, newValue) {
  let operation = 'replace';
  if (isEmptyOrNull(newValue)) {
    // If it removes the current value
    operation = 'remove';
  } else if (isEmptyOrNull(currentValue)) {
    operation = 'add';
  }
  let patch;
  if (operation === 'remove') {
    patch = {op: operation, path: '/' + attribute};
  } else {
    patch = {op: operation, path: '/' + attribute, value: newValue};
  }
  return patch;
}

export default {
  data() {
    return {
      values: {
        description: '',
        telephone: [],
        email: [],
        organization: '',
        address: [],
        nickname: '',
        note: '',
        birthday: '',
        impp: '',
      },
      edit: false,
      patch: [],
      original: '',
      errors: [],
    };
  },
  computed: {
    editInputValues() {
      return cardAttributes.map((attribute) => ({
        attribute,
        displayText: textForAttribute(attribute),
        complex: complexAttributes.indexOf(attribute) > -1,
        value: this.values[attribute],
      }));
    },
    name() {
      return this.firstName + ' ' + this.lastName;
    },
    /*
     * This computed property returns properties that are objects
     * This simply uses an array as include and iterates over that
     * returns an object filled the key value pairs
     */
    objectOptionals: function() {
      let result = {};
      complexAttributes.forEach((key) => {
        const values = this.values[key];
        if (values.length !== 0) {
          result[key] = values.filter((value) => !isEmptyOrNull(value));
        }
      });
      return result;
    },
    /*
     * This computed property returns properties that are text only
     * returns an object filled with the simple key-value pairs
     */
    presentError: function() {
      const errors = this.errors;
      return errors.length && errors[errors.length-1].field === 'modal-error';
    },
    simpleOptionals: function() {
      const result = {};
      const exclude = ['address', 'description', 'email', 'telephone'];
      const filtered = cardAttributes.filter((property) => {
        return exclude.indexOf(property) === -1;
      });
      filtered.forEach((key) => {
        if (!isEmptyOrNull(this.values[key])) {
          result[key] = this.values[key];
        }
      });
      return result;
    },
    shareURL: function() {
      const shareBaseURL = process.env.NODE_ENV === 'development' ?
        'https://transfr.test/card' :
        'https://transfr.info/card';
      return `${shareBaseURL}/${this.profileId}`;
    },
    ...mapGetters('user', ['firstName', 'lastName']),
  },
  components: {
    EditInput,
    Error,
  },
  props: {
    profileId: {
      type: String,
      required: true,
    },
    newCard: {
      type: Boolean,
      default: true,
    },
  },
  events: [
    'card-update',
    'card-new-abort',
    'card-delete',
  ],
  methods: {
    // Move functionality into vuex somehwo
    abort: function() {
      // abort changes and return
      // if new card, abort with no changes and emit event to
      // pop card off list
      if (this.newCard) {
        this.patch = [];
        this.edit = !this.edit;
        this.$emit('card-new-abort', true);
        return;
      }
      // parse orignal card to undo changes
      if (this.original) {
        const card = JSON.parse(this.original);
        this.patch.forEach((operation) => {
          // Extract attribute from path
          const attribute = operation.path.substring(1);
          this.values[attribute] = card[attribute] || '';
        });
      }
      this.patch = []; // discard path array
      this.edit = !this.edit;
    },
    commitEdits: function() {
      if (!this.values.description.length) {
        this.errors.push({
          field: 'modal-error',
          message: 'Description is required',
        });
        return;
      }
      this.edit = !edit;
    },
    // Redo for Vuex refactor
    deleteCard: function() {
      // discards any patches and emits event for deletion
      this.patch = [];
      this.edit = !this.edit;
      this.$emit('card-delete', {profileId: this.vcard.profileId});
    },
    extractLexicalArray(data) {
      const components = data.split(';');
      return [
        // in Format: 1st Line Adr., PO, 2nd Line Adr., City State ZIP,
        components[2],
        components[0],
        components[1],
        components[3] + ' ' + ' ' + components[4] + ' ' + components[5],
      ];
    },
    // For watcher
    populateData(id) {
      const card = this.$store.state.cards[id];
      this.original = JSON.stringify(card);
      // populate/update data to local state
      cardAttributes.forEach((attribute) => {
        if (attribute in card) {
          this.values[attribute] = card[attribute];
        } else {
          if (complexAttributes.indexOf(attribute) > -1) {
            this.values[attribute] = [];
          } else {
            this.values[attribute] = '';
          }
        }
      });
    },
    presentShareModal: function() {
      const shareElementRect =
        document.getElementById('share-modal').getBoundingClientRect();
      const popOverElement = document.getElementById('share-popover');
      this.share = !this.share;
      if (this.share) {
        popOverElement.style.display = 'block';
      } else {
        popOverElement.style.display = 'none';
        return;
      }
      const popOverElementRect = popOverElement.getBoundingClientRect();
      const shareMidPoint = shareElementRect.width / 2;
      const popOverMidPoint = popOverElementRect.width / 2;
      const offset = Math.round(Math.abs(popOverMidPoint - shareMidPoint));
      popOverElement.style.left = '-' + offset + 'px';
    },
    // Remove for Vuex refactor
    updateEditedCard: function(payload) {
      let attribute = payload[0].toLowerCase();
      const attributes = cardAttributes;
      if (attribute === 'description') {
        // Specific case for non optional property
        const operation =
          generatePatchObject(attribute, attributes.description, payload[1]);
        this.patch.push(operation);
        attributes.description = payload[1];
      } else {
        let optional = this.values;
        const operation =
          generatePatchObject(attribute, optional[attribute], payload[1]);
        let index = this.patch.findIndex((op) => op.path === ('/' + attribute));
        if (index > -1) {
          // If attribute has already been modified once, replace it
          this.patch.splice(index, 1, operation);
        } else {
          // Push new operation that is modified for first time
          this.patch.push(operation);
        }
        optional[attribute] = payload[1];
      }
    },
  },
  watch: {
    profileId: {
      handler: 'populateData',
      immediate: true,
    },
    edit: function(edit) {
      if (!edit && this.patch.length !== 0 && !this.newCard) {
        // cleaning up after done editing
        this.$emit('card-update', this.patch);
        this.original = '';
        this.patch = [];
      } else if (!edit && this.patch.length!== 0 && this.newCard) {
        let payload = this.vcard;
        this.patch.forEach((operation) => {
          const attribute = operation.path.substring(1);
          payload[attribute] = operation.value;
        });
        this.$emit('card-create', payload);
        this.original = '';
        this.patch = [];
      }
      this.share = false;
    },
    newCard: function(isNew) {
      if (isNew !== undefined && isNew) {
        this.edit = true;
      }
    },
    attributes: {
      handler: function(val) {
        this.errors = [];
      },
      deep: true,
    },
  },
};
</script>
<style lang="scss" scoped>
  #card {
    position: relative;
    text-align: left;
    box-sizing: border-box;
    margin-bottom: 1em;
    @media #{$breakpoint-md} {
      width: 100%;
    }
    @media #{$breakpoint-lg} {
      width: 91.667%;
    }
  }
  .card-main {
    box-sizing: border-box;
    padding: 2em;
    font-size: 1.1em;
    top:30px;
    background-color: $backgroundcolor;
    border-radius: 12px;
    width: 100%;
    @media #{$breakpoint-sm} {
      padding: 0.75em;
    }
    @media #{$breakpoint-md} {
      padding: 1.5em;
    }
  }
  #header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    span {
      flex: 4 2 58.333%;
      font-size: 1.5em;
    }
    #edit{
      display: flex;
      flex: 1 1 41.666%;
      justify-content: flex-end;
    }
    .editing-button {
      box-sizing: border-box;
      flex: 0 1 33.333%;
      margin-left: 0.25em;
      display: block;
      background-color: $secondarycolor;
      border: 0;
      color: $backgroundcolor;
      float: right;
      font-family: nunito, Helvetica, Arial, sans-serif;
      font-size: 1.1em;
      padding: 0.25em 1em 0.25em 1em;
      border-radius: 6px;
      @media #{$breakpoint-sm} {
          padding: 0.25em 0.75em 0.25em 0.75em;
          font-size: 1em;
      }
      @media (hover: hover) {
        &:hover {
          background-color: $primarycolor;
        }
      }
    }
    .editing-button-error {
      @extend .editing-button;
      background-color: $error-red;
      flex: 0 1 16.666%;
      @media (hover: hover) {
        &:hover {
          background-color: $error-highlight;
        }
      }
    }
    #share-button-container {
      box-sizing: border-box;
      flex: 0 1 33.333%;
    }
    .share-button {
      @extend .editing-button;
      background-color: $accentcolor;
    }
    #share-popover {
      display: none;
      background-color: $backgroundcolor;
      border-radius: 6px;
      box-sizing: border-box;
      font-size: 0.85em;
      position: absolute;
      padding: 1em;
      top: 3em;
      width: 20rem;
      h4 {
        font-size: 1.1em;
        margin: 0.5em 0em 0.25em 0em;
      }
      #share-link-row {
        display: flex;
        flex-direction: row;
        flex-wrap: row nowrap;
        align-items: center;
        height: 2em;
      }
      .share-link-text {
        flex: auto;
        min-width: 0;
      }
      .share-link-button {
        flex: 1 1 15%;
        background-color: transparent;
        border: none;
        margin: 0;
        img {
          width: 100%;
          height: 2em;
          &:hover {
            box-shadow: 0 4px 4px -1px rgba(196, 202, 29, 0.33);
          }
        }
      }
      @media #{$breakpoint-sm} {
        width: 13.5rem;
      }
      @media #{$breakpoint-md} {
        width: 18rem;
      }
    }
  }
  #footer {
    @extend #header;
  }
  .grid *{
    font-size: 1em;
    position: relative;
    box-sizing: border-box;
    width: 100%;
  }
  .row {
    padding-bottom: 0.5em;
    &:before {
      content: " ";
      display: table;
    }
    &:after {
      content: " ";
      display: table;
      clear: both;
    }
  }
  %column-properties {
    float: left;
    min-height: 1px;
    padding: 0.8em;
    position: relative;
  }
  .column-props {
    @extend %column-properties;
    width: 30%;
    text-align: right;
    font-weight: 600;
    @media #{$breakpoint-sm} {
      width: 100%;
      text-align: left;
    }
  }
  .column-values {
    @extend %column-properties;
    width: 70%;
    text-align: left;
    @media #{$breakpoint-sm} {
      width: 95%;
      margin-left: 5%;
      padding: 0;
    }

  }
  .column-list {
    ul {
      padding: 0;
      list-style: none;
      margin: 0 0 0.1em 0;
      li {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-around;
      }
      .column-list-label {
        flex: 1 1 35%;
      }
      .column-list-value {
        flex: 3 3 65%;
        text-align: left;
      }
    }
  }
</style>
