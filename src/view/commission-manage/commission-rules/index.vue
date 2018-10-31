<template lang="html">
    <div class="commission-rules-index">
        <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset" :no-search="true">
            <template slot="formBtn" >
                <Button type="primary" @click="jumpPage({ path: '/commissionManage/commissionRules/add' })"><Icon type="plus-round"></Icon>策略添加</Button>
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
                url: '/adminapi/commissionRules',
                searchParams: {

                },
                item: [],
                rowClass: [
                    {name: 'is_end', value: 1, type: 'disabled'}
                ],
                columns: [
                    { type: 'index', align: 'center', width: 100, fixed: 'left' },
                    { title: '考核产品', align: 'center', key: 'productname', width: 200, render: (h, params) => {
                        return params.row.product ? h('span', params.row.product.name) : h('span', '')
                    }},
                    { title: '开始时间', align: 'center', key: 'start_at_date', width: 120 },
                    { title: '结束时间', align: 'center', key: 'end_at_date', width: 120 },
                    { title: '考核类型', align: 'center', key: 'type_name', width: 90 },
                    { title: '考核标准', align: 'center', key: 'standard', width: 90 },
                    { title: '佣金金额', align: 'center', key: 'money', width: 90 },
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
                                        this.jumpPage('/commissionManage/commissionRules/edit/' + id)
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
                    _this.commissionRuleDel(id)
                },
                onCancel: function() {
                    _this.$Notice.error({
                        title: '提示',
                        desc: '操作取消'
                    })
                }
            })
        },
        commissionRuleDel(id) {
            var _this = this
            Util.ajax({
                url: '/adminapi/commissionRules/' + id,
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
    },
    mounted: function() {}
}
</script>

<style lang="css">
</style>
