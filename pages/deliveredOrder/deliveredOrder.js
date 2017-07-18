// pages/deliveredOrder/deliveredOrder.js
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
    Called when user click 地图
  */
  goMap: function (e) {
    wx.navigateTo({
      url: '../map/map'
    });
  },
  /*
    Called when user click 电话
  */
  goDial: function (e) {

  }
})