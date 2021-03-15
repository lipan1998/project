// pages/cart/cart.js
/* 
1. 获取用户的收货地址
   1 绑定点击事件
   2 获取小程序内置 API 获取用户的收货地址 wx.chooseAddress
2. 获取 用户 对小程序 所授予 获取地址的权限 状态 scope  authSetting  scope.address
  1 假设 用户 点击获取收货地址的提示框为 确定 
    scope 值 true 直接调用获取收货地址
  2 假设 用户 点击获取收货地址的提示框为 取消
    scope 值 false
    1 诱导用户 自己打开 授权页面 当用户重新给与 获取地址权限的时候
    2 获取收货地址
  3 假设用户 从来没有调用过 收货地址的API
    scope undefined 直接调用获取收货地址
注意：新公告 三个接口全部为true
scope.address: true
scope.invoice: true
scope.invoiceTitle: true
  4 将收货地址存入到缓存中


*/
import { getSetting, chooseAddress, openSetting } from "../../utils/asyncWx.js";
import { regeneratorRuntime } from "../../lib/runtime/runtime.js"
Page({
  // 1. 点击收货地址
  async handleChooseAddress() {

    // 2. 获取权限状态
    try {
      const result1 = await getSetting();
      // 1 获取权限状态 只要发现一些变量名很怪异的时候 都要用[]括起来
      const scopAddress = result1.authSetting['scope.address'];
      if (scopAddress === false) {
        // 2 用户以前拒绝过授予权限 先诱导用户打开授予权限
        await openSetting();
      }
      // 3 重新调用收货地址的API
      const address = await chooseAddress();
      wx.setStorageSync("address", address);

    } catch (error) {
      console.log(error);
    }
  }
})