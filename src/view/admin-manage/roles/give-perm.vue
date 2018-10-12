<template lang="html">
	<div class="roles-give-perm">
		<Form class="form-edit" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
			<FormItem label="角色名称" prop="name" required>
				<Input type="text" placeholder="角色名称" disabled v-model="formValidate.name"></Input>
			</FormItem>

			<Form-item label="权限名称" prop="permission_arr" required>
                <Checkbox
                :value="allChecked"
                @click.prevent.native="all()">
                全选
                </Checkbox>
                <table border="1" cellspacing="0" cellpadding="0" class="table">
                    <tr>
                        <th width="200">模块</th>
                        <th width="200">子模块</th>
                        <th>权限展示</th>
                    </tr>

                    <template v-for="(permission, index) in permissions">
                        <tr v-for="(perChild, ind) in permission.children">
                            <td v-if="ind == 0" width="200" :rowspan="permission.children.length" style="padding-left:50px;">
                                <Checkbox
                                    :value="permissions[index].checked"
                                    @click.prevent.native="first(index)">
                                    {{permission.name}}
                                </Checkbox>
                            </td>

                            <td width="200" style="padding-left:50px;">
                                <Checkbox
                                    :value="permissions[index]['children'][ind]['checked']"
                                    @click.prevent.native="second(index, ind)">
                                    {{perChild.name}}
                                </Checkbox>
                            </td>
                            <td style="padding-left:50px;">
                                <Checkbox-group v-model="formValidate.permission_arr" >
                                    <Checkbox
                                        v-for="(perm, i) in perChild.children"
                                        :label="perm.id"
                                        @click.prevent.native="third(index, ind, i)">
                                        <span>{{perm.nickname}}</span>
                                    </Checkbox>
                                </Checkbox-group>
                            </td>
                        </tr>
                    </template>
                </table>
            </Form-item>

			<FormItem>
	            <Button type="primary" @click.native="handleSubmit('formValidate')">提交</Button>
	        </FormItem>
		</Form>
	</div>
</template>

<script>
import Util from '@/libs/util';
import $ from 'jquery';

