<template>
  <div id="error" class="modal level-2">
    <slot>
      <span>Sorry, something has gone wrong, please try again later.</span>
    </slot>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
      message: '',
    };
  },
};
</script>
<style lang="scss">
.modal {
  border-radius: 6px;
  position: absolute;
  text-align: center;
  left: 50%;
  transform: translateX(-50%);
  top: 5%;
  z-index: 1000;
  color: $backgroundcolor;
  background-color: $error-red;
  font-size: 1.25rem;
  padding: 1rem;
}
</style>
