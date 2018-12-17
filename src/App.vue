<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/login">Log In</router-link> |
      <router-link to="/signup">Sign Up</router-link>
    </div>
    <router-view/>
  </div>
</template>
<style lang="scss">
  .home {
    background-color: $backgroundcolor;
  }
  .secondary {
      background-color: $secondarycolor !important;
  }
</style>
<script>
export default {
  beforeCreate() {
    document.body.classList.add('home');
  },
};
</script>
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
  padding: 30px;
  a {
    font-weight: bold;
    color: $primarycolor;
    &.router-link-exact-active {
      color: $accentcolor;
    }
  }
}
</style>
