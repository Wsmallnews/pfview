<template lang="html">
    <div class="prize-results-index">
        <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset">
            <template slot="formItem" >
                <Form-item prop="seller_id">
    				<Select v-model="listConf.searchParams.seller_id" placeholder="选择销售">
    	                <Option v-for="item in sellers" :value="item.id" :key="item.id">{{ item.name }} - {{ item.phone }}</Option>
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
            sellers: [],
            listConf: {
                url: '/adminapi/prizeResults',
                searchParams: {
                    seller_id: 0
                },
                item: [],
                columns: [
                    { type: 'index', align: 'center', width: 100, fixed: 'left' },
                    { title: '考核销售', align: 'center', key: 'sellername', width: 150, render: (h, params) => {
                        return params.row.seller ? h('span', params.row.seller.name + '-' + params.row.seller.phone) : h('span', '')
                    }},
                    { title: '考核产品', align: 'center', key: 'productname', width: 200, render: (h, params) => {
                        return params.row.product ? h('span', params.row.product.name) : h('span', '')
                    }},
                    { title: '考核类型', align: 'center', key: 'type_name', width: 90, render: (h, params) => {
                        return params.row.prizeRule ? h('span', params.row.prizeRule.type_name) : h('span', '')
                    }},
                    { title: '考核标准', align: 'center', key: 'standard', width: 90, render: (h, params) => {
                        return params.row.prizeRule ? h('span', params.row.prizeRule.standard) : h('span', '')
                    }},
                    { title: '奖金', align: 'center', key: 'prize', width: 90},
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
            url: '/adminapi/sellers/all',
            method: 'get',
            success: function(result) {
                if (result.error == 0) {
                    _this.sellers = result.result
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
