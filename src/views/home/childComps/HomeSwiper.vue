<template>
  <swiper>
    <swiper-item v-for="item in banners">
      <a :href="item.link">
        <!--@load监听图片加载完成-->
        <img :src="item.image" alt="" @load="imageLoad">
      </a>
    </swiper-item>
  </swiper>
</template>

<script>

  import {Swiper, SwiperItem} from 'components/common/swiper/index'

  export default {
    name: 'HomeSwiper',
    data() {
      return {
        isLoad: false
      }
    },
    props: {
      banners: {
        type: Array,
        default() {
          return []
        }
      }
    },
    components: {
      Swiper,
      SwiperItem
    },
    methods: {
      // 监听图片是否加载完成，出于性能，这里只需要加载一次图片获得offsetTop值即可
      imageLoad() {
        if (!this.isLoad) {
          this.$emit('swiperImageLoad')
          this.isLoad = true
        }
      }
    }
  }
</script>

<style scoped>

</style>
