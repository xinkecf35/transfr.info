<template>
  <div class="login">
    <form v-on:submit.prevent="login">
      <input type="text" v-model="input.username" placeholder="Username">
      <input type="password" v-model="input.password" placeholder="Password">
      <button>Login</button>
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
    xhr.onload = function() {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({status: xhr.status, response: xhr.response});
      }
    };
    xhr.onerror = function() {
      reject({status: xhr.status, statusText: xhr.statusText});
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
    login() {
      if (isValidInput()) {
        const requestBody = JSON.stringify(userInput);
        const authURL = 'https://api.transfr.info/v1/users/';
        let authPromise = authAjaxRequest('POST', authURL, requestBody);
        authPromise.then(function(response) {
          console.log(response);
        }).catch(function(err) {
          console.log(err);
        });
      }
    },
    isValidInput() {
      let valid = true;
      const userInput = this.input;
      if (userInput.username === '') {
        this.errors.push({field: username, error: 'Please enter username'});
        valid = false;
      }
      if (userInput.password === '') {
        this.errors.push({field: password, error: 'Please enter password'});
        valid = false;
      }
      return valid;
    },
  },
};
</script>
