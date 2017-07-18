//app.js
var config = require('config/config.js')

App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    var that = this;

    // 获取基础参数
    var settings = wx.getStorageSync('setting');
    if (!settings) {
      wx.request({
        url: config.api.baseUrl + '/system/info',//请求地址
        data: {
        },
        header: {//请求头
          "Content-Type": "applciation/json"
        },
        method: "GET",//get为默认方法/POST
        success: function (res) {
          that.setting.customerPhone = res.data.result.phone;
          that.setting.noticeRefund = res.data.result.notice_refund;
          that.setting.noticeGroup = res.data.result.notice_groupbuy;

          // 保存
          wx.setStorageSync('setting', that.setting)
        },
        fail: function (err) { },//请求失败
        complete: function () { }//请求完成后执行的函数
      })
    }
    else {
      this.setting = settings;
    }
  },
  getUserInfo: function (cb) {
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (loginCode) 
        {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              that.globalData.userInfo.loginCode = loginCode.code;
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      });
    }
  },
  globalData: {
    userInfo: null,
    cnt: 0,
    adsCnt: 0,
  },
  // 系统基础信息
  setting: {
    customerPhone: '010-92838022',
    noticeRefund: '包退提示',
    noticeGroup: '拼团提示'    
  }
})