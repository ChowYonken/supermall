import {debounce} from "@/common/utils";
import BackTop from "@/components/content/backTop/BackTop";

export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null,
      newRefresh: null
    }
  },
  mounted() {
    // 监听item中图片加载完成

    // 对这个函数进行防抖操作
    this.newRefresh = debounce(this.$refs.scroll.refresh, 200)

    // 对监听事件进行保存
    this.itemImgListener = () => {
      this.newRefresh()
    }
    this.$bus.$on('itemImageLoad', this.itemImgListener)
  }
}

export const backTopMixin = {
  data() {
    return {
      isShowBackTop: false
    }
  },
  components: {
    BackTop,
  },
  methods: {
    // 返回顶部
    backClick() {
      this.$refs.scroll.scrollTo(0, 0)
    }
  }
}

export const tabControlMixin = {
  data() {
    return {
      currentType: 'pop'
    }
  },
  methods: {
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
      console.log(this.currentType);
    }
  }
}
