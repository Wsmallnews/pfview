<template lang="html">
	<div class="institutions-add-edit">
		<Form class="form-edit" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
			<Form-item label="机构名称" prop="name">
                <Input v-model="formValidate.name" placeholder="请输入机构名称"></Input>
            </Form-item>

			<Form-item label="所属销售" prop="seller_id">
				<Select v-model="formValidate.seller_id" placeholder="请选择所属销售">
	                <Option v-for="item in sellers" :value="item.id" :key="item.id">{{ item.name }} - {{ item.phone }}</Option>
	            </Select>
            </Form-item>

            <FormItem label="所在地域" prop="region_id" >
                <Cascader
                    :data="regions"
                    v-model="formValidate.region_id"
                    placeholder="请选择所在地域"
                    change-on-select
                    @on-change="regionChange"
                    >
                </Cascader>
            </FormItem>

            <Form-item label="联系电话" prop="contact_phone">
                <Input v-model="formValidate.contact_phone" placeholder="请输入联系电话"></Input>
            </Form-item>

			<Form-item label="地址" prop="address">
                <Input v-model="formValidate.address" placeholder="请输入地址"></Input>
            </Form-item>
			<FormItem>
	            <Button type="primary" @click.native="handleSubmit('formValidate')">提交</Button>
				<Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
	        </FormItem>
		</Form>
	</div>
</template>

<script>
import Util from '@/libs/util'
export default {
  components: {

  },
  data () {
    return {
      sellers: [],
      regions: [],
      formValidate: {
        id: 0,
        name: '',
        seller_id: 0,
        region_id: [],
        region_name: [],
        contact_phone: '',
        address: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        seller_id: [
          { required: true, message: '请选择所属销售', min: 1, trigger: 'change', type: 'number'}
        ],
        region_id: [
          { required: true, type: 'array', min: 1, message: '请选择所在地域', trigger: 'change' }
        ],
        contact_phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleSubmit (name) {
      var _this = this

      _this.$refs[name].validate((valid) => {
        if (valid) {
          var method = 'post'
          var url = '/adminapi/institutions'
          if (_this.formValidate.id) { // 编辑
            method = 'patch'
            var url = '/adminapi/institutions/' + _this.formValidate.id
          }

          Util.ajax({
            url: url,
            method: method,
            data: _this.formValidate,
            success: function (result) {
              if (result.error == 0) {
                _this.$Notice.success({title: '提示', desc: '保存成功'})
                _this.$router.push('/customerManage/institutions/index')
              } else {
                _this.$Notice.error({title: '提示', desc: result.info})
              }
            }
          })
        } else {
          _this.$Notice.error({title: '提示', desc: '信息填写不完整'})
        }
      })
    },
    handleReset (name) { // 表单数据重置, name ,表单数据
      var _this = this
      _this.$refs[name].resetFields()
    },
    regionChange (value, data) {
      var region_name = []
      for (let item of data) {
        region_name.push(item.name)
      }
      this.formValidate.region_name = region_name
    }
  },
  mounted: function () {
  },
  created () {
    var _this = this
    if (_this.$route.params.id != undefined) {
      Util.ajax({
        url: '/adminapi/institutions/' + _this.$route.params.id,
        method: 'get',
        success: function (result) {
          if (result.error == 0) {
            var info = result.result
            for (var i in _this.formValidate) {
              _this.formValidate[i] = info[i]
              if (i == 'region_id') {
                _this.formValidate[i] = info['region_id_arr']
              }
              if (i == 'region_name') {
                _this.formValidate[i] = info['region_name_arr']
              }
            }
          } else {
            _this.$Notice.error({title: '提示', desc: result.info})
          }
        }
      })
    }

    // 所有销售
    Util.ajax({
      url: '/adminapi/sellers/all',
      method: 'get',
      success: function (result) {
        if (result.error == 0) {
          _this.sellers = result.result
        } else {
          _this.$Notice.error({title: '提示', desc: result.info})
        }
      }
    })

    // 所有地域
    Util.ajax({
      url: '/adminapi/regions',
      method: 'get',
      success: function (result) {
        if (result.error == 0) {
          _this.regions = result.result
        } else {
          _this.$Notice.error({
            title: '提示',
            desc: result.info
          })
        }
      }
    })
  }
}
</script>

<style lang="css">

</style>
