<template>
  <div id="login" class="level-1 account-forms">
    <router-link to="/">
      <img id="login-form" src="../assets/logo.svg">
    </router-link>
    <h1>Log In</h1>
    <form v-on:submit.prevent="login">
      <div v-for="error in errors" :key="error.id">
        <span v-if="error.field ==='username'">{{error.message}}</span>
      </div>
      <input type="text" v-model="input.username" placeholder="Username">
      <br>
      <div v-for="error in errors" :key="error.id">
        <span v-if="error.field ==='password'">{{error.message}}</span>
      </div>
      <input type="password" v-model="input.password" placeholder="Password">
      <br>
      <button class="level-1">Log in</button>
    </form>
    <router-link to="/signup">New here? Create an account.</router-link>
  </div>
</template>
<script>
import {ajaxRequest} from '../functions.js';

export default {
  name: 'login',
  beforeMount() {
    document.body.classList.toggle('secondary');
  },
  destroyed() {
    document.body.classList.toggle('secondary');
  },
  data: function() {
    return {
      input: {
        username: '',
        password: '',
      },
      errors: [],
    };
  },
  methods: {
    login: function() {
      const userInput = this.input;
      const router = this.$router;
      if (this.isValidInput()) {
        console.log('Sending request');
        const requestBody = JSON.stringify(userInput);
        let authURL = 'https://api.transfr.info/v1/users/';
        if (process.env.NODE_ENV === 'development') {
          authURL = 'https://api.transfr.test/v1/users/';
        }
        let authPromise = ajaxRequest('POST', authURL, requestBody);
        authPromise.then(function(response) {
          sessionStorage.setItem('csrf', response.csrf);
          router.push({name: 'user', params: {username: userInput.username}});
        }).catch(function(err) {
          console.log(err);
        });
      }
    },
    isValidInput: function() {
      let valid = true;
      const userInput = this.input;
      if (userInput.username === '') {
        this.errors.push({field: 'username', message: 'Please enter username'});
        valid = false;
      }
      if (userInput.password === '') {
        this.errors.push({field: 'password', message: 'Please enter password'});
        valid = false;
      }
      return valid;
    },
  },
};
</script>
<style lang="scss" scoped>
  #login-form {
    height: 4em;
  }
</style>
