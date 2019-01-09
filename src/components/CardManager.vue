<template>
  <div id="card-manager">
    <div id="controls">
      <div id="current-card" class="level-1 tabs">
        {{currentCard.description}}
      </div>
      <div id="more" class="level-1 tabs">
        ...
      </div>
    </div>
    <card id="card"
      v-bind:vcard ="cards[this.currentCardIndex]"
      v-bind:initialFirstName="firstName"
      v-bind:initialLastName="lastName"/>
  </div>
</template>
<script>
import card from '@/components/Card';

export default {
  data: function() {
    return {
      firstName: '',
      lastName: '',
      currentCardIndex: 0,
    };
  },
  components: {
    card,
  },
  computed: {
    displayName: function() {
      return this.firstName + ' ' + this.lastName;
    },
    csrfToken: function() {
      return sessionStorage.getItem('csrf');
    },
    currentCard: function() {
      return this.cards[this.currentCardIndex];
    },
  },
  props: {
    cards: Array,
    initialFirstName: String,
    initialLastName: String,
  },
  watch: {
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
  #controls {
    width: 100%;
    &:before {
      content: " ";
      display: table;
    }
    &:after {
      content: " ";
      display: table;
      clear: both;
    }
    #more {
      background-color: $secondarycolor;
      border-bottom: 10px solid $secondarycolor;
      margin-left: -16px;
      text-align: center;
      z-index: -1;
    }
    .tabs {
      @extend .card-tab;
      float: left;
      min-height: 1px;
      padding: 10px;
      position: relative;
    }
  }
  #card {
    padding: 0;
    z-index: 100;
  }
  .card-tab {
    color: $backgroundcolor;
    font-size: 1.25rem;
    top: 0px;
    padding: 0.25em 1em 0.2em 1em;
    background-color: $accentcolor;
    border-radius: 10px 10px 0px 0px;
    width: 12.5%;
    border-bottom: 10px solid $accentcolor;
    margin-bottom: -10px;
    z-index: 50;
  }
</style>
