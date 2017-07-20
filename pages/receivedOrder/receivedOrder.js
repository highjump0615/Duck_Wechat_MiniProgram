// pages/receivedOrder/receivedOrder.js
var util = require('../../utils/util.js')
var config = require('../../config/config.js')
var app = getApp();

var gnOrderId;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: {}
  },

  onLoad: function(option) {

    var that = this;

    gnOrderId = option.id;

    // 获取快递订单
    wx.request({
      url: config.api.baseUrl + '/order/detail/' + option.id,//请求地址
      data: {},
      header: {//请求头
        "Content-Type": "applciation/json"
      },
      method: "GET",//get为默认方法/POST
      success: function (res) {
        that.setData({//如果在sucess直接写this就变成了wx.request()的this了.必须为getdata函数的this,不然无法重置调用函数
          order: res.data.result
        })
      },
      fail: function (err) { },//请求失败
      complete: function () { }//请求完成后执行的函数
    });
  }, 

  /*
    Called when user click 确认收货
  */
  confirmReceipt: function (e) {
    wx.request({
      url: config.api.baseUrl + '/order/receive',//请求地址
      data: {
        order_id: gnOrderId,
      },
      header: {//请求头
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",//get为默认方法/POST
      success: function (res) {
        if (res.statusCode > 200) {
          // 失败
          return;
        }

        // 返回
        wx.navigateBack({
          delta: 1
        })
      },
      fail: function (err) {
      },//请求失败
      complete: function () { }//请求完成后执行的函数
    });
  }
})