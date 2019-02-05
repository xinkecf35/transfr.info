<template>
  <div id="user">
    <div id="sidebar">
      <img id="logo" src="../assets/logo.svg">
      <h1>{{displayName}}</h1>
      <span>Settings</span>
      <br>
      <a v-on:click.prevent="logout">Log out</a>
    </div>
    <card-manager id="card-manager"
      v-bind:cards="cards"
      v-bind:initialFirstName="firstName"
      v-bind:initialLastName="lastName"/>
  </div>
</template>
<script>
import {ajaxRequest} from '@/functions';
import cardManager from '@/components/CardManager';

export default {
  name: 'user',
  data: function() {
    return {
      fullName: '',
      email: '',
      cards: [{}],
    };
  },
  computed: {
    firstName: function() {
      const names = this.fullName.split(';');
      return names[1];
    },
    lastName: function() {
      const names = this.fullName.split(';');
      return names[0];
    },
    displayName: function() {
      return this.firstName + ' ' + this.lastName;
    },
    csrfToken: function() {
      return sessionStorage.getItem('csrf');
    },
  },
  methods: {
    populateData: function(data) {
      this.fullName = data.name;
      this.email = data.email;
      this.cards = data.vcards;
    },
    logout: function() {
      let logoutURL = 'https://api.transfr.info/v1/users/token?logout=true';
      if (process.env.NODE_ENV === 'development') {
        logoutURL = 'https://api.transfr.test/v1/users/token?logout=true';
      }
      const router = this.$router;
      let logoutPromise = ajaxRequest('POST', logoutURL);
      logoutPromise.then(function(response) {
        sessionStorage.removeItem('csrf');
        router.push({name: 'home'});
      }).catch((err) => console.log(err));
    },
  },
  components: {
    cardManager,
  },
  beforeRouteEnter(to, from, next) {
    let userDataURL = 'https://api.transfr.info/v1/userdata/user';
    if (process.env.NODE_ENV === 'development') {
      userDataURL = 'https://api.transfr.test/v1/userdata/user';
    }
    let userDataPromise = ajaxRequest('GET', userDataURL);
    userDataPromise.then(function(response) {
      if (response.meta.success) {
        next((vm) => vm.populateData(response.user));
      } else {
        next(false);
      }
    }).catch(function(err) {
      next(err);
    });
  },
};
</script>
<style lang="scss" scoped>
  #user {
    display: flex;
    flex-wrap: wrap;
    font-size: 1.25em;
    height: 100%;
    padding: 2em 1em 1em 1em;
    @media #{$breakpoint-sm} {
      justify-content: center;
      padding: 0.25rem;
      margin-left: 2%;
    }
  }
  #sidebar {
    flex: 0 1 33%;
    left: 0;
    font-size: 1.25rem;
    #logo {
      align-self: flex-start;
      height: 3em;
    }
    h1 {
      margin-top: 0.25rem;
      font-size: 2rem;
    }
    @media #{$breakpoint-sm} {
      flex: 0 1 100%;
      h1 {
        display: none;
      }
    }
    @media #{$breakpoint-md} {
      flex: 0 1 30%;
    }
  }
  #card-manager {
    flex: 0 2 66%;
    @media #{$breakpoint-sm} {
      flex: 0 2 95%;
      justify-content: center;
      align-self: center;
    }
    @media #{$breakpoint-md} {
      flex: 0 2 70%;
    }
  }
</style>