export default {
	components: {

    },
    data () {
        return {
			permissions: [],
			formValidate: {
                id: "",
				name: '',
                permission_arr: []
            },
			ruleValidate: {
                permission_arr: [
                    { required: true, type: 'array', message: '请选择权限', trigger: 'blur' }
                ]
            },
			perSecond: [],
            model: true,
            allChecked: false
        }
    },
	methods: {
		all: function () {
            this.allChecked = !this.allChecked;
            var checked = this.allChecked;

            for (var i in this.permissions) {
                this.first(i, checked);
            }
        },
        first: function (index, checked) {
            if (checked != undefined) {     // 全选
                this.permissions[index].checked = checked;
            } else {
                this.permissions[index].checked = !this.permissions[index].checked;
                checked = this.permissions[index].checked;
            }

            var children = this.permissions[index]['children'];
            for (let i in children) {
                this.permissions[index]['children'][i].checked = checked;

                for (let perm of children[i].children) {
                    if (checked) {
                        if ($.inArray(perm.id, this.formValidate.permission_arr) < 0) {
                            this.formValidate.permission_arr.push(perm.id);
                        }
                    } else {
                        this.remove(perm.id);
                    }
                }
            }

            this.checkIsAll(index);
        },
        second: function (index, ind) {
            this.permissions[index]['children'][ind].checked = !this.permissions[index]['children'][ind].checked;
            var checked = this.permissions[index]['children'][ind].checked;

            var children = this.permissions[index]['children'][ind]['children'];

            for (let perm of children) {
                if (checked) {
                    if ($.inArray(perm.id, this.formValidate.permission_arr) < 0) {
                        this.formValidate.permission_arr.push(perm.id);
                    }
                } else {
                    this.remove(perm.id);
                }
            }

            this.checkIsAll(index, ind);
        },
        third: function (index, ind, i) {
            var id = this.permissions[index]['children'][ind]['children'][i].id;
            if ($.inArray(id, this.formValidate.permission_arr) < 0) {
                this.formValidate.permission_arr.push(id);
            } else {
                this.remove(id);
            }

            this.checkIsAll(index, ind, i);
        },
        checkIsAll: function (index, ind, i) {
            if (i != undefined) {
                var children = this.permissions[index]['children'][ind]['children'];
                var is_all = true;

                for (let per of children) {
                    if ($.inArray(per.id, this.formValidate.permission_arr) < 0) {
                        is_all = false;
                        break;
                    }
                }

                this.permissions[index]['children'][ind].checked = is_all;

                var is_sceond_all = true;
                for (let per of this.permissions[index]['children']) {
                    if(!per.checked) {
                        is_sceond_all = false;
                    }
                }
                this.permissions[index].checked = is_sceond_all;

                this.allChecked = this.isAll();
            } else if (ind != undefined) {
                var children = this.permissions[index]['children'];
                var is_all = true;

                for (let per of children) {
                    if(!per.checked) {
                        is_all = false;
                    }
                }

                this.permissions[index].checked = is_all;
                this.allChecked = this.isAll();
            } else if (index != undefined){
                this.allChecked = this.isAll();
            }
        },
        isAll: function () {
            var is_all = true;
            for (let per of this.permissions) {
                if(!per.checked) {
                    is_all = false;
                }
            }

            return is_all;
        },
        remove: function (id) {     // 移除 数组元素
            for (var i in this.formValidate.permission_arr) {
                if (id == this.formValidate.permission_arr[i]) {
                    this.formValidate.permission_arr.splice(i, 1);
                }
            }
        },
        handleSubmit: function () {
            var _this = this;
            _this.$refs["formValidate"].validate((valid) => {
                if (valid) {
                    Util.ajax({
                        url: "/roles/" + _this.formValidate.id + "/givePermissions",
                        method: "post",
                        data: _this.formValidate,
                        success: function(result){
                            if (result.error == 0) {
                                Util.notice.success({ title: '提示', desc: '角色分配成功' });
                                Util.closeOpenView("{{route('admin.roles.index')}}");
                            }else {
                                Util.notice.error({ title: '提示', desc: result.info });
                            }
                        }
                    });
                } else {
                    Util.notice.error({ title: '提示', desc: '表单验证失败' });
                }
            })
        },
        handleReset () {                // 表单数据重置, name ,表单数据
            var _this = this;
            _this.$refs["formValidate"].resetFields();
        }
	},
	mounted:function(){
	},
	created () {
		var _this = this;
		Util.ajax({
			url: '/adminapi/roles/' + _this.$route.params.id,
			method: 'get',
			success: function(result){
				if (result.error == 0) {
					var info = result.result;

					_this.formValidate.id = info.id;
                    _this.formValidate.name = info.name;
                    var role_permissions = info.role_has_ps;

                    for (var i = 0; i < role_permissions.length; i++) {
                        _this.formValidate.permission_arr.push(role_permissions[i].permission_id);
                    }
				}else {
					_this.$Notice.error({title: '提示', desc: result.info});
				}
			}
		});


		Util.ajax({
            url: "/adminapi/permissions/givePermissions",
            method: "get",
            success: function(result){
                _this.permissions = result.permissions;
                _this.$nextTick(function () {
                    for (let permission in _this.permissions) {
                        for (let perm in _this.permissions[permission]['children']) {
                            for (let per in _this.permissions[permission]['children'][perm]['children']) {
                                _this.checkIsAll(permission, perm, per);
                            }
                        }
                    }
                })
            }
        });
	}
}
</script>

<style lang="css">
	.table { width: 100%;border:1px solid #9e9c9c;border-collapse: collapse; word-wrap:break-word; word-break:break-all;}
</style>
