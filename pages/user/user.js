// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    // 被收藏的商品的数量
    collectNums: 0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow() {
    const userInfo = wx.getStorageSync("userInfo");
    const collect = wx.getStorageSync("collect") || [];
    this.setData({
      userInfo,
      collectNums: collect.length
    })
  },

})