<template>
  <div id="login" class="level-1">
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
  #login {
    padding-top: 3em;
    padding-bottom: 3em;
    border-radius: 8px;
    width: 40%;
    margin: 0 auto;
    form {
      margin: 0 auto;
      width: 80%;
      input {
        padding: 1em;
        border-radius: 6px;
        border: 1px solid $accentcolor;
        width: 50%;
        margin-bottom: 2em;
        font-size: 1em;
      }
      button {
        width: 55%;
        padding-top: 1em;
        padding-bottom: 1em;
        font-size: 1em;
        border-radius: 6px;
        color: #fff;
        background-color: $primarycolor;
        text-decoration: none;
        margin-bottom: 2em;
        &:hover {
          background-color: $accentcolor;
        }
      }
    }
    a {
      text-decoration: none;
      color: $primarycolor;
      font-weight: 700;
    }
  }
</style>
