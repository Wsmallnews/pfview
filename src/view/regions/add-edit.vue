<template>
    <Form class="form-edit" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
        <FormItem label="地域名称" prop="name">
            <Input v-model="formValidate.name" placeholder="请填写名称"></Input>
        </FormItem>
        <FormItem label="上级地域" prop="parent_id" >
            <Cascader :data="regions" v-model="formValidate.parent_id" placeholder="不选择默认为顶级" change-on-select></Cascader>
        </FormItem>
        <FormItem>
            <Button type="primary" @click.native="handleSubmit('formValidate')">提交</Button>
        </FormItem>
    </Form>
</template>
<script>
import Util from '@/libs/util'

export default {
  components: {},
    data() {
        return {
            formValidate: {
                id: 0,
                name: '',
                parent_id: []
            },
            ruleValidate: {
                name: [
                    { required: true, message: '请填写名称', trigger: 'blur' }
                ]
            },
            regions: []
        }
    },
    methods: {
        handleSubmit(name) {
            var _this = this

            _this.$refs[name].validate((valid) => {
                if (valid) {
                    // 添加
                    var method = 'post'
                    var url = '/adminapi/regions'
                    if (_this.formValidate.id) { // 编辑
                        method = 'patch'
                        var url = '/adminapi/regions/' + _this.formValidate.id
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
                                _this.$router.push('/regions/index')
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
        }
    },
    created() {
        var _this = this
        Util.ajax({
            url: '/adminapi/regions',
            method: 'get',
            success: function(result) {
                if (result.error == 0) {
                    _this.regions = result.result
                } else {
                    _this.$Notice.error({
                        title: '提示',
                        desc: result.info
                    })
                }
            }
        })

        if (_this.$route.params.id != undefined) {
            Util.ajax({
                url: '/adminapi/regions/' + _this.$route.params.id,
                method: 'get',
                success: function(result) {
                    if (result.error == 0) {
                        var info = result.result
                        for (var i in _this.formValidate) {
                            _this.formValidate[i] = info[i]
                            if (i == 'parent_id') {
                                _this.formValidate[i] = info['parent_ids']
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
    }
}
</script>

<style lang="css">
</style>
