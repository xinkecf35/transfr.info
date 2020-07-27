<template>
  <div class="row">
    <div class="column-props">
      Address
    </div>
    <div class="column-values">
      <div
        class="address-input"
        @focus.capture="addressFocusCheck()"
      >
        <input
          id="address-label"
          v-model="label"
          type="text"
          class="control-label"
          placeholder="Label"
        >
        <div class="address-inputs">
          <input
            id="address-line1"
            v-model="addressComponents.line1"
            type="text"
            placeholder="Address Line 1"
            class="control-address-value"
          >
          <input
            id="address-line2"
            v-model="addressComponents.line2"
            type="text"
            placeholder="Address Line 2"
            class="control-address-value"
          >
          <div class="control-address-row">
            <input
              id="address-city"
              v-model="addressComponents.city"
              type="text"
              placeholder="City"
              class="sub-left control-address-value"
            >
            <input
              id="address-state"
              v-model="addressComponents.state"
              type="text"
              placeholder="State"
              class="sub-right control-address-value"
            >
          </div>
          <div class="control-address-row">
            <input
              id="address-zip"
              v-model="addressComponents.zipcode"
              type="text"
              placeholder="ZIP Code"
              class="sub-left control-address-value"
            >
            <input
              id="address-pobox"
              v-model="addressComponents.POBox"
              type="text"
              placeholder="PO Box"
              class="sub-right control-address-value"
            >
          </div>
        </div>
        <button
          class="control-button"
          @click="console.log('TODO: Add address')"
        >
          <img src="@/assets/plus-round.svg">
        </button>
      </div>
      <div
        v-for="(item, index) in formattedAddresses"
        :key="item.id"
        class="address-input"
        @focus.capture="addressFocusCheck()"
      >
        <input
          v-model="item.type"
          class="control-label"
          type="text"
          @change="$emit('update-edit', [attribute, text, index])"
        >
        <div class="address-inputs">
          <input
            v-model="item.value.line1"
            type="text"
            class="control-address-value"
            placeholder="Address Line 1"
            @change="updateAddress(formattedAddresses, index)"
          >
          <input
            v-model="item.value.line2"
            type="text"
            class="control-address-value"
            placeholder="Address Line 2"
            @change="updateAddress(formattedAddresses, index)"
          >
          <div class="control-address-row">
            <input
              v-model="item.value.city"
              type="text"
              class="sub-left control-address-value"
              placeholder="City"
              @change="updateAddress(formattedAddresses, index)"
            >
            <input
              v-model="item.value.state"
              type="text"
              class="sub-right control-address-value"
              placeholder="State"
              @change="updateAddress(formattedAddresses, index)"
            >
          </div>
          <div class="control-address-row">
            <input
              v-model="item.value.zipcode"
              type="text"
              class="sub-left control-address-value"
              placeholder="ZIP Code"
              @change="updateAddress(formattedAddresses, index)"
            >
            <input
              v-model="item.value.POBox"
              type="text"
              class="sub-right control-address-value"
              placeholder="PO Box"
              @change="updateAddress(formattedAddresses, index)"
            >
          </div>
        </div>
        <button
          class="control-button"
          @click="removeComplexValue(attribute, index)"
        >
          <img src="@/assets/minus-round.svg">
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    profileId: {
      type: String,
      required: true,
    },
  },
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
      const cardsModule = this.$store.state.cards;
      const card = cardsModule.profile[this.profileId];
      const addressesMap = cardsModule.address;
      return card['address'].map((id) => addressesMap[id]) || [];
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
.grid * {
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
.complex-input {
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

