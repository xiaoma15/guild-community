<style lang="less" scoped>
    .picturePreview {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1000;
        background: rgba(0, 0, 0, .7);
    }
    // .icon-chax2{
    //     position: absolute;
    //     top: 110px;
    //     right: 20px;
    //     color: #fff;
    //     font-size: 80px;
    // }
    // .xian{
    //     width: 1px;
    //     height: 60px;
    //     color: #fff;
    // }
    // .swiper-container {
    //     position: absolute;
    //     top: 183px;
    //     left: 15px;
    //     right: 15px;
    //     height: 194px;
    //     border-radius: 5px;
    //     background: #fff;
    // }
    .swiper-container {
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        transform: translateY(-50%);
    }
    .swiper-zoom-container{
        width: 100%;
    }
    .swiper-lazy-preloader {
        position: absolute;
        top: 50%;
        color: #ccc;
        font-size: 12px;
        animation: none;
        width: 60px;
        line-height: 42px;
        text-align: center;
        background: #fff;
    }
    .swiper-lazy-preloader:after {
        background: none;
    }
    .bullets_box {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
    }
    .bullets {
        display: inline-block;
        margin-right: 10px;
        width: 6px;
        height: 6px;
        border-radius: 50px;
        background: rgba(255,255,255,.5);
    }
    .activated {
        background: rgba(255,255,255,1);
    }
</style>
<style>
    .swiper-slide {
        width: 100%!important;
    }
</style>
<template>
    <div class="picturePreview" v-if="show" touch.stop @click.prevent.stop="hide">
        <!-- <i class="iconfont icon-chax2" @click.prevent.stop="hide"></i> -->
        <swiper :options="swiperOption" ref="picture">
            <swiper-slide v-for="(item, index) in list" :key="index">
                <div class="swiper-zoom-container" @click.prevent.stop="hide">
                    <img width="100%" :src="item" class="swiper-lazy" alt="图片加载中">
                </div>
                <div class="swiper-lazy-preloader" v-if="list.length == 0">
                    图片加载中
                </div>
            </swiper-slide>
        </swiper>
        <div class="bullets_box">
            <span class="bullets" :class="{'activated':activeIndex==index}" v-for="(bullItem, index) in list" :key="index"></span>
        </div>
        <show-tack-pic
            :showDialog="showDialog"
            :pictureNum="list.length"
            @on-cancel="cancelBottom"
            @cancel-tack="cancelTack"
            @tackPicture="tackPicture"></show-tack-pic>
    </div>
</template>
<script>
    import { swiper, swiperSlide } from 'vue-awesome-swiper'
    import 'swiper/dist/css/swiper.css'
    export default {
        components: {
            swiper,
            swiperSlide
        },
        props: {
            show: {
                type: Boolean,
                default: false
            },
            list: {
                type: Array,
                default() {
                    return []
                }
            },
            index: {
                type: Number,
                default: 0
            },
            onlyLook: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                pictureNum: 0,
                activeIndex: 0,
                showDialog: false,
                swiperOption: {
                    autoplayDisableOnInteraction: false,
                    observer:true,
                    observeParents:true,
                    initialSlide: this.index, // 初始化时slide的索引
                    direction: 'horizontal', // Slides的滑动方向，可设置水平(horizontal)或垂直(vertical)。
                    lazyLoading : true,
                    preloadImages: false,
                    lazyLoadingInPrevNext : true,
                    zoom: true, // 焦距功能：双击slide会放大，并且在手机端可双指触摸缩放。
                    zoomToggle :true, // 是否允许双击
                    autoHeight: true,
                    preventClicksPropagation: true, //阻止click冒泡。拖动Swiper时阻止click事件。
                    onSlideChangeStart: (swiper) => {
                        this.activeIndex = swiper.activeIndex;
                    },
                    // onSliderMove: (swiper) => {
                    //     if(swiper.zoom.scale != 1) {
                    //         swiper.zoom.scale = 3;
                    //         swiper.zoom.toggleZoom(swiper);
                    //     }
                    // }

                }
            }
        },
        watch: {
            show() {
                if(this.show) {
                    this.activeIndex = this.index;
                    this.swiperOption.initialSlide = this.index;
                }
            }
        },
        methods: {
            // 处理用户取消拍照或者选择照片时的事件
            cancelTack() {
                var time = setTimeout(() => {
                        this.showDialog = false;
                        clearTimeout(time);
                }, 500)
            },
            hide() {
                this.$emit('on-hide');
            },
            addInvoice() {
                this.showDialog = true
            },
            cancelBottom() {
                this.showDialog = false
            },
            tackPicture(picStr) {
                this.showDialog = false
                this.$emit('on-addInvoice', picStr);
            }
            // touchstart(e) {
            //     console.log('touchstart', e.layerX)
            //     this.$emit('on-touchstart', e.layerX, e.layerY);
            // },
            // touchend(e) {
            //     console.log('touchend', e.layerX)
            //     this.$emit('on-touchend', e.layerX, e.layerY);
            // }
        }
    }
</script>
