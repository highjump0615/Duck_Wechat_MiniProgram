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
    order: {},
    labelReceive: '收货',
    config: config,
    refundModal: false,
    refundReason: ''
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
        var order = res.data.result;
        var strLabel = '收货';
        if (order.channel == config.channel.self) {
          strLabel = '提货';
        }

        that.setData({//如果在sucess直接写this就变成了wx.request()的this了.必须为getdata函数的this,不然无法重置调用函数
          order: res.data.result,
          labelReceive: strLabel
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
  },

  /**
   * 转到地图
   */
  navigateMap: function() {
    var store = this.data.order.store;

    wx.openLocation({
      latitude: parseFloat(store.latitude),
      longitude: parseFloat(store.longitude),
      scale: 12,
      name: store.name,
      address: store.address,
      success: function() {},
      fail: function(err) {
        wx.showModal({
          content: err.errMsg,
          showCancel: false
        });
      }
    });
  },

  /**
   * 申请退款
   */
  requestRefund: function() {
    // 打开输入理由对话框
    this.setData({
      refundModal: true
    })
  },

  /**
   * 关闭对话框
   */
  cancelRefundModal: function() {
    this.setData({
      refundModal: false
    })
  },

  /**
   * 提交退款
   */
  submitRefund: function() {
    var that = this;

    wx.request({
      url: config.api.baseUrl + '/order/refund',//请求地址
      data: {
        order_id: gnOrderId,
        reason: this.data.refundReason
      },
      header: {//请求头
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",//get为默认方法/POST
      success: function (res) {

        if (res.statusCode > 200) {
          // 失败
          wx.showModal({
            title: '退款申请失败',
            showCancel: false
          });
          
          return;
        }

        wx.showToast({
          title: '申请退款成功'
        });

        // 返回
        setTimeout(function() {
          wx.navigateBack({
            delta: 1
          });
        }, 1000);
      },
      fail: function (err) {
      },//请求失败
      complete: function () {
        that.cancelRefundModal();
      }
    });
  },

  /**
   * 理由input
   */
  inputReason: function (e) {
    this.setData({
      refundReason: e.detail.value
    })
  },
})