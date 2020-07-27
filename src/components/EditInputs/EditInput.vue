<template>
  <div>
    <simple-input
      v-if="!isComplex"
      :attribute="attribute"
      :display-text="displayText"
      :profile-id="profileId"
    />
    <address-input
      v-else-if="attribute === 'address'"
      :profile-id="profileId"
    />
    <labeled-input
      v-else
      :attribute="attribute"
      :display-text="displayText"
      :profile-id="profileId"
    />
  </div>
</template>
<script>
import AddressInput from './AddressInput';
import LabeledInput from './LabeledInput';
import SimpleInput from './SimpleInput';


export default {
  components: {
    AddressInput,
    LabeledInput,
    SimpleInput,
  },
  props: {
    attribute: {
      type: String,
      required: true,
    },
    profileId: {
      type: String,
      required: true,
    },
    displayText: {
      type: String,
      required: true,
    },
    isComplex: {
      type: Boolean,
      default: false,
    },
  },
  computed: {},
  event: 'update-edit',
  methods: {},
};
</script>
<style lang="scss" scoped>
.address-input {
  align-items: flex-start;
  display: flex;
  flex-flow: row nowrap;
}
.address-inputs {
  display: flex;
  flex: auto;
  flex-flow: column nowrap;
  margin-bottom: 0.5em;
}
.control-address-value {
  @extend .control-value;
  flex: auto;
  margin-bottom: 0.35em;
}
.control-address-row {
  display: flex;
  flex-direction: row;
  flex-basis: 100%;
  flex-flow: row nowrap;
  %sub {
    margin-right: 0.2em;
  }
  .sub-left {
    @extend %sub;
    flex: 3 2 60%;
    min-width: 0;
  }
  .sub-right {
    @extend %sub;
    flex: 2 1 40%;
    min-width: 0;
  }
}
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
.complex-input{
  display: flex;
  flex-direction: row;
  flex-flow: row nowrap;
  margin-bottom: 0.5em;

}
.control {
    border-bottom: 2px solid rgba(25, 139, 28, 0.2);
    border-left: 0;
    border-top: 0;
    border-right: 0;
}
.control-label {
  @extend .control;
  flex: 0 1 25%;
  margin-right: 0.25em;
  min-width: 0;
}
.control-value {
  @extend .control;
  flex: auto;
}
.control-button {
  border: 0px;
  background-color: transparent;
  padding: 0px;
  flex: 0 1 8.3333%;
  &:focus {
    outline: none;
  }
  img {
    height: 1.25em;
    align-self: baseline;
  }
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

