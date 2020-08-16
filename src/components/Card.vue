<template>
  <div id="card">
    <!-- Regular View -->
    <div
      v-if="!edit"
      class="grid card-main level-2"
    >
      <div
        id="header"
        class="row"
      >
        <span>{{ firstName }} {{ lastName }}</span>
        <div id="edit">
          <div id="share-button-container">
            <button
              id="share-modal"
              class="level-1 share-button"
              @click="presentShareModal()"
            >
              Share
            </button>
            <div
              id="share-popover"
              class="level-1"
            >
              <h4>Link to Card:</h4>
              <div id="share-link-row">
                <input
                  v-model="shareURL"
                  type="text"
                  class="share-link-text"
                  readonly
                >
                <button
                  id="copyLink"
                  class="share-link-button"
                >
                  <img src="@/assets/clipboard.svg">
                </button>
              </div>
            </div>
          </div>
          <button
            class="level-1 editing-button"
            @click="edit = !edit"
          >
            Edit
          </button>
        </div>
      </div>
      <div
        v-for="key in Object.keys(objectOptionals)"
        :key="key"
        class="row"
      >
        <div class="column-props">
          {{ key }}
        </div>
        <div class="column-values column-list">
          <ul>
            <li
              v-for="item in objectOptionals[key]"
              :key="item.id"
            >
              <div class="column-list-label">
                {{ item.type }}
              </div>
              <div
                v-if="key !== 'address'"
                class="column-list-value"
              >
                <span>{{ item.value }}</span>
              </div>
              <div v-else>
                <ul style="min-width: 50%; float:right">
                  <li
                    v-for="address in extractLexicalArray(item.value)"
                    :key="address.id"
                    class="address-list"
                  >
                    <span>{{ address }}</span>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div
        v-for="key in Object.keys(simpleOptionals)"
        :key="key"
        class="row"
      >
        <div class="column-props">
          {{ key }}
        </div>
        <div class="column-values">
          {{ simpleOptionals[key] }}
        </div>
      </div>
    </div>
    <div
      v-else
      class="grid card-main level-2"
    >
      <Error v-if="presentError">
        {{ errors[0].message }}
      </Error>
      <div
        id="header"
        class="row"
      >
        <span>Editing</span>
        <div id="edit">
          <button
            class="level-1 editing-button-error"
            @click="abort()"
          >
            Cancel
          </button>
          <button
            class="level-1 editing-button"
            @click="commitEdits()"
          >
            Done
          </button>
        </div>
      </div>
      <edit-input
        v-for="item in editInputValues"
        :key="item.id"
        :profile-id="profileId"
        :display-text="item.displayText"
        :attribute="item.attribute"
        :is-complex="item.complex"
      />
      <div
        id="footer"
        class="row"
      >
        <div id="edit">
          <button
            class="level-1 editing-button-error"
            @click="deleteCard()"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapActions, mapGetters} from 'vuex';
import EditInput from '@/components/EditInputs/EditInput';
import Error from '@/components/Error';
import {isEmptyOrNull} from '@/functions';
import {cardAttributes, complexAttributes} from '@/global-vars';

// No longer entirely necessarily buy may change mind on text stuff
const textForAttribute = (attr) =>
  attr !== 'IMPP' ? String(attr) : 'IMPP';


export default {
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
          const getValues = this.$store.getters['cards/getObjectValues'];
          result[key] = getValues(this.profileId, key);
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
      return errors.length && errors[errors.length - 1].field === 'modal-error';
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
      const shareBaseURL =
        process.env.NODE_ENV === 'development'
          ? 'https://transfr.test/card'
          : 'https://transfr.info/card';
      return `${shareBaseURL}/${this.profileId}`;
    },
    ...mapGetters('user', ['firstName', 'lastName']),
  },
  watch: {
    profileId: {
      handler: 'populateData',
      immediate: true,
    },
    edit: function(edit) {
      if (!edit && !this.newCard) {
        // cleaning up after done editing
        this.updateEditedCard().then(() => {
          this.populateData(this.profileId);
        });
      } else if (!edit && this.newCard) {}
      this.share = false;
    },
    newCard: function(isNew) {
      if (isNew !== undefined && isNew) {
        this.edit = true;
      }
    },
  },
  methods: {
    // Move functionality into vuex somehwo
    abort() {
      // abort changes and return
      // if new card, abort with no changes and emit event to
      // pop card off list
      if (this.newCard) {
        this.edit = !this.edit;
        this.$emit('card-new-abort', true);
        return;
      }
      // parse orignal card to undo changes
      if (this.original) {
        const params = {id: this.profileId, original: this.original};
        this.undoCardChanges(params);
      }
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
    getDenormalizedCard(id=this.profileId) {
      const getDenormalizedCard =
        this.$store.getters['cards/getDenormalizedCard'];
      return getDenormalizedCard(id);
    },
    // For watcher
    populateData(id) {
      const card = this.$store.state.cards.profile[id];
      this.original = JSON.stringify(this.getDenormalizedCard(id));
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
      const shareElementRect = document
        .getElementById('share-modal')
        .getBoundingClientRect();
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
    updateEditedCard() {
      const params = {
        id: this.profileId,
        original: this.original,
      };
      return this.updateCardByPatch(params);
    },
    ...mapActions('cards', ['undoCardChanges', 'updateCardByPatch']),
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
  top: 30px;
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
  #edit {
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
.grid * {
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
