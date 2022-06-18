<template>
  <div id="category">
    <nav-bar class="nav-bar">
      <div slot="center">商品分类</div>
    </nav-bar>
    <div class="content">
      <tab-menu :categories="categories"
                @selectItem="selectItem"/>
      <scroll id="tab-content"
              ref="scroll">
        <div>
          <tab-content-category :subcategories="showSubcategory" @imgLoad="imgLoad"/>
          <tab-control :titles="['综合', '新品', '销量']"
                       @tabClick="tabClick"/>
<!--          <goods-list :goods="showCategoryDetail"/>-->
        </div>
      </scroll>
    </div>
  </div>
</template>

<script>

  import NavBar from "@/components/common/navbar/NavBar";
  import TabMenu from "@/views/category/childComps/TabMenu";
  import Scroll from  "@/components/common/scroll/Scroll"
  import TabContentCategory from "@/views/category/childComps/TabContentCategory";
  import TabControl from "@/components/content/tabControl/TabControl";
  import GoodsList from "@/components/content/goods/GoodsList";
  // 网络请求
  import {getCategory, getSubcategory, getCategoryDetail} from 'network/category'
  import {tabControlMixin} from '@/common/mixin'

  export default {
    name: 'Category',
    components: {
      NavBar,
      TabMenu,
      Scroll,
      TabContentCategory,
      TabControl,
      GoodsList
    },

    data() {
      return {
        categories: [],
        categoryData: {},
        currentIndex: -1
      }
    },
    mixins: [tabControlMixin],
    created() {
      // 请求分类数据
      this.getCategory()
      // 2.监听图片加载完成
      this.$bus.$on('itemImageLoad', () => {
        this.$refs.scroll.refresh()
      })
    },
    computed: {
      // 1.请求分类数据
      showSubcategory() {
        if (this.currentIndex === -1) return {}
        return this.categoryData[this.currentIndex].subcategories
      },
      showCategoryDetail() {
        if (this.currentIndex === -1) return []
        return this.categoryData[this.currentIndex].categoryDetail[this.currentType]
      }
    },
    methods: {
      /**
       * 网络请求的方法
       */
      getCategory() {
        getCategory().then(res => {
          console.log(res)
          // 1.获取分类数据
          this.categories = res.data.data.category.list
          // 2.初始化每个类别的子数据
          for (let i = 0; i < this.categories.length; i++) {
            this.categoryData[i] = {
              subcategories: {},
              categoryDetail: {
                'pop': [],
                'new': [],
                'sell': []
              }
            }
          }
          // 3.请求第一个分类的数据
          this.getSubcategories(0)
        })
      },
      getSubcategories(index) {
        this.currentIndex = index
        const maitKey = this.categories[index].maitKey
        getSubcategory(maitKey).then(res => {
          this.categoryData[index].subcategories = res.data.data
          this.categoryData = {...this.categoryData}
          this.getCategoryDetail('pop')
          this.getCategoryDetail('sell')
          this.getCategoryDetail('new')
        })
      },
      getCategoryDetail(type) {
        // 1.获取请求的miniWallkey
        const miniWallkey = this.categories[this.currentIndex].miniWallkey;
        // 2.发送请求,传入miniWallkey和type
        getCategoryDetail(miniWallkey, type).then(res => {
          // 3.将获取的数据保存下来
          this.categoryData[this.currentIndex].categoryDetail[type] = res
          this.categoryData = {...this.categoryData}
        })
      },
      selectItem(index) {
        this.getSubcategories(index)
      },
      imgLoad() {
        this.$refs.scroll.refresh()
      }
    }
  }
</script>

<style scoped>
  #category {
    height: 100vh;
  }

  .nav-bar {
    background-color: var(--color-tint);
    font-weight: 700;
    color: #fff;
  }

  .content {
    display: flex;
    position: absolute;
    left: 0;
    right: 0;
    top: 44px;
    bottom: 49px;
    overflow: hidden;
  }

  #tab-content {
    height: 100%;
    flex: 1;
  }
</style>
