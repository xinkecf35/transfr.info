<template>
  <div class="row">
    <div class="column-props">{{attribute}}</div>
    <div class="column-values">
      <input
        type="text"
        v-model="text"
        v-on:change="$emit('update:value', text)">
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
    isComplex: Boolean,
  },
};
</script>
