<template lang="html">
	<div class="admin-add-edit">
		<Form class="form-edit" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
			<Form-item label="姓名" prop="name">
                <Input v-model="formValidate.name" placeholder="请输入姓名"></Input>
            </Form-item>

            <Form-item label="手机号" prop="phone">
                <Input v-model="formValidate.phone" placeholder="请输入手机号"></Input>
            </Form-item>

            <Form-item label="所属机构" prop="institution_id">
                <Select v-model="formValidate.institution_id" placeholder="选择机构">
                    <Option v-for="item in institutions" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
            </Form-item>

			<Form-item label="身份证号" prop="idcard">
                <Input v-model="formValidate.idcard" placeholder="请输入身份证号"></Input>
            </Form-item>

            <Form-item label="邮箱" prop="email">
                <Input v-model="formValidate.email" placeholder="请输入邮箱"></Input>
            </Form-item>

			<Form-item label="部门" prop="department">
                <Input v-model="formValidate.department" placeholder="请输入部门"></Input>
            </Form-item>

			<Form-item label="职务" prop="job">
                <Input v-model="formValidate.job" placeholder="请输入职务"></Input>
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
import myUpload from '@/view/includes/myUpload'

export default {
    components: {
        myUpload
    },
    data() {
        return {
            institutions: [],
            formValidate: {
                id: 0,
                institution_id: 0,
                name: '',
                phone: '',
                idcard: '',
                email: '',
                department: '',
                job: '',
                address: ''
            },
            ruleValidate: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                institution_id: [
                    { required: true, message: '选择机构', min: 1, trigger: 'change', type: 'number' }
                ],
                phone: [
                    { required: true, message: '请输入手机号', trigger: 'blur' }
                ],
                idcard: [
                    { required: true, message: '请输入身份证号', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        handleSubmit(name) {
            var _this = this

            _this.$refs[name].validate((valid) => {
                if (valid) {
                    var method = 'post'
                    var url = '/adminapi/customers'
                    if (_this.formValidate.id) { // 编辑
                        method = 'patch'
                        var url = '/adminapi/customers/' + _this.formValidate.id
                    }

                    Util.ajax({
                        url: url,
                        method: method,
                        data: _this.formValidate,
                        success: function(result) {
                            if (result.error == 0) {
                                _this.$Notice.success({
                                    title: '提示',
                                    desc: '保存成功'
                                })
                                _this.$router.push('/customerManage/customers/index/' + _this.formValidate.institution_id)
                            } else {
                                _this.$Notice.error({
                                    title: '提示',
                                    desc: result.info
                                })
                            }
                        }
                    })
                } else {
                    _this.$Notice.error({
                        title: '提示',
                        desc: '信息填写不完整'
                    })
                }
            })
        },
        handleReset(name) { // 表单数据重置, name ,表单数据
            var _this = this
            _this.$refs[name].resetFields()
        }
    },
    mounted: function() {},
    created() {
        var _this = this
        if (_this.$route.params.id != undefined) {
            Util.ajax({
                url: '/adminapi/customers/' + _this.$route.params.id,
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

        Util.ajax({
            url: '/adminapi/institutions/all',
            method: 'get',
            success: function(result) {
                if (result.error == 0) {
                    _this.institutions = result.result
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
