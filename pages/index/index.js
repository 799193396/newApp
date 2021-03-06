//index.js
//获取应用实例
const app = getApp()
var a = -1;
var b = -1;
var c = -1;
var d = -1;
Page({
  data: {
    imgUrls: [
      '/images/tu1.png',
    ],
    indicatorDots: false,
    autoplay: true,
    interval: 3000,
    duration: 500,
    circular: true, //从data开始的值到此是轮播
    hasUserInfo: false, //是否已授权
    canIUse: wx.canIUse('button.open-type.getUserInfo'), //判断是否可用
    member: true, //是否是会员
    member_tel: "", //会员手机号,默认无
    member_dengji: "", //会员等级，默认无
    show: "", //卷码扫描值
    history: null, //历史记录值
    showModalStatus: false, //搜索面板显示，默认隐藏
    search_result: null, //搜索结果
    keyboardShow: null, //搜索车牌的值
    keyValue:'',    //关键字查询
  },
  onLoad: function(options) {
    var that = this
    // this.setData({
    //   simpleKeyboard: this.selectComponent("#simpleKeyboard"), //获取传值
    // })
    // 此处判断是否是会员--https://www.jianshu.com/p/aaf65625fc9d
    if (app.globalData.member) {
      this.setData({
        member: app.globalData.member,
        history: app.globalData.history,
      })
    } else {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      // app.memberReadyCallback = res => {
      //   that.shuju();
      // }
    }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // this.shuju(); //每次进入时数据渲染
  },

  bindKeyInput: function (e) { //input事件
    let para = {};
    para[e.target.dataset.value] = e.detail.value;
    this.setData(para);
  },
  // 搜索查询
  toSearch: function() {
    // this.data.simpleKeyboard.hide()
    // var o = this.data.simpleKeyboard.getContent()
    // let data;
    // let localStorageValue = [];
    let that = this;
    console.log(that.data.keyValue)
    let o = that.data.keyValue
    if (o !== '') {
      //调用API从本地缓存中获取数据  
      // var searchData = wx.getStorageSync('searchData') || []
      // searchData.push(this.data.inputValue)
      // wx.setStorageSync('searchData', searchData)

      wx.request({
        url:  'https://www.easy-mock.com/mock/5ca5b04b6338725a02e6ad94/example/parking/info/find/key', //这里填写后台给你的搜索接口  
        data: {
          key: o
        },
        header: {
          'content-type': 'application/json',
        },
        method: 'GET',
        success: function(res) {
          console.log(res)
          if (res.data.result == true) {
              that.setData({
                search_result: res.data.data,
              });
              that.showModal()
            } else {
              wx.showModal({
                title: "搜索提示",
                content: "" + res.data.msg,
                confirmColor: "#4fafc9",
                confirmText: "我知道了",
                showCancel: false,
                success: function(res) {
                  if (res.confirm) {}
                }
              })
            }
        },
        fail: function(e) {
          wx.showToast({
            title: '网络异常！',
            duration: 2000
          });
        },
      });
    } else {
      wx.showModal({
        title: "无法查询",
        content: "请输入查询关键字",
        confirmColor: "#4fafc9",
        confirmText: "我知道了",
        showCancel: false,
      })
    }

  },
  // 缴费规则
  tapRule: function(e) {
    wx.navigateTo({
      url: "/pages/w_index_rule/w_index_rule"
    })
  },
  //绑定会员
  tapBindmember: function(e) {
    this.data.simpleKeyboard.hide()
    wx.navigateTo({
      url: "/pages/w_my_bind_member/w_my_bind_member"
    })
  },

  //卷码扫描
  scan: function() {
    var that = this;
    var show;
    wx.scanCode({
      success: (res) => {
        this.show = "--result:" + res.result
        that.setData({
          show: this.show
        })
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
        //获取成功向后台保存获取的值
      },
      fail: (res) => {
        wx.showModal({
          title: "未获取成功",
          content: "未成功扫描二维码",
          confirmColor: "#4fafc9",
          confirmText: "我知道了",
          showCancel: false,
        })
        // wx.showToast({
        //   title: '未获取成功',
        //   image: '/images/tishi.png',
        //   duration: 2000
        // })
      },
      complete: (res) => {}
    })
  },
  //显示对话框
  showModal: function() {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function() {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  //搜索结果跳支付
  search_pay: function(e) {
    var str = e.currentTarget.dataset.text.replace("·", "")
    if (app.globalData.loginMess && app.globalData.loginMess != "") {
      wx.request({
        url: app.globalData.host + '/wxpay/getparkinginfo', //这里填写后台给你的搜索接口
        data: {
          carnumber: str
        },
        header: {
          'content-type': 'application/json',
          'Cookie': 'NWRZPARKINGID=' + app.globalData.loginMess
        },
        success: function(res) {
          console.log(res)
          if (res.data.code === 1200) {
            wx.showModal({
              title: "提示",
              content: "" + res.data.msg,
              confirmColor: "#4fafc9",
              confirmText: "我知道了",
              showCancel: false,
              success: function(res) {
                if (res.confirm) {}
              }
            })
          } else {
            if (res.data.code === 1001) {
              wx.showModal({
                title: "提示",
                content: "" + res.data.msg,
                confirmColor: "#4fafc9",
                confirmText: "我知道了",
                showCancel: false,
                success: function(res) {
                  if (res.confirm) {}
                }
              })
            } else {
              wx.navigateTo({
                url: "/pages/w_payment/w_payment?title=" + str
              })
            }
          }
        },
        fail: function(e) {
          wx.showToast({
            title: '网络异常！',
            duration: 2000
          });
        },
      });
    } else {
      wx.showModal({
        title: "提示",
        content: "当前网络延迟，未获取到相关信息，请重新尝试",
        confirmColor: "#4fafc9",
        confirmText: "我知道了",
        showCancel: false,
        success: function(res) {
          if (res.confirm) {}
        }
      })
    }

  },
  //每次进入时数据渲染
  shuju: function() {
    var str2 = "";
    if (app.globalData.member_tel) {
      var str = app.globalData.member_tel;
      str2 = str.substr(0, 3) + "****" + str.substr(7);
    }
    this.setData({
      member: app.globalData.member,
      member_tel: str2,
      member_dengji: app.globalData.member_dengji,
      history: app.globalData.history,
    })
  },
  changeBoxBtn: function(e) {
      // console.log(e.target.dataset.num)
      var num = e.target.dataset.num;
      var states = null;
      if (num == 0) {
        states = 0;
        a += 1;
        b = -1;
        c = -1;
        d = -1;
        if (a % 2 == 1) {
          states = 6;
        }
      } else if (num == 1) {
        states = 1;
        a = -1;
        b += 1;
        c = -1;
        d = -1;
        if (b % 2 == 1) {
          states = 6;
        }
      } else if (num == 2) {
        states = 2;
        a = -1;
        b = -1;
        c += 1;
        d = -1;
        if (c % 2 == 1) {
          states = 6;
        }
      } else if (num == 3) {
        states = 3;
        a = -1;
        b = -1;
        c = -1;
        d += 1;
        if (d % 2 == 1) {
          states = 6;
        }
      }
      // console.log(states)

      this.setData({
        states: states
      })
    },

  //预约   2019.5.19 legend 新增
  goReserve: function (e) {
    console.log(e.currentTarget.dataset.id)
    var str = e.currentTarget.dataset.id
      wx.navigateTo({
        url: "/pages/reserve/reserve?title=" + str
      })
  },
  
})