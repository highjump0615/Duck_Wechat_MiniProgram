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
    products: [],
    beforeproductImgs: [],
    userInfo: {}
  },

  makeadsImageUrls: function (i, imgUrl) {
    console.log('-->makeadsImage' + i);
    console.log(imgUrl);

    this.data.swiperImages[i].image_url = imgUrl;
    console.log("ads product images" + i);
    console.log(this.data.swiperImages[i].image_url);


  },
  /**
 * 生命周期函数--监听页面加载
 */

  onLoad: function () {
    console.log('onLoad')
      // get the categorylist from backend-server
 
     var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {

      that.setData({
        userInfo: userInfo
      })
      util.userInfo = userInfo;
      console.log(util.userInfo.nickName);
      console.log(util.userInfo.avatarUrl);

      console.log(userInfo);

      // get the customer id
      wx.request({
        url: 'https://hly.weifengkeji.top/public/api/v1/customer/set',//请求地址
        data: {
          loginCode: userInfo.loginCode,
          name: util.userInfo.nickName,
          photo_url: util.userInfo.avatarUrl,
        },
        header: {//请求头
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",//get为默认方法/POST
        success: function (res) {
          console.log('get custormer id');
          console.log(res.data.customer_id);//res.data相当于ajax里面的data,为后台返回的数据
          
          util.userInfo.customerId = res.data.customer_id;
          util.customerId = res.data.customer_id;
        },
        fail: function (err) { },//请求失败
        complete: function () { }//请求完成后执行的函数
      })
    })

    // get the ads 
    wx.request({
      url: 'https://hly.weifengkeji.top/public/api/v1/ads',//请求地址
      data: {
      },
      header: {//请求头
        "Content-Type": "applciation/json"
      },
      method: "GET",//get为默认方法/POST
      success: function (res) {
        console.log('get ads');
        console.log(res.data.result);//res.data相当于ajax里面的data,为后台返回的数据
        
        app.globalData.adsCnt = 0;
        for (let i = 0; i < res.data.result.length; i++) {
          console.log('-->ads');
          console.log(i+ res.data.result[i].image_url);

          wx.downloadFile({
            url: res.data.result[i].image_url, //仅为示例，并非真实的资源
            type: 'image',
            success: function (res) {
              that.makeadsImageUrls(app.globalData.adsCnt, res.tempFilePath);

              app.globalData.adsCnt++;
            }
          });
        }
        that.setData({//如果在sucess直接写this就变成了wx.request()的this了.必须为getdata函数的this,不然无法重置调用函数
          swiperImages: res.data.result
        })
        console.log("ads 111");
        console.log(that.data.swiperImages)
      },
      fail: function (err) { },//请求失败
      complete: function () { }//请求完成后执行的函数
    })

    // get the category
    this.getCategory();
    this.firstCategory();
  },

  getCategory: function () {//read the category list
    var that = this;   // 这个地方非常重要，重置data{}里数据时候setData方法的this应为以及函数的this, 如果在下方的sucess直接写this就变成了wx.request()的this了
    wx.request({
      url: 'https://hly.weifengkeji.top/public/api/v1/product/categories',//请求地址
      data: {
      },
      header: {//请求头
        "Content-Type": "applciation/json"
      },
      method: "GET",//get为默认方法/POST
      success: function (res) {
        console.log('submit success');
        console.log(res.data);//res.data相当于ajax里面的data,为后台返回的数据
　　　　  that.setData({//如果在sucess直接写this就变成了wx.request()的this了.必须为getdata函数的this,不然无法重置调用函数
　　　　　　buttons: res.data.result
　　　　　　　　　　})

      },
      fail: function (err) { },//请求失败
      complete: function () { }//请求完成后执行的函数
    })
  },
  makeImageUrls: function (i,imgUrl) {
    console.log(imgUrl);
    for (let i=0;i<this.data.products.length;i++) {
      this.data.products[i].imageUrl = imgUrl;  
      console.log(this.data.products);
    }
    
  },
  firstCategory: function () {
    
    var that = this;
    var categoryID = 1;
    var imagePath;
    var app = getApp();
    var getCategoryurl = 'https://hly.weifengkeji.top/public/api/v1/products/' + categoryID;
    console.log(getCategoryurl);
    console.log('111->>>first category');
    wx.request({
      url: getCategoryurl,//请求地址
      data: {

      },
      header: {//请求头
        "Content-Type": "applciation/json"
      },
      method: "GET",//get为默认方法/POST
      success: function (res) {
        console.log('first category');
        console.log(res.data.result);//res.data相当于ajax里面的data,为后台返回的数据
        //console.log(res.data.imageUrl);//res.data相当于ajax里面的data,为后台返回的数据
        app.globalData.cnt = 0;
        for (let i = 0; i < res.data.result.length; i++) {
          console.log('detail image urls');
          console.log(res.data.result[i].thumbnail);

          wx.downloadFile({
            url: res.data.result[i].thumbnail, //仅为示例，并非真实的资源
            type: 'image',
            success: function (res) {
              that.makeImageUrls(app.globalData.cnt, res.tempFilePath);
              app.globalData.cnt++;
            }
          })
        }
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
    console.log(e.target.dataset.id);
    var that = this;
    var categoryID = e.target.dataset.id;
    var imagePath;
    var app = getApp();
    var getCategoryurl = 'https://hly.weifengkeji.top/public/api/v1/products/'+categoryID;
    console.log(getCategoryurl);
    console.log('111->>>get the product list of one category');
    wx.request({
      url: getCategoryurl,//请求地址
      data: {
          
      },
      header: {//请求头
        "Content-Type": "applciation/json"
      },
      method: "GET",//get为默认方法/POST
      success: function (res) {
        console.log('get the product list of one category');
        console.log(res.data.result);//res.data相当于ajax里面的data,为后台返回的数据
        //console.log(res.data.imageUrl);//res.data相当于ajax里面的data,为后台返回的数据
        app.globalData.cnt = 0;
        for (let i=0;i<res.data.result.length;i++){
          console.log('detail image urls');
          console.log(res.data.result[i].thumbnail); 
           
            wx.downloadFile({
              url: res.data.result[i].thumbnail, //仅为示例，并非真实的资源
              type: 'image',
              success: function (res) {
                that.makeImageUrls(app.globalData.cnt,res.tempFilePath);
                app.globalData.cnt++;
              }
            })
        }
        that.setData({//如果在sucess直接写this就变成了wx.request()的this了.必须为getdata函数的this,不然无法重置调用函数
          products : res.data.result
                    
        })
        

      },
      fail: function (err) { },//请求失败
      complete: function () { }//请求完成后执行的函数
    })
   

  },

  makeBeforeImageUrls: function (i, imgUrl) {
    console.log(imgUrl);

    this.data.beforeproductImgs[i].imgUrl = imgUrl;
    console.log("each product images");
    console.log(this.data.beforeproductImgs[i].imgUrl);


  },
  
  detailClick: function (e) {
    var that = this;
    util.productId = e.target.dataset.id;
    console.log(util.productId);
    wx.navigateTo({
      url: '../productDetail/productDetail'

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