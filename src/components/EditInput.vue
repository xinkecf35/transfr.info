<template>
  <div>
    <div v-if="!isComplex" class="row">
      <div class="column-props">{{attribute}}</div>
      <div class="column-values">
        <input
          type="text"
          v-model="text"
          v-on:change="$emit('update:value', text)">
      </div>
    </div>
    <div v-else class="row">
      <div class="column-props">{{attribute}}</div>
      <div>Work on this, need to use multiples conditionals probably</div>
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

