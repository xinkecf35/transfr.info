<template>
    <div class="signup">
      <form v-on:submit.prevent="createAccount">
        <input type="text" v-model="input.username" placeholder="Username">
        <input type="text" v-model="input.firstName" placeholder="First Name">
        <input type="text" v-model="input.lastName" placeholder="Last Name">
        <input type="text" v-model="input.email" placeholder="Email">
        <input type="password" v-model="input.password" placeholder="Password">
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
  methods: {
    createAccount() {
      const userInput = this.input;
      if (isValidInput()) {
        const requestBody = JSON.stringify(userInput);
        const signupURL = 'https://api.transfr.info/v1/users/new';
        let signupPromise = ajaxRequest('POST', signupURL, requestBody);
        signupPromise.then(function(response) {
          console.log(response);
        }).catch(function(err) {
          console.log(err);
        });
      }
    },
    isValidInput() {
      let valid = true;
      const regex = '/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|' +
                    '(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1' +
                    ',3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/';
      const userInput = this.input;
      let errors = this.errors;
      // Check username
      if (userInput.username === '') {
        errors.push({field: username, error: 'Please enter a username'});
      }
      // Check email
      if (userInput.email === '') {
        errors.push({field: email, error: 'Please enter a email'});
        valid = false;
      } else if (!regex.match(userInput.email)) {
        errors.push({field: email, error: 'Please enter a valid email'});
        valid = false;
      }
      // Check password
      if (userInput.password === '') {
        errors.push({field: password, error: 'Please enter password'});
        valid = false;
      }
      // Check names
      if (userInput.firstName === '' || userInput.lastName === '') {
        errors.push({field: firstName, error: 'Please enter name'});
        valid = false;
      }
      return valid;
    },
  },
};
</script>
