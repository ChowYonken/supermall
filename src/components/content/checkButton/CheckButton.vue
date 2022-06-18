<template>
  <div class="icon-selector"
       :class="{active: isChecked}">
    <img src="~/assets/img/cart/tick.svg" alt="">
  </div>
</template>

<script>
  export default {
    name: "CheckButton",
    props: {
      isChecked: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style scoped>
  .icon-selector {
    border-radius: 50%;
    border: 2px solid #aaa;
  }

  .icon-selector img {
    border-radius: 50%;
  }

  .active {
    border-color: pink;
    background-color: pink;
  }
</style>
