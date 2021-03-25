// pages/collect/collect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collect: [],
    tabs: [
      {
        id: 0,
        value: "全部订单",
        isActive: true
      },
      {
        id: 1,
        value: "待付款",
        isActive: false
      },
      {
        id: 2,
        value: "待收货",
        isActive: false
      },
      {
        id: 3,
        value: "退货退款",
        isActive: false
      }
    ],

  },
  onShow() {
    const collect = wx.getStorageSync("collect") || [];
    this.setData({
      collect
    })
  },
  handleTabsItemChange(e) {
    // 标题点击事件 从子组件传递过来
    // console.log(e);
    // 1.获取被点击的标题索引
    const { index } = e.detail;
    // 2.修改源数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
    // 3.赋值到data中去
    this.setData({
      tabs
    })
  },



})