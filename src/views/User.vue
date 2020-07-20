<template>
  <div id="user">
    <div id="sidebar">
      <img class="logo" src="../assets/logo.svg">
      <h1>{{displayName}}</h1>
      <span>Settings</span>
      <br>
      <a v-on:click.prevent="logout">Log out</a>
    </div>
    <div id='mobile-menu'>
      <img id="menu-icon" src="../assets/menu-icon.svg"
        v-on:click="active = !active">
      <img class="logo" src="../assets/logo.svg">
      <div class="menu-full-cover"
        v-on:click="active = !active"
        v-bind:class="{menuActive: active}">
        <h1>{{displayName}}</h1>
        <span>Settings</span>
        <br>
        <a v-on:click.prevent="logout">Log out</a>
      </div>
    </div>
    <card-manager id="card-manager"
      v-bind:class="{menuHide: active}"
      v-bind:cards="cards"
      v-bind:initialFirstName="firstName"
      v-bind:initialLastName="lastName"/>
  </div>
</template>
<script>
import {mapActions, mapGetters, mapState} from 'vuex';
import {ajaxRequest} from '@/functions';
import cardManager from '@/components/CardManager';

export default {
  name: 'user',
  data: function() {
    return {
      active: false,
    };
  },
  computed: {
    ...mapState({
      csrfToken: (state) => state.csrf,
      email: (state) => state.user.email,
    }),
    ...mapGetters('user', ['displayName', 'firstName', 'lastName']),
    ...mapGetters('cards', {cards: 'cardsArray'}),
  },
  methods: {
    logout: function() {
      let logoutURL = 'https://api.transfr.info/v1/users/token?logout=true';
      if (process.env.NODE_ENV === 'development') {
        logoutURL = 'https://api.transfr.test/v1/users/token?logout=true';
      }
      const router = this.$router;
      let logoutPromise = ajaxRequest('POST', logoutURL);
      logoutPromise.then((response) => {
        this.$store.dispatch('clear').then(() => {
          router.push({name: 'home'});
        });
      }).catch((err) => this.$emit('error/api-fetch', err));
    },
    ...mapActions(['loadDataOnLogin']),
  },
  components: {
    cardManager,
  },
  beforeRouteEnter(to, from, next) {
    // Fetch Data if appropriate
    let userDataURL = 'https://api.transfr.info/v1/userdata/user';
    if (process.env.NODE_ENV === 'development') {
      userDataURL = 'https://api.transfr.test/v1/userdata/user';
    }
    let userDataPromise = ajaxRequest('GET', userDataURL);
    userDataPromise.then(() => {
      next((vm) => vm.loadDataOnLogin());
    }).catch(function(err) {
      // failed likely due to a authentication error
      if (err.status === 403) {
        next({name: 'login'});
      } else {
        next(err);
      }
    });
  },
  watch: {
    active: function(val) {
      if (val) {
        document.body.classList.add('no-scroll');
      } else {
        document.body.classList.remove('no-scroll');
      }
    },
  },
};
</script>
<style lang="scss" scoped>
  #user {
    display: flex;
    background-color: $backgroundcolor;
    flex-wrap: wrap;
    font-size: 1.25em;
    height: 100%;
    padding: 2em 1em 1em 1em;
    @media #{$breakpoint-sm} {
      justify-content: center;
      padding: 0.25em;
      margin-bottom: 1.5em;
    }
  }
  #sidebar {
    flex: 0 1 33%;
    left: 0;
    font-size: 1.25rem;
    .logo {
      align-self: flex-start;
      height: 3em;
    }
    h1 {
      margin-top: 0.25rem;
      font-size: 2rem;
    }
    @media #{$breakpoint-sm} {
      display: none;
    }
    @media #{$breakpoint-md} {
      flex: 0 1 30%;
    }
  }
  #mobile-menu {
    display: none;
    @media #{$breakpoint-sm} {
      display: block;
      left: 0;
      height: $mobile-menu-height;
      justify-content: space-between;
      width: 100%;
      .logo {
        float: right;
        margin-right: 5%;
        height: 2.5rem;
      }
      .menuActive {
        position: fixed;
        visibility: visible !important;
      }
      #menu-icon {
        float: left;
        height: 100%;
        margin-left: 4%;
      }
      .menu-full-cover {
        display: block;
        background-color: $backgroundcolor;
        position: fixed;
        top: $mobile-menu-height;
        width: 100%;
        height: 100%;
        visibility: hidden;
        z-index: 1000;
      }
    }
    @media #{$breakpoint-md}, #{$breakpoint-lg} {
      display: none;
    }
  }
  #card-manager {
    box-sizing: border-box;
    margin-top: 0.25rem;
    flex: 0 2 66%;
    z-index: 600;
    @media #{$breakpoint-sm} {
      flex: 0 2 95%;
    }
    @media #{$breakpoint-md} {
      flex: 0 2 70%;
    }
  }
</style>

