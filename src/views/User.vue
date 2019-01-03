<template>
  <div id="user">
    <div id="sidebar">
      {{displayName}}
    </div>
    <card id="card"
      v-bind:vcard = "cards[0]"
      v-bind:initialFirstName = "firstName"
      v-bind:initialLastName = "lastName"/>
  </div>
</template>
<script>
import {ajaxRequest} from '@/functions';
import card from '@/components/Card';

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
  },
  components: {
    card,
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
    flex: 0 1 20%;
    left: 0;
    min-height: 100%;
  }
</style>

