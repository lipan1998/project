// pages/category/category.js 
import { request } from "../../request/request.js";
import { regeneratorRuntime } from "../../lib/runtime/runtime.js"
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    // 左侧的菜单数据
    leftMenuList: [],
    // 右侧的商品数据
    rightContent: [],
    // 左侧被激活的菜单索引
    currentIndex: 0,
    // 左侧菜单被点击时右侧商品的滚动条距离顶部的距离
    scrollTop: 0
  },
  // 接口的返回数据
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /* 
    0 web中的本地存储和 小程序中的本地存储的区别
      1 写代码的方式不一样了
        web: localStorage.setItem("key","value") localStorage.getItem("key")
    小程序中:   wx.setStorageSync("key","value")  wx.getStorageSync("key")
    2:存的时候 有没有做类型转换
        web: 不管存入的是什么类型的数据，最终都会先调用以下 toString(),把数据变成了字符串 再存入进去
      小程序: 不存在 类型转换的这个操作 存什么类似的数据进去，获取的时候就是什么类型
    1. 先判断一下本地存储中有没有旧的数据
    {data:Date.now(),data:[...]}
    2. 没有旧数据 直接发送新请求
    3. 如果有 判断旧数据有没有过期 没有过期 就使用本地存储中的旧数据
    */

    // 1.获取本地存储中的数据 (小程序中也是存在 本地存储 技术的)
    const Cates = wx.getStorageSync("cates");
    if (!Cates) {
      // 如果不存在 发送请求数据
      this.getCates()
    } else {
      // 如果有旧的数据 定义过期时间 10s 改成 5分钟
      if (Date.now() - Cates.time > 1000 * 10) {
        // 重新发送请求
        this.getCates()
      } else {
        // 可以使用旧的数据
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },
  // 获取分类数据
  async getCates() {
    // request({
    //   url: '/categories',
    // }).then(result => {
    //   // console.log(result);
    //   this.Cates = result.data.message;
    //   // 把接口的数据存入本地存储中
    //   wx.setStorageSync("cates", { data: Date.now(), data: this.Cates });
    //   // 构造左侧的大菜单数据
    //   let leftMenuList = this.Cates.map(v => v.cat_name);
    //   // 构造右侧的商品数据
    //   let rightContent = this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    // })
    // 使用es7的async await 来请求数据
    const result = await request({ url: '/categories' });
    // this.Cates = result.data.message;
    this.Cates = result;
    // 把接口的数据存入本地存储中
    wx.setStorageSync("cates", { data: Date.now(), data: this.Cates });
    // 构造左侧的大菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name);
    // 构造右侧的商品数据
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  },
  // 左侧菜单的点击事件
  handleItemTap(e) {
    // console.log(e);
    /* 
    1. 获取被点击标题身上的索引
    2. 给data中的currentIndex赋值
    3. 根据不同的索引来渲染右侧的商品内容
    */
    const { index } = e.currentTarget.dataset;

    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      // 重新设置 右侧商品的滚动条距离顶部的距离
      scrollTop: 0
    })
  }


})