// pages/editStoreAddress/editStoreAddress.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeItems: [
      {id: '1', name: '北工大门店', address: '朝阳区平乐园100号', phone: '13031198966', distance: '125', checked: 'true'},
      { id: '2', name: '北工大门店', address: '朝阳区平乐园100号', phone: '13031198966', distance: '125'},
      { id: '3', name: '北工大门店', address: '朝阳区平乐园100号', phone: '13031198966', distance: '125' },
      { id: '4', name: '北工大门店', address: '朝阳区平乐园100号', phone: '13031198966', distance: '125' },
      { id: '5', name: '北工大门店', address: '朝阳区平乐园100号', phone: '13031198966', distance: '125' },
      { id: '6', name: '北工大门店', address: '朝阳区平乐园100号', phone: '13031198966', distance: '125' },
    ]
  },
  radioChange: function (e) {
    var checked = e.detail.value
    var changed = {}
    for (var i = 0; i < this.data.storeItems.length; i++) {
      if (checked.indexOf(this.data.storeItems[i].id) !== -1) {
        changed['storeItems[' + i + '].checked'] = true
      } else {
        changed['storeItems[' + i + '].checked'] = false
      }
    }
    this.setData(changed)
  },
  /*
    Called when user click 保存
  */
  saveAction: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },
  /*
    Called when user click 取消
  */
  cancelAction: function (e) {
    wx.navigateBack({
      delta: 1
    })
  }
})