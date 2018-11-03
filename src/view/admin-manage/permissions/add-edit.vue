<template lang="html">
	<div class="permission-add-edit">
		<Form class="form-edit" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
            <Form-item label="权限名" prop="nickname">
                <i-input v-model="formValidate.nickname" placeholder="权限名"></i-input>
            </Form-item>

            <Form-item label="权限标示" prop="name">
                <i-input v-model="formValidate.name" placeholder="权限标示"></i-input>
            </Form-item>

            <Form-item label="对应路由" prop="routes">
                <Transfer
                    :data="routes"
                    :target-keys="formValidate.routes"
                    :list-style="listStyle"
                    filterable
                    @on-change="handleRoute"
                    >
                </Transfer>
            </Form-item>

            <Form-item>
                <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
            </Form-item>
		</Form>
	</div>
</template>

<script>
import Util from '@/libs/util'

export default {
    components: {
    },
    data() {
        return {
            routes: [],
            listStyle: {
                width: '350px',
                height: '300px'
            },
            formValidate: {
                id: 0,
                guard_name: "adminapi",
                nickname: "",
                name: "",
                routes: []
            },
            ruleValidate: {
                nickname: [
                    { required: true, message: '请输入权限名', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入权限标示', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        handleSubmit(name) {
            var _this = this

            _this.$refs[name].validate((valid) => {
                if (valid) {
                    var method = 'post'
                    var url = '/adminapi/permissions'
                    if (_this.formValidate.id) { // 编辑
                        method = 'patch'
                        var url = '/adminapi/permissions/' + _this.formValidate.id
                    }

                    Util.ajax({
                        url: url,
                        method: method,
                        data: _this.formValidate,
                        success: function(result) {
                            if (result.error == 0) {
                                _this.$Notice.success({
                                    title: '提示',
                                    desc: '保存成功'
                                })
                                _this.$router.push('/adminManage/permissions/index')
                            } else {
                                _this.$Notice.error({
                                    title: '提示',
                                    desc: result.info
                                })
                            }
                        }
                    })
                } else {
                    _this.$Notice.error({
                        title: '提示',
                        desc: '信息填写不完整'
                    })
                }
            })
        },
        handleReset(name) { // 表单数据重置, name ,表单数据
            var _this = this
            _this.$refs[name].resetFields()
        },
        handleRoute (newTargetKeys) {
            this.formValidate.routes = newTargetKeys;
        },
    },
    mounted: function() {},
    created() {
        var _this = this
        if (_this.$route.params.id != undefined) {
            Util.ajax({
                url: '/adminapi/permissions/' + _this.$route.params.id,
                method: 'get',
                success: function(result) {
                    if (result.error == 0) {
                        var info = result.result
                        for (var i in _this.formValidate) {
                            _this.formValidate[i] = info[i];
                            if (i == 'routes') {
                                _this.formValidate[i] = info['route_name_arr'];
                            }
                        }
                    } else {
                        _this.$Notice.error({
                            title: '提示',
                            desc: result.info
                        })
                    }
                }
            })
        }

        Util.ajax({
            url: '/adminapi/permissions/routeAll/adminapi',
            method: 'get',
            success: function(result) {
                if (result.error == 0) {
                    _this.routes = result.result;
                } else {
                    _this.$Notice.error({ title: '提示', desc: result.info })
                }
            }
        })
    }
}
</script>

<style lang="css">

</style>
