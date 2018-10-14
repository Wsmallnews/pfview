<template>
    <Form class="form-edit" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
        <Alert show-icon>
            填写说明
            <template slot="desc">
                <!-- 产品类型：优惠券类型必须先添加至少一张优惠券； -->
                是否虚拟：虚拟产品没有发货流程，用户购买成功直接订单完成；
                推荐的产品才会在店铺详情显示
            </template>
        </Alert>

        <Menu mode="horizontal" theme="light" :active-name="activeName" @on-select="switchItem">
            <menu-item name="basic">基础信息</menu-item>
            <menu-item name="content">产品详情</menu-item>
            <menu-item name="stock_spec">库存/规格</menu-item>
            <menu-item name="attribute">产品属性</menu-item>
        </Menu>

        <div name="basic" v-show="activeName == 'basic'">
            <FormItem label="产品名称" prop="name">
                <Input v-model="formValidate.name" placeholder="请填写名称"></Input>
            </FormItem>
            <FormItem label="分类" prop="category_id">
                <Cascader :data="categoryList" v-model="formValidate.category_id" change-on-select></Cascader>
            </FormItem>
            <FormItem label="产品类型" prop="type" required>
                <RadioGroup v-model="formValidate.type" @on-change="typeChange">
                    <Radio label="show">普通</Radio>
                    <!-- <Radio label="coupon">优惠券</Radio> -->
                </RadioGroup>
            </FormItem>
            <FormItem label="是否虚拟" prop="is_virtual">
                <i-switch v-model="formValidate.is_virtual" :true-value="1" :false-value="0" :disabled="true" ></i-switch>
            </FormItem>
            <FormItem label="相册" prop="images" required>
                <my-upload ref="images" :data="uploadData" :multiple="true" :defaultImgs="formValidate.images"></my-upload>
            </FormItem>
            <FormItem label="原价" prop="origin_price">
                <!-- <Input v-model="formValidate.origin_price" placeholder="请填写原价"></Input> -->
                <InputNumber v-model="formValidate.origin_price" placeholder="请填写原价"></InputNumber>
            </FormItem>
            <FormItem label="现价" prop="price">
                <!-- <Input v-model="formValidate.price" placeholder="请填写现价"></Input> -->
                <InputNumber v-model="formValidate.price" placeholder="请填写现价"></InputNumber>
            </FormItem>
            <FormItem label="产品描述" prop="desc">
                <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 4,maxRows: 5}" placeholder=""></Input>
            </FormItem>
            <FormItem label="上架状态" prop="is_on_sale">
                <i-switch v-model="formValidate.is_on_sale" :true-value="1" :false-value="0"></i-switch>
            </FormItem>
            <FormItem label="推荐状态" prop="is_recommend">
                <i-switch v-model="formValidate.is_recommend" :true-value="1" :false-value="0"></i-switch>
            </FormItem>
            <FormItem label="特价状态" prop="is_special">
                <i-switch v-model="formValidate.is_special" :true-value="1" :false-value="0"></i-switch>
            </FormItem>
            <FormItem label="排序" prop="sort_order">
                <Input v-model="formValidate.sort_order" placeholder="数字越小，优先级越高"></Input>
            </FormItem>
        </div>

        <div name="content" v-show="activeName == 'content'">
            <FormItem label="产品详情" prop="content">
                <my-photo ref="content" :data="uploadData" :multiple="true" :defaultImgs="formValidate.content"></my-photo>
            </FormItem>
        </div>

        <div name="stock_spec" v-show="activeName == 'stock_spec'">
            <FormItem label="库存" prop="stock">
                <Input v-model="formValidate.stock" placeholder="库存" :disabled="formValidate.start_spec"></Input>
            </FormItem>
            <FormItem label="库存变动" prop="stock_time">
                <RadioGroup v-model="formValidate.stock_time">
                    <Radio label="downed">下单减库存</Radio>
                    <Radio label="no">永不减库存</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="开启规格" prop="start_spec">
                <i-switch v-model="formValidate.start_spec"></i-switch>
            </FormItem>

            <FormItem label="规格项" prop="spec" v-if="formValidate.start_spec">
                <Form ref="formGroup" class="form-group spec" inline>
                    <FormItem label="规格项" prop="spec_name" v-for="(item, index) in specName" :key="index">
                        <Input v-model="specName[index]['spec_name']" placeholder="如：颜色" ></Input>
                        <Button type="primary" @click="addItem(index)">
                            <Icon type="plus"></Icon>
                            <span>添加规格项</span>
                        </Button>
                        <Form ref="formGroupItem" class="form-group-spec" inline>
                            <FormItem class="form-group-spec-item small-input" v-for="(it, ind) in specName[index]['item']" :key="ind">
                                <Input v-model="specName[index]['item'][ind]"></Input>
                                <Button type="error" size="small" icon="close" @click="delItem(index, ind)"></Button>
                            </FormItem>
                        </Form>
                    </FormItem>
                </Form>
            </FormItem>

            <FormItem label="规格" prop="spec" v-if="formValidate.start_spec && specNoEmptyName.length">
                <Form ref="formGroupSpec" class="form-group-spec-table" inline>
                    <Table
                        :border="true"
                        :columns="specColumns"
                        :data="specItem"
                        >
                    </Table>
                </Form>
            </FormItem>
        </div>

        <div name="attribute" v-show="activeName == 'attribute'">
            <FormItem label="产品类别" prop="type">
                <Select v-model="formValidate.type_id" style="width:200px" @on-change="selectShopType">
                    <Option v-for="(item, index) in types" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
            </FormItem>
            <div v-for="(it,index) in type_attrs">
                <FormItem :label="it.name" v-if="it.type == 'select'">
                    <Select v-model="type_attrs[index].value" style="width:200px" >
                        <Option v-for="i in it.store_range_arr" :value="i" :key="i">{{ i }}</Option>
                    </Select>
                </FormItem>
                <FormItem :label="it.name" v-if="it.type == 'radio'"  >
                    <RadioGroup v-model="type_attrs[index].value" >
                        <Radio v-for="(i, ind) in it.store_range_arr" :key="i" :label="i">{{ i }}</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem :label="it.name" v-if="it.type == 'text'" >
                    <Input v-model="type_attrs[index].value" type="textarea" placeholder="请输入内容"></Input>
                </FormItem>
            </div>
        </div>

        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
        </FormItem>
    </Form>
