<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行', '新款', '精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 class="tab-control"
                 v-show="isTabFixed"/>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            :pull-up-load="true"
            @scroll="contentScroll"
            @pullingUp="loadMore">
      <home-swiper :banners="banners"
                   @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control :titles="['流行', '新款', '精选']"
                   @tabClick="tabClick"
                   ref="tabControl2"/>
      <goods-list :goods="showGoods"/>
    </scroll>
    <!-- .native 是监听组件的点击事件 -->
    <back-top @click.native="backClick"
              v-show="isShowBackTop"/>
  </div>

</template>

<script>
  // childComps的组件
  import HomeSwiper from './childComps/HomeSwiper.vue'
  import RecommendView from './childComps/RecommendView.vue'
  import FeatureView from './childComps/FeatureView.vue'

  //公共组件components
  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodsList from 'components/content/goods/GoodsList'
  import Scroll from 'components/common/scroll/Scroll'

  // 公共的
  import {getHomeMultidata, getHomeGoods} from 'network/home';
  import {backTopMixin, itemListenerMixin} from "@/common/mixin";


  export default {
    name: 'Home',
    components: {
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodsList,
      Scroll,
    },
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []}
        },
        // 定义初始的pop属性
        currentType: 'pop',
        // 记录tabControl的offsetTop值
        tabOffsetTop: 0,
        isTabFixed: false,
        // 记录活跃状态时的Y值
        saveY: 0
      }
    },
    // 混合的使用
    mixins: [itemListenerMixin, backTopMixin],
    created() {
      // 请求多个数据
      this.getHomeMultidata()

      //  请求tab-control的数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')

    },
    mounted() {},
    activated() {
      // 活跃时将自动跳回原来的位置
      this.$refs.scroll.scrollTo(0, this.saveY, 0)
      // 防止自动返回顶部 所以刷新一遍
      this.$refs.scroll.refresh()
    },
    deactivated() {
      // 不活跃时记录滚动后的位置
      this.saveY = this.$refs.scroll.getScrollY()
      // 不活跃时取消全局事件的监听
      this.$bus.$off('itemImageLoad', this.itemImgListener)
    },
    computed: {
      // 获取goods的list属性
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    methods: {
      /**
       * 事件监听相关方法
       */
      // 点击tab栏事件监听
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        // 让两个tabControl的currentIndex保持一致
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index
      },
      // 判断backtop组件是否隐藏
      contentScroll(position) {
        // 1.判断backTop是否显示
        this.isShowBackTop = (-position.y) > 1000
        // 2.判断tabControl是否吸顶(position: fixed)
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      //下拉加载更多
      loadMore() {
        this.getHomeGoods(this.currentType)
      },
      //计算tabControl的offsetTop值
      swiperImageLoad() {
        // 获取tabControl的offsetTop值
        // 每个组件都有一个$el属性：用于获取组件中的元素
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      },
      /**
       * 网络请求的方法
       */
      getHomeMultidata() {
         getHomeMultidata().then(res => {
          this.banners = res.data.data.banner.list
          this.recommends = res.data.data.recommend.list
      })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          this.goods[type].list.push(...res.data.data.list)
          this.goods[type].page += 1
          //上拉加载完成 需要调用scroll.finish函数继续执行加载
          this.$refs.scroll.finishPullUp()
        })
      }
    }
  }
</script>

<style scoped>
  #home {
    padding-top: 44px;
    /* 视口高度 */
    position: relative;
    height: 100vh;
  }

  .home-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: var(--color-tint);
    color: #fff;
    z-index: 9;
  }

  .content {
    position: absolute;
    overflow: hidden;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .tab-control {
    position: relative;
    z-index: 9;
  }
</style>
