<template>
  <div id="card">
    <div v-if="!edit" class="grid card-main level-2">
      <div id="header" class="row">
        <span>{{firstName}} {{lastName}}</span>
        <div id="edit">
          <button v-on:click="edit = !edit" class="level-1">Edit</button>
        </div>
      </div>
      <div class="row" v-for="key in Object.keys(objectOptionals)" :key="key">
        <div class="column-props">{{key}}</div>
        <div class="column-values column-list">
          <ul>
            <li v-for="item in objectOptionals[key]" :key="item.id">
              <div>{{item.type}}</div>
              <div>{{item.value}}</div>
            </li>
          </ul>
        </div>
      </div>
      <div class="row" v-for="key in Object.keys(simpleOptionals)" :key="key">
        <div class="column-props">{{key}}</div>
        <div class="column-values">{{simpleOptionals[key]}}</div>
      </div>
    </div>
    <!-- Editing view for card -->
    <div v-else class="grid card-main level-2">
      <div id="header" class="row">
        <span>Editing</span>
        <div id="edit">
          <button v-on:click="edit = !edit" class="level-1">Done</button>
        </div>
      </div>
      <edit-input
        v-for="item in editInputValues"
        v-bind:key="item.id"
        v-bind:attribute="item.attribute"
        v-bind:value.sync="item.value"
        v-bind:isComplex="item.complex"
        v-on:update-edit="updateEditedCard"/>
    </div>
  </div>
</template>
<script>
import EditInput from '@/components/EditInput';

/**
 * Null/Empty/Undefined Check for string
 * @param {String} string string to be checked
 * @return {Boolean} Is string empty, null or undefined
 */
function isEmptyOrNull(string) {
  return string === '' || string === null || string === undefined;
}

export default {
  data: function() {
    return {
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
      edit: false,
    };
  },
  computed: {
    name: function() {
      return this.firstName + ' ' + this.lastName;
    },
    /* This computed property returns properties that are text only
     * returns an object filled with the simple key-value pairs
     */
    simpleOptionals: function() {
      let result = {};
      const keys = Object.keys(this.optional);
      const exclude = ['telephone', 'email', 'description'];
      const filtered = keys.filter(function(property) {
        // if the property is not in exclude array, add it
        return exclude.indexOf(property) === -1;
      });
      filtered.forEach((key) => {
        if (!isEmptyOrNull(this.optional[key])) {
          result[key] = this.optional[key];
        }
      });
      return result;
    },
    /* This computed property returns properties that are objects
     * This simply uses an array as include and iterates over that
     * returns an object filled the key value pairs
     */
    objectOptionals: function() {
      let result = {};
      const include = ['telephone', 'email'];
      include.forEach((key) => {
        if (this.optional[key].length !== 0) {
          result[key] = this.optional[key];
        }
      });
      return result;
    },
    editInputValues: function() {
      return [
        {attribute: 'Description', value: this.description, complex: false},
        {attribute: 'Address', value: this.optional.address, complex: false},
        {attribute: 'Birthday', value: this.optional.birthday, complex: false},
        {attribute: 'Email', value: this.optional.email, complex: true},
        {attribute: 'Note', value: this.optional.note, complex: false},
        {attribute: 'Nickname', value: this.optional.nickname, complex: false},
        {attribute: 'Organization',
          value: this.optional.organization, complex: false},
        {attribute: 'Telephone', value: this.optional.telephone, complex: true},
      ];
    },
  },
  components: {
    EditInput,
  },
  props: {
    vcard: Object,
    initialFirstName: String,
    initialLastName: String,
  },
  methods: {
    updateEditedCard: function(payload) {
      let attribute = payload[0].toLowerCase();
      if (attribute === 'description') {
        // Specific case for non optional property
        this.description = payload[1];
      }
      let optional = this.optional;
      optional[attribute] = payload[1];
    },
  },
  watch: {
    vcard: function(card) {
      const optionalAttributes = Object.keys(this.optional);
      optionalAttributes.forEach((attribute) => {
        if (attribute in card) {
          this.optional[attribute] = card[attribute];
        }
      });
      this.description = card.description;
    },
    initialFirstName: function(value) {
      this.firstName = value;
    },
    initialLastName: function(value) {
      this.lastName = value;
    },
  },
};
</script>
<style lang="scss" scoped>
  #card {
    position: relative;
    text-align: left;
    padding: 14px;
  }
  .card-main {
    padding: 2em;
    font-size: 1.1rem;
    top:30px;
    background-color: $backgroundcolor;
    border-radius: 12px;
    width: 74.3333%;
  }
  #header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    span {
      font-size: 1.5rem;
    }
    #edit{
      flex: 0 1 16.667%;
      button {
        display: block;
        background-color: $secondarycolor;
        border: 0;
        color: $backgroundcolor;
        float: right;
        font-family: nunito, Helvetica, Arial, sans-serif;
        font-size: 1.1rem;
        padding: 0.25em 1em 0.25em 1em;
        border-radius: 6px;
        &:hover {
          background-color: $primarycolor;
        }
      }
    }
  }
  .grid *{
    font-size: 1rem;
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
    padding: 10px;
    position: relative;
  }
  .column-props {
    @extend %column-properties;
    width: 35%;
    text-align: right;
  }
  .column-values {
    @extend %column-properties;
    width: 65%;
    text-align: left;
  }
  .column-list {
    ul {
      padding: 0;
      list-style: none;
      margin: 0;
      li {
        display: flex;
        justify-content: space-around;
      }
    }
  }
</style>
