<template>
  <div id="login-root">
    <error v-if="errors.length !== 0">
      {{ errors[errors.length-1].message }}
    </error>
    <div id="login" class="level-1 account-forms">
      <router-link to="/">
        <img id="login-form" src="../assets/logo.svg">
      </router-link>
      <h1>Log In</h1>
      <form v-on:submit.prevent="login">
        <div v-for="error in errors" :key="error.id">
          <span v-if="error.field ==='username'">{{error.message}}</span>
        </div>
        <input type="text" placeholder="Username"
          v-model="input.username" @focus="removeError('username')">
        <br>
        <div v-for="error in errors" :key="error.id">
          <span v-if="error.field ==='password'">{{error.message}}</span>
        </div>
        <input type="password" placeholder="Password"
          v-model="input.password" @focus="removeError('password')">
        <br>
        <button class="level-1">Log in</button>
      </form>
      <router-link to="/signup">New here? Create an account.</router-link>
    </div>
  </div>
</template>
<script>
import {ajaxRequest} from '../functions.js';
import error from '@/components/Error';

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
  components: {
    error,
  },
  methods: {
    login: function() {
      const userInput = this.input;
      const router = this.$router;
      let errors = this.errors = [];
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
          if (err.status === 401) {
            errors.push({
              field: 'modal-error',
              message: 'Authentication failed,'
              +' please check username and password',
            });
          } else {
            errors.push({
              field: 'modal-error',
              message: 'Something went wrong, please try again later'});
          }
        });
      }
    },
    removeError: function(property) {
      let index = -1;
      for (let i = 0; i < this.errors.length; i++) {
        let error = this.errors[i];
        if (error.field === property) {
          index = i;
        }
      }
      if (index !== -1) {
        this.errors.splice(index, 1);
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
      if (this.errors.length) {
        this.errors.push({
          field: 'modal-error',
          message: 'Please fill empty fields',
        });
      }
      return valid;
    },
  },
};
</script>
<style lang="scss" scoped>
  .error-outline {
    outline: solid 1px $error-red;
  }

  #login-form {
    position: relative;
    height: 4em;
  }
</style>
