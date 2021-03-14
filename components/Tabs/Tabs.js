// components/Tabs/Tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: {
      type: Array,
      value: []
    }

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleItemTap(e) {
      // console.log(e);
      // 1.获取索引值
      const { index } = e.currentTarget.dataset;
      // 2.触发父组件中的自定义事件
      this.triggerEvent("tabsItemChange", { index })
    }
  }
})
