// pages/reserve/reserve.js
//获取应用实例
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '',//车牌
    member: false,//是否是会员,默认false
    first_pay: true,//是否是首次登录,默认true
    showHeight: !1,//会员积分模块高度判断
    pay_stop: 0,//停车费，默认0
    pay_member: 0,//会员减免，默认0
    pay_coupon: 0,//优惠券减免，默认0
    pay_memberjifen: 0,//付款时的支付的会员积分
    pay_memberjifen_money: 0,//付款时会员积分所减的金额
    pay_result: 0,//实际支付价格，默认0
    first_jin: true,//是否是首次进入,默认是

    showModalStatus: false,//优惠券面板显示，默认隐藏
    // search_result: null,//优惠券结果
    ok_coupon: [
      {
        name: "停车券",
        desc: "停车满2小时可用",
        date: "2019.07.30-2018.09.30",
      }, {
        name: "日照万象汇",
        desc: "停车满2小时可用",
        date: "2019.07.30-2018.09.30",
      }, {
        name: "日照万象汇",
        desc: "停车满2小时可用",
        date: "2019.07.30-2018.09.30",
      }, {
        name: "日照万象汇",
        desc: "停车满2小时可用",
        date: "2019.07.30-2018.09.30",
      }
    ],//优惠券结果
    keyboardShow: null,//优惠券的值
    //2019.5.19新增
    carType: ['小型汽车', '中巴', '大巴', '拖挂式汽车'],
    carTypeArray: [
      {
        id: 0,
        name: '小型汽车'
      },
      {
        id: 1,
        name: '中巴'
      },
      {
        id: 2,
        name: '大巴'
      },
      {
        id: 3,
        name: '拖挂式汽车'
      }
    ],
    index: 0,
    date: new Date().toLocaleDateString(),


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      optionsId: 1,
    })
    // this.setData({
    //   optionsId: options.id,
    // })
    this.getData()

  },

  // 获取页面数据
  getData: function () {
    let that = this;
    wx.request({
      url: 'https://www.easy-mock.com/mock/5ca5b04b6338725a02e6ad94/example/parking/info/find/id/id=' + that.data.optionsId,  
      header: {
        'content-type': 'application/json',
      },
      method: 'GET',
      success: function (res) {
        console.log(res)
        if (res.data.result == true) {
          that.setData({
            reserveResult: res.data.data,
          });
        } 
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 判断是否会员
    this.setData({
      member: app.globalData.member
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 判断是否会员
    this.setData({
      member: app.globalData.member
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  // 付款按钮
  payment: function (event) {
    var that = this;
    var oid = event.currentTarget.dataset.oid;
    var parameter;
    if (that.data.cid == '') {
      parameter = { oid: oid }
    } else {
      parameter = { oid: oid, cid: that.data.cid[0].cid }
    }
    wx.request({
      url: app.globalData.host + '/wechat/wx_pay/deliver_pay',
      data: parameter,
      header: {
        'content-type': 'application/json',
        'Cookie': 'NEWWWAY-session-id=' + app.globalData.loginMess
      },
      success: function (res) {
        if (res.data.result) {                   //正常付款
          wx.requestPayment(
            {
              'timeStamp': res.data.Message.timeStamp,//时间戳
              'nonceStr': res.data.Message.nonceStr,//随机字符串，长度为32个字符以下
              'package': res.data.Message.package,//统一下单接口返回的 prepay_id 参数值
              'signType': 'MD5',
              'paySign': res.data.Message.paySign,//签名
              'success': function (res) {
                wx.request({
                  url: app.globalData.host + '/wechat/wx_pay/receive_pay',
                  data: {
                    oid: oid
                  },
                  header: {
                    'content-type': 'application/json',
                    'Cookie': 'NEWWWAY-session-id=' + app.globalData.loginMess
                  },
                  success: function (res) {
                    app.globalData.payShow = 0;
                    app.globalData.cid = '';
                    wx.navigateBack({
                      delta: 10
                    })
                  }
                });
              },
              'fail': function (res) {
                console.log("失败")
                console.log(res)
              },
              'complete': function (res) {
              }
            })
        } else {
          if (res.data.errorcode == "1001") {      //已下架
            var content = "";
            for (var i = 0; i < res.data.data.length; i++) {
              content += res.data.data[i] + "\r\n";
            }
            wx.showModal({
              title: res.data.Messge,
              content: content,
              confirmColor: "#4fafc9",
              confirmText: "我知道了",
              showCancel: false
            })
          } else if (res.data.errorcode == "1002") {  //未登录
            that.setData({
              hiddenmodalput: false
            });
          } else if (res.data.errorcode == "1003") {    //购物券失效
            wx.showModal({
              title: '提示',
              content: res.data.Messge,
              confirmColor: "#4fafc9",
              confirmText: "我知道了",
              showCancel: false,
            })
          } else if (res.data.errorcode == "1004") {  //使用优惠券后结算金额为0
            wx.showModal({
              title: '提示',
              content: res.data.Messge,
              confirmColor: "#4fafc9",
              confirmText: "我知道了",
              showCancel: false,
              success: function (res1) {
                if (res1.confirm) {
                  wx.navigateBack({
                    delta: 10
                  })
                }
              }
            })
          }
          else { }
        }
      }
    })
  },

  bindCarTypeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
})