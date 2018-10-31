<template lang="html">
    <div class="settings-index">
        <Menu mode="horizontal" theme="light" :active-name="code" @on-select="getItem">
            <MenuItem v-for="(item, index) in settings" :name="item.code" :key="item.id">
                {{ item.name }}
            </MenuItem>
        </Menu>

        <Alert type="warning" show-icon>请根据每个选项下面提示信息认真填写</Alert>

        <Form ref="formValidate" class="form-edit" :label-width="90">
            <Form-item v-for="(item, index) in settingItem" :label="item.name" :prop="item.code" :key="item.id" >
                <template v-if="item.type == 'group' && item.groups != null">
                    <Form ref="formGroup" class="form-group" inline >
                        <template v-for="(it, ind) in item.groups">
                            <Form-item :label="it.name" :prop="item.code" class="form-group-item">
                                <template v-if="it.icon != null && it.icon != ''">
                                    <img :src="it.icon" class="set-icon" />
                                </template>
                                <myField :item="it" v-model="it.value" ></myField>
                                <span class="form-hints"><Icon type="alert-circled"></Icon>@{{ it.desc }}</span>
                            </Form-item>
                        </template>
                    </Form>
                </template>

                <template v-else>
                    <template v-if="item.icon != null && item.icon != ''">
                        <img :src="item.icon" class="set-icon" />
                    </template>
                    <myField :item="item" v-model="item.value"></myField>
                    <span class="form-hints"><Icon type="alert-circled"></Icon>@{{ item.desc }}</span>
                </template>
            </Form-item>

            <Form-item>
                <i-button type="primary" @click="handleSubmit('formValidate')">提交</i-button>
            </Form-item>
        </Form>
    </div>
</template>

<script>
import Util from '@/libs/util'
import myField from '@/view/includes/myField'


export default {
    components: {
        myField
    },
    data() {
        return {
            settings: [],
            settingItem: [],
            url: '/adminapi/settings',
            code: ''
        }
    },
    methods: {
        getItem (code) {
            var _this = this;

            if (_this.code == code) {
                return false;
            }
            _this.code = code;

            Util.ajax({
                url: _this.url + "/" + code,
                method: 'get',
                success: function(result){
                    if (result.error == 0) {
                        _this.settingItem = result.result;
                    }else {
                        _this.$Notice.error({ title: '提示', desc: result.info });
                    }
                }
            });
        },
        handleSubmit () {
            var _this = this;
            Util.ajax({
                url: "/settings",
                method: 'post',
                data: {item: this.settingItem, code: _this.code},
                success: function(result){
                    if (result.error == 0) {
                        _this.$Notice.success({ title: '提示', desc: "保存成功" });
                    }else {
                        _this.$Notice.error({ title: '提示', desc: result.info });
                    }
                }
            });
        }
    },
    created: function() {
        var _this = this;

        Util.ajax({
            url: _this.url + "/top",
            method: 'get',
            success: function(result){
                if (result.error == 0) {
                    _this.settings = result.result;
                    if (_this.settings.lenght) {
                        _this.getItem(_this.setting[0]['code']);
                    }
                }else {
                    _this.$Notice.error({ title: '提示', desc: result.info });
                }
            }
        });
    },
    mounted: function() {}
}
</script>

<style lang="css">
</style>
