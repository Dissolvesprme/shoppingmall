<template>
  <div id="detail">
    <detail-nav-bar @titleClick="titleClick" class="detail-nav" ref="nav" />
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
    >
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" />
      <detail-param-info :param-info="paramInfo" ref="params" />
      <detail-comment-info :comment-info="commentInfo" ref="comment" />
      <goods-list :goods="recommends" ref="recommend" />
    </scroll>
    <detail-bottom-bar @addCart="addToCart" />

    <back-top @click.native="backClick" v-show="isShowBackTop" />
    <!-- <toast :message="message" :show="show" /> -->
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailBottomBar from "./childComps/DetailBottomBar";

import Scroll from "components/common/scroll/Scroll";
import GoodsList from "components/content/goods/GoodsList";
// import Toast from "components/common/toast/Toast";

import { mapActions } from "vuex";

import {
  getDetail,
  Goods,
  Shop,
  GoodsParam,
  getRecommend
} from "network/detail";
import { debounce } from "common/utils";
import { itemListenerMixin, backTopMixin } from "common/mixin";

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
    DetailBottomBar,
    Scroll,
    GoodsList,
    // Toast
  },
  mixins: [itemListenerMixin, backTopMixin],
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
      // message: "",
      // show: false
    };
  },
  created() {
    // 1.保存传入的iid
    this.iid = this.$route.params.iid;
    // 每次拿到的id是不一样的(url可见)，一样的是页面显示的(因为keep-alive页面没有重新创建,也就没有重新从$route中取出参数)
    //  2.请求详情数据
    getDetail(this.iid).then(res => {
      console.log(res);
      // 1.获取数据
      const data = res.result;
      // 2.取出轮播图数据
      this.topImages = data.itemInfo.topImages;

      //  3.创建商品对象
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );

      // 4取出店铺信息
      this.shop = new Shop(data.shopInfo);

      // 5保存商品的详情数据
      this.detailInfo = data.detailInfo;

      // 6获取参数信息
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );
      // 7取出评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0];
      }
    });

    // 3.请求推荐数据
    getRecommend().then(res => {
      this.recommends = res.data.list;
    });

    // 4.给getThemeTOPY赋值(对赋值操作进行防抖)
    this.getThemeTopY = debounce(() => {
      this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      this.themeTopYs.push(Number.MAX_VALUE);

      console.log(this.themeTopYs);
    }, 100);
  },
  methods: {
    ...mapActions(["addCart"]),
    imageLoad() {
      this.$refs.scroll.refresh();
      this.getThemeTopY();
    },
    titleClick(index) {
      // console.log(index);
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200);
    },
    contentScroll(position) {
      // 1.获取y值
      const positionY = -position.y;
      // console.log(Number.MAX_VALUE);
      //  2.hack做法position.y和主题中的值进行对比
      const length = this.themeTopYs.length;
      for (let i = 0; i < length - 1; i++) {
        //   if (
        //     this.currentIndex !== i &&
        //       ((i < length - 1 &&
        //         positionY >= this.themeTopYs[i] &&
        //         positionY < this.themeTopYs[i + 1]) ||
        //     (i === length - 1 && positionY >= this.themeTopYs[i]))
        //   ) {
        //     this.currentIndex = i;
        //     // console.log(this.currentIndex);
        //     this.$refs.nav.currentIndex = this.currentIndex
        //   }
        if (
          this.currentIndex !== i &&
          positionY >= this.themeTopYs[i] &&
          positionY < this.themeTopYs[i + 1]
        ) {
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex;
        }
      }

      // 3.是否回到顶部
      this.isShowBackTop = Math.abs(position.y) > 1000;
    },
    destroyed() {
      this.$bus.$off("itemImgLoad", this.itemImgListener);
    },
    addToCart() {
      // console.log('----');
      //   // 1.获取购物车需要展示的商品信息
      const product = {};
      product.iid = this.iid;
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      //   // 2.将商品加入购物车
      // this.$store.cartList.push(product)
      // this.$store.commit("addCart", product);
      this.addCart(product).then(res => {
        // this.show = true;
        // this.message = res;
        // setTimeout(() => {
        //   this.show = true;
        //   this.message = '';
        // }, 1500);
        // console.log(res);
        console.log(this.$toast);
        this.$toast.show()
      });
      // this.$store.dispatch('addCart',product).then(res => {
      //   console.log(res);
      // })

      // 3.添加购物车成功
    }
  }
};
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
  z-index: 9;
  background-color: #fff;
}

.content {
  height: calc(100% - 102px);
  overflow: hidden;
}
</style>
