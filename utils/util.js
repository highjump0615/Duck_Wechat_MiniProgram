function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,

  // 商品详情 -> 待付款
  prepareOrderInfo: {
    channel: 0,
  },
}

var groupBuyMode = false;
var productId = 0; //when user click the detail button, store product id.
var userInfo = [];
var productDetails = [];

var latitude = 0.0;
var longtitude = 0.0;