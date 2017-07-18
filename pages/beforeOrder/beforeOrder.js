// beforeOrder.js
var calNum = 1 // product num
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiper: {
      images: ['1', '2', '3', '4', '5', '6', '7']//TODO get data from server
    },
    productNum: calNum
  },
  
  /*decrease product number*/
  decBtn: function(e) {
    calNum -= 1;
    if (calNum < 0)
      calNum = 0;
    this.setData({productNum: calNum})
  },

  /*increase product number*/
  incBtn: function (e) {
    this.setData({ productNum: calNum += 1})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})