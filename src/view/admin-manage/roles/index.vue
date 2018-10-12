<template lang="html">
    <div class="roles-index">
        <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset" :no-search="true">
            <template slot="formBtn" >
                <Button type="primary" @click="jumpPage({ path: '/adminManage/roles/add' })">添加角色</Button>
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
                    url: "/adminapi/roles",
                    searchParams: {
                    },
                    item: [],
                    columns: [
                        {title: 'ID', key: 'id', width: 100, fixed: 'left',align:'center'},
                        {title: '角色名称', align: 'center', key: 'name'},
                        {title: '角色标识', align: 'center', key: 'guard_name'},
                        {title: '操作', key: 'action', width:200, align: 'center',fixed:'right',
                            render: (h, params) => {
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small',
                                            icon: 'ios-brush'
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                var id = params.row.id;
                                                this.jumpPage("/adminManage/roles/edit/" + id );
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
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                var id = params.row.id;
                                                this.jumpPage("/adminManage/roles/givePerm/"+ id);
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
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                this.deleteId = params.row.id;

                                                this.$Modal.confirm({
                                                    'title': '提示',
                                                    'content': '确定要删除吗？删除之后不可恢复!',
                                                    'onOk': this.doDelete
                                                })
                                            }
                                        }
                                    })
                                ]);
                            },
                        }
                    ]
                },
                deleteId: 0
            }
        },
        methods: {
            selectRow: function(index){
                this.currentRow = index;
            },
            searchReset: function (originParams) {
                this.listConf.searchParams = Util.extend(this.listConf.searchParams, originParams);
            },
            jumpPage: function (path) {
                this.$router.push(path);
            },
            doDelete(){
                let _this = this;
                Util.ajax({
                    url: '/adminapi/roles/' + _this.deleteId,
                    method: 'delete',
                    success: function (result){
                        if(result.error == 0){
                            _this.$Notice.success({ title: '提示', desc: '删除成功' });
                            _this.$refs.listTable.listLoad();
                        }else{
                            _this.$Notice.error({ title: '提示', desc: result.info });
                        }
                    }
                });
            },
        },
        created: function () {

        },
        mounted: function (){
        },
		computed: {
            // is_list () {
            //     return this.$route.name == 'products-list';
            // }
        },
    }
</script>

<style lang="css">
</style>
