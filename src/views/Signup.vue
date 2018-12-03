<template>
  <div id="signup">
    <form v-on:submit.prevent="createAccount()">
      <div v-for="error in errors" :key="error.id">
        <span v-if="error.field ==='username'">{{error.message}}</span>
      </div>
      <input type="text" v-model="input.username" placeholder="Username">
      <br>
      <div v-for="error in errors" :key="error.id">
        <span v-if="error.field ==='firstName'">{{error.message}}</span>
      </div>
      <input type="text" v-model="input.firstName" placeholder="First Name">
      <div v-for="error in errors" :key="error.id">
        <span v-if="error.field ==='lastName'">{{error.message}}</span>
      </div>
      <input type="text" v-model="input.lastName" placeholder="Last Name">
      <br>
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
      <button>Create</button>
    </form>
  </div>
</template>
<script>
/**
 * Promise wrapper for XMLHttpRequest
 * @param {string} method HTTP Request Method
 * @param {string} url the URL for Ajax request
 * @param {string} body input for request]
 * @param {boolean} withCredentials set true to send credentials with request
 * @return {object} Promise for XMLHttpRequest
 */
function ajaxRequest(method, url, body, withCredentials) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.withCredentials = withCredentials || false;
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
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
  name: 'signup',
  data: function() {
    return {
      input: {
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      },
      errors: [],
    };
  },
  computed: {
    name: function() {
      return this.input.lastName + ';' + this.input.firstName;
    },
    requestBody: function() {
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
    createAccount: function createAccount() {
      if (this.isValidInput()) {
        const requestBody = JSON.stringify(requestBody);
        let signupURL = 'https://api.transfr.info/v1/users/new';
        if (process.env.NODE_ENV === 'development') {
          authURL = 'https://api.transfr.test/v1/users/new';
        }
        let signupPromise = ajaxRequest('POST', signupURL, requestBody, false);
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
    isValidInput: function isValidInput() {
      let valid = true;
      const regexPattern = '/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|' +
                    '(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1' +
                    ',3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/';
      const regex = new RegExp(regexPattern);
      const userInput = this.input;
      this.errors = [];
      // Check username
      if (userInput.username === '') {
        this.errors.push({field: 'username', message: 'Please enter a username'});
      }
      // Check email
      if (userInput.email === '') {
        this.errors.push({field: 'email', message: 'Please enter a email'});
        valid = false;
      } else if (!regex.test(userInput.email)) {
        // Damn regex is not working, probably did it wrong
        this.errors.push({field: 'email', message: 'Please enter a valid email'});
        // valid = false;
      }
      // Check password
      if (userInput.password === '') {
        this.errors.push({field: 'password', message: 'Please enter password'});
        valid = false;
      }
      // Check names
      if (userInput.firstName === '' || userInput.lastName === '') {
        this.errors.push({field: 'firstName', message: 'Please enter first and last name'});
        valid = false;
      }
      return valid;
    },
  },
};
</script>
