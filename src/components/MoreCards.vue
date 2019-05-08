<template>
  <div id="modalCards" class="modal-control level-2">
    <span>More Cards</span>
    <ul>
      <li v-for="(card, index) in cards" :key="card.id">
        <span role="button" @click="switchCard(index)">
          {{card.description}}
        </span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  events: 'card-switch',
  props: {
    cards: Array,
  },
  methods: {
    switchCard: function(index) {
      this.$emit('card-switch', index);
    },
  },
};
</script>
<style lang="scss" scoped>
#modalCards {
  color: $backgroundcolor;
  text-align: left;
}
#triangle {
  position: absolute;
  width: 0;
  height: 0;
  border-left: 0.75em solid transparent;
  border-right: 0.75em solid transparent;
  border-bottom: 1em solid $secondarycolor;
  top: -1rem;
}
.modal-control {
  display: block;
  width: 100%;
  border-radius: 12px;
  top: -$modal-position;
  height: 10rem;
  box-sizing: border-box;
  position: absolute;
  color: $backgroundcolor;
  background-color: $secondarycolor;
  font-size: 1.25em;
  padding: 0.75em;
  z-index: 400;
  ul {
    text-align: left;
    list-style: none;
    margin: 0.25em 0em 0em 0.5em;
    padding: 0;
  }
  @media #{$breakpoint-md} {
    width: 91%;
  }
  @media #{$breakpoint-lg} {
    width: 84.333%;
  }
}
</style>
