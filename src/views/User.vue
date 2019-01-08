<template>
  <div id="user">
    <div id="sidebar">
      {{displayName}}
      <a v-on:click.prevent="logout">Log out</a>
    </div>
    <card-manager id="card-manager"
      v-bind:cards="cards"
      v-bind:initialFirstNam ="firstName"
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
      let logoutPromise = ajaxRequest('POST', logoutURL);
      logoutPromise.then(function(response) {
        console.log(response);
      }).catch((err) => console.log(err));
    }
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
    font-size: 1.2em;
    padding: 0.5em;
  }
  #sidebar {
    flex: 0 1 33%;
    left: 0;
  }
  #card-manager {
    flex: 0 2 66%;
  }
</style>

