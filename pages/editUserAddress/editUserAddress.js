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
    var newReceiver = this.data.receiver || {};

    // 姓名
    if (!this.data.username) {
      this.showErrorMessage('请输入收件人姓名');
      return;
    }
    newReceiver.name = this.data.username; 

    // 联系电话
    if (!this.data.phone) {
      this.showErrorMessage('请输入手机号');
      return;
    }
    newReceiver.phone = this.data.phone; 

    // 地区
    if (!this.data.area) {
      this.showErrorMessage('请输入地区');
      return;
    }
    newReceiver.area = this.data.area; 

    // 地址
    if (!this.data.address) {
      this.showErrorMessage('请输入详细地址');
      return;
    }
    newReceiver.address = this.data.address; 

    // 邮政编码
    newReceiver.zipcode = this.data.zipcode; 

    // 保存
    this.data.receiver = newReceiver;
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