</template>
<script>
    import Util from '@/libs/util';
    import myTable from '@/view/includes/myTable';
    import myUpload from '@/view/includes/myUpload';
    import myPhoto from '@/view/includes/myPhoto';

    export default {
        components: {
            myUpload,
            myTable,
            myPhoto
        },
        data () {
            return {
                types: [],
                type_attrs: [],
                formValidate: {
                    id: 0,
                    name: '',
                    category_id: [],
                    type: 'show',
                    is_virtual: 1,
                    images: [],
                    origin_price: 0,
                    price: 0,
                    stock: 0,
                    desc: '',
                    content: '',
                    is_on_sale: 1,
                    is_recommend: 0,
                    is_special: 0,
                    spec_item: [],
                    sort_order: 50,
                    stock_time: 'downed',    // 默认付款完成减库存
                    type_id : "",           //产品属性类型shopProductType id
                    type_attrs: [],           //多属性
                    start_spec: false,
                    is_reset_spec: false,
                },
                ruleValidate: {
                    name: [
                        { required: true, message: '请填写名称', trigger: 'blur' }
                    ],
                    category_id: [
                        { required: true, type: 'array', min: 1, message: '请选择分类', trigger: 'change' },
                    ],
                    origin_price: [
                        { required: true, message: '原价', type: "number", min: 0.01, trigger: 'blur' }
                    ],
                    price: [
                        { required: true, message: '原价', type: "number", min: 0.01, trigger: 'blur' }
                    ],
                    type_id: [
                        { required: true, message: '请选择产品属性类型', trigger: 'blur' }
                    ],
                    images: [
                        { required: false }     // 提交的时候验证， 这样只是为了保留 * 号
                    ],
                },
                categoryList: [],
                uploadData: {
    				file_type: "products"
    			},
                activeName: 'basic',
                specName: [
                    {
                        spec_name: '',
                        item: []
                    },
                    {
                        spec_name: '',
                        item: []
                    },
                    {
                        spec_name: '',
                        item: []
                    },
                ],                // 规格项
                specItemEdit: [],       // 多规格（编辑使用）
                currentSpec: [],    // 多规格编辑
                specCount: 0,
                currentTypeId: 0,       // 编辑时的 typeid,默认值（编辑使用）
                typeAttrEdit: [],       // 多属性（编辑使用）

                typesOk: false,
                attrTimer: null
            }
        },
        computed: {
            specNoEmptyName () {
                var specName = this.specName;
                var newSpec = [];
                var spec_i = 0;
                for (let spec of specName) {
                    if (spec.spec_name != '' && spec.item.length > 0) {
                        newSpec[spec_i] = spec;
                        spec_i ++;
                    }
                }

                return newSpec;
            },
            specItem () {
                var isAdd = this.specItemEdit.length > 0 ? false : true;        // 主要用来判断 是否有 规格要合并，另外添加 this.specItemEdit.length  == 0
                var newSpec = this.specNoEmptyName;
                var resetSpec = this.isResetSpec();     // 是否重置规格项，改变规格项会出现很多问题

                var specItem = [];

                var item_i = 0;
                if (newSpec[0] != undefined) {
                    var opt = {
                        origin_price: '',
                        price: '',
                        stock: '',
                    }

                    for (var one of newSpec[0].item) {
                        if (one == '') {
                            continue;
                        }

                        var options = {
                            spec_name_one: one,
                        }

                        if (newSpec[1] != undefined) {
                            for (var two of newSpec[1].item) {
                                if (two == '') {
                                    continue;
                                }

                                var options = {
                                    spec_name_one: one,
                                    spec_name_two: two
                                }

                                if (newSpec[2] != undefined) {
                                    for (var three of newSpec[2].item) {
                                        if (three == '') {
                                            continue;
                                        }

                                        var options = {
                                            spec_name_one: one,
                                            spec_name_two: two,
                                            spec_name_three: three
                                        }

                                        if (isAdd) {
                                            options = Util.extend(options, opt)
                                        }
                                        specItem[item_i] = options;
                                        item_i ++;
                                    }
                                } else {
                                    if (isAdd) {
                                        options = Util.extend(options, opt)
                                    }

                                    specItem[item_i] = options;
                                    item_i ++;
                                }
                            }
                        } else {
                            if (isAdd) {
                                options = Util.extend(options, opt)
                            }
                            specItem[item_i] = options;
                            item_i ++;
                        }
                    }
                }

                if (!isAdd && !resetSpec) {     // （编辑，并且没有增删规格项 ）初始化值
                    var result = [];
                    for (var i in specItem) {
                        if (this.specItemEdit[i] != undefined) {
                            result[i] = Util.extend(this.specItemEdit[i], specItem[i])
                        } else {
                            result[i] = specItem[i];
                        }
                    }

                    specItem = result;
                }

                return specItem;
            },
            specColumns () {
                var _this = this;
                var columns = [];
                var newSpec = this.specNoEmptyName;

                var spec_i = 0;
                for (let spec of newSpec) {
                    var key = 'spec_name_one';
                    if (spec_i == 1) {
                        key = 'spec_name_two';
                    } else if (spec_i == 2) {
                        key = 'spec_name_three';
                    }

                    columns[spec_i] = {
                        title: spec.spec_name,
                        key: key,
                        minWidth: 150
                    };
                    spec_i ++;
                }

                var inputFunction = function (h, params) {
                    return h('Input', {
                        props: {
                            type: 'text',
                            value: params['row'][params.column.key],
                        },
                        class: [
                            'form-group-spec-item',
                            'small-input'
                        ],
                        style: {
                            width: '100px',
                        },
                        'on': {
                            'input': function (event) {
                                _this.specItem[params.index][params.column.key] = event;
                            }
                        }
                    });
                }

                var columns2 = [
                    { title: '原价', key: 'origin_price', width: 140, render: inputFunction },
                    { title: '现价', key: 'price', width: 140, render: inputFunction },
                    { title: '库存', key: 'stock', width: 140, render: inputFunction }
                ];

                return Util.extend(columns, columns2, true);
            }
        },
        methods: {
            handleSubmit (name) {
                var _this = this;

                this.$refs[name].validate((valid) => {
                    if (valid) {
                        // 添加
                        var method = "post";
                        var url = '/adminapi/shopProducts';
                        if (_this.formValidate.id) {  // 编辑
                            method = "patch";
                            var url = '/adminapi/shopProducts/' + _this.formValidate.id;
                        }
                        _this.formValidate.images = _this.$refs.images.imgList();
                        _this.formValidate.content = _this.$refs.content.imgList();

                        // if (_this.formValidate.category_id.length <= 0) {
                        //     _this.$Notice.error({title: '提示', desc: "请选择产品分类"});
                        //     return false;
                        // }

                        if (_this.formValidate.images.length <= 0) {
                            _this.$Notice.error({title: '提示', desc: "请上传产品图片"});
                            return false;
                        }

                        if (_this.formValidate.start_spec) {
                            var isSpec = true;
                            for (let item of _this.specItem) {
                                if (item.origin_price == '' || item.price == '' || item.stock == '') {
                                    var isSpec = false;
                                    break;
                                }
                            }

                            if (!isSpec) {
                                _this.$Notice.error({title: '提示', desc: "规格填写不完整"});
                                return false;
                            }

                            _this.formValidate.spec_item = _this.specItem;
                            _this.formValidate.spec_only_name = _this.specOnlyName();
                            _this.formValidate.is_reset_spec = _this.isResetSpec();
                        }

                        _this.formValidate.type_attrs = this.type_attrs;    //产品多属性

                        Util.ajax({
            	            url: url,
            	            method: method,
            	            data: _this.formValidate,
            	            success: function(result){
            					if (result.error == 0) {
            				        _this.$Notice.success({title: '提示', desc: '保存成功'});
                                    _this.$router.push({name: 'productmanage-products-index'});
                                    // _this.$router.push('/productManage/products/index');
            				    }else {
                                    _this.$Notice.error({title: '提示', desc: result.info});
            				    }
            	            }
            	        });
                    } else {
                        _this.$Notice.error({title: '提示', desc: '信息填写不完整'});
                    }
                })
            },
            specOnlyName() {        // 计算属性有缓存，改用方法
                var name = {};
                var specNoEmptyName = this.specNoEmptyName;

                for (var i in specNoEmptyName) {
                    var key = 'spec_name_one';
                    if (i == 1) {
                        key = 'spec_name_two';
                    } else if (i == 2) {
                        key = 'spec_name_three';
                    }
                    name[key] = specNoEmptyName[i]['spec_name'];
                }

                return name;
            },
            isResetSpec () {
                return this.specNoEmptyName.length == this.specCount ? false : true;        // 下面方法更加严格
                // var resetSpec = false;

                // for (var i in this.specNoEmptyName) {
                //     if (this.specNoEmptyName[i].item.length != this.currentSpec[i]) {
                //         resetSpec = true;
                //         break;
                //     }
                // }

                // return resetSpec;
            },
            typeChange () {
                // 优惠券注释
                if (this.formValidate.type == 'coupon' && this.couponTypeData.length <= 0) {
                    // this.getCouponTypeAll();
                }
            },
            // getCouponTypeAll:function(){
            //     var _this = this;
            //     let couponTypeData = [];
            //     Util.ajax({
            //         url: "/adminapi/couponTypes/CouponTypeAll",
            //         method: "get",
            //         data: {get_type: 'relative_product'},
            //         success: function(result){
            //             if (result.error == 0) {
            //                 _this.couponTypeData = result.result;
            //
            //                 if (result.result.length <= 0 && _this.formValidate.type == 'coupon') {
            //                     _this.$Notice.warning({ title: '提示', desc: "您还没有添加核销券，请先添加核销券", duration: 0 });
            //                 }
            //             }else {
            //                 _this.$Notice.error({ title: '提示', desc: result.info });
            //             }
            //         }
            //     });
            //
            //     return couponTypeData;
            // },
            switchItem (code) {     // 切换商品添加表单
                this.activeName = code;
            },
            addItem(index) {
                this.specName[index].item.push("");
            },
            delItem(index, i) {     // 删除规格
                this.specName[index]['item'].splice(i, 1);
            },
            shopAttrTimer () {
                if (this.typesOk) {
                    this.selectShopType(this.currentTypeId);
                    clearTimeout(this.attrTimer);
                } else {
                    this.attrTimer = setTimeout(() => {
                        this.shopAttrTimer();
                    }, 100);
                }
            },
            selectShopType(value){      // 切换 商品属性，更改下面输入框列表
                for (let i of this.types) {
                    if(i.id == value){
                        if (i.id == this.currentTypeId) {   // 编辑的时候 来回切换时候的 依然显示数据库中的默认值
                            var type_attrs = i.shop_product_type_attr.length > 0 ? i.shop_product_type_attr : [];
                            var typeAttrEdit = this.typeAttrEdit;

                            if (type_attrs.length && typeAttrEdit.length) {     // 编辑将默认值赋值到 属性列表
                                for (var i in  type_attrs) {
                                    for (let attr of typeAttrEdit) {
                                        if (type_attrs[i]['id'] == attr.attr_id) {
                                            type_attrs[i]['value'] = attr.value;
                                            type_attrs[i]['product_attr_id'] = attr.id;
                                            break;
                                        }
                                    }
                                }
                            }

                            this.type_attrs = type_attrs;
                        } else {
                            this.type_attrs = i.shop_product_type_attr.length > 0 ? i.shop_product_type_attr : [];
                        }
                    }
                }
            }
        },
        created () {
            var _this = this;

            // if (_this.formValidate.type == 'coupon') {
            //     this.getCouponTypeAll();
            // }

            Util.ajax({     // 获取商品分类
                url: '/adminapi/shopProductCategorys/catAll',
                method: 'get',
                data: {only_top: 0},
                success: function(result){
                    if (result.error == 0) {
                        _this.categoryList = result.result;
                    }else {
                        _this.$Notice.error({title: '提示', desc: result.info});
                    }
                }
            });

            Util.ajax({
                url: '/adminapi/shopProductTypes/typeAll',
                method: 'get',
                success: function(result){
                    if (result.error == 0) {
                        _this.types = result.result;
                        _this.typesOk = true;
                    }else {
                        _this.$Notice.error({title: '提示', desc: result.info});
                    }
                }
            });

            if (_this.$route.params.id != undefined) {
                Util.ajax({
                    url: '/adminapi/shopProducts/' + _this.$route.params.id,
                    method: 'get',
                    success: function(result){
                        if (result.error == 0) {
                            var info = result.result;

                            for (var i in _this.formValidate) {
                                if (i == 'images') {
                                    _this.formValidate[i] = info['images_arr'];
                                } else if (i == 'content') {
                                    _this.formValidate[i] = info['content_arr'];
                                } else if (i == 'category_id') {
                                    _this.formValidate[i] = info['category_id_arr'];
                                } else {
                                    _this.formValidate[i] = info[i];
                                }

                                if(i == 'type_attrs'){
                                    _this.formValidate[i] = info['product_attr'];
                                }
                            }

                            // 多规格
                            _this.specItemEdit = info.spec_item;
                            _this.specName = result.spec_name;

                            if (_this.specName[0] != undefined && _this.specName[0]['spec_name'] != '') {
                                _this.formValidate.start_spec = true;

                                // for (var i in _this.specName) {         // 记录所有规格，规格项，发生变化则舍弃老数据
                                //     _this.currentSpec[i] = _this.specName[i].item.length;
                                // }

                                for (var i in _this.specName) {         // 记录所有规格，规格项，发生变化则舍弃老数据, 上面方法检测更严格
                                    if (_this.specName[i].spec_name != '') {
                                        _this.specCount ++;
                                    }
                                }
                            }

                            // 多属性
                            _this.currentTypeId = info.type_id;
                            _this.typeAttrEdit = info.product_attr;         // 编辑

                            _this.attrTimer = setTimeout(function () {
                                _this.shopAttrTimer();
                            }, 100);
                        }else {
                            _this.$Notice.error({title: '提示', desc: result.info});
                        }
                    }
                });
            }
        }
    }
</script>

<style lang="css" scoped>
.ivu-menu-horizontal {
    margin-bottom: 20px;
}

form .small-input {
    width: 200px;
}

form .small-input .ivu-input {
    width: 200px;
}


form.form-group.spec input {
    width: 200px !important;
}

form.form-group-spec {
    margin: 10px 0;
}

form.form-group-spec .form-group-spec-item{
    border: 1px solid #dddee1;
    border-radius: 5px;
    padding: 5px;
    width: 240px;
    margin: 10px 5px;
}

/* 规格项输入框 */
form.form-group-spec .form-group-spec-item .ivu-input-wrapper {
    width: 200px;
}
form.form-group-spec .form-group-spec-item button{
    width: 24px;
    height: 24px;
}

/* 规格中的输入框 */
form .form-group-spec-table .small-input {
    width: 100px;
}
form .form-group-spec-table .small-input .ivu-input{
    width: 100px;
}
form .form-group-spec-table .ivu-input-wrapper {
    width: 100px;
}
</style>
