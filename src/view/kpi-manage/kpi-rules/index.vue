<template lang="html">
    <div class="kpi-rules-index">
        <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset">
            <template slot="formItem" >
                <Form-item prop="seller_id">
    				<Select v-model="listConf.searchParams.seller_id" placeholder="选择销售">
    	                <Option v-for="item in sellers" :value="item.id" :key="item.id">{{ item.name }} - {{ item.phone }}</Option>
    	            </Select>
                </Form-item>
            </template>

            <template slot="formBtn" >
                <Button type="primary" @click="jumpPage({ path: '/kpiManage/kpiRules/add' })"><Icon type="plus-round"></Icon>策略添加</Button>
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
                url: '/adminapi/kpiRules',
                searchParams: {
                    seller_id: this.$route.params.seller_id != undefined ? parseInt(this.$route.params.seller_id) : 0
                },
                item: [],
                rowClass: [
                    {name: 'is_end', value: 1, type: 'disabled'}
                ],
                columns: [
                    { type: 'index', align: 'center', width: 100, fixed: 'left' },
                    { title: '考核销售', align: 'center', key: 'sellername', width: 150, render: (h, params) => {
                        return params.row.seller ? h('span', params.row.seller.name + '-' + params.row.seller.phone) : h('span', '')
                    }},
                    { title: '考核地区', align: 'center', key: 'region_name', width: 200, render: (h, params) => {
                        var region_name = ''
                        var first = true
                        for (let region of params.row.region_name_arr) {
                            if (first) {
                                region_name += region
                            } else {
                                region_name += '-' + region
                            }
                            first = false
                        }
                        return h('span', region_name)
                    }},
                    { title: '考核产品', align: 'center', key: 'productname', width: 200, render: (h, params) => {
                        return params.row.product ? h('span', params.row.product.name) : h('span', '')
                    }},
                    { title: '开始时间', align: 'center', key: 'start_at_date', width: 120 },
                    { title: '结束时间', align: 'center', key: 'end_at_date', width: 120 },
                    { title: '考核周期', align: 'center', key: 'cycle_name', width: 90 },
                    { title: '考核类型', align: 'center', key: 'type_name', width: 90 },
                    { title: '考核标准', align: 'center', key: 'standard', width: 90 },
                    { title: '状态', align: 'center', key: 'end_name', width: 100 },
                    { title: '执行状态', align: 'center', key: 'exec_name', width: 100 },
                    { title: '备注', align: 'center', key: 'remark', width: 200 },
                    { title: '添加时间', align: 'center', key: 'created_at', width: 150},
                    { title: '操作', key: 'action', align: 'center', width: 150, fixed: 'right', render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small',
                                    icon: 'md-brush'
                                },
                                style: {
                                    marginRight: '5px',
                                    marginBottom: '5px'
                                },
                                on: {
                                    click: () => {
                                        var id = params.row.id
                                        this.jumpPage('/kpiManage/kpiRules/edit/' + id)
                                    }
                                }
                            }),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small',
                                    icon: 'md-close'
                                },
                                style: {
                                    marginRight: '5px',
                                    marginBottom: '5px'
                                },
                                on: {
                                    click: () => {
                                        var id = params.row.id
                                        this.deleteConf(id)
                                    }
                                }
                            })
                        ])
                    }}
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
        deleteConf: function(id) {
            var _this = this
            _this.$Modal.confirm({
                title: '提示',
                content: '确定删除吗？删除之后不可恢复!',
                onOk: function() {
                    _this.kpiRuleDel(id)
                },
                onCancel: function() {
                    _this.$Notice.error({
                        title: '提示',
                        desc: '操作取消'
                    })
                }
            })
        },
        kpiRuleDel(id) {
            var _this = this
            Util.ajax({
                url: '/adminapi/kpiRules/' + id,
                method: 'DELETE',
                success: function(result) {
                    if (result.error == 0) {
                        _this.$Notice.success({
                            title: '提示',
                            desc: '删除成功'
                        })
                        _this.$refs.listTable.listLoad()
                    } else {
                        _this.$Notice.error({
                            title: '提示',
                            desc: result.info
                        })
                    }
                }
            })
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
