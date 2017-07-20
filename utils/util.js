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

  /**
   * 秒转成mm:ss
   */
  formatMinute: function(seconds) {
    var hour = Math.floor(Math.floor(seconds / 60) / 60);
    var min = Math.floor(seconds / 60) % 60;

    return [hour, min].map(formatNumber).join(':')
  },

  foramtSeconds: function(seconds) {
    var sec = seconds % 60;
    return this.formatMinute(seconds) + ':' + formatNumber(sec);
  },

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