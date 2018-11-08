<template>
    <div class="table-index">
        <Form ref="search" inline v-if="!noSearch">
            <slot name="formItem" >

            </slot>

            <Form-item>
                <Button type="primary" icon="ios-search" @click="listSearch()">搜索</Button>
                <Button @click="listSearchReset()" style="margin-left: 8px">重置</Button>
            </Form-item>
        </Form>

        <div class="oper_div">
            <slot name="formBtn" :exportLoading="exportLoading">

            </slot>
        </div>

        <Table
            ref="table"
            :row-class-name="rowClassName"
            :loading="loading"
            :highlight-row="lighlightRow"
            :border="border"
            :stripe="stripe"
            :columns="cListConf.columns"
            :data="item"
            @on-row-click="listSelect"
            @on-sort-change="listChangeSort"
            >
        </Table>

        <div style="margin: 10px;overflow: hidden" v-if="pagestatus">
            <div style="float: right;">
                <Page
                    :total="total"
                    :current="current"
                    :page-size="cListConf.pageSize"
                    :show-elevator="showElevator"
                    :page-size-opts="pageSizeOpts"
                    :show-sizer="showSizer"
                    :show-total="showTotal"
                    @on-change="listChangePage"
                    @on-page-size-change="listChangeSize"
                    >
                </Page>
            </div>
        </div>
    </div>
</template>
<script>
/**
 * myTable 接口文档
 * author: smallnews
 * props {
 *      listConf: {
 *          url:    接口地址
 *          searchParams: 搜索条件
 *          rowClass: 根据状态显示对应的字体颜色
 *          columns:    列表所有字段
 *      }
 *      noSearch:     是否有搜索框
 *      isHandStart:  是否手动加载第一页
 * }
 *
 * event: {
 *      setTotal: 加载第一页的时候 返回 总条数
 *      searchReset: 重置事件
 *      select: 选择一行的事件
 * }
 */


    import Util from '@/libs/util';

    export default {
        props: {
            listConf: {
                default: function () {
                    return {};
                }
            },
            noSearch: {
                default: false
            },
            isHandStart: {
                default: false
            },
            pagestatus: {
                default: true
            },
            border: {
                default: false
            }
        },
        data () {
            return {
                loading: false,
                lighlightRow: true,
                // border: false,
                stripe: true,
                showSizer: true,    // 显示每页条数下拉框
                showTotal: true,
                showElevator: true,
                pageSizeOpts: [10, 30, 50, 100],
                defaultListConf: {
                    url: "",
                    pageSize: 10,
                    searchParams: {},
                    rowClass: []
                },
                originSearchParams: {},
                item: [],
                total: 0,
                current: 1,
                queryParams: {},
                onePage: false,
                exportLoading: false
            }
        },
        computed: {
            cListConf () {
                return Util.extend(this.defaultListConf, this.listConf);
            },
            rowClass () {
                return this.listConf.rowClass != undefined ? this.listConf.rowClass : [];
            }
        },
        methods: {
            listInit: function (){
                var _this = this;

                _this.queryParams['page'] = 1;
                _this.queryParams['page_size'] = _this.cListConf['pageSize'];

                _this.listLoad();
            },
            listLoadData: function (cb) {         // 只获取数据
                var _this = this;
                _this.listBaseRequest(cb);
            },
            listLoad: function () {      // 加载列表
                var _this = this;

                if (_this.loading) {    // 如果正在加载，返回
                    return;
                }

                _this.loading = true;
                _this.listBaseRequest(function(result){
                    if (!result.error){
                        _this.loading = false;
                        var data = result.result;
                        _this.total = data.total;
                        if (data.current_page == 1) {
                            _this.$emit('setTotal', data.total);
                        }

                        _this.current = data.current_page;

                        _this.onePage = _this.total <= _this.cListConf.pageSize;

                        _this.item = data.data;
                    }
                })
            },
            listBaseRequest: function (cb) {      // ajax 请求
                var _this = this;

                Util.extend(_this.queryParams, _this.cListConf['searchParams']);
                Util.ajax({
                    url: _this.cListConf['url'],
                    data : _this.queryParams,
                    method:'get',
                    success: function (result){
                        if (cb != undefined) {
                            cb(result);
                            return true;
                        }else {
                            return result;
                        }
                    }
                });
            },
            listSearch: function(){         // 上下页
                var _this = this;

                _this.queryParams['page'] = 1;
                _this.listLoad();
            },
            listSearchReset () {                // 表单数据重置, name ,表单数据
                var _this = this;
                this.$emit('searchReset', this.originSearchParams);
            },
            listChangePage: function(page){         // 上下页
                var _this = this;

                _this.queryParams['page'] = page;
                _this.listLoad();
            },
            listChangeSize: function(size){         // 每页条数
                var _this = this;

                _this.queryParams['page'] = 1;
                _this.queryParams['page_size'] = size;
                _this.listLoad();
            },
            listChangeSort: function (sort) {
                var _this = this;

                _this.queryParams['page'] = 1;
                _this.queryParams['sort'] = sort.key;
                _this.queryParams['order'] = sort.order;
                _this.listLoad();
            },
            listSelect: function(index){
                this.$emit('select', index);
            },
            rowClassName (row, index) {
                for (let item of this.rowClass) {
                    if (row[item.name] == item.value) {
                        return 'table-' + item.type + '-row';
                    }
                }

                return "";
            },
            exportCsv: function (options, opt = {}) {
                var route = this.$route;
                var columnsCB = options.columnsCB;
                var dataCB = options.dataCB;

                delete options.columnsCB;
                delete options.dataCB;

                var data = this.item;


                var defaultOptions = {
                    filename: route.meta != undefined ? (route.meta.title ? route.meta.title : '导出数据') : '导出数据',
                    original: true,
                    columns: columnsCB != undefined ? this.cListConf.columns.filter(columnsCB) : this.cListConf.columns,
                }

                // opt 里面不能包含 data
                defaultOptions = Util.extend(defaultOptions, opt)

                // 全部数据
                if (options.isAll) {
                    this.exportLoading = true;
                    var oldPageSize = this.queryParams['page_size'];
                    this.queryParams['page_size'] = 99999999999;

                    this.listLoadData((result) => {
                        this.exportLoading = false;

                        if (!result.error){
                            // 将 page_size 还原
                            this.queryParams['page_size'] = oldPageSize;
                            var data = result.result;
                            var item = data.data;

                            defaultOptions.data = dataCB != undefined ? item.filter(dataCB) : item;
                            this.$refs.table.exportCsv(defaultOptions);
                        }
                    });
                } else {
                    defaultOptions.data = dataCB != undefined ? this.item.filter(dataCB) : this.item;
                    this.$refs.table.exportCsv(defaultOptions);
                }
            }
        },
        created: function () {
            if (!this.isHandStart) {
                this.listInit();
            }
        },
        mounted: function (){
            // 复制 搜索初始值
            this.originSearchParams = JSON.parse(JSON.stringify(this.listConf.searchParams));
        }
    };
</script>

<style scoped>
.oper_div{
	margin-bottom: 20px;
}
.ivu-table-header{
	color: #FFFFFF !important;
}
.oper_div button {
    margin: 0 5px;
}

.oper_div .ivu-btn-group {
    margin: 0 5px;
}
</style>

<style>
.ivu-table .table-info-row td{
    color: #2db7f5;
}
.ivu-table .table-error-row td{
    color: #ed3f14;
}
.ivu-table .table-warning-row td{
    color: #ff6600;
}
.ivu-table .table-disabled-row td{
    color: #929292;
}
</style>
