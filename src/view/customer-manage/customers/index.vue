<template lang="html">
    <div class="admins-index">
        <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset">
            <template slot="formItem" >
                <Form-item prop="keyword">
                    <Input type="text" v-model="listConf.searchParams.keyword" placeholder="搜索客户姓名/手机号" ></Input>
                </Form-item>

                <Form-item prop="institution_id">
                    <Select v-model="listConf.searchParams.institution_id" placeholder="选择机构">
                        <Option v-for="item in institutions" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </Form-item>
            </template>

            <template slot="formBtn" >
                <Button type="primary" @click="jumpPage({ path: '/customerManage/customers/add' })">添加客户</Button>
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
                url: '/adminapi/customers',
                searchParams: {
                    keyword: '',
                    institution_id: this.$route.params.ins_id != undefined ? parseInt(this.$route.params.ins_id) : 0
                },
                item: [],
                columns: [
                    {type: 'index', align: 'center', width: 100, fixed: 'left'},
                    {title: '姓名', align: 'center', key: 'name'},
                    {title: '所属销售', align: 'center', key: 'sellername', render: (h, params) => {
                        return params.row.seller ? h('span', params.row.seller.name + '-' + params.row.seller.phone) : h('span', '')
                    }},
                    {title: '所属机构', align: 'center', key: 'institutionname', render: (h, params) => {
                        return params.row.institution ? h('span', params.row.institution.name) : h('span', '')
                    }},
                    {title: '手机', align: 'center', key: 'phone'},
                    {title: '邮箱', align: 'center', key: 'email'},
                    {title: '身份证号', align: 'center', key: 'idcard'},
                    {title: '部门', align: 'center', key: 'department'},
                    {title: '职位', align: 'center', key: 'job'},
                    {title: '地址', align: 'center', key: 'address'},
                    {title: '添加时间', align: 'center', key: 'created_at'},
                    {title: '操作', key: 'action', align: 'center', width: 150, fixed: 'right', render: (h, params) => {
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
                                        this.jumpPage('/customerManage/customers/edit/' + id)
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
                    _this.customerDel(id)
                },
                onCancel: function() {
                    _this.$Notice.error({
                        title: '提示',
                        desc: '操作取消'
                    })
                }
            })
        },
        customerDel(id) {
            var _this = this
            Util.ajax({
                url: '/adminapi/customers/' + id,
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
            url: '/adminapi/institutions/all',
            method: 'get',
            success: function(result) {
                if (result.error == 0) {
                    _this.institutions = result.result
                } else {
                    _this.$Notice.error({
                        title: '提示',
                        desc: result.info
                    })
                }
            }
        })
    },
    mounted: function() {
    }
}
</script>

<style lang="css">
</style>
