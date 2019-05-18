<template>
  <div id="card">
    <!-- Regular View -->
    <div v-if="!edit" class="grid card-main level-2">
      <div id="header" class="row">
        <span>{{attributes.firstName}} {{attributes.lastName}}</span>
        <div id="edit">
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
                  <li v-for="item in extractLexicalArray(item.value)"
                    :key="item.id" class="address-list">
                    <span>{{item}}</span>
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
        v-bind:key="item.id"
        v-bind:attribute="item.attribute"
        v-bind:initialValue="item.value"
        v-bind:isComplex="item.complex"
        v-on:update-edit="updateEditedCard"/>
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
import EditInput from '@/components/EditInput';
import Error from '@/components/Error';
import {isEmptyOrNull} from '../functions';

// Array of attributes that should be handled specially
const complexAttributes = ['address', 'email', 'telephone'];

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
  data: function() {
    return {
      attributes: {
        description: '',
        firstName: '',
        lastName: '',
        optional: {
          telephone: [],
          email: [],
          organization: '',
          address: '',
          nickname: '',
          note: '',
          birthday: '',
          impp: '',
        },
      },
      edit: false,
      patch: [],
      original: '',
      errors: [],
    };
  },
  computed: {
    editInputValues: function() {
      const attributes = this.attributes;
      return [
        {attribute: 'Description',
          value: attributes.description, complex: false},
        {attribute: 'Address',
          value: attributes.optional.address, complex: true},
        {attribute: 'Birthday',
          value: attributes.optional.birthday, complex: false},
        {attribute: 'Email', value: attributes.optional.email, complex: true},
        {attribute: 'Note', value: attributes.optional.note, complex: false},
        {attribute: 'Nickname',
          value: attributes.optional.nickname, complex: false},
        {attribute: 'Organization',
          value: attributes.optional.organization, complex: false},
        {attribute: 'Telephone',
          value: attributes.optional.telephone, complex: true},
      ];
    },
    name: function() {
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
        if (this.attributes.optional[key].length !== 0) {
          result[key] = this.attributes.optional[key];
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
      let result = {};
      const keys = Object.keys(this.attributes.optional);

      const exclude = ['address', 'description', 'email', 'telephone'];
      const filtered = keys.filter(function(property) {
        // if the property is not in exclude array, add it
        return exclude.indexOf(property) === -1;
      });
      filtered.forEach((key) => {
        if (!isEmptyOrNull(this.attributes.optional[key])) {
          result[key] = this.attributes.optional[key];
        }
      });
      return result;
    },
  },
  components: {
    EditInput,
    Error,
  },
  props: {
    vcard: Object,
    initialFirstName: String,
    initialLastName: String,
    newCard: Boolean,
  },
  events: [
    'card-update',
    'card-new-abort',
    'card-delete',
  ],
  methods: {
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
          if (attribute === 'description') {
            this.attributes.description = card.description;
          } else {
            this.optional[attribute] = card[attribute] || '';
          }
        });
      }
      this.patch = []; // discard path array
      this.edit = !this.edit;
    },
    commitEdits: function() {
      if (!this.attributes.description.length) {
        this.errors.push({
          field: 'modal-error',
          message: 'Description is required',
        });
        return;
      }
      this.edit = !edit;
    },
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
    updateEditedCard: function(payload) {
      let attribute = payload[0].toLowerCase();
      const attributes = this.attributes;
      if (attribute === 'description') {
        // Specific case for non optional property
        const operation =
          generatePatchObject(attribute, attributes.description, payload[1]);
        this.patch.push(operation);
        attributes.description = payload[1];
      } else {
        let optional = attributes.optional;
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
    },
    initialFirstName: function(value) {
      this.attributes.firstName = value;
    },
    initialLastName: function(value) {
      this.attributes.lastName = value;
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
    vcard: function(card) {
      this.original = JSON.stringify(card);
      // populate data
      const attributes = this.attributes;
      const optionalAttributes = Object.keys(attributes.optional);
      optionalAttributes.forEach((attribute) => {
        if (attribute in card) {
          attributes.optional[attribute] = card[attribute];
        } else {
          if (complexAttributes.indexOf(attribute) > -1) {
            attributes.optional[attribute] = [];
          } else {
            attributes.optional[attribute] = '';
          }
        }
      });
      attributes.description = card.description;
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
      width: 84.333%;
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
      flex: 0 1 41.666%;
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
      @media (hover: hover) {
        &:hover {
          background-color: $error-highlight;
        }
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
