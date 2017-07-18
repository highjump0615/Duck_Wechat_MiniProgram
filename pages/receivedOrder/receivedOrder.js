// pages/receivedOrder/receivedOrder.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupBuyingHidden: true
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      groupBuyingHidden: !util.groupBuyMode
    })
  },
  /*
    Called when user click 确认收货
  */
  confirmReceipt: function (e) {
    wx.navigateTo({
      url: '../index/index'
    });
  }
})