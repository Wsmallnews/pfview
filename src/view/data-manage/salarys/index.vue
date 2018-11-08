<template lang="html">
    <div class="salarys-index">
        <myTable ref="listTable" :listConf="listConf" :border="true" @select="selectRow" @searchReset="searchReset">
            <template slot="formItem" >
                <Form-item prop="keyword">
                    <Input type="text" v-model="listConf.searchParams.keyword" placeholder="搜索销售姓名/手机号" ></Input>
                </Form-item>
                <Form-item prop="month">
                    <DatePicker v-model="listConf.searchParams.month" type="month" @on-change="salaryMonth" placeholder="搜索工资月份"></DatePicker>
                </Form-item>
            </template>

            <template slot="formBtn" slot-scope="params">
                <Button type="primary" @click="jumpPage({ path: '/dataManage/salarys/add' })"><Icon type="plus-round"></Icon>工资录入</Button>
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
                url: '/adminapi/salarys',
                searchParams: {
                    keywords: '',
                    month: ''
                },
                item: [],
                columns: [
                    { type: 'index', align: 'center', width: 100, fixed: 'left' },
                    { title: '所属销售', align: 'center', width: 100, key: 'sellername', render: (h, params) => {
                        return params.row.seller ? h('span', params.row.seller.name + '-' + params.row.seller.phone) : h('span', '')
                    }},
                    { title: '部门', align: 'center', width: 100, key: 'department' },
                    { title: '岗位', align: 'center', width: 100, key: 'job' },
                    { title: '工资月份', align: 'center', width: 100, key: 'month' },

                    { title: '应发金额', align: 'center', children: [
                        { title: '基本工资', align: 'center', width: 100, key: 'base_salary' },
                        { title: '绩效考核', align: 'center', width: 100, key: 'achievement_salary' },
                        { title: '车/饭补贴', align: 'center', width: 100, key: 'subsidy_salary' },
                        { title: '其他加班费', align: 'center', width: 100, key: 'other_overtime_salary' },
                        { title: '国定加班费', align: 'center', width: 100, key: 'overtime_salary' },
                        { title: '独生子女费', align: 'center', width: 100, key: 'one_child_salary' },
                        { title: '其他津贴', align: 'center', width: 100, key: 'other_allowance_salary' },
                        { title: '放射津贴', align: 'center', width: 100, key: 'radiate_allowance_salary' },
                        { title: '补发', align: 'center', width: 100, key: 'reissue_salary' },
                        { title: '其他工资', align: 'center', width: 100, key: 'other_salary' },
                        { title: '经济补偿金', align: 'center', width: 100, key: 'economy_salary' },
                        { title: '应发工资合计', align: 'center', width: 100, key: 'should_salary' },
                    ]},

                    { title: '应扣金额', align: 'center', children: [
                        { title: '养老金', align: 'center', width: 100, key: 'pension_salary' },
                        { title: '医疗金', align: 'center', width: 100, key: 'medical_salary' },
                        { title: '失业金', align: 'center', width: 100, key: 'unemploy_salary' },
                        { title: '公积金', align: 'center', width: 100, key: 'accumulation_salary' },
                        { title: '病假扣款', align: 'center', width: 100, key: 'ill_salary' },
                        { title: '事假扣款', align: 'center', width: 100, key: 'thing_salary' },
                        { title: '其他扣款', align: 'center', width: 100, key: 'other_reduce_salary' },
                        { title: '应纳税额', align: 'center', width: 100, key: 'tax_salary' },
                        { title: '个税', align: 'center', width: 100, key: 'personal_tax_salary' },
                        { title: '扣款合计', align: 'center', width: 100, key: 'reduce_salary' },
                    ]},

                    { title: '实发工资金额', align: 'center', width: 100, key: 'salary' },

                    { title: '备注', align: 'center', width: 100, key: 'remark' },
                    { title: '添加时间', align: 'center', width: 100, key: 'created_at' },
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
                                        this.jumpPage('/dataManage/salarys/edit/' + id)
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
        salaryMonth(date, value) {
            this.listConf.searchParams.month = date;
        },
        deleteConf: function(id) {
            var _this = this
            _this.$Modal.confirm({
                title: '提示',
                content: '确定删除吗？删除之后不可恢复!',
                onOk: function() {
                    _this.salaryDel(id)
                },
                onCancel: function() {
                    _this.$Notice.error({
                        title: '提示',
                        desc: '操作取消'
                    })
                }
            })
        },
        salaryDel(id) {
            var _this = this
            Util.ajax({
                url: '/adminapi/salarys/' + id,
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
                    return index > 0 && index <= 9;
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
