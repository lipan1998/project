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
   4 将收货地址存入到本地缓存中
3. 页面加载完毕
   0 onLoad onShow
   1 获取本地存储中的地址数据
   2 把数据 设置给data中的一个变量
4. onShow
   0 回到了商品的详情页面 第一次添加商品的时候 手动添加了属性
     1 num = 1;
     2 checked = true;
   1 获取缓存中的购物车数组
   2 把购物车数据填充到data中
5. 全选的实现 数据的展示
  1 onShow 获取缓存中的购物车数组
  2 根据购物车中的商品数据 所有的商品都被选中 checked = true全选就被选中
6. 总价格和总数量
  1 都需要商品被选中 我们才拿它来做计算
  2 获取购物车数组
  3 遍历
  4 判断商品是否被选中
  5 总价格 += 商品的单价 * 商品的数量
    总数量 += 商品的数量
  6 把计算后的价格和数量 设置回data中即可
7. 商品的选中
  1 绑定change事件
  2 获取到被修改的商品对象
  3 商品对象的选中状态取反
  4 重新填充回data中和缓存中
  5 重新计算全选 总价格 总数量
8. 全选和反选
  1 全选复选框绑定事件 change
  2 获取data中的全选变量  allChecked
  3 直接取反  allChecked=！allChecked
  4 遍历购物车数组 让里面商品 选中状态跟随  allChecked改变而改变
  5 把购物车数组 和  allChecked 重新设置回data 把购物车重新设置回缓存中
9. 商品数量的编辑 
  1 “+” “-”按钮 绑定同一个点击事件 区分的关键是 自定义属性
    1 “+” “+1“
    2 “-” “-1”
  2 传递被点击的商品id goods_id
  3 获取data中的购物车数组 来获取被需要修改的商品对象
  4 当购物车数量 =1 时 用户点击 “-”
    弹窗提示（showModal） 询问用户 是否要删除
    1 确定 直接执行删除、
    2 取消 什么都不做
  4 直接修改商品对象的数量
  5 把cart数组 重新设置回 缓存中 和data中 this.setCart
10 点击结算
  1 判断有没有收获地址信息
  2 判断用户有没有选购商品
  3 经过以上的验证 跳转到支付页面


*/
import { getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/asyncWx.js";
import { regeneratorRuntime } from "../../lib/runtime/runtime.js"
Page({
  data: {
    address: {},
    cart: [],
    allChecked: false,
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
      let address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;

      wx.setStorageSync("address", address);

    } catch (error) {
      console.log(error);
    }
  },
  // 商品的选中
  handleItemChange(e) {
    // console.log(e);
    // 1 获取被修改的商品的id
    const goods_id = e.currentTarget.dataset.id;
    // 2 获取购物车数组
    let { cart } = this.data;
    // 3 找到被修改的商品对象
    const index = cart.findIndex(v => v.goods_id === goods_id);
    // 4 选中状态取反
    cart[index].checked = !cart[index].checked;

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
  // 商品全选功能
  handleItemAllchange() {
    // 1 获取data中的全选变量 allChecked cart
    let { cart, allChecked } = this.data;
    // 2 取反
    allChecked = !allChecked;
    // 3 遍历购物车数组 让里面商品 选中状态跟随
    cart.forEach(v => v.checked = allChecked);
    // 4 把购物车数组 和 allChecked 重新设置回data 把购物车重新设置回缓存中
    this.setCart(cart);

  },
  // 商品数量的编辑
  async handleItemNumEdit(e) {
    // console.log(e);
    // 1 获取被点击商品的id operation
    const { id, operation } = e.currentTarget.dataset;
    // 2 获取被修改的商品数组
    let { cart } = this.data;
    // 3 获取被修改商品的索引
    const index = cart.findIndex(v => v.goods_id === id);
    // 4 判断是否要执行删除
    if (cart[index].num === 1 && operation === -1) {
      // 4.1 弹窗提醒
      const res = await showModal({ content: '是否要删除？' });
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      // 4 修改商品对象得数量
      cart[index].num += operation;
      // 5 把cart数组 重新设置回 缓存中 和data中 this.setCart
      this.setCart(cart);
    }
  },
  // 点击结算
  async handlePay() {
    // 1 判断有没有收获地址
    const { address, totalNum } = this.data;

    if (!address.userName) {
      await showToast({ title: '您还没有收获地址~' });
      return;
    }
    // 2 判断用户有没有选购商品
    if (totalNum === 0) {
      await showToast({ title: '您还没有选购商品~' });
      return;
    }
    // 3 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/pay'
    });

  }
})