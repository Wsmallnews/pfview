<template lang="html">
    <div class="products-index">
        <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset">
            <template slot="formItem" >
                <Form-item prop="name">
                    <Input type="text" v-model="listConf.searchParams.name" placeholder="搜索产品名称" ></Input>
                </Form-item>

                <Form-item prop="category_id">
                    <Cascader :data="catList" v-model="listConf.searchParams.category_id" change-on-select></Cascader>
                </Form-item>
            </template>
            <template slot="formBtn" v-if="is_list">
                <Button type="primary" @click="jumpPage({ path: '/productManage/products/add' })">添加产品</Button>
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
                    url: "/adminapi/shopProducts" + (this.$route.name == 'productmanage-products-index' ? "" : "/trashIndex"),
                    searchParams: {
                        name : "",
                        category: []
                    },
                    // rowClass: [
                    //     {name: 'check_status', value: 0, type: 'disabled'}
                    // ],
                    item: [],
                    columns: [
                        { title: 'ID', align: "center", key: 'id', width: 100, fixed: 'left'},
                        { title: '产品名称', key: 'name', width: 200 },
                        { title: '分类', key: 'category_name', width: 120, render:(h, params) => {
                            if(params.row.category != null){
                                return h("span", params.row.category.name);
                            }
                        }},
                        { title: '产品类型', key: 'type_name', width: 100 },
                        { title: '图片', key: 'image', width: 100, render:(h, params) => {
                            return h('div', [
                                h('img', {
                                    attrs: {
                                        src: params.row.image, style: 'width: 50px; height: 50px;border-radius: 2px;'
                                    }
                                }),
                            ]);
                        }},
                        { title: '原价', key: 'origin_price', width: 100 },
                        { title: '现价', key: 'price', width: 100},
                        { title: '销量', key: 'sale_num', width: 100},
                        { title: '上架', key: 'is_on_sale', width: 100, render:(h, params)=>{
                            return h('div', [
                                h('i-switch', {
                                    props:{
                                        value: params.row.is_on_sale,
                                        size: "large",
                                        'true-value': 1,
                                        'false-value': 0
                                    },
                                    on: {
                                        'on-change': (is_on_sale) => {
                                            var _this = this;
                                            var id = params.row.id;
                                            _this.setOnSale(id, is_on_sale);
                                        }
                                    }
                                })
                            ]);
                        }},
                        { title: '推荐', key: 'is_recommend', width: 100, render:(h, params)=>{
                            return h('div', [
                                h('i-switch', {
                                    props:{
                                        value: params.row.is_recommend,
                                        size: "large",
                                        'true-value': 1,
                                        'false-value': 0
                                    },
                                    on: {
                                        'on-change': (is_recommend) => {
                                            var _this = this;
                                            var id = params.row.id;
                                            _this.setRecommend(id, is_recommend);
                                        }
                                    }
                                })
                            ]);
                        }},
                        { title: '特价', key: 'is_special', width: 100, render:(h, params)=>{
                            return h('div', [
                                h('i-switch', {
                                    props:{
                                        value: params.row.is_special,
                                        size: "large",
                                        'true-value': 1,
                                        'false-value': 0
                                    },
                                    on: {
                                        'on-change': (is_special) => {
                                            var _this = this;
                                            var id = params.row.id;
                                            _this.setSpecial(id, is_special);
                                        }
                                    }
                                })
                            ]);
                        }},
                        // { title: '审核状态', key: 'check_status_name', width: 100 },
                        { title: '排序', key: 'sort_order', width: 100 },
                        { title: '添加时间', key: 'created_at', width: 150},
                        { title: '修改时间', key: 'updated_at', width: 150},
                        { title: '操作', key: 'oper', fixed:'right',align:'center', width: 120, render: (h, params) => {
                            if (this.is_list) {
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
                                                this.jumpPage({path: '/productManage/products/edit/' + id});
                                            }
                                        }
                                    }),
                                    h('Button', {
                                        props: {
                                            type: 'error',
                                            size: 'small',
                                            icon: 'md-trash'
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
                                                    'content': '确定要放入回收站吗？',
                                                    'onOk': this.productDelete
                                                })
                                            }
                                        }
                                    }),
                                ]);
                            } else {
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small',
                                            icon: 'md-share-alt'
                                        },
                                        style: {
                                            marginRight: '5px',
                                            marginBottom: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                this.restoreId = params.row.id;

                                                this.$Modal.confirm({
                                                    'title': '提示',
                                                    'content': '确定要恢复吗',
                                                    'onOk': this.productRestore
                                                })
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
                                                this.fDeleteId = params.row.id;

                                                this.$Modal.confirm({
                                                    'title': '提示',
                                                    'content': '确定要彻底删除吗？删除之后不可恢复',
                                                    'onOk': this.productForceDelete
                                                })
                                            }
                                        }
                                    }),
                                ]);
                            }
                        }},
                    ]
                },
                deleteId: 0,
                restoreId: 0,
                fDeleteId: 0,
                catList: [],
            }
        },
        computed: {
            is_list () {
                return this.$route.name == 'productmanage-products-index';
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
            setOnSale (id, is_on_sale) {
                var _this = this;

                Util.ajax({
                    url: '/adminapi/shopProducts/' + id + '/setOnSale',
                    method: 'patch',
                    data: {is_on_sale: is_on_sale},
                    success: function(result){
                        if (result.error == 0) {
                            _this.$Notice.success({title: '提示', desc: '操作成功'});
                            _this.$refs.listTable.listLoad();
                        }else {
                            _this.$Notice.error({title: '提示', desc: result.info});
                        }
                    }
                });
            },
            setRecommend (id, is_recommend) {
                var _this = this;

                Util.ajax({
                    url: '/adminapi/shopProducts/' + id + '/setRecommend',
                    method: 'patch',
                    data: {is_recommend: is_recommend},
                    success: function(result){
                        if (result.error == 0) {
                            _this.$Notice.success({title: '提示', desc: '操作成功'});
                            _this.$refs.listTable.listLoad();
                        }else {
                            _this.$Notice.error({title: '提示', desc: result.info});
                        }
                    }
                });
            },
            setSpecial (id, is_special) {
                var _this = this;

                Util.ajax({
                    url: '/adminapi/shopProducts/' + id + '/setSpecial',
                    method: 'patch',
                    data: {is_special: is_special},
                    success: function(result){
                        if (result.error == 0) {
                            _this.$Notice.success({title: '提示', desc: '操作成功'});
                            _this.$refs.listTable.listLoad();
                        }else {
                            _this.$Notice.error({title: '提示', desc: result.info});
                        }
                    }
                });
            },
            productDelete: function () {
                var _this = this;

                Util.ajax({
                    url: '/adminapi/shopProducts/' + _this.deleteId,
                    method: 'delete',
                    success: function(result){
                        if (result.error == 0) {
                            _this.$Notice.success({title: '提示', desc: '删除成功'});
                            _this.$refs.listTable.listLoad();
                        }else {
                            _this.$Notice.error({title: '提示', desc: result.info});
                        }
                    }
                });
            },
            productRestore: function () {
                var _this = this;

                Util.ajax({
                    url: '/adminapi/shopProducts/' + _this.restoreId + "/restore",
                    method: 'patch',
                    success: function(result){
                        if (result.error == 0) {
                            _this.$Notice.success({title: '提示', desc: '恢复成功'});
                            _this.$refs.listTable.listLoad();
                        }else {
                            _this.$Notice.error({title: '提示', desc: result.info});
                        }
                    }
                });
            },
            productForceDelete: function () {
                var _this = this;

                Util.ajax({
                    url: '/adminapi/shopProducts/' + _this.fDeleteId + "/forceDelete",
                    method: 'delete',
                    success: function(result){
                        if (result.error == 0) {
                            _this.$Notice.success({title: '提示', desc: '彻底删除成功'});
                            _this.$refs.listTable.listLoad();
                        }else {
                            _this.$Notice.error({title: '提示', desc: result.info});
                        }
                    }
                });
            },
        },
        created: function () {
            var _this = this;

            Util.ajax({
                url: '/adminapi/shopProductCategorys/catAll',
                method: 'get',
                data: {only_top: 0},
                success: function(result){
                    if (result.error == 0) {
                        _this.catList = result.result;
                    }else {
                        _this.$Notice.error({title: '提示', desc: result.info});
                    }
                }
            });
        },
        mounted: function (){

        }
    }
</script>

<style lang="css">
</style>
