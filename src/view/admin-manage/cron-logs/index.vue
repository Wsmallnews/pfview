<template lang="html">
    <div class="cron-logs-index">
        <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset">
            <template slot="formItem">
                <Form-item prop="cycle">
                    <Select v-model="listConf.searchParams.types" placeholder="cron 类型">
                        <Option v-for="item in types" :value="item.value" :key="item.value">{{ item.name }}</Option>
                    </Select>
                </Form-item>

                <Form-item prop="dateRange">
                    <Date-Picker @on-change="dateHandle" v-model="listConf.searchParams.datePicker" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" placement="right-start" placeholder="检索时间范围" style="width: 400px"></Date-Picker>
                </Form-item>
            </template>
        </myTable>
    </div>
</template>

<script>
    import Util from '@/libs/util';
    import myTable from '@/view/includes/myTable';

    export default {
        components: {
            myTable
        },
        data () {
            return {
                currentRow:{},
                types: [],
                listConf: {
                    url: "/adminapi/cronLogs",
                    searchParams: {
                        dateRange: [],
                        datePicker: [],
                    },
                    item: [],
                    columns: [
                        {type: 'index', align: 'center', width:100, fixed: 'left'},
                        {title: '类型', align: 'center', width: 250, key: 'type_name'},
                        {title: '执行结果', align: 'left', minWidth: 250, key: 'data_arr'},
                        {title: '开始时间', align: 'center', width: 250, key: 'start_at'},
                        {title: '结束时间', align: 'center', width: 250, key: 'end_at'},
                        {title: '添加时间', align: 'center', width: 200, key: 'created_at'}
                    ]
                }
            }
        },
        methods: {
            selectRow: function(index){
                this.currentRow = index;
            },
            searchReset: function (originParams) {
                this.listConf.searchParams = Util.extend(this.listConf.searchParams, originParams);
            },
            dateHandle:function(range){
                this.listConf.searchParams.dateRange[0] = range[0] != ""  ? range[0] : null;
                this.listConf.searchParams.dateRange[1] = ( ( range[1] == "") || (range[1] == undefined) ) ? null : range[1] ;
            },
            jumpPage: function (path) {
                this.$router.push(path);
            },
        },
        created: function () {
            var _this = this;
            Util.ajax({
                url: '/adminapi/cronLogs/typeAll',
                method: 'get',
                success: function(result) {
                    if (result.error == 0) {
                        _this.types = result.result;
                    } else {
                        _this.$Notice.error({ title: '提示', desc: result.info })
                    }
                }
            })
        },
        mounted: function (){
        },
    }
</script>

<style lang="css">
</style>
