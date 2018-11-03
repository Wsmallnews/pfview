<template lang="html">
    <div class="sellers-index">
        <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset">
            <template slot="formItem" >
                <Form-item prop="keyword">
                    <Input type="text" v-model="listConf.searchParams.keyword" placeholder="搜索姓名/手机号" ></Input>
                </Form-item>
            </template>
            <template slot="formBtn" >
                <Button type="primary" @click="jumpPage({ path: '/sellers/add' })"><Icon type="plus-round"></Icon>销售添加</Button>
                <Button type="primary" @click="showKpiRules"><Icon type="plus-round"></Icon>查看 KPI 考核</Button>
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
            listConf: {
                url: '/adminapi/sellers',
                searchParams: {
                    keyword: ''
                },
                item: [],
                columns: [
                    {type: 'index', align: 'center', width: 100, fixed: 'left'},
                    {title: '姓名', align: 'center', key: 'name'},
                    {title: '手机', align: 'center', key: 'phone'},
                    {title: '邮箱', align: 'center', key: 'email'},
                    {title: '身份证号', align: 'center', key: 'idcard'},
                    {title: '地址', align: 'center', key: 'address'},
                    {title: '添加时间', align: 'center', key: 'created_at'},
                    { title: '操作', key: 'action', align: 'center', width: 150, fixed: 'right',
                        render: (h, params) => {
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
                                            this.jumpPage('/sellers/edit/' + id)
                                        }
                                    }
                                }),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'ios-build'
                                    },
                                    style: {
                                        marginRight: '5px',
                                        marginBottom: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            var id = params.row.id
                                            this.jumpPage('/sellers/resetPassword/' + id)
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
                        }
                    }
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
                    _this.sellerDel(id)
                },
                onCancel: function() {
                    _this.$Notice.error({
                        title: '提示',
                        desc: '操作取消'
                    })
                }
            })
        },
        sellerDel(id) {
            var _this = this
            Util.ajax({
                url: '/adminapi/sellers/' + id,
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
        },
        showKpiRules: function() {
            if (this.currentRow.id == undefined || this.currentRow.id == null || this.currentRow.id == '') {
                this.$Notice.error({ title: '提示', desc: '请先选择一位用户' })
            } else {
                this.$router.push({ path: '/kpiManage/kpiRules/index/' + this.currentRow.id })
            }
        }
    },
    created: function() {
        console.log('index-----');
    },
    mounted: function() {}
}
</script>

<style lang="css">
</style>
