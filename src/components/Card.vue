<template>
  <div id="card">
    <div id="card-tab" class="level-1">
      {{description}}
    </div>
    <div id="card-main" class="grid level-2">
      <span> {{firstName}} {{lastName}} </span>
      <div class="row"
        v-for="key in Object.keys(objectOptionals)" :key="key">
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
      <div class="row"
        v-for="key in Object.keys(simpleOptionals)" :key="key">
        <div class="column-props">{{key}}</div>
        <div class="column-values">{{simpleOptionals[key]}}</div>
      </div>
    </div>
  </div>
</template>
<script>
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
      const exclude = ['telephone', 'email'];
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
        if (this.optional[key] !== []) {
          result[key] = this.optional[key];
        }
      });
      return result;
    },
  },
  props: {
    vcard: Object,
    initialFirstName: String,
    initialLastName: String,
  },
  methods: {
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
  #card-tab {
    color: $backgroundcolor;
    font-size: 1.25rem;
    top: 0px;
    padding: 0.25em 1em 0.2em 1em;
    background-color: $accentcolor;
    border-radius: 10px 10px 0px 0px;
    width: 16%;
    border-bottom: 10px solid $accentcolor;
    margin-bottom: -10px;

  }
  #card-main {
    padding: 2em;
    font-size: 1.1rem;
    top:30px;
    background-color: $backgroundcolor;
    border-radius: 12px;
    width: 66%;
    span {
      font-size: 1.2rem;
    }
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
  .grid *{
    font-size: 1rem;
    position: relative;
    box-sizing: border-box;
    width: 100%;
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
