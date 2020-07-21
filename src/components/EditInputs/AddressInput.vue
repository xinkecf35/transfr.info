<template>
  <div class="row">
    <div class="column-props">Address</div>
    <div class="column-values">
      <div class="address-input" v-on:focus.capture="addressFocusCheck()">
        <input type="text" v-model="label"
        id="address-label" class="control-label" placeholder="Label">
        <div class ="address-inputs">
          <input type="text" placeholder="Address Line 1"
          id="address-line1" class="control-address-value"
          v-model="addressComponents.line1">
          <input type="text" placeholder="Address Line 2"
          id="address-line2" class="control-address-value"
          v-model="addressComponents.line2">
          <div class="control-address-row">
            <input type="text" placeholder="City"
              id="address-city" class="sub-left control-address-value"
              v-model="addressComponents.city">
            <input type="text" placeholder="State"
              id="address-state"  class="sub-right control-address-value"
              v-model="addressComponents.state">
          </div>
          <div class="control-address-row">
            <input type="text" placeholder="ZIP Code"
              id="address-zip" class="sub-left control-address-value"
              v-model="addressComponents.zipcode">
            <input type="text" placeholder="PO Box"
              id="address-pobox" class="sub-right control-address-value"
              v-model="addressComponents.POBox">
          </div>
        </div>
        <button class="control-button"
          v-on:click="console.log('TODO: Add address')">
          <img src="@/assets/plus-round.svg">
        </button>
      </div>
      <div class="address-input"
        v-on:focus.capture="addressFocusCheck()"
        v-for="(item, index) in formattedAddresses" :key="item.id">
        <input class="control-label" type="text" v-model="item.type"
          v-on:change="$emit('update-edit', [attribute, text, index])">
        <div class ="address-inputs">
          <input type="text" class="control-address-value"
          v-on:change="updateAddress(formattedAddresses, index)"
          placeholder="Address Line 1" v-model="item.value.line1">
          <input type="text" class="control-address-value"
          v-on:change="updateAddress(formattedAddresses, index)"
          placeholder="Address Line 2" v-model="item.value.line2">
          <div class="control-address-row">
            <input type="text" class="sub-left control-address-value"
              v-on:change="updateAddress(formattedAddresses, index)"
              placeholder="City" v-model="item.value.city">
            <input type="text" class="sub-right control-address-value"
              v-on:change="updateAddress(formattedAddresses, index)"
              placeholder="State" v-model="item.value.state">
          </div>
          <div class="control-address-row">
            <input type="text" class="sub-left control-address-value"
              v-on:change="updateAddress(formattedAddresses, index)"
              placeholder="ZIP Code" v-model="item.value.zipcode">
            <input type="text" class="sub-right control-address-value"
              v-on:change="updateAddress(formattedAddresses, index)"
              placeholder="PO Box" v-model="item.value.POBox">
          </div>
        </div>
        <button class="control-button"
          v-on:click="removeComplexValue(attribute, index)">
          <img src="@/assets/minus-round.svg">
        </button>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  data: function() {
    return {
      label: '',
      addressComponents: {
        POBox: '',
        line2: '',
        line1: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
      },
    };
  },
  computed: {
    addresses() {
      return this.$store.state.cards[this.profileId].address;
    },
    addressKeys: function() {
      return Object.keys(this.addressComponents);
    },
    addressData: function() {
      const components = this.addressComponents;
      const keys = this.addressKeys;
      const validKeys = keys.filter((key) => components[key] !== '');
      if (this.label !== '' && validKeys.length > 0) {
        return {
          type: this.label,
          value: Array.from(keys, (key) => components[key]).join(';'),
        };
      }
      return null;
    },
    complexData: function() {
      if (this.label !== '' && this.value !== '') {
        return {type: this.label, value: this.value};
      } else {
        return null;
      }
    },
    formattedAddresses: function() {
      const addresses = [];
      this.addresses.forEach((address) => {
        const components = address.value.split(';');
        const formattedAddress = {
          POBox: components[0],
          line2: components[1],
          line1: components[2],
          city: components[3],
          state: components[4],
          zipcode: components[5],
          country: components[6],
        };
        addresses.push({type: address.type, value: formattedAddress});
      });
      return addresses;
    },
  },
  event: 'update-edit',
  methods: {
    // This won't work anymore
    addressFocusCheck: function() {
      if (document.activeElement.id.indexOf('address-') === -1) {
        console.log('address hit');
      }
    },
    updateAddress: function(data, index) {
      let address = data[index];
      const keys = this.addressKeys;
      let modified = Array.from(keys, (key) => address.value[key]).join(';');
      this.text[index].value = modified;
      this.$emit('update-edit', ['Address', this.text, index]);
    },
    removeComplexValue: function(attribute, index) {
      this.text.splice(index, 1);
      this.$emit('update-edit', [attribute, this.text, index]);
    },
  },
  props: {
    profileId: {
      type: String,
      required: true,
    },
  },
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

