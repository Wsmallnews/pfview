<template lang="html">
	<div class="sellers-add-edit">
		<Form class="form-edit" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
			<Form-item label="姓名" prop="name">
                <Input v-model="formValidate.name" placeholder="请输入姓名"></Input>
            </Form-item>

            <Form-item label="手机" prop="phone">
                <Input v-model="formValidate.phone" placeholder="请输入手机" :disabled="type == 'edit'"></Input>
            </Form-item>

            <Form-item label="邮箱" prop="email">
                <Input v-model="formValidate.email" placeholder="请输入邮箱"></Input>
            </Form-item>

            <Form-item v-if="type == 'add'" label="密码" prop="password" >
                <Input v-model="formValidate.password" type="password" placeholder="请输入初始密码"></Input>
            </Form-item>

            <Form-item label="身份证号" prop="idcard">
                <Input v-model="formValidate.idcard" placeholder="请输入身份证号"></Input>
            </Form-item>

            <Form-item label="地址" prop="address">
                <Input v-model="formValidate.address" placeholder="请输入地址"></Input>
            </Form-item>

            <Form-item>
                <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
            </Form-item>
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
      type: 'add',
      formValidate: {
        id: 0,
        name: '',
        phone: '',
        password: '',
        email: '',
        idcard: '',
        address: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        email: [
          { required: true, type: 'email', message: '请输入邮箱', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
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
          var url = '/adminapi/sellers'
          if (_this.formValidate.id) { // 编辑
            method = 'patch'
            var url = '/adminapi/sellers/' + _this.formValidate.id
          }

          Util.ajax({
            url: url,
            method: method,
            data: _this.formValidate,
            success: function (result) {
              if (result.error == 0) {
                _this.$Notice.success({title: '提示', desc: '保存成功'})
                _this.$router.push('/sellers/index')
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
    }
  },
  mounted: function () {
  },
  created () {
    var _this = this
    if (_this.$route.params.id != undefined) {
      _this.type = 'edit'
      Util.ajax({
        url: '/adminapi/sellers/' + _this.$route.params.id,
        method: 'get',
        success: function (result) {
          if (result.error == 0) {
            var info = result.result
            for (var i in _this.formValidate) {
              _this.formValidate[i] = info[i]
            }
          } else {
            _this.$Notice.error({title: '提示', desc: result.info})
          }
        }
      })
    }
  }
}
</script>

<style lang="css">

</style>
