<template>
  <div class="row">
      <div class="column-props">{{attribute}}</div>
      <div class="column-values" >
          <div class="complex-input"
            v-on:blur.capture="addCombinedValue(attribute, complexData)">
            <input type="text" class="control-label" placeholder="Label"
            v-model="label"
            v-on:keyup.enter="addCombinedValue(attribute, complexData)">
            <input type="text" class="control-value"
            v-bind:placeholder="attribute" v-model="value"
            v-on:keyup.enter="addCombinedValue(attribute, complexData)">
            <button class="control-button"
              v-on:click="addCombinedValue(attribute, complexData)">
              <img src="@/assets/plus-round.svg">
            </button>
          </div>
          <!-- show other values for editting -->
          <div class="complex-input"
            v-for="(item, index) in values" :key="item.id">
            <input class="control-label" type="text" v-model="item.type"
              v-on:change="$emit('update-edit', [attribute, text, index])">
            <input class="control-value" type="text" v-model="item.value"
              v-on:change="$emit('update-edit', [attribute, text, index])">
            <button class="control-button"
              v-on:click="removeCombinedValue(attribute, index)">
              <img src="@/assets/minus-round.svg">
            </button>
          </div>
      </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      label: '',
      value: '',
    };
  },
  computed: {
    complexData: function() {
      if (this.label !== '' && this.value !== '') {
        return {type: this.label, value: this.value};
      } else {
        return null;
      }
    },
    values() {
      return this.$store.state.cards[this.profileId][this.attribute];
    },
  },
  event: 'update-edit',
  methods: {
    addCombinedValue: function(attribute, data) {
      if (data !== null) {
        let index = this.text.push(data) - 1;
        this.$emit('update-edit', [attribute, this.text, index]);
        this.label = this.value = '';
        this.addressKeys.forEach((key) => {
          this.addressComponents[key] = '';
        });
      }
    },
    removeCombinedValue: function(attribute, index) {
      this.text.splice(index, 1);
      this.$emit('update-edit', [attribute, this.text, index]);
    },
  },
  props: {
    attribute: {
      type: String,
      require: true,
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

