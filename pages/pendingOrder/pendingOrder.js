// pages/pendingOrder/pendingOrder.js
var util = require('../../utils/util.js')
var config = require('../../config/config.js')
var md5 = require('../../lib/md5.js')

var app = getApp();

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
    channel: config.channel.delivery
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
    console.log('pending order map');
    
    console.log(e.target.dataset.id);
    wx.navigateTo({
      url: '../map/map'
    });
  },
  /*
* load function
*/
  onLoad: function () {
    console.log(util.prepareOrderInfo);

    var that = this;

    // 规格
    var strSpec = '';
    for (var i = 0; i < util.productDetails.specs.length; i++) {
      if (util.productDetails.specs[i].id == util.prepareOrderInfo.specId) {
        strSpec = util.productDetails.specs[i].name;
        break;
      }
    }

    this.setData({
      productDetails: util.productDetails,
      buyCnt: util.prepareOrderInfo.count,
      spec: strSpec,

      // 价格合计
      priceSum: util.prepareOrderInfo.count * util.productDetails.price,  

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
        }

        that.setData({//如果在sucess直接写this就变成了wx.request()的this了.必须为getdata函数的this,不然无法重置调用函数
          storeList: res.data.result
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
  
  /*
    Called when user click 提交订单
  */
  submitOrder: function (e) {
    // 确认收件人信息
    if (!this.data.receiver) {
      wx.showModal({
        title: '请输入收件人信息',
        showCancel: false
      });

      return;
    }

    // 预支付
    wx.request({
      url: config.api.baseUrl + '/order/prepare',//请求地址
      data: {
        product_id: util.productDetails.id,
        customer_id: util.userInfo.customerId,
        price: util.prepareOrderInfo.totalPrice
      },
      header: {//请求头
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",//get为默认方法/POST
      success: function (res) {
        console.log(res);

        if (res.statusCode > 200) {
          // 失败
          wx.showToast({
            title: '无法开启支付接口！'
          });

          return;
        }
        
        var response = res.data.result;
        // 发起支付
        var appId = response.appid;
        var timeStamp = (Date.parse(new Date()) / 1000).toString();
        var pkg = 'prepay_id=' + response.prepay_id;
        var nonceStr = response.nonce_str;
        var paySign = md5.hex_md5('appId='+appId+'&nonceStr='+nonceStr+'&package='+pkg+'&signType=MD5&timeStamp='+timeStamp+"&key=5UkDSKPgHQ6cpsUSwxt2lJnixzQkzQeO").toUpperCase();

        console.log(paySign);

        wx.requestPayment({
          'appId': appId,
          'timeStamp': timeStamp,
          'nonceStr': nonceStr,
          'package': pkg,
          'signType': 'MD5',
          'paySign': paySign,
          'success':function(res){
            wx.showToast({
              title: '支付成功', 
              icon: 'success'
            });
          },
          'fail':function(res){
            console.log(res);
          }
        });
      },
      fail: function (err) {
        wx.showToast({
          title: '无法开启支付接口！'
        });
      },//请求失败
      complete: function () { }//请求完成后执行的函数
    })

    // if(this.data.deliveryActive == 'active') {
    //   wx.navigateTo({
    //     url: '../receivedOrder/receivedOrder'
    //   });
    // }else if(this.data.storeActive == 'active') {
    //   wx.navigateTo({
    //     url: '../deliveredOrder/deliveredOrder'
    //   });
    // }
  }
})