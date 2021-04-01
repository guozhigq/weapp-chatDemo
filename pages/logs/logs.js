//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  aaa(){
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },
  bbb(){
    wx.navigateTo({
      url: '/pages/index2/index2',
    })
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  }
})
