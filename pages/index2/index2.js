//index.js
//获取应用实例
// var url = 'wss://test.nwx000.com/wss';
// const wxapi = require('../../../utils/wxapi')
// const vail = require('../../../utils/vail')
// const util = require('../../../utils/util')
const app = getApp();

Page({
  data: {
    picShow: false,
    safeheight: '', //安全高度,
    userInputContent: '', //输入框内容
    index: '',
    close_flag: 5000,
    scrollTop: '50',
    talkData: [
      {
        fromid: '123', // 发送人id
        type: 'text', // 消息类型
        content: '浔阳江头夜送客'
      },
      {
        fromid: '321', // 发送人id
        type: 'text', // 消息类型
        content: '枫叶荻花秋瑟瑟'
      },
      {
        fromid: '123', // 发送人id
        type: 'text', // 消息类型
        content: '主人下马客在船'
      },
      {
        fromid: '321', // 发送人id
        type: 'text', // 消息类型
        content: '举酒欲饮无管弦'
      },
      {
        fromid: '123', // 发送人id
        type: 'text', // 消息类型
        content: '醉不成欢惨将别'
      },
      {
        fromid: '321', // 发送人id
        type: 'text', // 消息类型
        content: '别时茫茫江浸月'
      },
      {
        fromid: '123', // 发送人id
        type: 'text', // 消息类型
        content: '忽闻水上琵琶声'
      },
      {
        fromid: '321', // 发送人id
        type: 'text', // 消息类型
        content: '主人忘归客不发'
      },
      {
        fromid: '123', // 发送人id
        type: 'text', // 消息类型
        content: '寻声暗问弹者谁'
      },
      {
        fromid: '321', // 发送人id
        type: 'text', // 消息类型
        content: '琵琶声停欲语迟'
      },
      {
        fromid: '123', // 发送人id
        type: 'text', // 消息类型
        content: '移船相近邀相见'
      },
      {
        fromid: '123', // 发送人id
        type: 'text', // 消息类型
        content: '寻声暗问弹者谁'
      },
      {
        fromid: '321', // 发送人id
        type: 'text', // 消息类型
        content: '琵琶声停欲语迟'
      },
      {
        fromid: '123', // 发送人id
        type: 'text', // 消息类型
        content: '移船相近邀相见'
      },
    ], // 聊天内容
    uploadPic_url: '',
    img: '',
    fromid: 123, // 当前用户id
    from_head: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=757545797,2214471709&fm=11&gp=0.jpg',// 当前用户头像
    toId: '', // 对方id
    to_head: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2622933625,920552892&fm=26&gp=0.jpg', // 对方头像
    emojiArr: [],
    isLoad: true,//解决初试加载时emoji动画执行一次
    emojis: [],//qq、微信原始表情
    keyBoardHeight: 200,
    inputFocus: true,
    refreshStatus: true,
    menuList: [
      {
        icon: '/img/phone.png',
        text: '要电话'
      },
      {
        icon: '/img/talk.png',
        text: '不合适'
      },
      {
        icon: '/img/phone.png',
        text: '邀请面试'
      },
    ],

  },
  startPull(){
    
  },
  refreshPull(){
    setTimeout(()=>{
      this.setData({
        refreshStatus: false
      })
    },1000)
  },
  restorePull(){
    
  },
  // 滑动
  onScroll(e){
    let detail = e.detail
    let scrollTouch = detail.scrollTop
    if(scrollTouch < this.data.scrollTouch){
      this.setData({
        picShow: false
      })
    }
    this.setData({
      scrollTouch: scrollTouch
    })
    
  },
  // 关闭表情、失焦
  onClose(){
    this.setData({
      picShow: false,
      inputFocus: false
    })
  },
  // 表情
  isShow: function () {
    const that = this
    let picShow = this.data.picShow 
    if(!this.data.picShow){
      this.setData({
        picShow: true,
        inputFocus: false
      })
      let query = wx.createSelectorQuery();
      query.selectAll('.msg-box').boundingClientRect(function (rect) {
        that.setData({
          scrollTop: rect[0].height+ that.data.keyBoardHeight
        })
      }).exec();
    }else{
      this.setData({
        inputFocus: !this.data.inputFocus
      })
    }
    
  },
  // 输入框监听
  InputBlur: function (e) {
    this.setData({
      userInputContent: e.detail.value
    })
  },
  // 表情
  getEmojiArr:function (){
    const _high = 55357;
    const _low = 56832;
    const _nums = 80;
    const emojiArr = [];
    for(let i = 0; i < _nums; i ++){
      const u_high = "%u"+ _high.toString(16)
      const u_low = "%u"+ (_low+i).toString(16)
      emojiArr.push(unescape(u_high+u_low))
    }
    this.setData({
      emojiArr: emojiArr
    })
  },
  // 选择表情
  onChoose(e){
    let index = e.currentTarget.dataset.index;
    let emojiArr = this.data.emojiArr
    let InputContent = this.data.InputContent
    this.setData({
      InputContent: InputContent ? InputContent + emojiArr[index] : emojiArr[index],
    })
  },
  // 输入文字
  bindInput(e){
    let value = e.detail.value
    this.setData({
      InputContent: value,
    })
  },
  //表单 formId
  submit: function (e) {
    const formId = e.detail.formId;
    const openid = wx.getStorageSync('openid')
   
    this.setData({
      formId: formId
    })

    const that = this;
    const url = app.globalData.url + '/api/saveFormId';

    wx.request({
      url: url,
      data: {
        form_id: formId,
        openid: openid
      },
      method: 'POST',
      success(res) {
        // that.setData({
        //   chatData: res.data.data
        // })
      }
    })
  },
  // 发送文字消息
  sendMsg: function () {
    const that = this;
    const InputContent = this.data.InputContent;
    if (!InputContent) {
      wx.showToast({
        title: '请输入内容 ...',
        icon: 'none'
      });
    } else {
      let msgObj = {};
      msgObj.content = this.data.InputContent; // 输入框内容
      msgObj.type = 'text'; // 消息类型       
      msgObj.fromid = this.data.fromid // 是当前用户
      msgObj.portrait = this.data.from_head // 当前用户头像
      
      // 本地数据填充
      let talkData = this.data.talkData
      talkData.push(msgObj)
      this.setData({
        talkData: talkData,
        InputContent: ''
      })
      let query = wx.createSelectorQuery();
      query.selectAll('.msg-box').boundingClientRect(function (rect) {
        that.setData({
          scrollTop: rect[0].height
        })
      }).exec();
    }
  },
  // 发送图片信息
  sendPic: function (width, height) {
    const that = this;
    let imgUrl = that.data.imgUrl;
    let msgObj = {};
    msgObj.url = imgUrl.url; // 图片/照片
    msgObj.width = imgUrl.width; // 图片/照片
    msgObj.height = imgUrl.height; // 图片/照片
    msgObj.isMine = true; // 是否是我 
    msgObj.type = 'img'; // 消息类型
    msgObj.portrait = that.data.mineAvatar ?
      that.data.mineAvatar :
      app.globalData.userInfo.avatarUrl // 头像
    let arr = [];
    let talkData = that.data.talkData;
    arr = [msgObj, ...talkData] // 对象拼接
    that.setData({
      talkData: arr,
      msg: msgObj
    })
    let imgData = {
      meaasge: '',
      url: that.data.imgUrl.url,
      width: width,
      height: height,
      to: '9878676', // 对方id
      from: '123142', // 自己的id
      type: 'img'
    }
    wx.sendSocketMessage({
      data: JSON.stringify({
        type: 'sendMsg',
        data: imgData
      }),
      fail: res => {

      },
      success: res => {
        that.setData({
          picShow: false
        })
      }
    })
    // this.sendMessage();
  },
  // 图片比例缩放
  setPicSize(content) {
    let maxW = 400;//350是定义消息图片最大宽度
    let maxH = 400;//350是定义消息图片最大高度
    if (content.width > maxW || content.height > maxH) {
      let scale = content.width / content.height;
      content.width = scale > 1 ? maxW : maxH * scale;
      content.height = scale > 1 ? maxW / scale : maxH;
    }
    return content;
  },
  // 上传图片
  uploadPic: function (tempFilePath) {
    const that = this;
   
    wx.uploadFile({
      url: url,
      filePath: tempFilePath,
      name: 'file',
      success(res) {
        
        const data = JSON.parse(res.data)
        if (data.state === 2000) {
          // that.setData({
          //   imgUrl: data.data,
          // })
          wx.getImageInfo({
            src: tempFilePath,
            success(res) {
              // that.setData({ // 实际图片尺寸
              //   'sendImg.wdith': res.width,
              //   'sendImg.height': res.height,
              // })
              // let img = that.setPicSize(res)
              // 展示的图片信息
              that.setData({
                'imgUrl.width': res.width,
                'imgUrl.height': res.height,
                'imgUrl.url': data.data,
              })
              // console.log(that.data.imgUrl);
              that.sendPic(res.width, res.height); // 发送图片
            }
          })
        }
      }
    })
  },
  // 相册选取图片
  choosePic: function () {
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        var tempFilePaths = res.tempFilePaths
        that.uploadPic(tempFilePaths[0]);
      },
      fail(res) { }
    })
  },
  // 照相机获取
  chooseCream: function () {
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['camera'],
      success(res) {
        var tempFilePaths = res.tempFilePaths
        that.uploadPic(tempFilePaths[0]);
      },
      fail(res) { }
    })
  },
  // 图片查看
  // imgTouch: function (res) {
  //   const url = res.currentTarget.dataset.text.url
  //   var current_url = 'http://106.12.121.189:6004/' + url
  //   var urls = []
  //   var list = this.data.talkData
  //   for (var index in list) {
  //     if (list[index].type == 'img') {
  //       urls.push('http://106.12.121.189:6004/' + list[index].url)
  //     }
  //   }
  //   urls = urls.reverse();
  //   wx.previewImage({
  //     current: current_url,
  //     urls: urls
  //   })
  // },
  // 消息触底
  msgBottom: function () {
    const that = this;
    let query = wx.createSelectorQuery();
    query.selectAll('.cu-chat').boundingClientRect(function (rects) {
      wx.pageScrollTo({
        scrollTop: rects[rects.length - 1].bottom
      })
      that.setData({
        bottom: rects[rects.length - 1].bottom
      })
    }).exec();
  },
  // 消息未读
  unRead(){
    const that  = this
    let fromid = that.data.fromid;
    let toid = that.data.toId;
    util.request({
      modules: '',
      method: 'post',
      data: {
          fromid: fromid,
          toid: toid
      },
      success: (result) => {
        console.log(result)
      }
    })
  },
  // 连接socket
  connect: function () {
    
    // 创建一个websocket连接
    // return wx.connectSocket({
    //   url: 'wss://test.nwx000.com/wss',
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   method: 'GET',
    //   success: res => {
    //     console.log('websocket连接')
    //   },
    //   fail: res => {
    //     console.log('websocket连接失败~')
    //   }
    // })
  },
  onSocketMessage(){
    const that = this
    
    wx.onSocketMessage(function (res) {
    
      let fromid = that.data.fromid;
      let toid = that.data.toId;
      let chatData = JSON.parse(res.data);
      console.log(chatData)
      //接收服务端传过来的消息
      let type = chatData.type
      switch (type) {
            case "init":

              wx.sendSocketMessage({
                  data: JSON.stringify({
                    type: 'bind',
                    fromid: fromid, // 自己的id
                })
              });
              
              let online = '{"type":online,"toid":"'+toid+'","fromid":"'+fromid+'"}';   //查看当前用户是否在线
              wx.sendSocketMessage(JSON.stringify(online));
              that.unRead()
              // changeNoRead();
              break;
            case "text":        //处理文字消息
              
              // if (toid == chatData.fromid) {
              //   console.log(chatData.data)
                
              // }
              console.log(type)
              let receiveMsg = {};
              let msg = unescape(chatData.data)
              console.log(msg)
              // receiveMsg.content = chatData.data; // 输入框内容
              receiveMsg.content = msg; // 输入框内容

              receiveMsg.type = chatData.type; // 消息类型       
              receiveMsg.fromid = chatData.fromid; // 对方
              let avatar = '/img/my/avatar.png'
              receiveMsg.portrait = avatar // 头像
              let talkData = that.data.talkData
              if(chatData.fromid == that.data.toId){
                talkData.push(receiveMsg)
                that.setData({
                  talkData: talkData
                })
              }
              let query = wx.createSelectorQuery();
              query.selectAll('.msg-box').boundingClientRect(function (rect) {
                console.log(rect)
                that.setData({
                  scrollTop: rect[0].height
                })
              }).exec();
              // $(".chat-content").scrollTop(3000);   将对话框定到最下面
              // changeNoRead();
              break;
            case "say_img":     //处理图片消息
              //处理图片放在对话框
            
            case "save":        //聊天记录持久化
              // that.saveMessage(chatData)   //聊天记录
              if (chatData.isread == 1) {
                online = 1;
                // $(".shop-online").text("在线");
              } else {
                // $(".shop-online").text("不在线");
              }

            case "online":     //用户是否在线
              if(chatData.status == 1){
                  // online=1;
                  // $(".shop-online").text("在线");
              } else{
                  // online=0;
                  // $(".shop-online").text("不在线");
              }
      }
    })
  },
  onLoad: function (options) {
    const that = this;
    // 获取手机系统信息
    wx.getSystemInfo({
      success: function (res) {
        const model = res.model;
        const mobileModel = model.indexOf('iPhone X');
        // console.log(model, mobileModel);
        if (mobileModel == 0) {
          that.setData({
            safeheight: 68
          })
        }
      }
    })
  },
  onShow: function (options) {
    this.getEmojiArr() // 获取emoji表情
    const that = this;
    let query = wx.createSelectorQuery();
    query.selectAll('.tools').boundingClientRect(function (rect) {
      that.setData({
        toolHeight: rect[0].height
      })
    }).exec();
    query.selectAll('.menu').boundingClientRect(function (rect) {
      that.setData({
        menuHeight: rect[0].height
      })
    }).exec();
    this.getSystemInfo()
  },
  getSystemInfo(){
    wx.getSystemInfo({
      success: (result) => {
        this.setData({
          windowHeight: result.windowHeight
        })
      },
    })
  },
  // 自定义下拉刷新空间被下拉
  startPull(){
    console.log('startPull')
  
  },
  // 自定义下拉刷新被触发
  refreshPull(){
    console.log('startPull')

    console.log('自定义下拉刷新被触发')
    setTimeout(()=>{
      this.setData({
        refreshStatus: false
      })
    },1000)
  },
  // 自定义下拉刷新被复位
  restorePull(){
    console.log('自定义下拉刷新被复位')
  },
  // 监听键盘高度变化
  bindFocus(e){
    const that = this
    let keyBoardHeight = e.detail.height || 200
    this.setData({
      keyBoardHeight: keyBoardHeight || 200,
      picShow: true
    })
    let query = wx.createSelectorQuery();
      query.selectAll('.msg-box').boundingClientRect(function (rect) {
        that.setData({
          scrollTop: rect[0].height + keyBoardHeight
        })
      }).exec();
  },
  //页面隐藏
  onHide: function () {
      wx.closeSocket();
  },
  onPullDownRefresh: function () {
    // this.getTalkData();
  }
});
