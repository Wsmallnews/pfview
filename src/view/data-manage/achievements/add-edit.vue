<template lang="html">
	<div class="achievements-add-edit">
		<Form class="form-edit" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
            <Form-item label="所属销售" prop="seller_id">
				<Select v-model="formValidate.seller_id" placeholder="请选择所属销售">
	                <Option v-for="item in sellers" :value="item.id" :key="item.id">{{ item.name }} - {{ item.phone }}</Option>
	            </Select>
            </Form-item>

            <FormItem label="销售地域" prop="region_id" >
                <Cascader
                    :data="regions"
                    v-model="formValidate.region_id"
                    placeholder="请选择销售地域"
                    change-on-select
                    @on-change="regionChange"
                    >
                </Cascader>
            </FormItem>

			<Form-item label="相关客户" prop="customer_id">
				<Select v-model="formValidate.customer_id" placeholder="请选择所属销售">
	                <Option v-for="item in customers" :value="item.id" :key="item.id">{{ item.name }} - {{ item.phone }}</Option>
	            </Select>
            </Form-item>

            <Form-item label="产品" prop="product_id">
				<Select v-model="formValidate.product_id" placeholder="请选择销售产品" @on-change="productChange">
	                <Option v-for="item in products" :value="item.id" :key="item.id">{{ item.name }}</Option>
	            </Select>
            </Form-item>

            <Form-item label="价格" prop="price">
                <InputNumber v-model="formValidate.price" placeholder="产品价格" readonly></InputNumber>
            </Form-item>

            <Form-item label="销售数量" prop="sale_num">
                <InputNumber v-model="formValidate.sale_num" placeholder="请输入销售数量"></InputNumber>
            </Form-item>

            <Form-item label="优惠金额" prop="discount_money">
                <InputNumber v-model="formValidate.discount_money" placeholder="请输入优惠金额"></InputNumber>
            </Form-item>

            <Form-item label="应销售总额" prop="should_money">
                <InputNumber v-model="should_money" placeholder="请输入应销售总额" readonly></InputNumber>
            </Form-item>

            <Form-item label="实际销售总额" prop="real_money">
                <InputNumber v-model="real_money" placeholder="请输入实际销售总额" readonly></InputNumber>
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
            regions: [],
			customers: [],
            formValidate: {
                id: 0,
                seller_id: 0,
                region_id: [],
                region_name: [],
				customer_id: 0,
                product_id: 0,
                price: 0,
                sale_num: 0,
                discount_money: 0,
                should_money: 0,
                real_money: 0,
                remark: ''
            },
            ruleValidate: {
                seller_id: [
                    { required: true, message: '请选择所属销售', min: 1, trigger: 'change', type: 'number'}
                ],
                region_id: [
                    { required: true, message: '请选择销售地域', trigger: 'change', type: 'array'}
                ],
                product_id: [
                    { required: true, message: '请选择销售产品', min: 1, trigger: 'change', type: 'number'}
                ],
                sale_num: [
                    { required: true, message: '销售数量', type: 'number', min: 1, trigger: 'blur' }
                ],
            }
        }
    },
    computed: {
        should_money () {
            return this.formValidate.price * this.formValidate.sale_num;
        },
        real_money () {
            return this.should_money - this.formValidate.discount_money;
        }
    },
    methods: {
        handleSubmit(name) {
            var _this = this

            _this.$refs[name].validate((valid) => {
                if (valid) {
                    var method = 'post'
                    var url = '/adminapi/achievements'
                    if (_this.formValidate.id) { // 编辑
                        method = 'patch'
                        var url = '/adminapi/achievements/' + _this.formValidate.id
                    }

                    Util.ajax({
                        url: url,
                        method: method,
                        data: _this.formValidate,
                        success: function(result) {
                            if (result.error == 0) {
                                _this.$Notice.success({ title: '提示', desc: '保存成功' })
                                _this.$router.push('/dataManage/achievements/index')
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
        productChange (product_id) {
            for (let item of this.products) {
                if (item.id == product_id) {
                    this.formValidate.price = item.price
                    break;
                }
            }
        }
    },
    mounted: function() {},
    created() {
        var _this = this
        if (_this.$route.params.id != undefined) {
            Util.ajax({
                url: '/adminapi/achievements/' + _this.$route.params.id,
                method: 'get',
                success: function(result) {
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

        // 所有地域
        Util.ajax({
            url: '/adminapi/regions',
            method: 'get',
            success: function(result) {
                if (result.error == 0) {
                    _this.regions = result.result
                } else {
                    _this.$Notice.error({ title: '提示', desc: result.info })
                }
            }
        })

		// 所有客户
        Util.ajax({
            url: '/adminapi/customers/all',
            method: 'get',
            success: function(result) {
                if (result.error == 0) {
                    _this.customers = result.result
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
    }
}
</script>

<style lang="css">

</style>
