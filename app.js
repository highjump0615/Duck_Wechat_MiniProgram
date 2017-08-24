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
      },
      fail: function (err) { },//请求失败
      complete: function () { }//请求完成后执行的函数
    });

    //调用应用实例的方法获取全局数据
    this.getUserInfo();

    // 收件人
    this.receiver = wx.getStorageSync('receiver');
  },
  getUserInfo: function () {
    var that = this;

    var userInfo = wx.getStorageSync('userInfo');
    var strLoginCode;

    if (userInfo) {
      this.globalData.userInfo = userInfo;
    } else {
      //调用登录接口
      wx.login({
        success: function (loginCode) 
        {
          strLoginCode = loginCode.code;

          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;

               // get the customer id
              wx.request({
                url: config.api.baseUrl + '/customer/set',//请求地址
                data: {
                  login_code: strLoginCode,
                  name: res.userInfo.nickName,
                  photo_url: res.userInfo.avatarUrl,
                },
                header: {//请求头
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST",//get为默认方法/POST
                success: function (res) {
                  console.log('get custormer id');
                  console.log(res.data.customer_id);//res.data相当于ajax里面的data,为后台返回的数据

                  if (res.data.status == "success") {
                    that.globalData.userInfo.customerId = res.data.customer_id;

                    // 保存
                    wx.setStorageSync('userInfo', that.globalData.userInfo);
                  }
                  else {
                    wx.showModal({
                      title: '用户识别获取失败：' + strLoginCode,
                      showCancel: false
                    });

                    console.log('用户识别获取失败：' + strLoginCode);
                  }
                },
                fail: function (err) { },//请求失败
                complete: function () { }//请求完成后执行的函数
              })
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
  },

  //自定义Toast   
  showToast: function(text,o,count){
    var _this = o;
    count = parseInt(count) ? parseInt(count) : 3000;
    _this.setData({
      toastText:text,
      isShowToast: true,
    });
    setTimeout(function () {
      _this.setData({
        isShowToast: false
      });
    },count);
  },
})