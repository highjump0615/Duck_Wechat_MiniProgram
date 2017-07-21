// pages/pendingOrder/pendingOrder.js
var util = require('../../utils/util.js')
var config = require('../../config/config.js')
var md5 = require('../../lib/md5.js')

var app = getApp();

var gnStoreId = 0;

/**
 * 计算距离
 * @param {*} lat1 
 * @param {*} lon1 
 * @param {*} lat2 
 * @param {*} lon2 
 */
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    deliveryActive: 'active',
    storeActive: '',
    storeHidden: false,
    groupBuyingHidden: true,
    productDetails: [],
    buyCnt: 0,
    priceSum: 0,
    totalPrice: 0,
    thumbnail: '',
    storeList: [],
    // 配送渠道
    channel: config.channel.delivery,
    desc: ''
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      groupBuyingHidden: !util.groupBuyMode,
      // 收件人
      receiver: app.receiver
    });
  },
  /*
    Called when user click 快递配送
  */
  selectDelivery: function (e) {
    this.setData({
      deliveryActive: 'active',
      storeActive: '',
      storeHidden: false,
      channel: config.channel.delivery
    })
  },
  /*
    Called when user click 门店自提
  */
  selectStore: function (e) {
    this.setData({
      deliveryActive: '',
      storeActive: 'active',
      storeHidden: true,
      channel: config.channel.self
    })
  },
  /*
    Called when user click 编辑
  */
  editAddress: function (e) {
    if(this.data.deliveryActive == 'active'){
      wx.navigateTo({
        url: '../editUserAddress/editUserAddress'
      });
    }else if(this.data.storeActive == 'active'){
      wx.navigateTo({
        url: '../editStoreAddress/editStoreAddress'
      });
    }
  },
  /*
    Called when user click radio
  */
  radioChange: function (e) {
    var checked = e.detail.value
    var changed = {}
    for (var i = 0; i < this.data.storeList.length; i++) {
      if (checked.indexOf(this.data.storeList[i].id) !== -1) {
        changed['storeList[' + i + '].checked'] = true
        gnStoreId = this.data.storeList[i].id;
      } else {
        changed['storeList[' + i + '].checked'] = false
      }
    }
    this.setData(changed)
  },
  /*
    Called when user click map marker
   */
  goMap: function(e) {
    var nIndex = e.currentTarget.dataset.index;
    var store = this.data.storeList[nIndex];

    wx.openLocation({
      latitude: store.latitude,
      longitude: store.longitude,
      scale: 12,
      name: store.name,
      address: store.address,
      success: function() {}
    })
    
    // console.log(e.target.dataset.id);
    // wx.navigateTo({
    //   url: '../map/map'
    // });
  },
  /*
  * load function
  */
  onLoad: function () {
    var that = this;

    // 规格
    var strSpec = '';
    for (var i = 0; i < util.productDetails.specs.length; i++) {
      if (util.productDetails.specs[i].id == util.prepareOrderInfo.specId) {
        strSpec = util.productDetails.specs[i].name;
        break;
      }
    }

    // 获取单价
    var dPrice = util.productDetails.price;
    if (util.groupBuyMode) {
      dPrice = util.productDetails.gb_price;
    }

    this.setData({
      productDetails: util.productDetails,
      buyCnt: util.prepareOrderInfo.count,
      spec: strSpec,

      // 价格合计
      priceSum: util.prepareOrderInfo.count * dPrice, 

      // 价格总计
      totalPrice: util.prepareOrderInfo.totalPrice
    })
    
    
    console.log('pending order -->');
    console.log(that.data.username);
    console.log(that.data.phone);
    console.log(util.productDetails);
    console.log('<---');

    // get the store list
    var storeUrl = 'https://hly.weifengkeji.top/public/api/v1/stores'
    wx.request({
      url: storeUrl,//请求地址
      data: {},
      header: {//请求头
        "Content-Type": "applciation/json"
      },
      method: "GET",//get为默认方法/POST
      success: function (res) {
        console.log('get store list -->');
        console.log(res.data.result);//res.data相当于ajax里面的data,为后台返回的数据

        var stores = res.data.result;
        // 默认选择第一家门店
        if (stores.length > 0) {
          stores[0].checked = true;
          gnStoreId = stores[0].id;

          // 计算距离
          for (var i = 0; i < stores.length; i++) {
            stores[i].distance = getDistanceFromLatLonInKm(
              app.globalData.userInfo.latitude,
              app.globalData.userInfo.longitude,
              stores[i].latitude,
              stores[i].longitude
            ).toFixed(1);
          }
        }

        that.setData({//如果在sucess直接写this就变成了wx.request()的this了.必须为getdata函数的this,不然无法重置调用函数
          storeList: stores
        })        
      },
      fail: function (err) { },//请求失败
      complete: function () { }//请求完成后执行的函数
    })
  },
  
  /**
   * 输入内容
   */
  // 收件人姓名
  userName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  // 手机号
  userPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  // 买家留言
  desc: function (e) {
    this.setData({
      desc: e.detail.value
    })
  },

  showPayemntError: function() {
    wx.showModal({
      title: '无法开启支付接口！',
      showCancel: false
    });
  },

  showMakeOrderError: function() {
    wx.showModal({
      title: '下单失败！',
      showCancel: false
    });
  },
  
  /*
    Called when user click 提交订单
  */
  submitOrder: function (e) {
    var that = this;

    // 确认收件人信息
    if (!this.data.receiver) {
      wx.showModal({
        title: '请输入收件人信息',
        showCancel: false
      });

      return;
    }

    // this.makeOrder();
    // return;

    // 预支付
    wx.request({
      url: config.api.baseUrl + '/order/prepare',//请求地址
      data: {
        product_id: util.productDetails.id,
        customer_id: app.globalData.userInfo.customerId,
        // price: util.prepareOrderInfo.totalPrice
        price: 0.01
      },
      header: {//请求头
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",//get为默认方法/POST
      success: function (res) {
        console.log(res);

        if (res.statusCode > 200) {
          // 失败
          that.showPayemntError();
          return;
        }

        var response = res.data.result;
        // 发起支付
        var appId = response.appid;
        var timeStamp = (Date.parse(new Date()) / 1000).toString();
        var pkg = 'prepay_id=' + response.prepay_id;
        var nonceStr = response.nonce_str;
        var paySign = md5.hex_md5('appId='+appId+'&nonceStr='+nonceStr+'&package='+pkg+'&signType=MD5&timeStamp='+timeStamp+"&key=5UkDSKPgHQ6cpsUSwxt2lJnixzQkzQeO").toUpperCase();

        wx.requestPayment({
          'appId': appId,
          'timeStamp': timeStamp,
          'nonceStr': nonceStr,
          'package': pkg,
          'signType': 'MD5',
          'paySign': paySign,
          'success':function(res){
            // 生成订单
            that.makeOrder();
          },
          'fail':function(res){
            console.log(res);
          }
        });
      },
      fail: function (err) {
        that.showPayemntError();
      },//请求失败
      complete: function () { }//请求完成后执行的函数
    });

    // }else if(this.data.storeActive == 'active') {
    //   wx.navigateTo({
    //     url: '../deliveredOrder/deliveredOrder'
    //   });
    // }
  },
  /**
   * 生成订单
   */
  makeOrder: function() {

    var that = this;

    var paramData = {
      customer_id: app.globalData.userInfo.customerId,
      product_id: util.productDetails.id,
      count: this.data.buyCnt,
      // 收件人
      name: this.data.receiver.name,
      phone: this.data.receiver.phone,
      // 规格
      spec_id: util.prepareOrderInfo.specId,
      channel: this.data.channel,
      desc: this.data.desc,
      price: util.prepareOrderInfo.totalPrice,
    };

    // 门店
    if (this.data.channel == config.channel.self) {
      paramData.store_id = gnStoreId
    }
    else {
      // 地址
      paramData.address = this.data.receiver.address;
      paramData.area = this.data.receiver.area;
      paramData.zipcode = this.data.receiver.zipcode;
    }

    // 拼团
    paramData.groupbuy_id = util.prepareOrderInfo.groupBuy;

    wx.request({
      url: config.api.baseUrl + '/order/make',//请求地址
      data: paramData,
      header: {//请求头
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",//get为默认方法/POST
      success: function (res) {
        if (res.statusCode > 200) {
          // 失败
          that.showMakeOrderError();
          return;
        }

        // 下单成功
        wx.showToast({
          title: '下单成功'
        });

        // 跳转，默认是拼团列表
        var strUrl = '../userGroup/userGroup';
        if (util.prepareOrderInfo.groupBuy < 0) {
          // 门店订单
          if (that.data.channel == config.channel.self) {
            strUrl = '../storeOrder/storeOrder';
          }
          // 快递订单
          else {
            strUrl = '../deliveryOrder/deliveryOrder';
          }
        }

        // 跳转到订单列表页面
        wx.redirectTo({
          url: strUrl
        });
      },
      fail: function (err) {
        that.showMakeOrderError();
      },//请求失败
      complete: function () { }//请求完成后执行的函数
    })
  }
})