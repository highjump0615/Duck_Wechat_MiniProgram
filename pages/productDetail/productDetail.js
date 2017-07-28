// pages/productDetail/productDetail.js
var util = require('../../utils/util.js');
var config = require('../../config/config.js');

//在使用的View中引入WxParse模块
var WxParse = require('../../lib/wxParse/wxParse.js');

var app = getApp();

var gnProductId;

var timerGroupbuy;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    swiperImages: [],
    productArray: [], // each product info array
    modalRetreatHidden: true,
    modalFireHidden: true,
    actionSheetHidden: true,
    commodityCount: 1,
    groupBuyingHidden: true,
    showLoading: false,
    specId: 0,

    // loading提示语
    loadingMessage: '',
    productDetails: [],
    groupBuys: [],

    // 图片base url
    baseUrl: config.baseUrl,
  },
  
  /**
   * 分享
   */
  onShareAppMessage: function() {
    return {
      title: this.data.productDetails.name,
      desc: this.data.productDetails.name,
      path: '/pages/productDetail/productDetail?id=' + gnProductId
    };
  },

  /*
    Called when user click question mark in 七天包退, 十四天包换 to show modal
  */
  modalRetreat: function (e) {
    this.setData({
      modalRetreatHidden: false
    })
  },
  /*
    Called when user click 确定 to hide modal
  */
  modalRetreatChange: function (e) {
    this.setData({
      modalRetreatHidden: true
    })
  },
  /*
    Called when user click question mark in 火热拼团 to show modal
  */
  modalFire: function (e) {
    this.setData({
      modalFireHidden: false
    })
  },
  /*
    Called when user click 确定 to hide modal
  */
  modalFireChange: function (e) {
    this.setData({
      modalFireHidden: true
    })
  },
  /*
    Called when user click close button in actionsheet
  */
  actionSheetChange: function (e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  /*
    Called when user click + in actionsheet
  */
  increaseCount: function (e) {
    this.setData({
      commodityCount: this.data.commodityCount + 1
    })
  },
  /*
    Called when user click - in actionsheet
  */
  decreaseCount: function (e) {
    if (this.data.commodityCount > 1) {
      this.setData({
        commodityCount: this.data.commodityCount - 1
      })
    }
  },
  /*
    Called when user click 立即购买
  */
  goBuyNow: function() {
    this.setData({
      groupBuyingHidden: true,
      actionSheetHidden: !this.data.actionSheetHidden,
      commodityCount: 1,
    });
    util.groupBuyMode = false;

    util.prepareOrderInfo.groupBuy = -1;
  },
  /*
    Called when user click 发起拼团
  */
  goGroupBuy: function() {
    this.setData({
      groupBuyingHidden: false,
      actionSheetHidden: !this.data.actionSheetHidden,
      commodityCount: 1,
    })
    util.groupBuyMode = true;

    util.prepareOrderInfo.groupBuy = 0;
  },

  /**
   * 参加拼团
   */
  inGroupBuy: function(e) {
    this.goGroupBuy();
    util.prepareOrderInfo.groupBuy = e.target.dataset.id;
  },

  /*
    Called when user click '下一步' button
  */
  goPending: function (e) {
    // 检查规格
    // if (this.data.specId <= 0) {
    //   wx.showModal({
    //     title: '请选择规格',
    //     showCancel: false
    //   });

    //   return;
    // }

    // 检查库存
    if (this.data.commodityCount > this.data.productDetails.remain) {
      wx.showModal({
        title: '库存不够',
        showCancel: false
      });

      return;
    }
    
    //
    // 跳转到下单页面
    //
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
    wx.navigateTo({
      url: '../pendingOrder/pendingOrder'
    });

    // 设置数量
    util.prepareOrderInfo.count = this.data.commodityCount;
    util.prepareOrderInfo.specId = this.data.specId;

    // 获取单价
    var dPrice = this.data.productDetails.price;
    if (util.groupBuyMode) {
      dPrice = this.data.productDetails.gb_price;
    }
    
    util.prepareOrderInfo.totalPrice = parseFloat(this.data.commodityCount * dPrice) + parseFloat(this.data.productDetails.price_deliver);
    util.productDetails = this.data.productDetails;

    console.log('go buy now -->');
    console.log(this.data.commodityCount);
    console.log(this.data.productDetails.price);
    console.log(util.totalPrice);
    console.log('<---');
  },
  hideLoading() {
    this.setData({ showLoading: false, loadingMessage: '' });
  },
  /*
  * load function
  */
  onLoad: function (option) {
    gnProductId = option.id;

    // 获取当前位置
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        app.globalData.userInfo.latitude = res.latitude;
        app.globalData.userInfo.longitude = res.longitude;
      }
    });

    this.setData({
      noticeRefund: app.setting.noticeRefund,
      noticeGroup: app.setting.noticeGroup
    })
  },

  onHide: function() {
    clearTimeout(timerGroupbuy);
  },

  onUnload: function() {
    clearTimeout(timerGroupbuy);
  },

  onShow: function() {
    this.getProductInfo();
  }, 

  //read the category list
  getProductInfo: function () {
    var that = this;   // 这个地方非常重要，重置data{}里数据时候setData方法的this应为以及函数的this, 如果在下方的sucess直接写this就变成了wx.request()的this了
    var productUrl = config.api.baseUrl + '/product/detail/' + gnProductId
    wx.request({
      url: productUrl,//请求地址
      data: {
        customer_id: app.globalData.userInfo.customerId
      },
      header: {//请求头
        "Content-Type": "applciation/json"
      },
      method: "GET",//get为默认方法/POST
      success: function (res) {
        console.log('product informations');
        console.log(res.data.result);//res.data相当于ajax里面的data,为后台返回的数据

        // 默认选择第一个规格
        var specId = 0;
        if (res.data.result.specs.length > 0) {
          specId = res.data.result.specs[0].id;
        }

        var detail = res.data.result;
        for (var i = 0; i < detail.groupbuys.length; i++) {
          detail.groupbuys[i].time_remain_formatted = util.foramtSeconds(detail.groupbuys[i].time_remain);
        }
        
        that.setData({//如果在sucess直接写this就变成了wx.request()的this了.必须为getdata函数的this,不然无法重置调用函数
          productDetails: detail,
          groupBuys: detail.groupbuys,
          specId: specId,
          thumbnail: res.data.result.thumbnail,
          swiperImages: res.data.result.images,
        })

        /**
        * WxParse.wxParse(bindName , type, data, target,imagePadding)
        * 1.bindName绑定的数据名(必填)
        * 2.type可以为html或者md(必填)
        * 3.data为传入的具体数据(必填)
        * 4.target为Page对象,一般为this(必填)
        * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
        */
        WxParse.wxParse('article', 'html', res.data.result.rtf_content, that, 10);

        timerGroupbuy = setTimeout(that.updateTimeRemaining, 1000);
        
        console.log('productdetail->swiperimages')
        console.log(that.data.swiperImages)
      },
      fail: function (err) { },//请求失败
      complete: function () { }//请求完成后执行的函数
    })
  },

  updateTimeRemaining: function() {    
    var detail = this.data.groupBuys;
    for (var i = 0; i < detail.length; i++) {
      detail[i].time_remain--;
      detail[i].time_remain_formatted = util.foramtSeconds(detail[i].time_remain);
    }

    this.setData({//如果在sucess直接写this就变成了wx.request()的this了.必须为getdata函数的this,不然无法重置调用函数
        groupBuys: detail
    });

    timerGroupbuy = setTimeout(this.updateTimeRemaining, 1000);
  },

  /**
   * 选择规格
   */
  selectSpec: function(e) {
    var specId = e.target.dataset.id;
    this.setData({
      specId: specId
    });
  }
})