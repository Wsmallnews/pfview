<template lang="html">
    <div class="categorys-index">
        <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset" :no-search="true" >
            <template slot="formBtn" >
                <Button type="primary" @click="jumpPage({ path: '/productManage/categorys/add' })">添加分类</Button>
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
                listConf: {
                    url: "/adminapi/shopProductCategorys",
                    searchParams: {
                        name : ""
                    },
                    item: [],
                    columns: [
                        { title: 'ID', align: "center", key: 'id', width: 100, fixed: 'left'},
                        { title: '分类名称', key: 'name' },
                        { title: '上级分类', key: 'parent_name', render:(h, params) => {
                            if(params.row.parent != null){
                                return h('span',params.row.parent.name);
                            } else {
                                return "--";
                            }
                        }},
                        { title: '排序', key: 'sort_order' },
                        { title: '添加时间', key: 'created_at' },
                        { title: '修改时间', key: 'updated_at' },
                        { title: '操作', key: 'updated_at', align:'center',render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'ios-brush'
                                    },
                                    style: {
                                        marginRight: '5px',
                                        marginBottom: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            var id = params.row.id;
                                            this.jumpPage({path: '/productManage/categorys/edit/' + id});
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
                                            this.deleteId = params.row.id;

                                            this.$Modal.confirm({
                                                'title': '提示',
                                                'content': '确定要删除吗',
                                                'onOk': this.catDelete
                                            })
                                        }
                                    }
                                }),
                            ]);
                        }},
                    ]
                },
                deleteId: 0,
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
            catDelete: function () {
                var _this = this;

                Util.ajax({
                    url: '/adminapi/shopProductCategorys/' + _this.deleteId,
                    method: 'delete',
                    success: function(result){
                        if (result.error == 0) {
                            _this.$Notice.success({title: '提示', desc: '删除成功'});
                            _this.$router.push({name: 'adminmanage-category-index'});
                        }else {
                            _this.$Notice.error({title: '提示', desc: result.info});
                        }
                    }
                });
            }
        },
        created: function () {

        },
        mounted: function (){
        }
    }
</script>

<style lang="css">
</style>
