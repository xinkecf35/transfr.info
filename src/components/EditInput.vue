<template>
  <div>
    <!-- Simple values for editing -->
    <div v-if="!isComplex" class="row">
      <div class="column-props">{{attribute}}</div>
      <div class="column-values">
        <input type="text" class="control"
          v-model="text"
          v-on:change="$emit('update-edit', [attribute, text])">
      </div>
    </div>
    <!-- custom input for address input -->
    <div v-else-if="attribute === 'Address'" class="row">
      <div class="column-props">{{attribute}}</div>
      <div class="column-values">
          <div class="address-input">
            <input type="text" class="control-label" placeholder="Label"
            v-model="label">
            <div class ="address-inputs">
              <input type="text" class="control-address-value"
              placeholder="Address Line 1" v-model="addressComponents.line1">
              <input type="text" class="control-address-value"
              placeholder="Address Line 2" v-model="addressComponents.line2">
              <div class="control-address-row">
                <input type="text" class="sub-left control-address-value"
                  placeholder="City" v-model="addressComponents.city">
                <input type="text" class="sub-right control-address-value"
                  placeholder="State" v-model="addressComponents.state">
              </div>
              <div class="control-address-row">
                <input type="text" class="sub-left control-address-value"
                  placeholder="ZIP Code" v-model="addressComponents.zipcode">
                <input type="text" class="sub-right control-address-value"
                  placeholder="PO Box" v-model="addressComponents.POBox">
              </div>
            </div>
            <button class="control-button"
              v-on:click="addComplexValue(attribute, addressData)">
              <img src="../assets/plus-round.svg">
            </button>
          </div>
          <div class="address-input"
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
              <img src="../assets/minus-round.svg">
            </button>
          </div>
      </div>
    </div>
    <div v-else class="row">
      <div class="column-props">{{attribute}}</div>
      <div class="column-values">
          <div class="complex-input"
          v-on:blur.capture="addComplexValue(attribute, complexData)">
            <input type="text" class="control-label" placeholder="Label"
            v-model="label"
            v-on:keyup.enter="addComplexValue(attribute, complexData)">
            <input type="text" class="control-value"
            v-bind:placeholder="attribute" v-model="value"
            v-on:keyup.enter="addComplexValue(attribute, complexData)">
            <button class="control-button"
              v-on:click="addComplexValue(attribute, complexData)">
              <img src="../assets/plus-round.svg">
            </button>
          </div>
          <!-- show other values for editting -->
          <div class="complex-input"
            v-for="(item, index) in text" :key="item.id">
            <input class="control-label" type="text" v-model="item.type"
              v-on:change="$emit('update-edit', [attribute, text, index])">
            <input class="control-value" type="text" v-model="item.value"
              v-on:change="$emit('update-edit', [attribute, text, index])">
            <button class="control-button"
              v-on:click="removeComplexValue(attribute, index)">
              <img src="../assets/minus-round.svg">
            </button>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      text: this.initialValue,
      label: '',
      value: '',
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
    addressKeys: function() {
      return Object.keys(this.addressComponents);
    },
    complexData: function() {
      if (this.label !== '' && this.value !== '') {
        return {type: this.label, value: this.value};
      } else {
        return null;
      }
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
    formattedAddresses: function() {
      if (this.attribute !== 'Address') return undefined;
      let addresses = [];
      this.text.forEach((address) => {
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
  event: 'update:edit',
  methods: {
    addComplexValue: function(attribute, data) {
      if (data !== null) {
        let index = this.text.push(data) - 1;
        this.$emit('update-edit', [attribute, this.text, index]);
        this.label = this.value = '';
        this.addressKeys.forEach((key) => {
          this.addressComponents[key] = '';
        });
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
    attribute: String,
    initialValue: [String, Array],
    isComplex: {
      type: Boolean,
      default: false,
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
input[type="text"] > * {
  border-radius: 2px;
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

