<template>
  <scroll class="content" ref="scroll">
    <cart-list-item v-for="(item, index) in cartList"
                    :key="index"
                    :item-info="item"/>
  </scroll>
</template>

<script>

  import Scroll from 'components/common/scroll/Scroll'
  import CartListItem from "@/views/cart/childComps/CartListItem";

  import {mapGetters} from 'vuex'

  export default {
    name: "CartList",
    components: {
      Scroll,
      CartListItem
    },
    computed: {
      ...mapGetters([
        'cartList'
      ])
    },
    activated() {
      this.$refs.scroll.refresh()
    }
  }
</script>

<style scoped>
  .content {
    position: absolute;
    top: 44px;
    bottom: 89px;
    left: 0;
    right: 0;
    overflow: hidden;
  }
</style>
