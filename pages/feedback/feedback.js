// pages/feedback/feedback.js
/* 
1 点击 “+” 触发tap点击事件
  1 调用小程序内置的 选择图片的api
  2 获取到 图片的路径 数组
  3 把图片路径 存到 data的变量中
  4 页面就可以根据 图片数组 进行循环显示
2 点击 自定义图片 组件
  1 获取被点击的元素的索引
  2 获取data中的图片数组
  3 根据索引 数组中删除对应的元素
  4 把数组重新设置回data中
3 点击“提交”
  1 获取文本域中的内容 类似 输入框的获取
    1 data中定义变量 表示输入框内容
    2 文本域 绑定 输入事件 事件触发的时候 把输入框的值 存入到变量中
  2 对这些内容 合法性验证
  3 验证通过 用户选择的图片 上传到专门的图片的服务器 返回图片外网的链接
    1 遍历图片数组
    2 挨个上传
    3 自己再维护图片数组存放 图片上传后的外网的链接
  4 文本域 和 外网的图片的路径 一起提交到服务器 只是前端的模拟 不会发送请求到后台
  5 清空当前页面
  6 返回上一页
*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "商品、商家投诉",
        isActive: false
      },
    ],
    // 被选中的图片数组
    chooseImages: [],
    // 文本域的内容
    textVal: ""

  },
  // 外网的图片路径数组
  UploadImages: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  // 点击 + 选择图片
  handleChooseImg() {
    // 调用小程序内置的选择图片的api
    wx.chooseImage({
      // 同时选中图片的数量 最多9
      count: 9,
      // 图片的格式 压缩 原图
      sizeType: ['original', 'compressed'],
      // 图片的来源 相册 照相机
      sourceType: ['album', 'camera'],
      success: (result) => {
        // console.log(result);
        this.setData({
          chooseImages: [...this.data.chooseImages, ...result.tempFilePaths]
        })
      },

    });
  },
  // 点击自定义图片组件
  handleRemoveImg(e) {
    // console.log(e);
    // 获取被点击的图片的索引
    const { index } = e.currentTarget.dataset;
    console.log(index);
    // 获取data中的图片数组
    let { chooseImages } = this.data;
    // 删除图片
    chooseImages.splice(index, 1);
    this.setData({
      chooseImages
    })

  },
  // 文本域的输入事件
  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value
    })
  },
  // 提交按钮的点击
  handleFormSubmit(e) {
    // 1 获取文本域的内容
    const { textVal, chooseImages } = this.data;
    // 2 合法性的验证
    if (!textVal.trim()) {
      wx.showToast({
        title: '内容不合法',
        icon: 'none',
        mask: true
      });
      return;
    }
    // 3 准备上传图片到专门的图片服务器
    // 上传文件的api 不支持多个文件同时上传 遍历数组 挨个上传
    // 显示正在等待的图片
    wx.showLoading({
      title: "正在提交中",
      mask: true,
    });
    // 判断有没有需要上传的数组
    if (chooseImages.length != 0) {
      chooseImages.forEach((v, i) => {
        wx.uploadFile({
          // 图片要上传到哪里
          url: 'https://images.ac.cn/Home/Index/UploadAction/',
          // 被上传的文件的路径
          filePath: v,
          // 上传的文件的名称 后台来获取文件 file
          name: "file",
          // 顺带的文本信息
          formData: {},
          success: (result) => {
            console.log(result);
            let url = JSON.parse(result.data).url;
            this.UploadImages.push(url);
            // console.log(this.UploadImages);
            // 所有的图片都上传完毕了 才触发
            if (i === chooseImages.length - 1) {
              wx.hideLoading();
              console.log("把文本内容 和 外网的图片数组 都提交到后台中");
              // 提交都成功了 重置页面
              this.setData({
                chooseImages: [],
                textVal: ""
              })
              // 返回上一个页面
              wx.navigateBack({
                delta: 1
              });
            }
          },

        });
      })
    } else {
      wx.hideLoading();
      console.log("只是提交了文本");
      wx.navigateBack({
        delta: 1
      });
    }
  }

})