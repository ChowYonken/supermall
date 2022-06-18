<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button :is-checked="isSelectAll"
                    class="check-button"
                    @click.nat.native="checkClick"/>
      <span>全选</span>
    </div>
    <div class="price">
      合计: {{totalPrice}}
    </div>
    <div class="calculate"
         @click="calcClick">
      去计算({{checkLength}})
    </div>
  </div>
</template>

<script>

  import CheckButton from "@/components/content/checkButton/CheckButton";
  import {mapGetters} from "vuex";

  export default {
    name: "CartBottomBar",
    components: {
      CheckButton
    },
    computed: {
      ...mapGetters(['cartList']),
      totalPrice() {
        return '¥' + this.cartList.filter(item => {
          return item.checked
        }).reduce((preValue, item) => {
          return preValue + item.realPrice * item.count
        }, 0).toFixed(2)
      },
      checkLength() {
        return this.cartList.filter(item => item.checked).length
      },
      isSelectAll() {
        if (this.cartList.length === 0) return false
        // 1.filter
        // return !(this.cartList.filter(item => !item.checked).length)
        // 2.find
        return !(this.cartList.find(item => !item.checked))
        // 3.普通循环
      }
    },
    methods: {
      checkClick() {
        if (this.isSelectAll) { // 全部选中
          this.cartList.forEach(item => item.checked = false)
        } else { //部分或全部不中
          this.cartList.forEach(item => item.checked = true)
        }
      },
      calcClick() {
        if (!this.isSelectAll) {
          this.$toast.show('请选择购买的商品', 2000)
        }
      }
    }
  }
</script>

<style scoped>
  .bottom-bar {
    display: flex;
    position: fixed;
    bottom: 49px;
    left: 0;
    right: 0;
    height: 40px;
    font-size: 14px;
    /*background-color: #eee;*/
    box-shadow: 0 -2px 3px rgba(0, 0, 0, .2);
    line-height: 40px;
    padding-left: 10px;
  }

  .check-content {
    display: flex;
    align-items: center;
    width: 66px;
  }

  .check-button {
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 5px;
  }
  .price {
    flex: 1;
    margin-left: 20px;
  }

  .calculate {
    width: 90px;
    background-color: red;
    color: #fff;
    text-align: center;
  }
</style>
