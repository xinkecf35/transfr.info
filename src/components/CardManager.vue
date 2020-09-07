<template>
  <div id="card-manager">
    <div id="controls">
      <div
        id="current-card"
        class="level-1 tabs"
      >
        <span>{{ cardDescription }}</span>
      </div>
      <div
        id="more"
        class="level-1 tabs"
        @click="showModal = !showModal"
      >
        <span>...</span>
      </div>
      <div
        id="add"
        class="level-1 tabs"
        @click="pushNewCard"
      >
        <span>+</span>
      </div>
    </div>
    <div
      id="wrapper"
      :class="{showMore: showModal}"
    >
      <div id="wrapper-cards">
        <moreCards
          v-if="showModal"
          :cards="cards"
        />
        <keep-alive>
          <template v-if="cards.length === 0">
            <div
              id="getting-started"
              class="level-1"
            >
              <div id="call-to-action">
                <h2>You don't have any cards, why not add one?</h2>
                <button
                  class="action-button level-1"
                  @click="pushNewCard"
                >
                  Add a Card
                </button>
              </div>
            </div>
          </template>
          <template v-else>
            <card
              id="card"
              ref="currentCard"
              :profile-id="currentCardId"
              :is-new-card="isNewCard"
              @card-new-abort="abortNew"
              @card-delete="deleteCard"
            />
          </template>
        </keep-alive>
      </div>
    </div>
  </div>
</template>
<script>
import {mapGetters, mapState, mapMutations} from 'vuex';
import card from '@/components/Card';
import moreCards from '@/components/MoreCards';
import {ajaxRequest, getRandomInt, isEmptyOrNull} from '@/functions';

export default {
  components: {
    card,
    moreCards,
  },
  data: function() {
    return {
      showModal: false,
      isNewCard: false,
    };
  },
  computed: {
    cards() {
      return this.cardIds.map((id) => this.$store.state.cards.profile[id]);
    },
    cardDescription() {
      if (isEmptyOrNull(this.currentCardId)) {
        return 'Welcome';
      }
      return this.profiles[this.currentCardId].description;
    },
    currentCardId: {
      get() {
        return this.$store.state.cards.currentCardId;
      },
      set(id) {
        this.setCurrentCardId(id);
      },
    },
    ...mapGetters('user', ['displayName']),
    ...mapGetters('cards', {
      cards: 'cardsArray',
    }),
    ...mapState('cards', {
      cardIds: 'ids',
      profiles: 'profile',
    }),
  },
  watch: {
    cards: {
      handler() {
        if (isEmptyOrNull(this.currentCardId)) {
          this.currentCardId = this.cards[0].profileId;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    abortNew: function() {
      this.isNewCard = false;
    },
    deleteCard: function(payload) {
      const cards = this.cards;
      const profileId = payload.profileId;
      const deleteIndex = cards.findIndex(
        (card) => card.profileId == profileId);
      let deleteURL = 'https://api.transfr.info/v1/userdata/profile/';
      deleteURL = deleteURL + profileId;
      if (process.env.NODE_ENV === 'development') {
        deleteURL = 'https://api.transfr.test/v1/userdata/profile/';
        deleteURL = deleteURL + profileId;
      }
      const headers = [{name: 'X-CSRF-TOKEN', value: 'snakeoil'}];
      const deletePromise = ajaxRequest('DELETE', deleteURL, null, headers);
      deletePromise.then((response) => {
        if (!response.meta.success) {
          throw response.meta.message;
        }
        this.currentCardIndex = response.user.vcards.length - 1;
        cards.splice(deleteIndex, 1);
      }).catch((err) => this.$emit('error/api-fetch', err));
    },
    pushNewCard() {
      const profileId = `temp-${getRandomInt(100, 1000)}`;
      const params = {
        id: profileId,
        description: 'New Card',
      };
      this.addNewCard(params);
      this.currentCardId = profileId;
      this.isNewCard = true;
    },
    ...mapMutations('cards', ['addNewCard', 'setCurrentCardId']),
  },
};
</script>
<style lang="scss" scoped>
  #card-manager {
    font-size: 1rem;
  }
  .card-tab {
    color: $backgroundcolor;
    font-size: 1.25em;
    top: 0px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    background-color: $accentcolor;
    border-radius: 10px;
    padding: 0.35em 0.25em 0.25em 0.25em;
    box-sizing: border-box;
    width: $tabsize-lg;
    height: $tab-height;
    @media #{$breakpoint-sm} {
      padding: 0.25em 0.15em 0.15em 0.15em;
      width: $tabsize-sm;
    }
    @media #{$breakpoint-md} {
      width: $tabsize-md;
    }
  }
  #controls {
    position: absolute;
    z-index: 25;
    text-overflow: ellipsis;
    font-size: 1em;
    &:before {
      content: " ";
      display: table;
    }
    &:after {
      content: " ";
      display: table;
      clear: both;
    }
    .layer-tabs {
      margin-left: -$tab-margin;
      background-color: $secondarycolor;
      border-bottom: 10px solid $secondarycolor;
      margin-left: -$tab-margin;
      text-align: center;
      font-size: 1.5em;
      padding-top: 0.1em;
      font-weight: 900;
    }
    #more {
      @extend .layer-tabs;
      z-index: 20;
    }
    #add {
      @extend .layer-tabs;
      z-index: 10;
      // special case for iPhone SE/5
      @media screen and (max-width: 374px) {
        width: 4em;
      }
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
    min-height: 20em;
    padding: 2em;
    position: relative;
    z-index: 200;
    .action-button {
      background-color: $secondarycolor;
      border: 0;
      border-radius: 6px;
      color: $backgroundcolor;
      flex: 1 1 33%;
      padding: 0.5em 0.75em 0.5em 0.75em;
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
  .showMore {
    top: $modal-position;
    transition: all 0.5s ease;
  }
  #wrapper {
    position: relative;
  }
  #wrapper-cards {
    position: absolute;
    width: 100%;
    z-index: 50;
    top: 2.25em;
  }
  // animatitions
  .slide-enter-active, .slide-leave-active  {
      transition: all 0.5s ease;
  }
</style>
