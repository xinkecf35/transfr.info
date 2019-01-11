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
            <input class="control-label">
            <input class="control-value">
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
          </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      text: this.value,
    };
  },
  event: 'update:value',
  props: {
    attribute: String,
    value: [String, Array],
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
    flex: 0 1 16.6666%;
    margin-right: 0.25rem;
  }
  .control-value {
    @extend .control;
    flex: 0 2 66.6666%;
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

