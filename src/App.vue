<template>
  <div id="app">
    <div id="nav" v-show="showNav">
      <img id="nav-logo" alt="transfr logo" src="./assets/logo-invert.svg">
      <div id="nav-links">
        <router-link to="/">Home</router-link>
        <router-link to="/about">About</router-link>
        <router-link to="/login">Log In</router-link>
        <router-link to="/signup">Sign Up</router-link>
      </div>
    </div>
    <router-view/>
  </div>
</template>
<script>
export default {
  beforeCreate() {
    document.body.classList.add('home');
    document.body.classList.add('no-margin');
  },
  computed: {
    showNav: function() {
      const routes = ['user', 'login', 'signup'];
      return !(routes.indexOf(this.$route.name) > -1);
    },
  },
};
</script>
<style lang="scss">
button {
  outline: none;
}
.home {
  background-color: $backgroundcolor;
}
.secondary {
    background-color: $secondarycolor !important;
}
</style>
<style lang="scss" scoped>
@import url("https://use.typekit.net/bek7yhg.css");
#app {
  font-family: nunito, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $primarycolor;
}
#nav {
  background-color: $secondarycolor;
  justify-content: flex-start;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  a {
    font-weight: bold;
    color: $primarycolor;
  }
}
#nav-logo{
  flex-grow: 1;
  order: 1;
  height: 3em;
}
#nav-links {
  justify-content: flex-end;
  display: flex;
  flex-direction: row;
  flex-grow: 2;
  order: 2;
  margin-right: 2em;
  a {
    font-size: 1.1em;
    color: $backgroundcolor;
    text-decoration: none;
    display: block;
    padding: 1em 2em 1em 2em;
    &:hover {
      background-color: $primarycolor;
    }
  }
}
</style>
