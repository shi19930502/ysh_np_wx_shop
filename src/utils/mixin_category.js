export default {
  data() {
    return {
      // 一级商品分类列表
      categoryList: [],
      // 获取商品参数
      gbgoodsId: '',
      // 二级分类列表
      secondCategoryList: [],
      // 判断是否为个人中心进入
      isUserEnter: false,
      // 是否常买菜单被点击
      isOftenBuy: false
    }
  },
  methods: {
    /**
     * 处理是否选择数据
     */
    addActiveStatus(arr) {
      var activeCount = 1
      this.isUserEnter ? activeCount = 0 : activeCount = 1
      for (var i in arr) {
        if (i == activeCount) {
          arr[i].isActive = true
        } else {
          arr[i].isActive = false
        }
      }
      return arr
    },
    /**
     * 点击商品分类
     */
    menuClick(d) {
      this.pageNum = 1
      this.productList = []
      if (this.$refs.productList) {
        this.$refs.productList.$emit('ydui.infinitescroll.reInit');
      }
      if (!d.isActive) {
        d.isActive = true
      }
      for (var item of this.categoryList) {
        // 是否选择处理
        if (d.id != item.id) {
          item.isActive = false
        }
      }
      // 获取二级分类
      if (d.id == 'oftenbuy') { // 获取常买商品
        this.secondCategoryList = []
        this.isOftenBuy = true
        this.gbgoodsId = ''
        this.getProductList()
      } else {
        this.isOftenBuy = false
        if (d.childList) {
          this.secondCategoryList = d.childList
          // 子分类第一条数据添加选中状态
          // 如果有一天需要默认选择第一个二级分类就放开这个注释
          //					this.secondCategoryList[0].isActive = true
          for (var i in this.secondCategoryList) {
            if (i != 0 && this.secondCategoryList[i].isActive) {
              this.secondCategoryList[i].isActive = false
            }
          }
          // 查找商品
          // 如果有一天需要默认选择第一个二级分类就放开这个注释
          //					this.gbgoodsId = this.secondCategoryList[0].gbgoodsId
          this.gbgoodsId = d.gbgoodsId
          this.getProductList()
        } else {
          this.secondCategoryList = []
          this.gbgoodsId = d.gbgoodsId
          this.getProductList()
        }
      }
    },
    /**
     * 获取商品分类
     */
    getCategoryList() {
      // 			if(localStorage.getItem('categoryList')) {
      // 				this.categoryList = this.addActiveStatus(JSON.parse(localStorage.getItem('categoryList')))
      // 				this.getSonCategoryList(this.categoryList)
      // 			} else {
      this.getCategoryListSaveLocal()
      // }
    },
    /**
     * 获取分类列表缓存本地
     */
    getCategoryListSaveLocal() {
      this.$dialog.loading.open("商品分类加载中")

      this.postRequest('category/childList', {
        parentCategoryId: 'top',
        filteEnabled: 1,
        filteDeleted: 0,
        orderField: 't.f_id',
        supplierId: this.sellerId,
        onlyLv2: true
      }).then(resp => {
        this.$dialog.loading.close()
        if (resp && resp.data && resp.data.state == 0) {
          // 添加常买选项
          resp.data.aaData.unshift({
            name: '常买',
            id: 'oftenbuy'
          })
          // 商品分类数据
          this.categoryList = this.addActiveStatus(resp.data.aaData)
          this.getSonCategoryList(this.categoryList)
          // 缓存分类列表
          // localStorage.setItem('categoryList', JSON.stringify(this.categoryList))
        }
      })
    },
    /**
     * 获取二级分类
     */
    getSonCategoryList(categoryList) {
      // 添加二级分类isActive
      for (var i in categoryList) {
        if (categoryList[i].childList) { // 如果存在二级分类
          for (var j in categoryList[i].childList) {
            // 如果有一天需要默认选择第一个二级分类就放开这个注释
            //						if(j == 0) {
            //							categoryList[i].childList[j].isActive = true
            //						} else {
            categoryList[i].childList[j].isActive = false
            //						}
          }
        }
      }

      // 默认选择第一个分类
      if (this.isOftenBuy) {
        this.getProductList()
      } else {
        if (categoryList.length > 1 && categoryList[1].childList) {
          this.secondCategoryList = categoryList[1].childList
          // 如果有一天需要默认选择第一个二级分类就放开这个注释
          // this.gbgoodsId = this.secondCategoryList[0].gbgoodsId
          this.gbgoodsId = categoryList[1].gbgoodsId
          this.getProductList()
        } else {
          this.secondCategoryList = []
          if (categoryList.length > 1) {
            this.gbgoodsId = categoryList[1].gbgoodsId
            this.getProductList()
          }
        }
      }
    }
  }
}
