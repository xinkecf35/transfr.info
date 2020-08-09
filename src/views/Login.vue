<template>
  <div id="login-root">
    <error v-if="presentError">
      {{ errors[errors.length-1].message }}
    </error>
    <div
      id="login"
      class="level-1 account-forms"
    >
      <router-link to="/">
        <img
          id="login-form"
          src="../assets/logo.svg"
        >
      </router-link>
      <h1>Log In</h1>
      <form @submit.prevent="login">
        <div
          v-for="error in errors"
          :key="error.id"
        >
          <span v-if="error.field ==='username'">{{ error.message }}</span>
        </div>
        <input
          v-model="input.username"
          type="text"
          placeholder="Username"
        >
        <br>
        <div
          v-for="error in errors"
          :key="error.id"
        >
          <span v-if="error.field ==='password'">{{ error.message }}</span>
        </div>
        <input
          v-model="input.password"
          type="password"
          placeholder="Password"
        >
        <br>
        <button class="level-1">
          Log in
        </button>
      </form>
      <router-link to="/signup">
        New here? Create an account.
      </router-link>
    </div>
  </div>
</template>
<script>
import {mapActions} from 'vuex';
import {ajaxRequest} from '@/functions.js';
import {baseURL} from '@/global-vars';
import error from '@/components/Error';

export default {
  name: 'Login',
  components: {
    error,
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
  computed: {
    presentError: function() {
      const errors = this.errors;
      return errors.length && errors[errors.length-1].field === 'modal-error';
    },
  },
  watch: {
    presentError: function(value) {
      if (value) {
        window.setTimeout(()=> this.errors.pop(), 5000);
      }
    },
  },
  beforeMount() {
    document.body.classList.toggle('secondary');
  },
  destroyed() {
    document.body.classList.toggle('secondary');
  },
  methods: {
    login: function() {
      const userInput = this.input;
      const router = this.$router;
      let errors = this.errors = [];
      if (this.isValidInput()) {
        const requestBody = JSON.stringify(userInput);
        let authURL = `${baseURL}/users/`;
        let authPromise = ajaxRequest('POST', authURL, requestBody);
        authPromise.then((response) => {
          this.$store.commit('setCSRF', response.csrf);
          return this.loadDataOnLogin();
        }).then(() => {
          router.push({name: 'user', params: {username: userInput.username}});
        }).catch(function(err) {
          if (err.status === 401) {
            errors.push({
              field: 'modal-error',
              message: 'Authentication failed,'
              +' please check username and password',
            });
          } else if (err.status === 403) {
            errors.push({
              field: 'modal-error',
              message: 'Authentication failed,'
              +' please check username and password or try again later',
            });
          } else {
            errors.push({
              field: 'modal-error',
              message: 'Something went wrong, please try again later'});
          }
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
      if (this.errors.length) {
        this.errors.push({
          field: 'modal-error',
          message: 'Please fill empty fields',
        });
      }
      return valid;
    },
    ...mapActions(['loadDataOnLogin']),
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
