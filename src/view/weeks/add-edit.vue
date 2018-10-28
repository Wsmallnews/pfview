<template lang="html">
	<div class="achievements-add-edit">
		<Form class="form-edit" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
            <Form-item label="开始日期" prop="start_at">
                <DatePicker :value="formValidate.start_at" type="date" @on-change="startDate" placeholder="请选择开始日期" required></DatePicker>
                <span class="form-hints"><Icon type="md-alert" /> 所选择日期的 00:00:00</span>
            </Form-item>

            <!-- <Form-item label="结束日期" prop="end_at">
                <DatePicker v-model="formValidate.end_at" type="date" @on-change="endDate" placeholder="请选择结束日期" required></DatePicker>
                <span class="form-hints"><Icon type="md-alert" /> 所选择日期的 23:59:59</span>
            </Form-item>

            <Form-item label="年份" prop="year">
                <DatePicker v-model="formValidate.year" type="year" @on-change="yearDate" placeholder="请选择年份" required></DatePicker>
            </Form-item> -->

            <Form-item label="季度" prop="quarter">
                <InputNumber v-model="formValidate.quarter" placeholder="请输入日历季度"></InputNumber>
            </Form-item>

            <Form-item label="月份" prop="month">
                <InputNumber v-model="formValidate.month" placeholder="请输入日历月份"></InputNumber>
            </Form-item>

            <Form-item label="周" prop="week">
                <InputNumber v-model="formValidate.week" placeholder="请输入日历周"></InputNumber>
            </Form-item>

            <Form-item label="天数" prop="days">
                <InputNumber v-model="formValidate.days" placeholder="请输入日历天数"></InputNumber>
            </Form-item>

            <Form-item label="周类型" prop="week_type">
                <Select v-model="formValidate.week_type" placeholder="请选择周类型">
                    <Option v-for="item in week_types" :value="item.value" :key="item.value">{{ item.name }}</Option>
                </Select>
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
            week_types: [],
            formValidate: {
                id: 0,
                start_at: '',
                end_at: '',
                year: 0,
                quarter: 0,
                month: 0,
                week: 0,
                days: 0,
                week_type: 'normal'
            },
            ruleValidate: {
                start_at: [
                    { required: true, message: '请选择开始日期', trigger: 'change', type: 'date'}
                ],
                end_at: [
                    { required: true, message: '请选择考核地域', trigger: 'change', type: 'array'}
                ],
                year: [
                    { required: true, message: '请选择考核产品', min: 1, trigger: 'change', type: 'number'}
                ],
                quarter: [
                    { required: true, message: '请选择考核开始时间', trigger: 'change'}
                ],
                month: [
                    { required: true, message: '请选择考核结束时间', trigger: 'change'}
                ],
                week: [
                    { required: true, message: '请选择考核周期', trigger: 'change'}
                ],
                days: [
                    { required: true, message: '请填写考核标准', type: 'number', min: 0.01, trigger: 'blur' }
                ],
                week_type: [
                    { required: true, message: '请填写考核标准', type: 'number', min: 0.01, trigger: 'blur' }
                ],
            }
        }
    },
    computed: {
    },
    methods: {
        handleSubmit(name) {
            var _this = this

            _this.$refs[name].validate((valid) => {
                if (valid) {
                    var method = 'post'
                    var url = '/adminapi/kpiRules'
                    if (_this.formValidate.id) { // 编辑
                        method = 'patch'
                        var url = '/adminapi/kpiRules/' + _this.formValidate.id
                    }

                    Util.ajax({
                        url: url,
                        method: method,
                        data: _this.formValidate,
                        success: function(result) {
                            if (result.error == 0) {
                                _this.$Notice.success({ title: '提示', desc: '保存成功' })
                                _this.$router.push('/kpiManage/kpiRules/index')
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
        startDate(value, data) {
            this.formValidate.start_at = value;
        },
        endDate(value, data) {
            console.log(value)
            console.log(data)

        },
        yearDate(value, data) {
            console.log(value)
            console.log(data)
        },
    },
    mounted: function() {},
    created() {
        var _this = this
        if (_this.$route.params.id != undefined) {
            Util.ajax({
                url: '/adminapi/weeks/' + _this.$route.params.id,
                method: 'get',
                success: function(result) {
                    if (result.error == 0) {
                        var info = result.result
                        for (var i in _this.formValidate) {
                            _this.formValidate[i] = info[i]
                        }
                    } else {
                        _this.$Notice.error({ title: '提示', desc: result.info })
                    }
                }
            })
        }

        Util.ajax({
            url: '/adminapi/weeks/weekTypeAll',
            method: 'get',
            success: function(result) {
                if (result.error == 0) {
                    _this.week_types = result.result;
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
