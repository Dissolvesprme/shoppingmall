<template> 
<div class="check-button" :class="{check: isChecked}">
  <img src="~/assets/img/cart/tick.svg" alt="">
</div>
</template>

<script>
export default {
  name: "CheckButton",
  props: {
    isChecked: {
      type: Boolean,
      default: true
    }
  }
};
</script>

<style>
.check-button {

  border-radius: 55%;
  border: 2px solid #aaa
}

.check {
  border-color: red;
   background-color: red;
}
</style>
