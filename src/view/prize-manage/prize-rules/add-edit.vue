<template lang="html">
	<div class="prize-rules-add-edit">
		<Form class="form-edit" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
            <Form-item label="考核销售" prop="seller_id">
				<Select v-model="formValidate.seller_id" placeholder="请选择考核销售">
	                <Option v-for="item in sellers" :value="item.id" :key="item.id">{{ item.name }} - {{ item.phone }}</Option>
	            </Select>
            </Form-item>

            <Form-item label="奖金开始时间" prop="start_at">
                <Select v-model="formValidate.start_at" placeholder="请选择奖金开始时间">
                    <Option v-for="item in weeks" :value="item.start_at" :key="item.start_at">{{ item.year }} 年 -- 第 {{ item.quarter }} 季度 -- 第 {{ item.quarter }} 季度 -- 第 {{ item.month }} 月 -- 第 {{ item.week }} 周</Option>
                </Select>
                <span class="form-hints"><Icon type="md-alert" /> 所选择行动日历的开始时间</span>
            </Form-item>

            <Form-item label="奖金结束时间" prop="end_at">
                <Select v-model="formValidate.end_at" placeholder="请选择奖金结束时间" >
                    <Option v-for="item in weeks" :value="item.end_at" :key="item.end_at">{{ item.year }} 年 -- 第 {{ item.quarter }} 季度 -- 第 {{ item.quarter }} 季度 -- 第 {{ item.month }} 月 -- 第 {{ item.week }} 周</Option>
                </Select>
                <span class="form-hints"><Icon type="md-alert" /> 所选择行动日历的结束时间</span>
            </Form-item>

            <Form-item label="相关产品" prop="product_id">
				<Select v-model="formValidate.product_id" placeholder="请选择相关产品" >
	                <Option v-for="item in products" :value="item.id" :key="item.id">{{ item.name }}</Option>
	            </Select>
            </Form-item>

            <Form-item label="考核类型" prop="type">
                <Select v-model="formValidate.type" placeholder="考核类型">
                    <Option v-for="item in types" :value="item.value" :key="item.value">{{ item.name }}</Option>
                </Select>
            </Form-item>

            <Form-item label="考核标准" prop="standard">
                <Input v-model="formValidate.standard" placeholder="请输入考核标准"></Input>
            </Form-item>

            <Form-item label="奖金" prop="money">
                <InputNumber v-model="formValidate.money" placeholder="请输入奖金金额"></InputNumber>
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
            products: [],
            weeks: [],
            types: [
                {name: '销售额', value: 'money'},
                {name: '销售单数', value: 'num'},
            ],
            formValidate: {
                id: 0,
                seller_id: 0,
                start_at: '',
                end_at: '',
                product_id: 0,
                type: '',
                standard: '',
                money: 0,
                remark: ''
            },
            ruleValidate: {
                seller_id: [
                    { required: true, message: '请选择考核销售', min: 1, trigger: 'change', type: 'number'}
                ],
                start_at: [
                    { required: true, message: '请选择考核开始时间', trigger: 'change'}
                ],
                end_at: [
                    { required: true, message: '请选择考核结束时间', trigger: 'change'}
                ],
                product_id: [
                    { required: true, message: '请选择考核产品', min: 1, trigger: 'change', type: 'number'}
                ],
                type: [
                    { required: true, message: '请选择考核类型', trigger: 'change'}
                ],
                standard: [
                    { required: true, message: '请填写考核标准', trigger: 'blur' }
                ],
                money: [
                    { required: true, message: '请填写奖金金额', min: 0.01, trigger: 'blur', type: 'number'}
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
                    var url = '/adminapi/prizeRules'
                    if (_this.formValidate.id) { // 编辑
                        method = 'patch'
                        var url = '/adminapi/prizeRules/' + _this.formValidate.id
                    }

                    Util.ajax({
                        url: url,
                        method: method,
                        data: _this.formValidate,
                        success: function(result) {
                            if (result.error == 0) {
                                _this.$Notice.success({ title: '提示', desc: '保存成功' })
                                _this.$router.push('/prizeManage/prizeRules/index')
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
        regionChange(value, data) {
            var region_name = []
            for (let item of data) {
                region_name.push(item.name)
            }
            this.formValidate.region_name = region_name
        },
    },
    mounted: function() {},
    created() {
        var _this = this
        if (_this.$route.params.id != undefined) {
            Util.ajax({
                url: '/adminapi/prizeRules/' + _this.$route.params.id,
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

        // 所有产品
        Util.ajax({
            url: '/adminapi/shopProducts/all',
            method: 'get',
            success: function(result) {
                if (result.error == 0) {
                    _this.products = result.result
                } else {
                    _this.$Notice.error({ title: '提示', desc: result.info })
                }
            }
        })

        Util.ajax({
            url: '/adminapi/weeks/all',
            method: 'get',
            success: function(result) {
                if (result.error == 0) {
                    _this.weeks = result.result;
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
