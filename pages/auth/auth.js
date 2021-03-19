// pages/auth/auth.js
import { request } from "../../request/request.js";
import { regeneratorRuntime } from "../../lib/runtime/runtime.js";
import { login } from "../../utils/asyncWx.js";
Page({

  // 获取用户信息
  async handleGetUserInfo(e) {
    // console.log(e);
    try {
      // 1 获取用户信息
      const { encryptedData, iv, rawData, signature } = e.detail;
      // 2 获取小程序登录成功后的code
      const { code } = await login();
      // console.log(code);
      const loginParams = { encryptedData, iv, rawData, signature, code };
      // 3 发送请求 获取用户的token
      const { token } = await request({ url: "users/wxlogin", data: loginParams, method: "POSt" });

      // 4 把token 存入缓存中 同时跳回上一个页面
      wx.setStorageSync("token", token);
      wx.navigateBack({
        delta: 1
      });
    } catch (error) {
      console.log(error);
    }
  }
})