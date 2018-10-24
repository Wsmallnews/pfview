<template lang="html">
    <div class="categorys-index">
        <Button class="add-btn" type="primary" @click="jumpPage({ path: '/productManage/categorys/add' })">添加分类</Button>
        <Tree :data="categorys" :render="renderContent" empty-text=""></Tree>
    </div>
</template>

<script>
import Util from '@/libs/util'

export default {
  components: {},
  data () {
    return {
      categorys: [],
      deleteId: 0
    }
  },
  methods: {
    jumpPage: function (path) {
      this.$router.push(path)
    },
    renderContent (h, { root, node, data }) {
      var icon = data.parent_id == null ? 'ios-folder-outline' : 'ios-paper-outline'
      return h('span', {
        style: {
          display: 'inline-block',
          width: '100%'
        }
      }, [
        h('span', [
          h('Icon', {
            props: {
              type: icon
            },
            style: {
              marginRight: '8px'
            }
          }),
          h('span', data.name)
        ]),
        h('span', {
          style: {
            display: 'inline-block',
            float: 'right',
            marginRight: '32px'
          }
        }, [
          h('Button', {
            props: {
              type: 'primary',
              size: 'small',
              icon: 'md-brush'
            },
            style: {
              marginRight: '5px',
              marginBottom: '5px'
            },
            on: {
              click: () => {
                var id = data.id
                this.jumpPage({
                  path: '/productManage/categorys/edit/' + id
                })
              }
            }
          }),
          h('Button', {
            props: {
              type: 'error',
              size: 'small',
              icon: 'md-close'
            },
            style: {
              marginRight: '5px',
              marginBottom: '5px'
            },
            on: {
              click: () => {
                this.deleteId = data.id

                this.$Modal.confirm({
                  'title': '提示',
                  'content': '确定要删除吗',
                  'onOk': this.catDelete
                })
              }
            }
          })
        ])
      ])
    },
    getCagetorys: function () {
      var _this = this
      Util.ajax({
        url: '/adminapi/shopProductCategorys',
        method: 'get',
        success: function (result) {
          if (result.error == 0) {
            _this.categorys = result.result
          } else {
            _this.$Notice.error({
              title: '提示',
              desc: result.info
            })
          }
        }
      })
    },
    catDelete: function () {
      var _this = this

      Util.ajax({
        url: '/adminapi/shopProductCategorys/' + _this.deleteId,
        method: 'delete',
        success: function (result) {
          if (result.error == 0) {
            _this.$Notice.success({
              title: '提示',
              desc: '删除成功'
            })
            _this.getCagetorys()
          } else {
            _this.$Notice.error({
              title: '提示',
              desc: result.info
            })
          }
        }
      })
    }
  },
  created: function () {
    this.getCagetorys()
  },
  mounted: function () {}
}
</script>

<style lang="css" >
button.add-btn {
    margin-bottom: 20px;
}
</style>
