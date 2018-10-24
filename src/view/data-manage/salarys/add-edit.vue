<template lang="html">
	<div class="salarys-add-edit">
		<Form class="form-edit" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
            <Form-item label="所属销售" prop="seller_id">
				<Select v-model="formValidate.seller_id" placeholder="请选择所属销售">
	                <Option v-for="item in sellers" :value="item.id" :key="item.id">{{ item.name }} - {{ item.phone }}</Option>
	            </Select>
            </Form-item>

            <Form-item label="部门" prop="department">
                <Input v-model="formValidate.department" placeholder="请输入部门"></Input>
            </Form-item>

            <Form-item label="岗位" prop="job">
                <Input v-model="formValidate.job" placeholder="请输入岗位"></Input>
            </Form-item>

            <Form-item label="工资月份" prop="month">
                <DatePicker v-model="formValidate.month" type="month" @on-change="salaryMonth" placeholder="请选择工资月份" required></DatePicker>
            </Form-item>

            <Form-item label="基本工资" prop="base_salary">
                <InputNumber v-model="formValidate.base_salary" placeholder="请输入基本工资"></InputNumber>
            </Form-item>

            <Form-item label="绩效考核" prop="achievement_salary">
                <InputNumber v-model="formValidate.achievement_salary" placeholder="请输入绩效考核"></InputNumber>
            </Form-item>

            <Form-item label="车/饭补贴" prop="subsidy_salary">
                <InputNumber v-model="formValidate.subsidy_salary" placeholder="请输入车/饭补贴"></InputNumber>
            </Form-item>

            <Form-item label="其他加班费" prop="other_overtime_salary">
                <InputNumber v-model="formValidate.other_overtime_salary" placeholder="请输入其他加班费"></InputNumber>
            </Form-item>

            <Form-item label="国定加班费" prop="overtime_salary">
                <InputNumber v-model="formValidate.overtime_salary" placeholder="请输入国定加班费"></InputNumber>
            </Form-item>

            <Form-item label="独生子女费" prop="one_child_salary">
                <InputNumber v-model="formValidate.one_child_salary" placeholder="请输入独生子女费"></InputNumber>
            </Form-item>

            <Form-item label="其他津贴" prop="other_allowance_salary">
                <InputNumber v-model="formValidate.other_allowance_salary" placeholder="请输入其他津贴"></InputNumber>
            </Form-item>

            <Form-item label="放射津贴" prop="radiate_allowance_salary">
                <InputNumber v-model="formValidate.radiate_allowance_salary" placeholder="请输入放射津贴"></InputNumber>
            </Form-item>

            <Form-item label="补发" prop="reissue_salary">
                <InputNumber v-model="formValidate.reissue_salary" placeholder="请输入补发"></InputNumber>
            </Form-item>

            <Form-item label="其他工资" prop="other_salary">
                <InputNumber v-model="formValidate.other_salary" placeholder="请输入其他工资"></InputNumber>
            </Form-item>

            <Form-item label="经济补偿金" prop="economy_salary">
                <InputNumber v-model="formValidate.economy_salary" placeholder="请输入经济补偿金"></InputNumber>
            </Form-item>

            <Form-item label="应发工资合计" prop="should_salary">
                <InputNumber v-model="formValidate.should_salary" placeholder="请输入应发工资合计"></InputNumber>
            </Form-item>

            <Form-item label="养老金" prop="pension_salary">
                <InputNumber v-model="formValidate.pension_salary" placeholder="请输入养老金"></InputNumber>
            </Form-item>

            <Form-item label="医疗金" prop="medical_salary">
                <InputNumber v-model="formValidate.medical_salary" placeholder="请输入医疗金"></InputNumber>
            </Form-item>

            <Form-item label="失业金" prop="unemploy_salary">
                <InputNumber v-model="formValidate.unemploy_salary" placeholder="请输入失业金"></InputNumber>
            </Form-item>

            <Form-item label="公积金" prop="accumulation_salary">
                <InputNumber v-model="formValidate.accumulation_salary" placeholder="请输入公积金"></InputNumber>
            </Form-item>

            <Form-item label="病假扣款" prop="ill_salary">
                <InputNumber v-model="formValidate.ill_salary" placeholder="请输入病假扣款"></InputNumber>
            </Form-item>

            <Form-item label="事假扣款" prop="thing_salary">
                <InputNumber v-model="formValidate.thing_salary" placeholder="请输入事假扣款"></InputNumber>
            </Form-item>

            <Form-item label="其他扣款" prop="other_reduce_salary">
                <InputNumber v-model="formValidate.other_reduce_salary" placeholder="请输入其他扣款"></InputNumber>
            </Form-item>

            <Form-item label="应纳税额" prop="tax_salary">
                <InputNumber v-model="formValidate.tax_salary" placeholder="请输入应纳税额"></InputNumber>
            </Form-item>

            <Form-item label="个税" prop="personal_tax_salary">
                <InputNumber v-model="formValidate.personal_tax_salary" placeholder="请输入个税"></InputNumber>
            </Form-item>

            <Form-item label="扣款合计" prop="reduce_salary">
                <InputNumber v-model="formValidate.reduce_salary" placeholder="请输入扣款合计"></InputNumber>
            </Form-item>

            <Form-item label="实发工资金额" prop="salary">
                <InputNumber v-model="formValidate.salary" placeholder="请输入实发工资金额"></InputNumber>
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
                department: '',
                job: '',
                month: '',
                // 应发金额
                base_salary: 0,
                achievement_salary: 0,
                subsidy_salary: 0,
                other_overtime_salary: 0,
                overtime_salary: 0,
                one_child_salary: 0,
                other_allowance_salary: 0,
                radiate_allowance_salary: 0,
                reissue_salary: 0,
                other_salary: 0,
                economy_salary: 0,
                should_salary: 0,
                // 应扣金额
                pension_salary: 0,
                medical_salary: 0,
                unemploy_salary: 0,
                accumulation_salary: 0,
                ill_salary: 0,
                thing_salary: 0,
                other_reduce_salary: 0,
                tax_salary: 0,
                personal_tax_salary: 0,
                reduce_salary: 0,
                // 实发金额
                salary: 0,

                remark: '',
            },
            ruleValidate: {
                seller_id: [
                    { required: true, message: '请选择所属销售', min: 1, trigger: 'change', type: 'number' }
                ],
                department: [
                    { required: true, message: '请输入部门', trigger: 'blur' }
                ],
                job: [
                    { required: true, message: '请输入岗位', trigger: 'blur' }
                ],
                month: [
                    { required: false }
                ],
                should_salary: [
                    { required: true, message: '请输入应发工资合计', type: 'number', min: 0.01, trigger: 'blur' }
                ],
                reduce_salary:[
                    { required: true, message: '请输入扣款合计', type: 'number', min: 0.01, trigger: 'blur' }
                ],
                salary:[
                    { required: true, message: '请输入实发工资', type: 'number', min: 0.01, trigger: 'blur' }
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
                    var url = '/adminapi/salarys'
                    if (_this.formValidate.id) { // 编辑
                        method = 'patch'
                        var url = '/adminapi/salarys/' + _this.formValidate.id
                    }

                    Util.ajax({
                        url: url,
                        method: method,
                        data: _this.formValidate,
                        success: function(result) {
                            if (result.error == 0) {
                                _this.$Notice.success({ title: '提示', desc: '保存成功' })
                                _this.$router.push('/dataManage/salarys/index')
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
        salaryMonth(date, value) {
            this.formValidate.month = date;
        }
    },
    mounted: function() {},
    created() {
        var _this = this
        if (_this.$route.params.id != undefined) {
            Util.ajax({
                url: '/adminapi/salarys/' + _this.$route.params.id,
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
