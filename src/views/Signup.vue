<template>
  <div id="signup" class="level-1 account-forms">
    <h1>Sign Up</h1>
    <form v-on:submit.prevent="createAccount()">
      <div v-for="error in errors" :key="error.id">
        <span v-if="error.field ==='username'">{{error.message}}</span>
      </div>
      <input type="text" v-model="input.username" placeholder="Username">
      <br>
      <div v-for="error in errors" :key="error.id">
        <span v-if="error.field ==='firstName' || error.field ==='lastName'">
          {{error.message}}
        </span>
      </div>
      <div class="row-input">
        <input type="text" v-model="input.firstName" placeholder="First Name">
        <input type="text" v-model="input.lastName" placeholder="Last Name">
      </div>
      <div v-for="error in errors" :key="error.id">
        <span v-if="error.field ==='email'">{{error.message}}</span>
      </div>
      <input type="email" v-model="input.email" placeholder="Email">
      <br>
      <div v-for="error in errors" :key="error.id">
        <span v-if="error.field ==='password'">{{error.message}}</span>
      </div>
      <input type="password" v-model="input.password" placeholder="Password">
      <br>
      <div v-for="error in errors" :key="error.id">
        <span v-if="error.field ==='confirm'">{{error.message}}</span>
      </div>
      <input type="password" v-model="input.confirm"
        placeholder="Confirm Password">
      <br>
      <button>Create</button>
    </form>
    <router-link to="/login">Already have an account? Login here.</router-link>
  </div>
</template>
<script>
import {ajaxRequest} from '../functions.js';

export default {
  name: 'signup',
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
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirm: '',
      },
      errors: [],
    };
  },
  computed: {
    name: function() {
      return this.input.lastName + ';' + this.input.firstName;
    },
    computedBody: function() {
      // computes request body for api request
      const body = {
        username: this.input.username,
        password: this.input.password,
        email: this.input.email,
        name: this.name,
      };
      return body;
    },
  },
  methods: {
    createAccount: function() {
      if (this.isValidInput()) {
        const requestBody = JSON.stringify(this.computedBody);
        let signupURL = 'https://api.transfr.info/v1/users/new';
        if (process.env.NODE_ENV === 'development') {
          signupURL = 'https://api.transfr.test/v1/users/new';
        }
        let signupPromise = ajaxRequest('POST', signupURL, requestBody);
        signupPromise.then(function(response) {
          console.log(response);
        }).catch(function(err) {
          console.log(err);
        });
      } else {
        console.log('Validation failed');
        console.log(this.errors);
      }
    },
    isValidInput: function() {
      let valid = true;
      const userInput = this.input;
      this.errors = [];
      // Check username
      if (userInput.username === '') {
        this.errors.push({
          field: 'username',
          message: 'Please enter a username',
        });
      }
      // Check email
      if (userInput.email === '') {
        this.errors.push({field: 'email', message: 'Please enter a email'});
        valid = false;
      }
      // Check password
      if (userInput.password === '') {
        this.errors.push({
          field: 'password',
          message: 'Please enter password',
        });
        valid = false;
      }
      if (userInput.password !== userInput.confirm) {
        this.errors.push({field: 'confirm', message: 'Passwords do not match'});
        valid = false;
      }
      // Check names
      if (userInput.firstName === '' || userInput.lastName === '') {
        this.errors.push({
          field: 'firstName',
          message: 'Please enter first and last name',
        });
        valid = false;
      }
      return valid;
    },
  },
};
</script>
<style lang="scss" scoped>
.row-input {
  display: flex;
  margin: 0 auto;
  input {
    flex: 1 2 0;
    width: 50%;
    margin: 0rem 0.5rem 0rem 0.5rem;
  }
}
</style>


