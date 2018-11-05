<template lang="html">
    <div class="commission-results-index">
        <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset">
            <template slot="formItem" >
                <Form-item prop="customer_id">
    				<Select v-model="listConf.searchParams.customer_id" placeholder="选择销售">
    	                <Option v-for="item in customers" :value="item.id" :key="item.id">{{ item.name }} - {{ item.phone }}</Option>
    	            </Select>
                </Form-item>
            </template>
        </myTable>
    </div>
</template>

<script>
import Util from '@/libs/util'
import myTable from '@/view/includes/myTable'

export default {
    components: {
        myTable
    },
    data() {
        return {
            currentRow: {},
            customers: [],
            listConf: {
                url: '/adminapi/commissionResults',
                searchParams: {
                    customer_id: 0
                },
                item: [],
                columns: [
                    { type: 'index', align: 'center', width: 100, fixed: 'left' },
                    { title: '佣金客户', align: 'center', key: 'sellername', render: (h, params) => {
                        return params.row.customer ? h('span', params.row.customer.name + '-' + params.row.customer.phone) : h('span', '')
                    }},
                    { title: '相关产品', align: 'center', key: 'productname', render: (h, params) => {
                        return params.row.product ? h('span', params.row.product.name) : h('span', '')
                    }},
                    { title: '考核类型', align: 'center', key: 'type_name', render: (h, params) => {
                        return params.row.commission_rule ? h('span', params.row.commission_rule.type_name) : h('span', '')
                    }},
                    { title: '考核标准', align: 'center', key: 'standard', render: (h, params) => {
                        return params.row.commission_rule ? h('span', params.row.commission_rule.standard) : h('span', '')
                    }},
                    { title: '佣金', align: 'center', key: 'commission'},
                    { title: '添加时间', align: 'center', key: 'created_at', width: 150}
                ]
            },
            deleteId: 0
        }
    },
    methods: {
        selectRow: function(index) {
            this.currentRow = index
        },
        searchReset: function(originParams) {
            this.listConf.searchParams = Util.extend(this.listConf.searchParams, originParams)
        },
        jumpPage: function(path) {
            this.$router.push(path)
        }
    },
    created: function() {
        var _this = this
        Util.ajax({
            url: '/adminapi/customers/all',
            method: 'get',
            success: function(result) {
                if (result.error == 0) {
                    _this.customers = result.result
                } else {
                    _this.$Notice.error({
                        title: '提示',
                        desc: result.info
                    })
                }
            }
        })
    },
    mounted: function() {}
}
</script>

<style lang="css">
</style>
