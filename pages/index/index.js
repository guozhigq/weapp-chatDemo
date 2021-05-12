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
    ], 
    // 聊天内容
    // 1 文字
    // 2 表情
    // 3 图片
    // 4 语音
    // 5 文件
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
          {type: 1, content: '今天天气怎么样？今天天气怎么样？今天天气怎么样？今天天气怎么样？'},
          {type: 2, content: "[流泪]", imageClass: "smiley_5"},
          {type: 1, content: '亲爱的啊啊啊，今天天气怎么样？'},
        ]
      },
      {
        fromid: '123', // 发送人id
        type: 'record', // 消息类型
        record: '16',
        timestemp: 5
      }
    ], // 聊天内容
    uploadPic_url: '', 
    img: '',
    fromid: 123, // 当前用户id
    from_head: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3364379035,3672240386&fm=26&gp=0.jpg',// 当前用户头像
    toId: '', // 对方id
    to_head: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2622933625,920552892&fm=26&gp=0.jpg', // 对方头像
    emojiArr: [],
    isLoad: true,//解决初试加载时emoji动画执行一次
    emojis: [],//qq、微信原始表情
    keyboardHeight: '', // 键盘高度
    inputFocus: false, // 输入框自动对焦
    refreshStatus: true,
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
      },
      {
        type: 'file',
        icon: '/img/file.png',
        text: '文件'
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
  // input输入
  onInput(e) {
    const value = e.detail.value
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
    let obj = {fromid: fromid, type: 'text', content: [...this.parseEmoji(comment)]}
    const talkData2 = this.data.talkData2
    talkData2.unshift(obj)
    this.setData({
      talkData2,
      comment: '' // 发送成功，清空输入框
    })
    this.pageUp()
  },
  // 删除表情
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
  // 连接socket
  connect: function () {
    // 创建一个websocket连接
    return wx.connectSocket({
      url: 'wss://abc.com/wss', 
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: res => {
        console.log('websocket连接')
      },
      fail: res => {
        console.log('websocket连接失败~')
      }
    })
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

        // 初始化
        case "init":

        break;

        // 处理文字消息
        case "text": 
          
        break;

        // 处理图片信息 
        case "say_img": 
          
        break;

        // ... ...
      }
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

  // 菜单栏事件
  menuFun(e) {
    let type = e.currentTarget.dataset.type;
    switch (type){
      case 'photo':
        this.choosePic();
        console.log('选择上传照片')
       break;
      case 'carame':
        this.choosePic();
        console.log('选择上传照片')
        break;
      case 'file':
        this.chooseMessageFile();
        console.log('选择上传文件')
        break;
    }
    
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
        // 上传图片至服务端
        that.uploadPic(tempFilePaths[0]);
      },
      fail(res) { }
    })
  },
  // 上传图片至服务器
  uploadPic: function (tempFilePath) {
    const that = this
    let img = {};
    const fromid = that.data.fromid;
    wx.getImageInfo({
      src: tempFilePath,
      success(res) {
        res = that.setPicSize(res)
        img = {
          width: res.width,
          height: res.height,
          url: tempFilePath
        }

        let obj = {fromid: fromid, type: 'image', image: img, content: [{ img:img}]}
        const talkData2 = that.data.talkData2
        talkData2.unshift(obj)
        console.log(talkData2)
        that.setData({
          talkData2,
        })
      }
    })
  },
  // 图片比例缩放
  setPicSize(content) {
    let maxW = 700; //350是定义消息图片最大宽度
    let maxH = 700; //350是定义消息图片最大高度
    if (content.width > maxW || content.height > maxH) {
      let scale = content.width / content.height;
      content.width = scale > 1 ? maxW : maxH * scale;
      content.height = scale > 1 ? maxW / scale : maxH;
    }
    return content;
  },
  // 选择文件
  chooseMessageFile: function (e) {
    var that = this;
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res) {
        let filename = res.tempFiles[0].name; // 选择文件的名称
        let filePath = res.tempFiles[0].path; // 选择文件的临时路径
        // 上传到后端服务器
        wx.uploadFile({
          url: "xxx",
          filePath: filePath,
          name: 'xxx',
          success(result) {
            // json字符串 需用 JSON.parse 转
            let res = JSON.parse(result.data);

          }
        })
 
 
 
      }
    });
  },
  // 开始录音
  onRecordStart(){
    this.setData({
      recording: true,
    })
    const options = {
      duration: 30000, //指定录音的时长，单位 ms
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
    let x = 0;
    recorder.onStart((res) => {
      wx.showToast({
        title: `正在录音...`,
        icon: 'none',
        duration: 99999999
      })
      this.setData({
        vioceStart: new Date().getTime()
      })
    })
    recorder.onStop((res) => {
      let {
        tempFilePath
      } = res;
      
      x = new Date().getTime() - this.data.vioceStart
      if (x > 1000) {
        console.log('停止录音,临时路径', tempFilePath);
        // 提交语音至后台服务器，并添加到聊天数据中
        this.addRecord(x,tempFilePath)
      }else{
        wx.showToast({
          title: '时间过短',
          icon: 'none'
        })
      }
    })
  },
  // 结束录音
  onRecordEnd(){
    var x = new Date().getTime() - this.data.vioceStart
    if (x < 1000) {
      console.log('录音停止，说话小于1秒！')
      wx.showModal({
        title: '提示',
        content: '说话要大于1秒！',
      })
      recorder.stop();
    } else {
      // 录音停止，开始上传
      wx.hideToast({
        success: (res) => {},
      })
      recorder.stop();
      this.setData({
        recording: false
      })
    }
  },
  // 添加录音至聊天数据
  addRecord(x,tempFilePath) {
    x = (x/1000).toFixed(0)
    const that = this;
    const fromid = that.data.fromid;
    let obj = {fromid: fromid, type: 'record', record: tempFilePath, timestemp: x, content: [{ type:4, record: tempFilePath, timestemp:x}]}
    const talkData2 = that.data.talkData2
    talkData2.unshift(obj)
    console.log(talkData2)
    that.setData({
      talkData2,
    })
  },
  // 播放录音
  playVoice(e){
    const that = this
    let voice = e.currentTarget.dataset.voice;
    let index = e.currentTarget.dataset.index;
    let timestemp = that.data.talkData2[index].timestemp*1000;
    
    wx.playVoice({
      filePath: voice,
      success (res) { 
        that.setData({
          [`talkData2[${index}].playStatus`]: true
        })
        console.log(that.data.talkData2)
        setTimeout(()=>{
          that.setData({
            [`talkData2[${index}].playStatus`]: false
          })
        },timestemp)
      },
      fail (err) {
        console.log(err)
      }
    })
  },
  /*
  *  小程序生命周期
  */
  onLoad: function (options) {
  
    const emojiInstance = this.selectComponent('.mp-emoji')
    this.emojiNames = emojiInstance.getEmojiNames()
    this.parseEmoji = emojiInstance.parseEmoji
    
  },
  onShow: function () {

  },
  onReady: function () {
    const that = this;
    let query = wx.createSelectorQuery();
    // 获取底部输入栏的高度
    query.selectAll('.tools').boundingClientRect(function (rect) {
      console.log(rect[0].height)
      that.setData({
        toolHeight: rect[0].height
      })
    }).exec();

    // 获取手机系统信息
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        })
      }
    })
    this.listenRecord()
  },
});
