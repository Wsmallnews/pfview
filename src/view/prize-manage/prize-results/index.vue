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

            <template slot="formBtn" slot-scope="params">
                <ButtonGroup>
                    <Button type="primary" @click="exportData(0)"><Icon type="md-cloud-download" /> 导出当前页</Button>
                    <Button type="primary" :loading="params.exportLoading" @click="exportData(1)"> 全部</Button>
                </ButtonGroup>
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
                    { title: '考核销售', align: 'center', key: 'sellername', render: (h, params) => {
                        return params.row.seller ? h('span', params.row.seller.name + '-' + params.row.seller.phone) : h('span', '')
                    }},
                    { title: '考核产品', align: 'center', key: 'productname', render: (h, params) => {
                        return params.row.product ? h('span', params.row.product.name) : h('span', '')
                    }},
                    { title: '考核类型', align: 'center', key: 'type_name', render: (h, params) => {
                        return params.row.prize_rule ? h('span', params.row.prize_rule.type_name) : h('span', '')
                    }},
                    { title: '考核标准', align: 'center', key: 'standard', render: (h, params) => {
                        return params.row.prize_rule ? h('span', params.row.prize_rule.standard) : h('span', '')
                    }},
                    { title: '奖金', align: 'center', key: 'prize'},
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
        },
        exportData: function (isAll) {
            this.$refs.listTable.exportCsv({
                isAll: isAll,
                columnsCB: function (item, index, columns) {
                    return index > 0;
                },
                dataCB: function (item, index, data) {
                    item.sellername = item.seller ? item.seller.name + '-' + item.seller.phone : '';
                    item.productname = item.product ? item.product.name : '';
                    item.type_name = item.prize_rule ? item.prize_rule.type_name : '';
                    item.standard = item.prize_rule ? item.prize_rule.standard : '';

                    return item;
                },
            });
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
