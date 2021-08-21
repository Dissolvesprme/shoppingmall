<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button
        class="check-button"
        :is-checked="isSelectAll"
        @click.native="checkClick"
      />
      <span>全选</span>
    </div>

    <div class="price">合计： {{ totalPrice }}</div>

    <div class="calculate"
    @click="calcClick">去计算({{ checkedLength }})</div>
  </div>
</template>

<script>
import CheckButton from "components/content/checkButton/CheckButton";

import { mapGetters } from "vuex";

export default {
  name: "CartBottomBar",
  components: {
    CheckButton
  },
  computed: {
    ...mapGetters(["cartList"]),
    totalPrice() {
      return (
        "￥" +
        this.cartList
          .filter(item => {
            return item.checked;
          })
          .reduce((preValue, item) => {
            return preValue + item.price * item.count;
          }, 0)
          .toFixed(2)
      );
    },
    checkedLength() {
      return this.cartList.filter(item => item.checked).length;
    },
    isSelectAll() {
      if (this.cartList.length === 0) return false;
      // 方法一filter return !(this.cartList.filter( item => item.checked).length)

      // 方法二find return !this.cartList.find(item => !item.checked)
      // 方法三普通遍历
      // for (let item of this.cartList) {
      //   if(!item.checked) {
      //     return false
      //   }
      // }
      // return true
      return this.cartList.every(item => item.checked);
    }
  },
  methods: {
    checkClick() {
      if (this.isSelectAll){ //全部选中
        this.cartList.forEach(item => item.checked = false)
      } else {  //部分或者没选
          this.cartList.forEach(item => item.checked = true)
        }
      // this.cartList.forEach(item => item.checked = !this.isSelectAll);
    },
    calcClick(){
      if (!this.cartList.find(item => item.checked)){
         this.$toast.show('请选择购买的商品', 2000)
      }
    }
  }
};
</script>

<style scoped>
.bottom-bar {
  position: relative;
  display: flex;

  line-height: 40px;
  height: 40px;

  background-color: #eee;

  font-size: 14px;
}
.check-content {
  display: flex;
  align-items: center;
  margin-left: 10px;
  width: 60px;
}
.check-button {
  width: 20px;
  height: 20px;
  line-height: 20px;
  margin-right: 5px;
}
.price {
  margin-left: 20px;
  flex: 1;
}
.calculate {
  /* margin-left: auto; */
  width: 90px;
  background: red;
  color: #fff;
  text-align: center;
}
</style>
