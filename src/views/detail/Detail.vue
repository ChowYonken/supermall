<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav"
                    @titleClick="titleClick"
                    ref="nav"/>
    <scroll class="content"
            ref="scroll"
            @scroll="contentScroll"
            :probe-type="3">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo"
                         @imageLoad="imageLoad"/>
      <detail-param-info ref="param" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommends" :goods="recommends"/>
    </scroll>
    <detail-bottom-bar @addToCart="addToCart"/>
    <back-top v-show="isShowBackTop"
              @click.native="backClick"/>
<!--    <toast :message="message" :show="show"/>-->
  </div>
</template>

<script>
  // 1.导入相关组件
  import DetailNavBar from "@/views/detail/childComps/DetailNavBar";
  import DetailSwiper from "@/views/detail/childComps/DetailSwiper";
  import DetailBaseInfo from "@/views/detail/childComps/DetailBaseInfo";
  import DetailShopInfo from "@/views/detail/childComps/DetailShopInfo";
  import DetailGoodsInfo from "@/views/detail/childComps/DetailGoodsInfo";
  import DetailParamInfo from "@/views/detail/childComps/DetailParamInfo";
  import DetailCommentInfo from "@/views/detail/childComps/DetailCommentInfo";
  import Scroll from "@/components/common/scroll/Scroll";
  import DetailBottomBar from "@/views/detail/childComps/DetailBottomBar";

  // 2.导入相关网络请求的方法
  import {getDetail, getRecommend, Goods, Shop, GoodsParam} from "@/network/detail";

  // 3.一些可复用的组件
  import GoodsList from "@/components/content/goods/GoodsList";
  import {backTopMixin, itemListenerMixin} from "@/common/mixin";
  import {debounce} from "@/common/utils";
  import {TOP_DISTANCE} from "@/common/const";
  // import Toast from "@/components/common/toast/Toast";

  import {mapActions} from 'vuex'

  export default {
    name: "Detail",
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      Scroll,
      DetailBottomBar,
      GoodsList,
      // Toast
    },
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        getThemeTopY: null,
        currentIndex: 0,
        // message: '',
        // show: false
      }
    },
    // 混合的使用
    mixins: [itemListenerMixin, backTopMixin],
    created() {
      // 1.保存传入的iid
      this.iid = this.$route.params.iid

      // 2.根据iid请求详情数据
      getDetail(this.iid).then(res => {
        // 获取顶部的图片的轮播数据
        const data = res.data.result
        this.topImages = data.itemInfo.topImages
        // 获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
        // 获取店铺信息
        this.shop = new Shop(data.shopInfo)
        // 获取商品详情数据
        this.detailInfo = data.detailInfo
        // 获取商品参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
        // 获取评价信息
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
        }
        // 错误的写法
        // this.$nextTick(() => {
        //   // 根据最新的数据，对应的DOM已经被渲染出来
        //   // 但是图片依然没有加载完（目前获取到的offsetTop值不包含图片）
        //   // offsetTop值不对的时候，都是图片的问题
        //
        //   // 每次更新都要将themeTopYs设为空数组
        //   this.themeTopYs = []
        //   this.themeTopYs.push(0)
        //   this.themeTopYs.push(this.$refs.param.$el.offsetTop)
        //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        //   this.themeTopYs.push(this.$refs.recommends.$el.offsetTop)
        // })
      })

      // 3.请求推荐数据
      getRecommend().then(res => {
        this.recommends = res.data.data.list
      })

      // 4.对一个函数进行防抖操作
      this.getThemeTopY = debounce(() => {
        // 每次更新都要将themeTopYs设为空数组
        this.themeTopYs = []

        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.param.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommends.$el.offsetTop)
        this.themeTopYs.push(Number.MAX_VALUE)
        // console.log(this.themeTopYs)
      }, 300)
    },
    mounted() {},
    destroyed() {
      // 不活跃时取消全局事件的监听
      this.$bus.$off('itemImageLoad', this.itemImgListener)
    },
    methods: {
      ...mapActions(['addCart']),
      imageLoad() {
        // 进行刷新
        this.newRefresh()
        this.getThemeTopY()
      },
      titleClick(index) {
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
      },
      // 监听滚动事件
      contentScroll(position) {
        // 1.获取y值
        const positionY = -position.y
        // 2.positionY和主题中的值作对比
        let length = this.themeTopYs.length
        for(let i = 0; i < length - 1; i++) {
          // 普通写法
          // if (this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) || (i === length - 1 && positionY >= this.themeTopYs[i]))) {
          //   this.currentIndex = i
          //   this.$refs.nav.currentIndex = this.currentIndex
          // }
          // hack写法
          if (this.currentIndex !== i && (positionY >=this.themeTopYs[i] && positionY < this.themeTopYs[i+1])) {
            this.currentIndex = i
            this.$refs.nav.currentIndex = this.currentIndex
          }
        }
        // 3.滑到一定的offsetTop值显示backTop
        this.isShowBackTop = -(position.y) > TOP_DISTANCE
      },
      // 添加到购物车
      addToCart() {
        // 获取购物车需要展示的信息
        const product = {}
        product.title = this.goods.title
        product.image = this.topImages[0]
        product.desc = this.goods.desc
        product.iid = this.iid
        product.realPrice = this.goods.realPrice
        // 将商品添加到购物车(actions可以返回promise对象，还可以使用mapActions直接映射到组件中)
        this.addCart(product).then(res => {
          // 原始的方法
          // this.show = true
          // this.message = res
          //
          // setTimeout(() => {
          //   this.show = false
          // }, 1500)
          this.$toast.show(res, 1500)
        })
        // this.$store.dispatch('addCart', product).then(res => {
        //   console.log(res)
        // })
        console.log(this.$store.state.cartList)
      }
    }
  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav {
    position: relative;
    background-color: #fff;
    z-index: 9;
  }

  .content {
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
    overflow: hidden;
  }
</style>
