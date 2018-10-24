<template lang="html">
    <div class="weeks-index">
        <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset">
            <template slot="formItem" >
                <Form-item prop="year">
                    <DatePicker :value="listConf.searchParams.year" type="year" placeholder="选择年份" @on-change="selectYear" style="width: 200px"></DatePicker>
                </Form-item>
                <Form-item prop="week_type">
                    <Select v-model="listConf.searchParams.week_type" placeholder="选择类型">
                        <Option value="0" key="" selected>全部</Option>
                        <Option v-for="item in week_types" :value="item.value" :key="item.value">{{ item.name }}</Option>
                    </Select>
                </Form-item>
            </template>

            <template slot="formBtn" >
                <Button type="primary" @click="setWeeks"><Icon type="plus-round"></Icon>定义</Button>
            </template>
        </myTable>
    </div>
</template>

<script>
import Util from '@/libs/util'
import myTable from '@/view/includes/myTable'
import myTableEdit from '@/view/includes/myTableEdit.vue'

export default {
    components: {
        myTable,
        myTableEdit
    },
    data() {
        return {
            currentRow: {},
            week_types: [],
            edittingCellId:'',          // 当前编辑的单元格
            listConf: {
                url: '/adminapi/weeks',
                searchParams: {
                    year: '',
                    week_type: '0'
                },
                item: [],
                columns: [
                    { type: 'index', align: 'center', fixed: 'left' },
                    { title: '季度', align: 'center', key: 'quartername', render: (h, params) => {
                        return h('span', "第 " + params.row.quarter + " 季度")
                    }},
                    { title: '月份', align: 'center', key: 'monthname', render: (h, params) => {
                        return h('span', "第 " + params.row.month + " 月")
                    }},
                    { title: '周期', align: 'center', key: 'weekname', render: (h, params) => {
                        return h('span', "第 " + params.row.week + " 周")
                    }},
                    { title: '周类型', align: 'center', key: 'week_type_name', width: 200, render: (h, params) => {
                        var name = params.row.week_type_name;
                        var value = params.row.week_type;
                        return h(myTableEdit, {
                            props: {
                                params: params,
                                name: name,
                                value: value,
                                edittingCellId: this.edittingCellId,
                                editable: true,
                                options: this.week_types
                            },
                            on: {
                                'input': val => {
                                    this.edittingVal = val
                                },
                                'on-start-edit': (params) => {
                                    this.edittingCellId = `editting-${params.index}-${params.column.key}`
                                    // this.$emit('on-start-edit', params)
                                },
                                'on-cancel-edit': (params) => {
                                    this.edittingCellId = ''
                                    // this.$emit('on-cancel-edit', params)
                                },
                                'on-save-edit': (params) => {
                                    this.editWeek(params, this.edittingVal)
                                    // this.value[params.row.initRowIndex][params.column.key] = this.edittingText
                                    // this.$emit('input', this.value)
                                    // this.$emit('on-save-edit', Object.assign(params, {
                                    //     value: this.edittingText
                                    // }))
                                    this.edittingCellId = ''
                                }
                            }
                        })
                    }},
                    { title: '开始时间', align: 'center', key: 'start_at_date' },
                    { title: '结束时间', align: 'center', key: 'end_at_date' },
                    { title: '天数', align: 'center', key: 'weekname', render: (h, params) => {
                        return h('span', params.row.days + " 天")
                    }},
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
        selectYear: function (year) {
            this.listConf.searchParams.year = year;
        },
        setWeeks: function () {
            var _this = this;
            var myDate = new Date(_this.listConf.searchParams.year)
            var year = myDate.getFullYear();

            Util.ajax({
                url: '/adminapi/weeks/setWeeks',
                method: 'post',
                data: {year: year},
                success: function(result) {
                    if (result.error == 0) {
                        _this.$Notice.success({
                            title: '提示',
                            desc: "定义成功"
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
        editWeek: function (params, val) {
            var _this = this;

            if (params != undefined && params.row != undefined) {
                var data = {week_type: val};
                Util.ajax({
                    url: '/adminapi/weeks/' + params.row.id,
                    method: 'patch',
                    data: data,
                    success: function(result) {
                        if (result.error == 0) {
                            _this.$Notice.success({ title: '提示', desc: "定义成功" })
                            _this.$refs.listTable.listLoad()
                        } else {
                            _this.$Notice.error({ title: '提示', desc: result.info })
                        }
                    }
                })
            } else {
                _this.$Notice.error({ title: '提示', desc: "参数错误" })
            }
        }
    },
    created: function() {
        var _this = this
        var myDate = new Date();
        var year = myDate.getFullYear();
        var month = myDate.getMonth();

        // 如果月份为 1,2月，则年份为上一年
        if (month >= 0 && month < 2) {
            year = year - 1;
        }
        this.listConf.searchParams.year = year.toString();

        Util.ajax({
            url: '/adminapi/weeks/weekTypeAll',
            method: 'get',
            success: function(result) {
                if (result.error == 0) {
                    _this.week_types = result.result;
                } else {
                    _this.$Notice.error({ title: '提示', desc: result.info })
                }
            }
        })
    },
    mounted: function() {}
}
</script>

<style lang="css">
</style>
