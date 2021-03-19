// 同时发送异步请求的次数
let ajaxTimes = 0;
export const request = (params) => {
    // 判断 url 中是否有/my/请求的是私有的路径 带上header token
    let header = { ...params.header };
    if (params.url.includes("/my/")) {
        // 拼接header 带上token
        header["Authorization"] = wx.getStorageSync("token");
    }
    ajaxTimes++;
    // 添加请求加载图标
    wx.showLoading({
        title: "加载中",
        mask: true

    });
    // 定义公共的URL
    const baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1';
    return new Promise((resolve, reject) => {
        wx.request({
            ...params,
            header: header,
            url: baseUrl + params.url,
            success: (result) => {
                resolve(result.data.message)
            },
            fail: (err) => {
                reject(err)
            },
            complete: () => {
                ajaxTimes--;
                if (ajaxTimes === 0) {
                    // 关闭加载图标
                    wx.hideLoading();
                }

            }
        })
    })
}