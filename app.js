//app.js
App({
  onLaunch: function () {
    var that = this
    wx.getSystemInfo({
      success: res => {
          //获取手机型号
          const model = res.model;
          const screenHeight = res.safeArea.height;
          const screenTop = res.safeArea.top

          const modelInclude = ["iPhone X", 'iPhone XR', "iPhone XS", "iPhone XS MAX", "iPhone 11", "iPhone 11 Pro", "iPhone 11 Pro Max", "iphone 12", "iphone 12 Pro", "iphone 12 Pro Max"];
          var ios = !!(res.system.toLowerCase().search('ios') + 1);
          var statusBarHeight = res.statusBarHeight;
          
          var title_height = ios ? 44 : 48;
          // var title_height = ios ? 44 : 48;
          that.globalData.title_height = title_height,
          that.globalData.statusbarHeight = statusBarHeight
          that.globalData.statusBarHeight = statusBarHeight
          that.globalData.screenHeight = screenHeight
          that.globalData.screenTop = screenTop
          that.globalData.windowHeight = res.windowHeight

          for (let i = 0; i < modelInclude.length; i++) {
              //模糊判断是否是modelInclude 中的机型,因为真机上测试显示的model机型信息比较长无法一一精确匹配
              if (model.indexOf(modelInclude[i]) != -1) {
                  that.globalData.isIphoneXHeight = 168;
                  that.globalData.isIphoneXTop = '4'
              }
          }
      
      },
    fail(err) {
      console.log(err);
    }
  })
  },
  globalData: {
    userInfo: null,
    isIphoneXHeight: null
  }
})