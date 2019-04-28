const fetch = require('../../utils/fetch')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shop:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    fetch(`shops/${options.item}`).then(res=>{
      console.log(res.data)
      this.setData({shop: res.data})
      wx.setNavigationBarTitle({
        title: res.data.name
      })
    })
  },
  previewHandle(e) {
    wx.previewImage({
      current: e.target.dataset.src, // 当前显示图片的http链接
      urls: this.data.shop.images // 需要预览的图片http链接列表
    })
  }
})