// pages/search/search.js
/* 
1. 输入框绑定 值改变事件 input事件
   1 获取到输入框的值
   2 合法性判断
   3 检验通过 把输入框的值 发送到后台
   4 返回的数据打印到页面上
2. 防抖 （防止抖动） 定时器 节流
     0 防抖 一般 输入框中 防止重复输入 重复发送请求
     1 节流 一般是用在页面下拉和上拉
   1 定义全局的定时器id
*/
import { request } from "../../request/request.js";
import { regeneratorRuntime } from "../../lib/runtime/runtime.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    // 取消 按钮是否显示
    isFocus: false,
    // 输入框的值
    inpValue: ""
  },
  TimeId: -1,
  // 输入框的值改变 就会触发的事件
  handleInput(e) {
    // console.log(e);
    // 1. 获取输入框的值
    const { value } = e.detail;
    // 2 检测合法性
    if (!value.trim()) {
      // 值不合法
      // clearTimeout(this.TimeId);
      this.setData({
        goods: [],
        isFocus: false
      })
      return;
    }
    // 3. 准备发送请求获取数据
    this.setData({
      isFocus: true
    })
    clearTimeout(this.TimeId);
    // 防抖
    this.TimeId = setTimeout(() => {
      this.qsearch(value)
    }, 1000)

  },
  // 点击取消按钮
  handleCancle() {
    this.setData({
      inpValue: "",
      isFocus: false,
      goods: []
    })
  },
  async qsearch(query) {
    let res = await request({ url: "/goods/qsearch", data: { query } });
    // console.log(res);
    this.setData({
      goods: res
    })
  }

})