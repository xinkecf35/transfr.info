<template>
  <div id="signup-root">
    <error v-if="errors.length !== 0">
      {{ errors[errors.length-1].message }}
    </error>
    <div
      id="signup"
      class="level-1 account-forms"
    >
      <h1>Sign Up</h1>
      <form @submit.prevent="createAccount()">
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
        <div
          v-for="error in errors"
          :key="error.id"
        >
          <span v-if="error.field ==='firstName' || error.field ==='lastName'">
            {{ error.message }}
          </span>
        </div>
        <div class="row-input">
          <input
            v-model="input.firstName"
            type="text"
            placeholder="First Name"
          >
          <input
            v-model="input.lastName"
            type="text"
            placeholder="Last Name"
          >
        </div>
        <div
          v-for="error in errors"
          :key="error.id"
        >
          <span v-if="error.field ==='email'">{{ error.message }}</span>
        </div>
        <input
          v-model="input.email"
          type="email"
          placeholder="Email"
        >
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
        <div
          v-for="error in errors"
          :key="error.id"
        >
          <span v-if="error.field ==='confirm'">{{ error.message }}</span>
        </div>
        <input
          v-model="input.confirm"
          type="password"
          placeholder="Confirm Password"
        >
        <button>Create</button>
      </form>
      <router-link to="/login">
        Already have an account? Login here.
      </router-link>
    </div>
  </div>
</template>
<script>
import {ajaxRequest} from '@/functions.js';
import error from '@/components/Error';
import {baseURL} from '@/global-vars';

export default {
  name: 'Signup',
  components: {
    error,
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
  beforeMount() {
    document.body.classList.toggle('secondary');
  },
  destroyed() {
    document.body.classList.toggle('secondary');
  },
  methods: {
    createAccount: function() {
      if (this.isValidInput()) {
        const router = this.$router;
        let errors = this.errors;
        const requestBody = JSON.stringify(this.computedBody);
        let signupURL = `${baseURL}/users/new`;
        let signupPromise = ajaxRequest('POST', signupURL, requestBody);
        signupPromise.then(function(response) {
          router.push({path: 'login'});
        }).catch(function(err) {
          if (err.status === 403) {
            errors.push({
              field: 'modal-error',
              message: 'Username taken, please choose another username',
            });
          } else {
            errors.push({
              field: 'modal-error',
              message: 'Something went wrong, please try again later',
            });
          }
        });
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


