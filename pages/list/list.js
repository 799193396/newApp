// pages/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false, // loading
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 组件---排序点击事件
   */
  onTapSort(e) {
    this.setData({
      // loading: true,
      sortAsc: e.detail.sortAsc,
      sortField: e.detail.sortField,
      pageIndex: 1,
    })
    this.getListData()
  },
  // 获取内容
  getListData:function(){
    console.log('sss')
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})