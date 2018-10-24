<template lang="html">
	<div class="reimburs-add-edit">
		<Form class="form-edit" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
            <Form-item label="所属销售" prop="seller_id">
				<Select v-model="formValidate.seller_id" placeholder="请选择所属销售">
	                <Option v-for="item in sellers" :value="item.id" :key="item.id">{{ item.name }} - {{ item.phone }}</Option>
	            </Select>
            </Form-item>

            <Form-item label="报销项目" prop="project">
                <Input v-model="formValidate.project" placeholder="请输入报销项目"></Input>
            </Form-item>

            <Form-item label="报销事由说明" prop="explain">
                <Input v-model="formValidate.explain" placeholder="请输入报销事由说明"></Input>
            </Form-item>

            <Form-item label="报销金额" prop="money">
                <InputNumber v-model="formValidate.money" placeholder="请输入报销金额"></InputNumber>
            </Form-item>

			<Form-item label="备注" prop="remark">
                <Input v-model="formValidate.remark" type="textarea" placeholder="请输入备注"></Input>
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
            sellers: [],
            formValidate: {
                id: 0,
                seller_id: 0,
                project: '',
                explain: '',
                money: 0,
                remark: '',
            },
            ruleValidate: {
                seller_id: [
                    { required: true, message: '请选择所属销售', min: 1, trigger: 'change', type: 'number' }
                ],
                project: [
                    { required: true, message: '请输入报销项目', trigger: 'blur' }
                ],
                money: [
                    { required: true, message: '请输入报销金额', type: 'number', min: 0.01, trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        handleSubmit(name) {
            var _this = this

            console.log(_this.formValidate);
            _this.$refs[name].validate((valid) => {
                if (valid) {
                    var method = 'post'
                    var url = '/adminapi/reimburs'
                    if (_this.formValidate.id) { // 编辑
                        method = 'patch'
                        var url = '/adminapi/reimburs/' + _this.formValidate.id
                    }

                    Util.ajax({
                        url: url,
                        method: method,
                        data: _this.formValidate,
                        success: function(result) {
                            if (result.error == 0) {
                                _this.$Notice.success({ title: '提示', desc: '保存成功' })
                                _this.$router.push('/dataManage/reimburs/index')
                            } else {
                                _this.$Notice.error({ title: '提示', desc: result.info })
                            }
                        }
                    })
                } else {
                    _this.$Notice.error({ title: '提示', desc: '信息填写不完整' })
                }
            })
        },
        handleReset(name) { // 表单数据重置, name ,表单数据
            var _this = this
            _this.$refs[name].resetFields()
        },
        salaryMonth(date) {
            this.formValidate.month = date;
        }
    },
    mounted: function() {},
    created() {
        var _this = this
        if (_this.$route.params.id != undefined) {
            Util.ajax({
                url: '/adminapi/reimburs/' + _this.$route.params.id,
                method: 'get',
                success: function(result) {
                    if (result.error == 0) {
                        var info = result.result
                        for (var i in _this.formValidate) {
                            _this.formValidate[i] = info[i]
                        }
                    } else {
                        _this.$Notice.error({
                            title: '提示',
                            desc: result.info
                        })
                    }
                }
            })
        }

        // 所有销售
        Util.ajax({
            url: '/adminapi/sellers/all',
            method: 'get',
            success: function(result) {
                if (result.error == 0) {
                    _this.sellers = result.result
                } else {
                    _this.$Notice.error({ title: '提示', desc: result.info })
                }
            }
        })
    }
}
</script>

<style lang="css">

</style>
