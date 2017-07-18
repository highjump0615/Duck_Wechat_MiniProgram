// pages/retreatOrder/retreatOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalHidden: true
  },
  confirmRetreat: function (e) {
    this.setData({
      modalHidden: false
    })
  },
  modalChange: function (e) {
    this.setData({
      modalHidden: true
    })
  },
})