<template lang="html">
    <div class="admin-logs-index">
        <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset">
            <template slot="formItem">
                <Form-item prop="phone">
                    <Input type="text" v-model="listConf.searchParams.phone" placeholder="管理员手机号"></Input>
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
                listConf: {
                    url: "/adminapi/adminLogs",
                    searchParams: {
                        phone: "",
                        dateRange: [],
                        datePicker: [],
                    },
                    item: [],
                    columns: [
                        {type: 'index', align: 'center', width:100, fixed: 'left'},
                        {title: '管理员', align: 'center', width: 250, key: 'admin', render:(h, params)=>{
                            return params.row.admin ? h('span', params.row.admin.name +'-'+ params.row.admin.phone) : h('span', '');
                        }},
                        {title: '操作', align: 'left', minWidth: 250, key: 'log_info'},
                        {title: 'ip地址', align: 'center', width: 250, key: 'ip_address'},
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

        },
        mounted: function (){
        },
    }
</script>

<style lang="css">
</style>
