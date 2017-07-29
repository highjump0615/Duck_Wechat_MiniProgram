// pages/userGroup/userGroup.js

var util = require('../../utils/util.js')
var config = require('../../config/config.js')
var app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[],
    config: config
  },

  onLoad: function() {

    var that = this;

    // 获取快递订单
    wx.request({
      url: config.api.baseUrl + '/orders/groupbuy',//请求地址
      data: {
        customer_id: app.globalData.userInfo.customerId
      },
      header: {//请求头
        "Content-Type": "applciation/json"
      },
      method: "GET",//get为默认方法/POST
      success: function (res) {
        var orders = res.data.result;
        for (var i = 0; i < orders.length; i++) {
          orders[i].remain_time_formatted = util.formatMinute(orders[i].groupbuy.remain_time);
        }

        that.setData({//如果在sucess直接写this就变成了wx.request()的this了.必须为getdata函数的this,不然无法重置调用函数
          orders: orders
        })
      },
      fail: function (err) { },//请求失败
      complete: function () { }//请求完成后执行的函数
    })
  },

  detailClick: function(e) {
    // 跳转到订单详情页面
    wx.navigateTo({
      url: '../receivedOrder/receivedOrder?id=' + e.target.dataset.id
    });
  },

  /**
   * 跳转到商品详情页面
   */
  productView: function(e) {
    wx.navigateTo({
      url: '../productDetail/productDetail?id=' + e.currentTarget.dataset.id
    });
  }


})