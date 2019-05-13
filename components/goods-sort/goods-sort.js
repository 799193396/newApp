// components/goods-sort/goods-sort.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    sortAsc: false, //排序，false降序，true升序
  },

  /**
   * 组件生命周期
   */
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached() {
      // 商城配色
      this.setData({
        styleCfg: 'FFB900'
      })

      this.configSort()
    },
    moved() {},
    detached() {},
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 商品分组 自定义排序
     */
    configSort: function() {
      // 1距离
      // 2价格由低到高
      // 3价格由高到低
      switch (true) {
        case 2:
          this.setData({
            currentSort: 1,
            sortField: "salePrice",
            sortAsc: true
          });
          break;
        case 3:
          this.setData({
            currentSort: 1,
            sortField: "salePrice",
            sortAsc: false
          });
          break;
        case 5:
          this.setData({
            currentSort: 2,
            sortField: "mallSalesNum",
            sortAsc: false
          });
          break;
        default:
          this.setData({
            sortField: "",
            sortAsc: false
          });
          break;
      }
    },

    /**
     * 排序点击事件
     */
    tapSort: function(e) {
      let myEventDetail = {}

      // 判断是否是点击的当前排序,如果不相等，则，重置页码和sortAsc
      if (this.data.currentSort != e.currentTarget.dataset.index) {
        this.setData({
          currentSort: e.currentTarget.dataset.index,
          sortAsc: false,
        });
        
        switch (e.currentTarget.dataset.sort) {
          case "distance":
            this.setData({
              sortField: "salePrice",
              sortAsc: !this.data.sortAsc
            });
            myEventDetail = {
              sortField: "salePrice",
              sortAsc: this.data.sortAsc
            }
            this.triggerEvent('click', myEventDetail, {})

            break;
          case "price":
            this.setData({
              sortField: "salePrice",
              sortAsc: !this.data.sortAsc
            });
            myEventDetail={
              sortField: "salePrice",
              sortAsc: this.data.sortAsc
            }
            this.triggerEvent('click', myEventDetail, {})

            break;
          case "reserve":
            this.setData({
              sortField: "mallSalesNum",
              sortAsc: false
            });

            myEventDetail = {
              sortField: "mallSalesNum",
              sortAsc: false
            }
            this.triggerEvent('click', myEventDetail, {})

            break;
          default:
            this.setData({
              sortField: "",
              sortAsc: false
            });
            myEventDetail = {
              sortField: "",
              sortAsc: false
            }
            this.triggerEvent('click', myEventDetail, {})
            break;
        }
      } else {
        if (e.currentTarget.dataset.sort =='price'){
          this.setData({
            sortField: "salePrice",
            sortAsc: !this.data.sortAsc
          });
          myEventDetail = {
            sortField: "salePrice",
            sortAsc: this.data.sortAsc
          }
          this.triggerEvent('click', myEventDetail, {})
        }
      }
      
    },
  }
})