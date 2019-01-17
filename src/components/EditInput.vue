<template>
  <div>
    <div v-if="!isComplex" class="row">
      <div class="column-props">{{attribute}}</div>
      <div class="column-values">
        <input type="text" class="control"
          v-model="text"
          v-on:change="$emit('update-edit', [attribute, text])">
      </div>
    </div>
    <div v-else class="row">
      <div class="column-props">{{attribute}}</div>
      <div class="column-values">
          <div class="complex-input">
            <input class="control-label" v-model="label">
            <input class="control-value" v-model="value">
            <button class="control-button"
              v-on:click="addComplexValue(attribute, complexData)">
              <img src="../assets/plus-round.svg">
            </button>
          </div>
          <div
            v-for="(item, index) in text" :key="item.id"
            class="complex-input">
            <input
              class="control-label"
              type="text"
              v-model="item.type"
              v-on:change="$emit('update-edit', [attribute, text, index])">
            <input
              class="control-value"
              type="text" v-model="item.value"
              v-on:change="$emit('update-edit', [attribute, text, index])">
            <button class="control-button"
              v-on:click="removeComplexValue(attribute, index)">
              <img src="../assets/minus-round.svg">
            </button>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      text: this.initialValue,
      label: '',
      value: '',
    };
  },
  computed: {
    complexData: function() {
      if (this.label !== '' && this.value !== '') {
        return {type: this.label, value: this.value};
      } else {
        return null;
      }
    },
  },
  event: 'update:value',
  methods: {
    addComplexValue: function(attribute, data) {
      if (data !== null) {
        let index = this.text.push(data) - 1;
        this.$emit('update-edit', [attribute, this.text, index]);
      }
    },
    removeComplexValue: function(attribute, index) {
      this.text.splice(index, 1);
      this.$emit('update-edit', [attribute, this.text, index]);
    },
  },
  props: {
    attribute: String,
    initialValue: [String, Array],
    isComplex: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style lang="scss" scoped>
  .complex-input{
    display: flex;
    flex-direction: row;
    margin-bottom: 0.5rem;
  }
  .control {
      border-bottom: 2px solid rgba(25, 139, 28, 0.2);
      border-left: 0;
      border-top: 0;
      border-right: 0;
  }
  .control-label {
    @extend .control;
    flex: 0 1 25%;
    margin-right: 0.25rem;
  }
  .control-value {
    @extend .control;
    flex: 0 2 66.666%;
  }
  .control-button {
    border: 0px;
    background-color: transparent;
    padding: 0px;
    flex: 0 1 8.3333%;
    &:focus {
      outline: none;
    }
    img {
      height: 1.25em;
      align-self: baseline;
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
    width: 20%;
    text-align: right;
  }
  .column-values {
    @extend %column-properties;
    width: 80%;
    text-align: left;
    color: #000;
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

