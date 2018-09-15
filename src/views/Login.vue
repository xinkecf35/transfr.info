<template>
  <div class="login">
    <form v-on:submit.prevent="login">
      <label for="username">Username</label>
      <input type="text" id="username" v-model="input.username">
      <label for="password">Password</label>
      <input type="password" id="password" v-model="input.password">
      <button>Login</button>
    </form>
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
        reject({
          status: this.status,
          statusText: this.statusText,
        });
      }
    };
    xhr.onerror = function() {
      reject({
        status: xhr.status,
        statusText: xhr.statusText,
      });
    };
    xhr.send(body);
  });
}


export default {
  name: 'LogIn',
  data: function() {
    return {
      input: {
        username: '',
        password: '',
      },
    };
  },
  methods: {
    login() {
      const userInput = this.input;
      if (userInput.username !== '' || userInput.password !== '') {
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
  },
};
</script>
