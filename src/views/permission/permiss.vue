<!--
 * @Descripttion:
 * @Author: mikasa
 * @Date: 2020-09-12 10:16:27
-->
<template>

  <div class="permiss">
    <div style="margin:40px 20px;fontWeight:bolder;">权限配置</div>
    <el-tree
      :data="data"
      show-checkbox
      node-key="menuId"
      :default-expanded-keys="[2, 3]"
      :default-checked-keys="[5]"
      :props="defaultProps"
    />
  </div>
</template>

<script>
import { PermissMenu, SelectMenu } from '@/api'
export default {
  data() {
    return {
      data: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created() {
    this.getinfo()
    this.selectMenu()
  },
  methods: {
    compare(key) {
      return function(a, b) {
        var value1 = a[key]
        var value2 = b[key]
        return value1 - value2
      }
    },
    selectMenu() {
      SelectMenu().then(res => {
        console.log('select:' + res)
      }).catch(err => {
        console.log('err:' + err)
      })
    },
    getinfo() {
      const arr = []
      PermissMenu()
        .then((res) => {
          const result = res.data.sort(this.compare('parentId'))
          result.forEach((el) => {
            el.children = []
            if (el.parentId == 0) {
              arr.push(el)
            } else {
              const result = arr.forEach((item, index) => {
                if (el.parentId == item.menuId) {
                  item.children.push(el)
                }
              })
            }
          })
          console.log(arr)
          this.data = arr
        })
        .catch((err) => {})
    }
  }
}
</script>

<style>
</style>
