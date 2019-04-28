const fetch = require('../../utils/fetch')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 当前加载的分类
    category: {},
    // 此分类下的全部店铺
    shops: [],
    pageIndex: 1,
    pageSize: 20,
    totalCount: 0,
    hasMore: true
  },

  loadMore() {
    if(!this.data.hasMore) return
    // 解构赋值
    let { pageIndex, pageSize, searchText } = this.data
    const params = { _page: pageIndex++, _limit: pageSize }
    if(searchText) params.q = searchText

    return fetch(`categories/${this.data.category.id}/shops`, params)
    .then(res => {
      // 获取的数据的总条数
      const totalCount = parseInt(res.header['X-Total-Count'])
      // 判断是不是还有数据能加载
      const hasMore = this.data.pageIndex * this.data.pageSize < totalCount
      // 加载下一页数据时候，当前页与之拼接
      const shops = this.data.shops.concat(res.data)
      this.setData({ shops, totalCount, pageIndex, hasMore })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    fetch(`categories/${options.cat}`).then(res => {
      // console.log(res.data)
      // console.log(1)
      // setNavigationBarTitle必须在页面首次渲染完成之后去设置
      // 这里不能确定一定是在onReady 过后执行
      // wx.setNavigationBarTitle({
      //   title: res.data.name
      // })

      this.setData({ category: res.data })
      wx.setNavigationBarTitle({
        title: res.data.name
      })

      // 加载完分类信息过后再去加载商铺信息
     this.loadMore()
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // console.log(2)
    // 相当于加了个保险
    if(this.data.category.name) {
      wx.setNavigationBarTitle({
        title: this.data.category.name
      })
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    // 重新加载数据
    this.setData({ shops: [], pageIndex: 1, hasMore: true })
    // 在数据加载完，即上一个promise结束，就立即停止刷新
    this.loadMore().then(() => wx.stopPullDownRefresh())
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // console.log('到底了，别拉了')
    // 在这里加载下一页的数据
    // 需要判断是否正在加载，否则会有多次触发问题
    // 上拉刷新，如果还有数据就加载更多
    this.loadMore()
  },
  searchHandle () {
    // console.log(this.data.searchText)
    this.setData({ shops: [], pageIndex: 0, hasMore: true })
    this.loadMore()
  },

  showSearchHandle () {
    this.setData({ searchShowed: true })
  },
  hideSearchHandle () {
    this.setData({ searchText: '', searchShowed: false })
  },
  clearSearchHandle () {
    this.setData({ searchText: '' })
  },
  searchChangeHandle (e) {
    this.setData({ searchText: e.detail.value })
  }
})