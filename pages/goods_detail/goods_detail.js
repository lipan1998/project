// pages/goods_detail/goods_detail.js
/* 
<!-- 1 商品详情轮播图 -->
<!--
 2 点击轮播图 放大预览效果
    1 需要给轮播图绑定一个点击事件
    2 调用小程序的API prevewImage -->
 3 点击 加入购物车
   1 先绑定点击事件
   2 获取缓存中的购物车数据 数组格式
   3 先判断 当前的商品是否已经存在于购物车
   4 已经存在 修改商品数据 执行购物车数量++ 重新把购物车数组填充回缓存中
   5 不存在于购物车的数组中 直接给购物车数组添加一个新元素 新元素带上购买数量属性 num 重新把购物车数组 填充回缓存中 
   6 弹窗提醒 
 4 商品收藏
   1 页面onShow 的时候 加载缓存中的商品收藏的数据
   2 判断当前商品是不是被收藏
     1 是 改变页面的图标
     2 不是。。。
   3 点击商品收藏按钮
     1 判断该商品是否存在于缓存数组中
     2 已经存在 把该商品删除
     3 没有存在 把商品添加到收藏数组中 存入到缓存中即可

--> */
import { request } from "../../request/request.js";
import { regeneratorRuntime } from "../../lib/runtime/runtime.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    // 商品是否被收藏
    isCollect: false

  },
  GoodsObj: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages = getCurrentPages();
    let currentPages = pages[pages.length - 1];
    let options = currentPages.options;
    const { goods_id } = options;
    this.getGoodsDetail(goods_id)

  },
  // 1. 获取商品详情数据
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({ url: '/goods/detail', data: { goods_id } });
    this.GoodsObj = goodsObj;
    // 获取缓存中商品收藏的数组
    let collect = wx.getStorageSync("cart");
    // 判断当前商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.GoodsObj.goods_id)
    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        // ipone 部分手机 不识别webp图片格式
        // 最好找到后台 让他修改
        // 临时修改 确保后台存在 1.webp => 1.jpg
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        goods_price: goodsObj.goods_price,
        pics: goodsObj.pics


      },
      isCollect

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
    // console.log("加入");
    // 1 获取缓存中的购物车数据 数组
    let cart = wx.getStorageSync("cart") || [];
    // 2 判断当前商品是否已存在于购物车
    let index = cart.findIndex(v => v.goods_id === this.GoodsObj.goods_id);
    if (index === -1) {
      // 3 不存在 第一次添加
      this.GoodsObj.num = 1;
      this.GoodsObj.checked = true;
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
  },
  // 点击商品收藏图标
  handleCollect() {
    let isCollect = false;
    // 1. 获取缓存中商品收藏数组
    let collect = wx.getStorageSync("collect") || [];
    // 2. 判断该商品是否被收藏过
    let index = collect.findIndex(v => v.goods_id === this.GoodsObj.goods_id);
    // 3. 当index!=-1时 表示已经收藏过
    if (index !== -1) {
      // 能找到 已经收藏过了 在数组中删除数组
      collect.splice(index, 1);
      isCollect = false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true,
      });
    } else {
      // 没有收藏过
      collect.push(this.GoodsObj);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true,
      });
    }
    // 4. 把数组存入到缓存中
    wx.setStorageSync("collect", collect);
    // 5. 修改data中的属性
    this.setData({
      isCollect
    })
  }


})