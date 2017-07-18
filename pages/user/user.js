// pages/user/user.js
var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    /*owner: {
      image: '../../images/user.png',
      name: 'Myname'
    }*/

    myName: '',
    myImage:'',
  },
  goStorePage: function (e) {
    wx.navigateTo({
      url: '../storeOrder/storeOrder'
    });
  },
  goDeliveryPage: function (e) {
    wx.navigateTo({
      url: '../deliveryOrder/deliveryOrder'
    });
  },
  goWePage: function (e) {
    wx.navigateTo({
      url: '../userGroup/userGroup'
    });
  },
  /**
   * 拨打电话
   */
  goCustomerPage: function (e) {
    wx.makePhoneCall({
      phoneNumber: this.data.phone
    });
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function () {
    console.log('onLoad')
    // get the categorylist from backend-server
    var that = this
    that.setData ({
      myName : util.userInfo.nickName,
      myImage : util.userInfo.avatarUrl,
      phone: app.setting.customerPhone
    })

    console.log(that.myName);
    console.log(that.myImage);
  },
})
