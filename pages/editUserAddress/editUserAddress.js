// pages/editUserAddress/editUserAddress.js
var util = require('../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {},
  showErrorMessage: function(message) {
    wx.showModal({
        title: message,
        showCancel: false
      });
  },
  onLoad: function() {
    this.setData({
      receiver: app.receiver
    });

    if (this.data.receiver) {
      this.setData({
        username: this.data.receiver.name,
        phone: this.data.receiver.phone,
        area: this.data.receiver.area,
        address: this.data.receiver.address,
        zipcode: this.data.receiver.zipcode,
      })
    }
  },
  /*
    Called when user click 保存
  */
  saveAction: function(e) {
    // 姓名
    if (!this.data.username) {
      this.showErrorMessage('请输入收件人姓名');
      return;
    }
    this.data.receiver.name = this.data.username; 

    // 联系电话
    if (!this.data.phone) {
      this.showErrorMessage('请输入手机号');
      return;
    }
    this.data.receiver.phone = this.data.phone; 

    // 地区
    if (!this.data.area) {
      this.showErrorMessage('请输入地区');
      return;
    }
    this.data.receiver.area = this.data.area; 

    // 地址
    if (!this.data.address) {
      this.showErrorMessage('请输入详细地址');
      return;
    }
    this.data.receiver.address = this.data.address; 

    // 邮政编码
    this.data.receiver.zipcode = this.data.zipcode; 

    // 保存
    app.receiver = this.data.receiver;
    wx.setStorageSync('receiver', this.data.receiver)
   
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
})