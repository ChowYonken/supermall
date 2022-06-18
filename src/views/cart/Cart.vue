<template>
  <div class="cart">
    <!--导航栏-->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{Length}})</div>
    </nav-bar>
    <!--购物车商品-->
    <cart-list/>
    <!--底部导航栏-->
    <cart-bottom-bar/>
  </div>
</template>

<script>

  import NavBar from "@/components/common/navbar/NavBar";
  import CartList from "@/views/cart/childComps/CartList";
  import CartBottomBar from "@/views/cart/childComps/CartBottomBar";
  // 引入辅助函数
  import {mapGetters} from 'vuex'

  export default {
    name: 'Cart',
    components: {
      NavBar,
      CartList,
      CartBottomBar
    },
    computed: {
      // mapGetters 将store中的getters 映射到 局部组件中
      // 两种写法
      // ...mapGetters([
      //   "cartList",
      //   "cartLength"
      // ])
      ...mapGetters({
        List: "cartList",
        Length: "cartLength"
      })
    }
  }
</script>

<style scoped>
  .nav-bar {
    background-color: var(--color-tint);
    color: #fff;
  }
</style>
