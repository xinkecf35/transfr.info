<template>
  <div class="row">
    <div class="column-props">{{displayText}}</div>
    <div class="column-values">
      <input type="text" class="control"
        v-model="value">
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    value: {
      get() {
        return this.$store.state.cards[this.profileId][this.attribute];
      },
      set(value) {
        const options = {id: profileId, attribute, value};
        this.$store.commit('cards/updateAttributeForId', options);
      },
    },
  },

  props: {
    attribute: {
      type: String,
      required: true,
    },
    displayText: {
      type: String,
      required: true,
    },
    profileId: {
      type: String,
      required: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.grid *{
  font-size: 1em;
  position: relative;
  box-sizing: border-box;
  width: 100%;
}
.row {
  padding-bottom: 0.5em;
  &:before {
    content: " ";
    display: table;
  }
  &:after {
    content: " ";
    display: table;
    clear: both;
  }
}
input[type="text"]:focus {
  outline: none;
  box-shadow: 0 4px 4px -1px rgba(196, 202, 29, 0.33);
}
.control {
    border-bottom: 2px solid rgba(25, 139, 28, 0.2);
    border-left: 0;
    border-top: 0;
    border-right: 0;
}
%column-properties {
  float: left;
  min-height: 1px;
  padding: 10px;
  position: relative;
}
.column-props {
  @extend %column-properties;
  width: 20%;
  text-align: right;
  font-weight: 600;
  @media #{$breakpoint-sm} {
      width: 100%;
      text-align: left;
      padding: 10px 0px 10px 0px;
  }
}
.column-values {
  @extend %column-properties;
  display: block;
  width: 80%;
  text-align: left;
  color: #000;
  @media #{$breakpoint-sm} {
      width: 100%;
      padding: 0;
  }
}
.column-list {
  ul {
    padding: 0;
    list-style: none;
    margin: 0;
    li {
      display: flex;
      justify-content: space-around;
    }
  }
}
</style>

