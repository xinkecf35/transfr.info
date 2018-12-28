<template>
  <div id="card">
    <span> {{firstName}} {{lastName}} </span>
    <div v-for="object in objectOptionals" :key="object.id">
      <span v-for="item in object" :key="item.id">
        {{item.value}} {{item.type}}
      </span>
    </div>
    <span v-for="item in simpleOptionals" :key="item.id">
      {{item}}
    </span>
  </div>
</template>
<script>
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
      filtered.forEach((key) => result[key] = this.optional[key]);
      return result;
    },
    /* This computed property returns properties that are objects
     * This simply uses an array as include and iterates over that
     * returns an object filled the key value pairs
     */
    objectOptionals: function() {
      let result = {};
      const include = ['telephone', 'email'];
      include.forEach((key) => result[key] = this.optional[key]);
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
