<template>
  <div id="card-manager">
    <div id="controls">
      <div id="current-card" class="level-1 tabs">
        <span>
          {{cardDescription}}
        </span>
      </div>
      <div id="more" class="level-1 tabs" @click="showModal = !showModal">
        ...
      </div>
    </div>
    <div id="wrapper">
      <moreCards v-if="showModal"
        v-bind:cards="cards"
        v-on:card-switch="switchCard"/>
      <div id="wrapper-cards">
        <keep-alive>
          <template v-if="cards.length === 0">
            <div id="getting-started" class="level-1">
              <div id="call-to-action">
                <h2>You don't have any cards, why not add one?</h2>
                  <button class="action-button level-1" @click="pushCard">
                    Add a Card
                  </button>
              </div>
            </div>
          </template>
          <template v-else>
            <card id="card"
              v-bind:vcard ="cards[this.currentCardIndex]"
              v-bind:initialFirstName="firstName"
              v-bind:initialLastName="lastName"
              v-bind:newCard="addCard"
              v-on:card-update="patchCard"
              v-on:card-create="createCard"/>
          </template>
        </keep-alive>
      </div>
    </div>
  </div>
</template>
<script>
import card from '@/components/Card';
import moreCards from '@/components/MoreCards';
import {ajaxRequest, isEmptyOrNull} from '../functions';

export default {
  data: function() {
    return {
      firstName: '',
      lastName: '',
      currentCardIndex: 0,
      showModal: false,
      addCard: false,
    };
  },
  components: {
    card,
    moreCards,
  },
  computed: {
    displayName: function() {
      return this.firstName + ' ' + this.lastName;
    },
    cardDescription: function() {
      if (isEmptyOrNull(this.currentCard)) {
        return 'Welcome';
      }
      return this.currentCard.description;
    },
    csrfToken: function() {
      return sessionStorage.getItem('csrf');
    },
    currentCard: function() {
      if (this.cards.length !== 0) {
        return this.cards[this.currentCardIndex];
      }
      return null;
    },
  },
  methods: {
    createCard: function(payload) {
      if (this.addCard) {
        this.addCard = false;
      }
      const index = this.currentCardIndex;
      const cards = this.cards;
      let createURL = 'https://api.transfr.info/v1/userdata/profiles';
      if (process.env.NODE_ENV === 'development') {
        createURL = 'https://api.transfr.test/v1/userdata/profiles';
      }
      const headers = [{name: 'X-CSRF-TOKEN', value: this.csrfToken}];
      const createJSON = JSON.stringify(payload);
      const createPromise = ajaxRequest('POST', createURL, createJSON, headers);
      createPromise.then(function(response) {
        if (!response.meta.success) {
          throw response.meta.message;
        }
        cards.splice(index, 1, response.user);
      }).catch((err) => console.log(err));
    },
    patchCard: function(payload) {
      const index = this.currentCardIndex;
      const cards = this.cards;
      const profileId = cards[index].profileId;
      let patchURL = 'https://api.transfr.info/v1/userdata/profile/' + profileId;
      if (process.env.NODE_ENV === 'development') {
        patchURL = 'https://api.transfr.test/v1/userdata/profile/' + profileId;
      }
      const patchBody = {patch: payload};
      const patchJSON = JSON.stringify(patchBody);
      const headers = [{name: 'X-CSRF-TOKEN', value: this.csrfToken}];
      const patchPromise = ajaxRequest('PATCH', patchURL, patchJSON, headers);
      patchPromise.then(function(response) {
        if (!response.meta.success) {
          throw response.meta.message;
        }
        cards.splice(index, 1, response.card);
      }).catch((err) => console.log(err));
    },
    pushCard: function() {
      this.addCard = true;
      this.cards.push({
        description: 'New Card',
        fullName: this.lastName +';'+this.firstName,
        name: this.firstName + ' ' + this.lastName,
      });
    },
    switchCard: function(payload) {
      this.currentCardIndex = payload;
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
    position: absolute;
    width: 100%;
    z-index: 25;
    text-overflow: ellipsis;
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
      margin-left: -1.25rem;
      text-align: center;
      z-index: 1;
    }
    .tabs {
      @extend .card-tab;
      float: left;
      min-height: 1px;
      position: relative;
    }
  }
  #card {
    padding: 0;
    z-index: 300;
  }
  #getting-started {
    background-color: $backgroundcolor;
    border-radius: 12px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    min-height: 20rem;
    padding: 2em;
    position: relative;
    z-index: 200;
    .action-button {
      background-color: $secondarycolor;
      border: 0;
      border-radius: 6px;
      color: $backgroundcolor;
      flex: 1 1 33%;
      padding: 0.5rem 0.75rem 0.5rem 0.75rem;
      @media (hover: hover) {
        &:hover {
          background-color: $primarycolor;
        }
      }
    }
    #call-to-action {
      box-sizing: border-box;
      position: relative;
    }
    @media #{$breakpoint-md} {
      width: 91%;
    }
    @media #{$breakpoint-lg} {
      width: 84.333%;
    }
  }
  .card-tab {
    color: $backgroundcolor;
    font-size: 1.25rem;
    top: 0px;
    padding: 0.3rem 1rem 0.5rem 1rem;
    background-color: $accentcolor;
    border-radius: 10px 10px 0px 0px;
    border-bottom: 10px solid $accentcolor;
    width: 10rem;
    @media #{$breakpoint-sm} {
      width: 8rem;
    }
    @media #{$breakpoint-md} {
      width: 9rem;
    }
  }
  #wrapper {
    font-size: 16px;
    position: relative;
  }
  #wrapper-cards {
    position: absolute;
    width: 100%;
    z-index: 50;
    top: 2.25rem;
    font-size: 16px;
  }
</style>
