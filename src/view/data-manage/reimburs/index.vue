<template lang="html">
    <div class="reimburs-index">
        <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset">
            <template slot="formItem" >
                <Form-item prop="keyword">
                    <Input type="text" v-model="listConf.searchParams.keyword" placeholder="搜索销售姓名/手机号" ></Input>
                </Form-item>
            </template>

            <template slot="formBtn" slot-scope="params">
                <Button type="primary" @click="jumpPage({ path: '/dataManage/reimburs/add' })"><Icon type="plus-round"></Icon>报销录入</Button>
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
            institutions: [],
            listConf: {
                url: '/adminapi/reimburs',
                searchParams: {
                    keywords: '',
                },
                item: [],
                columns: [
                    { type: 'index', align: 'center', width: 100, fixed: 'left' },
                    { title: '所属销售', align: 'center', key: 'sellername', render: (h, params) => {
                        return params.row.seller ? h('span', params.row.seller.name + '-' + params.row.seller.phone) : h('span', '')
                    }},
                    { title: '报销项目', align: 'center', key: 'project' },
                    { title: '报销事由说明', align: 'center', key: 'explain' },
                    { title: '报销金额', align: 'center', key: 'money' },
                    { title: '备注', align: 'center', width: 150, key: 'remark' },
                    { title: '添加时间', align: 'center', width: 150, key: 'created_at' },
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
                                        this.jumpPage('/dataManage/reimburs/edit/' + id)
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
                }]
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
                    _this.reimburDel(id)
                },
                onCancel: function() {
                    _this.$Notice.error({
                        title: '提示',
                        desc: '操作取消'
                    })
                }
            })
        },
        reimburDel(id) {
            var _this = this
            Util.ajax({
                url: '/adminapi/reimburs/' + id,
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
        exportData: function (isAll) {
            this.$refs.listTable.exportCsv({
                isAll: isAll,
                columnsCB: function (item, index, columns) {
                    return index > 0 && index <= 6;
                },
                dataCB: function (item, index, data) {
                    item.sellername = item.seller ? item.seller.name + '-' + item.seller.phone : '';

                    return item;
                },
            });
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
