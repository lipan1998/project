// pages/goods_detail/goods_detail.js
// 
import { request } from "../../request/request.js";
import { regeneratorRuntime } from "../../lib/runtime/runtime.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {}

  },
  GoodsObj: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { goods_id } = options;
    this.getGoodsDetail(goods_id)

  },
  // 1. 获取商品详情数据
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({ url: '/goods/detail', data: { goods_id } });
    this.GoodsObj = goodsObj;
    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        // ipone 部分手机 不识别webp图片格式
        // 最好找到后台 让他修改
        // 临时修改 确保后台存在 1.webp => 1.jpg
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        goods_price: goodsObj.goods_price,
        pics: goodsObj.pics


      }
    })
  },
  // 点击轮播图放大预览
  handlePrevewImage(e) {
    // console.log("放大");
    // 1 先构造要预览的图片数组
    const urls = this.GoodsObj.pics.map((v => v.pics_mid));
    // 2 接收传递过来的图片 url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls

    });
  },
  // 点击加入购物车
  handleCartAdd() {
    console.log("加入");
    // 1 获取缓存中的购物车数据 数组
    let cart = wx.getStorageSync("cart") || [];
    // 2 判断当前商品是否已存在于购物车
    let index = cart.findIndex(v => v.goods_id === this.GoodsObj.goods_id);
    if (index === -1) {
      // 3 不存在 第一次添加
      this.GoodsObj.num = 1;
      cart.push(this.GoodsObj)
    } else {
      // 4 已将存在购物车 执行num++
      cart[index].num++;
    }
    // 5 把数组重新填充回缓存中
    wx.setStorageSync("cart", cart);
    // 6 弹窗提醒
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      // 防止用户手抖 疯狂点击按钮
      mask: true,

    });
  }


})