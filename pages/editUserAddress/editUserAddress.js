// pages/editUserAddress/editUserAddress.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
      username: '王小萌',
      phone: '13041096933',
      area: '北京市 朝阳区',
      address: '北京工业大学东门',
      zipcode: '100124'
    
  },
  /*
    Called when user click 保存
  */
  saveAction: function(e) {
    util.username = this.data.username;
    util.phone = this.data.phone;
    util.area = this.data.area;
    util.address = this.data.address;
    util.zipcode = this.data.zipcode;
   
    wx.navigateBack({
      delta: 1
    })
  },

  userName: function (e) {
    this.setData({
      username: e.detail.value
    })
  },
  userPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  userArea: function (e) {
    this.setData({
      area: e.detail.value
    })
  },
  userAddress: function (e) {
    this.setData({
      address: e.detail.value
    })
  },
  userZipcode: function (e) {
    this.setData({
      zipcode: e.detail.value
    })
  },
  /*
    Called when user click 取消
  */
  cancelAction: function(e) {
    wx.navigateBack({
      delta: 1
    })
  },
  /*
    Called when user click 定位
  */
  goMap: function (e) {
    wx.navigateTo({
      url: '../map/map'
    });
  }
})