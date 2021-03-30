// index.js
// 获取应用实例

import { request } from "../../request/request.js";

//Page Object
Page({
  data: {
    // 1. 轮播图数组
    swiperList: [],
    // 2. 导航数组
    catesList: [],
    floorList: []
  },
  //页面开始加载 就会触发
  onLoad: function (options) {
    // 发送异步请求 获取轮播图数据
    // var reqTask = wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',

    //   success: (result) => {
    //     this.setData({
    //       swiperList: result.data.message
    //     })
    //   }
    // });
    this.getSwiperList();
    this.getCatesList();
    this.getFloorList();


  },
  // 1. 获取轮播图数组
  getSwiperList() {
    request({
      url: '/home/swiperdata',
    }).then(result => {
      // console.log(result);
      this.setData({
        swiperList: result
      })
    })
  },
  // 2. 获取分类导航数据
  getCatesList() {
    request({
      url: '/home/catitems',
    }).then(result => {
      // console.log(result);
      this.setData({
        catesList: result
      })
    })
  },
  // 3. 获取楼层数据
  getFloorList() {
    request({
      url: '/home/floordata',
    }).then(result => {
      // console.log(result);
      this.setData({
        floorList: result
      })
    })

  }


});