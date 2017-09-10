//index.js
//获取应用实例
var util = require('../../utils/util.js')
var config = require('../../config/config.js')

var app = getApp()
Page({
  data: {
    swiperImages: [], // ads images
    buttons: [],
    productImgs: [],
    products: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  loadPage: function () {
    console.log('onLoad')
 
    var that = this;

    // get the ads 
    wx.request({
      url: config.api.baseUrl + '/ads',//请求地址
      data: {
      },
      header: {//请求头
        "Content-Type": "applciation/json"
      },
      method: "GET",//get为默认方法/POST
      success: function (res) {
        console.log('get ads');
        console.log(res.data.result);//res.data相当于ajax里面的data,为后台返回的数据
        
        that.setData({//如果在sucess直接写this就变成了wx.request()的this了.必须为getdata函数的this,不然无法重置调用函数
          swiperImages: res.data.result
        })
      },
      fail: function (err) { },//请求失败
      complete: function () { }//请求完成后执行的函数
    })

    // get the category
    this.getCategory();
  },

  onLoad: function() {
    app.getSystemData(this.loadPage);
  },

  getCategory: function () {//read the category list
    var that = this;   // 这个地方非常重要，重置data{}里数据时候setData方法的this应为以及函数的this, 如果在下方的sucess直接写this就变成了wx.request()的this了
    wx.request({
      url: config.api.baseUrl + '/product/categories',//请求地址
      data: {
      },
      header: {//请求头
        "Content-Type": "applciation/json"
      },
      method: "GET",//get为默认方法/POST
      success: function (res) {
        var categories = res.data.result;

        // 设置显示数据
        that.setData({
　　　　　　buttons: res.data.result
        })

        // 获取第一个分类的商品
        if (categories.length > 0) {
          that.getProductList(categories[0].id);
        }
      },
      fail: function (err) { },//请求失败
      complete: function () { }//请求完成后执行的函数
    })
  },
  getProductList: function (category) {    
    var that = this;

    var getCategoryurl = config.api.baseUrl + '/products/' + category;

    wx.request({
      url: getCategoryurl,//请求地址
      data: {

      },
      header: {//请求头
        "Content-Type": "applciation/json"
      },
      method: "GET",//get为默认方法/POST
      success: function (res) {
        that.setData({//如果在sucess直接写this就变成了wx.request()的this了.必须为getdata函数的this,不然无法重置调用函数
          products: res.data.result
        })
      },
      fail: function (err) { },//请求失败
      complete: function () { }//请求完成后执行的函数
    })

  },
  // get the prodcut's detail information
  clickCategory: function (e) { 
    this.getProductList(e.target.dataset.id);
  },

  /**
   * 点击宣传图片
   */
  onAdImage: function(e) {
    wx.navigateTo({
      url: '../productDetail/productDetail?id=' + e.currentTarget.dataset.id
    });
  },
  
  /**
   * 点击商品
   */
  detailClick: function (e) {
    wx.navigateTo({
      url: '../productDetail/productDetail?id=' + e.currentTarget.dataset.id
    });
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