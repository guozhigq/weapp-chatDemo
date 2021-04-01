//index.js
//获取应用实例
var recorder = wx.getRecorderManager();
const innerAudioContext = wx.createInnerAudioContext() //获取播放对象
const app = getApp();

Page({
  data: {
    isIphoneXHeight: app.globalData.isIphoneXHeight,
    picShow: false,
    safeheight: '', //安全高度,
    userInputContent: '', //输入框内容
    index: '',
    close_flag: 5000,
    scrollTop: '50',
    scrollAnimation: true, // scorll-view 滑动动画，设置为false为防止首次进入页面滑动
    emojiSource: 'https://res.wx.qq.com/wxdoc/dist/assets/img/emoji-sprite.b5bd1fe0.png',
    lineHeight: 24,
    comment: '',
    cursor: 0,
    talkData: [
      {
        fromid: '123', // 发送人id
        type: 'text', // 消息类型
        content: '1',
        id: 'page1'
      },
      {
        fromid: '321', // 发送人id
        type: 'text', // 消息类型
        content: '2'
      },
      {
        fromid: '123', // 发送人id
        type: 'text', // 消息类型
        content: '3',
        id: 'page1'
      },
      {
        fromid: '321', // 发送人id
        type: 'text', // 消息类型
        content: '4'
      },
      {
        fromid: '123', // 发送人id
        type: 'text', // 消息类型
        content: '5',
        id: 'page1'
      },
      {
        fromid: '321', // 发送人id
        type: 'text', // 消息类型
        content: '6'
      },
      {
        fromid: '123', // 发送人id
        type: 'text', // 消息类型
        content: '7'
      },
      {
        fromid: '321', // 发送人id
        type: 'text', // 消息类型
        content: '8'
      },
      {
        fromid: '123', // 发送人id
        type: 'text', // 消息类型
        content: '9'
      },
      {
        fromid: '321', // 发送人id
        type: 'text', // 消息类型
        content: '10'
      },
      {
        fromid: '123', // 发送人id
        type: 'text', // 消息类型
        content: '11'
      },
      {
        fromid: '321', // 发送人id
        type: 'text', // 消息类型
        content: '12'
      },
      {
        fromid: '123', // 发送人id
        type: 'text', // 消息类型
        content: '13'
      },
      {
        fromid: '321', // 发送人id
        type: 'text', // 消息类型
        content: '14'
      },
      {
        fromid: '123', // 发送人id
        type: 'text', // 消息类型
        content: '15'
      }
    ], // 聊天内容
    talkData2: [
      {
        fromid: '321', // 发送人id
        type: 'text', // 消息类型
        content: '16',
        content: [
          {type: 1, content: '不告诉你'},
          {type: 2, content: "[龇牙]", imageClass: "smiley_13"}
        ]
      },
      {
        fromid: '123', // 发送人id
        type: 'text', // 消息类型
        content: '16',
        content: [
          {type: 1, content: '今天天气怎么样？'},
          {type: 2, content: "[流泪]", imageClass: "smiley_5"}
        ]
      }
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
    keyboardHeight: '', // 键盘高度
    inputFocus: false, // 输入框自动对焦
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
    menuHeight: 0,
    toolViewHeight: '',
    total_page: 5,
    page: 0,
    loading: false,
    menuList: [
      {
        type: 'photo',
        icon: '/img/photo.png',
        text: '照片'
      },
      {
        type: 'camera',
        icon: '/img/camera.png',
        text: '拍摄'
      }
    ],
    recording: false, // 录音按钮按下样式
    isRcord: false // 录音按钮显隐
  },
  // 录音
  onRecord(){
    let isRcord = this.data.isRcord
    this.setData({
      isRcord: !isRcord
    })
  },
  // 关闭表情、失焦
  onClose(){
    this.setData({
      picShow: false,
      inputFocus: false,
      emojiShow: false,
      functionShow: false,
      toolViewHeight: 0
    })
    this.pageUp()
  },
  // 滑动
  onScroll(e){
    let detail = e.detail
    let scrollTouch = detail.scrollTop
    // if(scrollTouch < this.data.scrollTouch){
    //   this.onClose()
    // }
    this.setData({
      scrollTouch: scrollTouch
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
          scrollTop: rect[0].height+ that.data.keyboardHeight
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
  // 隐藏
  hideAllPanel() {
    this.setData({
      functionShow: false,
      emojiShow: false
    })
  },
  // 展示emoji Panel
  showEmoji() {
    if(!this.data._keyboardShow || this.data.emojiShow){
      this.setData({
        isRcord: false
      })
    }
    this.setData({
      emojiShow: this.data._keyboardShow || !this.data.emojiShow,
      functionShow: false,
      toolViewHeight: !this.data.emojiShow ? 300+this.data.toolHeight/2-this.data.isIphoneXHeight/2 : 0
    })
    this.pageUp()
  },
  // 展示附件 Panel
  showFunction() {
    if(!this.data._keyboardShow || this.data.functionShow){
      this.setData({
        isRcord: false
      })
    }
    this.setData({
      functionShow: this.data._keyboardShow || !this.data.functionShow,
      emojiShow: false,
      toolViewHeight: !this.data.functionShow ? 200+this.data.toolHeight/2-this.data.isIphoneXHeight/2 : 0
    })
    // this.pageUp()
  },
  bindBlur(){
    this.setData({
      keyboardHeight: 0
    })
  },
  // 页面上推
  pageUp(){
    const that = this
    let query = wx.createSelectorQuery();
    let toolViewHeight  = this.data.toolViewHeight
    query.selectAll('.msg-box').boundingClientRect(function (rect) {
      that.setData({
        scrollTop: rect[0].height + toolViewHeight
      })
    }).exec();
  },
  // 输入文字
  bindInput(e){
    let value = e.detail.value
    this.setData({
      InputContent: value,
      scrollAnimation: true
    })
  },
  // 监听键盘高度变化
  onkeyboardHeightChange(e) {
    console.log('获取键盘高度')
    const that = this
    const {height} = e.detail
    console.log(height)
    that.setData({
      keyboardHeight: height,
    })
    if(height !=0){
      that.setData({
        emojiShow: false,
      functionShow: false
      })
    }
    let query = wx.createSelectorQuery();
    query.selectAll('.msg-box').boundingClientRect(function (rect) {
      that.setData({
        scrollTop: rect[0].height + height
      })
    }).exec();
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
  // input输入
  onInput(e) {
    const value = e.detail.value
    console.log(value)
    this.data.comment = value
  },
  onConfirm() {
    this.onsend()
  },
  // 插入表情
  insertEmoji(evt) {
    const emotionName = evt.detail.emotionName
    const { cursor, comment } = this.data
    const newComment =
      comment.slice(0, cursor) + emotionName + comment.slice(cursor)
    
    this.setData({
      comment: newComment,
      cursor: cursor + emotionName.length
    })
    console.log()
  },
  // 发送消息
  onsend() {
    const comment = this.data.comment
    const fromid = this.data.fromid
    let obj = {fromid: fromid, content: [...this.parseEmoji(comment)]}
    const talkData2 = this.data.talkData2
    console.log(talkData2)
    talkData2.unshift(obj)
    this.setData({
      talkData2,
      comment: '' // 发送成功，清空输入框
    })
  },
  deleteEmoji: function() {
    const pos = this.data.cursor
    const comment = this.data.comment
    let result = '',
      cursor = 0

    let emojiLen = 6
    let startPos = pos - emojiLen
    if (startPos < 0) {
      startPos = 0
      emojiLen = pos
    }
    const str = comment.slice(startPos, pos)
    const matchs = str.match(/\[([\u4e00-\u9fa5\w]+)\]$/g)
    // 删除表情
    if (matchs) {
      const rawName = matchs[0]
      const left = emojiLen - rawName.length
      if (this.emojiNames.indexOf(rawName) >= 0) {
        const replace = str.replace(rawName, '')
        result = comment.slice(0, startPos) + replace + comment.slice(pos)
        cursor = startPos + left
      }
      // 删除字符
    } else {
      let endPos = pos - 1
      if (endPos < 0) endPos = 0
      const prefix = comment.slice(0, endPos)
      const suffix = comment.slice(pos)
      result = prefix + suffix
      cursor = endPos
    }
    this.setData({
      comment: result,
      cursor: cursor
    })
  },

  
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
 
  getSystemInfo(){
    wx.getSystemInfo({
      success: (result) => {
        this.setData({
          windowHeight: result.windowHeight
        })
      },
    })
  },
  
  // 监听键盘高度变化
  bindFocus(e){
    const that = this
    let keyboardHeight = e.detail.height || 200
    this.setData({
      keyboardHeight: keyboardHeight || 200,
      // emojiShow: false,
      // functionShow: false
    })
    // let query = wx.createSelectorQuery();
    //   query.selectAll('.msg-box').boundingClientRect(function (rect) {
    //     that.setData({
    //       scrollTop: rect[0].height + keyboardHeight
    //     })
    //   }).exec();
  },

  /*
  * sceoll-view滑动事件
  */

  // 自定义下拉刷新空间被下拉
  startPull(){
  
  },
  // 自定义下拉刷新被触发
  refreshPull(){
    const that = this
    console.log('自定义下拉刷新被触发')
    setTimeout(()=>{
      this.setData({
        refreshStatus: false
      })
    },200)
    // let page = that.data.page
    // this.setData({
    //   talkData: [...this.data.talkData,...this.data.talkData2],
    //   page: page++
    // })
    // console.log(page)
    // that.setData({
    //   scrollIntoView: `page${page}`
    // })
  },
  // 自定义下拉刷新被复位
  restorePull(){
    console.log('自定义下拉刷新被复位')
  },

  /*
  *  发送附件 照片
  */
 
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
    console.log(content)
    let maxW = 700;//350是定义消息图片最大宽度
    let maxH = 700;//350是定义消息图片最大高度
    if (content.width > maxW || content.height > maxH) {
      let scale = content.width / content.height;
      content.width = scale > 1 ? maxW : maxH * scale;
      content.height = scale > 1 ? maxW / scale : maxH;
    }
    return content;
  },
  // 上传图片至服务器
  uploadPic: function (tempFilePath) {
    const that = this
    let img = {};
    const fromid = that.data.fromid;
    wx.getImageInfo({
      src: tempFilePath,
      success(res) {
        that.setPicSize(res)
        img = {
          width: res.width,
          height: res.height,
          url: tempFilePath
        }

        let obj = {fromid: fromid, content: [{type:3,img:img}]}
        const talkData2 = that.data.talkData2
        talkData2.unshift(obj)
        that.setData({
          talkData2,
        })
      }
    })
    return
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
              that.setData({
                'imgUrl.width': res.width,
                'imgUrl.height': res.height,
                'imgUrl.url': data.data,
              })
              that.sendPic(res.width, res.height); // 发送图片
            }
          })
        }
      }
    })
  },
  // 相册选取图片
  choosePic: function (e) {
    let type = e.currentTarget.dataset.type
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        // 上传图片至服务端
        that.uploadPic(tempFilePaths[0]);
      },
      fail(res) { }
    })
  },

  // 图片查看
  imgTouch: function (res) {
    const url = res.currentTarget.dataset.text.url
    var current_url = 'http://106.12.121.189:6004/' + url
    var urls = []
    var list = this.data.talkData
    for (var index in list) {
      if (list[index].type == 'img') {
        urls.push('http://106.12.121.189:6004/' + list[index].url)
      }
    }
    urls = urls.reverse();
    wx.previewImage({
      current: current_url,
      urls: urls
    })
  },
  // 开始录音
  onRecordStart(){
    console.log('手指点击录音')
    wx.showToast({
      title: '开始录音',
      icon: 'none'
    })
    
    this.setData({
      recording: true,
      recordStart_temp: new Date().getTime(), //记录开始点击的时间
    })
    const options = {
      duration: 10000, //指定录音的时长，单位 ms
      sampleRate: 8000, //采样率
      numberOfChannels: 1, //录音通道数
      encodeBitRate: 24000, //编码码率
      format: 'mp3', //音频格式，有效值 aac/mp3
      audioSource: 'auto',
      frameSize: 12, //指定帧大小，单位 KB
    }
    recorder.start(options) //开始录音
  },
  // 监听录音事件
  listenRecord(){
    console.log('录音监听事件');
    recorder.onStart((res) => {
      console.log('开始录音');
    })
    recorder.onStop((res) => {
      let {
        tempFilePath
      } = res;
      console.log('停止录音,临时路径', tempFilePath);
      var x = new Date().getTime() - this.data.voice_ing_start_date
      if (x > 1000) {
        let timestamp = new Date().getTime();
        console.log(tempFilePath)
        // wx.cloud.uploadFile({
        //   cloudPath: "sounds/" + timestamp + '.mp3',
        //   filePath: tempFilePath,
        //   success: res => {
        //     console.log('上传成功', res)
        //     that.setData({
        //       soundUrl: res.fileID,
        //     })
 
        //     var data = {
        //       _qunId: 'fb16f7905e4bfa24009098dc34b910c8',
        //       _openId: wx.getStorageSync('openId'),
        //       // 消息
        //       text: '',
        //       voice: res.fileID,
        //       img: '',
        //       // 时间
        //       dataTime: util.nowTime(),
        //       // 头像
        //       sendOutHand: wx.getStorageSync('userInfo').avatarUrl,
        //       // 昵称
        //       sendOutname: wx.getStorageSync('userInfo').nickName
        //     }
        //     console.log(data)
        //     wx.cloud.callFunction({
        //       name: "news",
        //       data: data,
        //       success(res) {
        //         console.log('发送语音发送', res)
        //       },
        //       fail(res) {
        //         console.log('发送语音失败', res)
        //       }
        //     })
        //   },
        // })
      }
    })
  },
  // 结束录音
  onRecordEnd(){
    var x = new Date().getTime() - this.data.voice_ing_start_date
    if (x < 1000) {
      console.log('录音停止，说话小于1秒！')
      wx.showModal({
        title: '提示',
        content: '说话要大于1秒！',
      })
      recorder.stop();
    } else {
      // 录音停止，开始上传
      recorder.stop();
      this.setData({
        recording: false
      })
    }
  },
  /*
  *  小程序生命周期
  */

  onLoad: function (options) {
    const that = this;
    const emojiInstance = this.selectComponent('.mp-emoji')
    this.emojiNames = emojiInstance.getEmojiNames()
    this.parseEmoji = emojiInstance.parseEmoji
    // 获取手机系统信息
    wx.getSystemInfo({
      success: function (res) {
        const model = res.model;
        const mobileModel = model.indexOf('iPhone X');
        if (mobileModel == 0) {
          that.setData({
            safeheight: 68
          })
        }
      }
    })
  },
  onShow: function (options) {
    const that = this;
    let query = wx.createSelectorQuery();
    query.selectAll('.tools').boundingClientRect(function (rect) {
      that.setData({
        toolHeight: rect[0].height
      })
    }).exec();
    query.selectAll('.menu').boundingClientRect(function (rect) {
      if(rect.length > 0){
        that.setData({
          menuHeight: rect[0].height
        })
      }
    }).exec();
    this.getSystemInfo()
  },
  onReady: function () {
    this.listenRecord()
  },
  //页面隐藏
  onHide: function () {

  },
  onPullDownRefresh: function () {
    // this.getTalkData();
  }
});
