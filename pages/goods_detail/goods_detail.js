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
    this.setData({
      goodsObj
    })
  }


})