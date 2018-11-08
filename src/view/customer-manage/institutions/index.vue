<template lang="html">
    <div class="roles-index">
        <myTable ref="listTable" :listConf="listConf" @select="selectRow" @searchReset="searchReset">
            <template slot="formItem" >
                <Form-item prop="name">
                    <Input type="text" v-model="listConf.searchParams.name" placeholder="搜索机构名称" ></Input>
                </Form-item>

                <Form-item prop="seller_id">
    				<Select v-model="listConf.searchParams.seller_id" placeholder="选择销售">
    	                <Option v-for="item in sellers" :value="item.id" :key="item.id">{{ item.name }} - {{ item.phone }}</Option>
    	            </Select>
                </Form-item>
            </template>
            <template slot="formBtn" slot-scope="params">
                <Button type="primary" @click="jumpPage({ path: '/customerManage/institutions/add' })">添加机构</Button>
                <Button type="primary" @click="showCustomers">查看机构客户</Button>

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
            sellers: [],
            currentRow: {},
            listConf: {
                url: '/adminapi/institutions',
                searchParams: {
                    name: '',
                    seller_id: ''
                },
                item: [],
                columns: [
                    { title: 'ID', key: 'id', width: 100, fixed: 'left', align: 'center' },
                    { title: '机构名称', align: 'center', key: 'name' },
                    { title: '所属销售', align: 'center', key: 'sellername', render: (h, params) => {
                        return params.row.seller ? h('span', params.row.seller.name + '-' + params.row.seller.phone) : h('span', '')
                    }},
                    { title: '所在地区', align: 'center', key: 'region_name', render: (h, params) => {
                        var region_name = ''
                        var first = true
                        for (let region of params.row.region_name_arr) {
                            if (first) {
                                region_name += region
                            } else {
                                region_name += '-' + region
                            }
                            first = false
                        }
                        return h('span', region_name)
                    }},
                    { title: '联系电话', align: 'center', key: 'contact_phone' },
                    { title: '地址', align: 'center', key: 'address' },
                    { title: '操作', key: 'action', width: 120, align: 'center', fixed: 'right',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        icon: 'md-brush'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            var id = params.row.id
                                            this.jumpPage('/customerManage/institutions/edit/' + id)
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
                                            this.deleteId = params.row.id

                                            this.$Modal.confirm({
                                                'title': '提示',
                                                'content': '确定要删除吗？删除之后不可恢复!',
                                                'onOk': this.doDelete
                                            })
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
        showCustomers() {
            if (this.currentRow.id == undefined || this.currentRow.id == null || this.currentRow.id == '') {
                this.$Notice.error({
                    title: '提示',
                    desc: '请先选择一条记录'
                })
                return false
            }
            this.$router.push('/customerManage/customers/index/' + this.currentRow.id)
        },
        doDelete() {
            let _this = this
            Util.ajax({
                url: '/adminapi/institutions/' + _this.deleteId,
                method: 'delete',
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
                    return index > 0 && index <= 5;
                },
                dataCB: function (item, index, data) {
                    item.sellername = item.seller ? item.seller.name + '-' + item.seller.phone : '';

                    var region_name = ''
                    var first = true
                    for (let region of item.region_name_arr) {
                        if (first) {
                            region_name += region
                        } else {
                            region_name += '-' + region
                        }
                        first = false
                    }

                    item.region_name = region_name;

                    return item;
                },
            });
        }
    },
    created: function() {
        var _this = this
        Util.ajax({
            url: '/adminapi/sellers/all',
            method: 'get',
            success: function(result) {
                if (result.error == 0) {
                    _this.sellers = result.result
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
