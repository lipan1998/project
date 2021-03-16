// pages/pay/pay.js


import { getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/asyncWx.js";
import { regeneratorRuntime } from "../../lib/runtime/runtime.js"
Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    // 1 获取缓存中的地址数据
    const address = wx.getStorageSync("address");
    // 1 获取缓存中中的购物车数据
    const cart = wx.getStorageSync("cart") || [];
    this.setData({ address });
    this.setCart(cart);
  },



  // 封装 设置购物车状态时 重新计算 底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart) {
    // 重新计算全选 总价格 总数量
    let allChecked = true;
    // 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }

    });
    // 判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    });
    wx.setStorageSync("cart", cart);
  },



})