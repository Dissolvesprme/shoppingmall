<template>
  <div id="home" class="wrapper">
<!-- 首页顶部导航栏 -->
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
 <!-- 狸猫换太子，实现吸附效果 -->
     <tab-control :titles="['流行', '新款', '精选']"
                  @tabClick="tabClick"
                  ref="tabControl1"
                  class="tabControl" v-show="isTabFixed"/>
<!-- Scroll添加滚动 -->
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
      :pull-up-load="true"
      @pullingUp="loadMore">
<!-- 轮播图 -->
      <home-swiper :banners="banners" 
       @swiperImageLoad="swiperImageLoad" />
<!-- 推荐组件 -->
      <recommend-view :recommends="recommends" />
<!-- 本周流行 -->
      <feature-view />
<!-- 分类导航栏 -->
      <tab-control
       :titles="['流行', '新款', '精选']"
        @tabClick="tabClick"
        ref="tabControl2"/>
<!-- 商品展示 -->
      <goods-list :goods="showGoods" />
    </scroll>
<!-- 回到顶部按钮 -->
    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>

<script>
import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";

import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll";


import { getHomeMultidata, getHomeGoods } from "network/home";
import { itemListenerMixin ,backTopMixin} from "common/mixin";

export default {
  name: "Home",
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
    
  },
  mixins: [itemListenerMixin,backTopMixin],
  data() {
    return {
      // result: null,
      banners: [],
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] }
      },
      currentType: "pop",
      tabOffsetTop: 0,
      saveY: 0,
      isTabFixed: false,
      
    };
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    }
  },
  destroyed() {
    // console.log('home destroyed');
  },
  activated() {
   this.$refs.scroll.scrollTo(0,this.saveY, 0)
   this.$refs.scroll.refresh()
  },
  deactivated() {
    // 保存Y值
    this.saveY =  this.$refs.scroll.getScollY()
    // console.log(this.saveY);
     this.$bus.$off('itemImgLoad', this.itemImgListener )
  },
  created() {
    // 1.请求多个数据
    this.getHomeMultidata();

    //2。请求商品数据
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");

  },
  mounted() {},
    //1.图片加载完成的事件监听
    // let refresh = debounce(this.$refs.scroll.refresh, 50)
    // this.itemImgListener =  () => {
    //   refresh()
    // }
    // this.$bus.$on("itemImageLoad", this.itemImgListener)  //    console.log("----");
      // this.$refs.scroll.refresh();  
 
    // 2.获取tabControl的offsetop
      //  this.tabOffsetTop = this.$$refs.tabControl 
      // console.log(this.$refs.tabControl.$el.offsetTop);
  methods: {
    /**
     * 事件监听方法
     */
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }

      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },
    contentScroll(position) {
      // 1.判断BackTop是否显示
      this.isShowBackTop = Math.abs(position.y) > 1000;
      // 滚动的时候切换页面，还是会一直监听滚动，并且滚动距离都是nan,可以在监听方法内，用off方法取消滚动监听

      //2.决定tabControl是否吸顶（positon: fixed)
      this.isTabFixed = Math.abs(position.y) > this.tabOffsetTop
    },
    loadMore() {
      this.getHomeGoods(this.currentType)
    },
    swiperImageLoad() {
      // console.log(this.$refs.tabControl.$el.offsetTop);
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
    },
    /**
     * 网络请求方法
     */
    getHomeMultidata() {
      getHomeMultidata().then(res => {
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then(res => {
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;

        //完成上拉加载更多
        this.$refs.scroll.finishPullUp();
      });
    }
  }
};
</script>

<style scoped>
#home {
  /* padding-top: 44px; */
  height: 100vh;
  position: relative;
}
.home-nav {
  background-color: var(--color-tint);
  color: #fff;

  /* position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9; 使用原生滚动，不让导航跟随滚动*/
}


.content {
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}

.tabControl {
  position: relative;
  z-index: 9;
}

/* .content {
  height: calc(100vh - 93px);
  overflow: hidden;
  margin-top: 44px;
} */
</style>
