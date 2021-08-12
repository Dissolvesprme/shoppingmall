<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";

export default {
  name: "Scroll",
  props: {
    probeType: {
      type: Number,
      default: 0
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scroll: null,
      message: "哈哈哈"
    };
  },
  mounted() {
    this.scroll = new BScroll(this.$refs.wrapper, {
      click: true,
      probeType: this.probeType,
      pullUpLoad: this.pullUpLoad,

      mouseWheel: true,
      observeDOM: true,
      observeImage: true //在better-scroll@2.1.0得图片刷新加载显示区域延迟到解决
      // 官方解释: $refs 只会在组件渲染完成之后生效，并且它们不是响应式的。这仅作为一个用于直接操作子组件的“逃生舱”——你应该避免在模板或计算属性中访问 $refs
      // observeImage: {debounceTime: 300},
    });

    if (this.probeType === 2 || this.probeType === 3) {
      this.scroll.on('scroll', position => {
        // console.log(position);
        this.$emit('scroll', position);
      });
    }

    if (this.pullUpLoad) {
      this.scroll.on('pullingUp', () => {
        this.$emit('pullingUp')
      });
     
    }
  },
  methods: {
    scrollTo(x, y, time = 300) {
      this.scroll && this.scroll.scrollTo && this.scroll.scrollTo(x, y, time);
    }, // scrollTo(x, y, time, easing, extraTransform, isSilent)ref：
    // 如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素；如果用在子组件上，引用就指向组件实例，可以通过实例直接调用组件的方法或访问数据
    refresh() {
      this.scroll && this.scroll.refresh();
    },
     finishPullUp() {
       this.scroll && this.scroll.finishPullUp();
    },
    getScollY() {
      return this.scroll ? this.scroll.y : 0
    }
  }
};
</script>

<style></style>
