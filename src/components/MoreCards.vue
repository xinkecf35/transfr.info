<template>
  <div
    id="modalCards"
    class="modal-control level-2"
  >
    <span>More Cards</span>
    <ul>
      <li
        v-for="card in cardsArray"
        :key="card.id"
      >
        <span
          role="button"
          @click="switchCard(card.profileId)"
        >{{ card.description }}</span>
      </li>
    </ul>
  </div>
</template>
<script>
import {mapGetters} from 'vuex';

export default {
  events: 'card-switch',
  computed: mapGetters('cards', ['cardsArray']),
  methods: {
    switchCard(profileId) {
      this.$emit('card-switch', profileId);
    },
  },
};
</script>
<style lang="scss" scoped>
#modalCards {
  color: $backgroundcolor;
  text-align: left;
  height: 8em;
  box-sizing: border-box;
}
.modal-control {
  display: block;
  width: 100%;
  border-radius: 12px;
  top: -$modal-position;
  height: 20em;
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
    overflow: auto;
    height: 4em;
  }
  @media #{$breakpoint-md} {
    width: 91%;
  }
  @media #{$breakpoint-lg} {
    width: 84.333%;
  }
}
</style>
