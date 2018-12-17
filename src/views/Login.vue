<template>
  <div id="login" class="level-1 account-forms">
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
      <button class="level-1">Login</button>
    </form>
    <router-link to="/signup">New here? Create an account.</router-link>
  </div>
</template>
<script>
/**
 * Promise wrapper for XMLHttpRequest
 * @param {string} method HTTP Request Method
 * @param {string} url the URL for Ajax request
 * @param {string} body input for Authentication Request
 * @return {object} Promise for XMLHttpRequest
 */
function authAjaxRequest(method, url, body) {
  return new Promise(function(resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xhr.withCredentials = true;
    xhr.onload = function() {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({status: xhr.status, response: xhr.response});
      }
    };
    xhr.onerror = function() {
      reject({status: xhr.status, response: xhr.response});
    };
    xhr.send(body);
  });
}

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
    login: function login() {
      const userInput = this.input;
      if (this.isValidInput()) {
        console.log('Sending request');
        const requestBody = JSON.stringify(userInput);
        let authURL = 'https://api.transfr.info/v1/users/';
        if (process.env.NODE_ENV === 'development') {
          authURL = 'https://api.transfr.test/v1/users/';
        }
        let authPromise = authAjaxRequest('POST', authURL, requestBody);
        authPromise.then(function(response) {
          console.log(response);
        }).catch(function(err) {
          console.log(err);
        });
      }
    },
    isValidInput: function isValidInput() {
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
</style>
