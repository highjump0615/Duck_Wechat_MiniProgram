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
  formatTime: formatTime
}

var groupBuyMode = false;
var productId = 0; //when user click the detail button, store product id.
var beforeProductImgs = [];
var userInfo = [];
var customerId = '';
var productDetails = [];
var buyCnt = 0;
var priceSum = 0;
var totalPrice = 0;

var usrname = '朝阳区';
var phone =  '13041096933';
var area =  '北京市 朝阳区';
var address = '北京工业大学东门';
var zipcode = '100124';
var latitude = 0.0;
var longtitude = 0.0;