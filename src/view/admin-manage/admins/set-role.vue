<template lang="html">
	<div class="admins-set-role">
		<Form class="form-edit" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
			<Form-item label="管理员账号" prop="name" required>
                <Input v-model="formValidate.name" disabled placeholder="管理员账号"></Input>
            </Form-item>

            <Form-item label="选择角色" prop="role_ids" required>
                <Select v-model="formValidate.role_ids" style="width:200px" filterable multiple>
                    <Option v-for="item in roleAll" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
            </Form-item>

            <Form-item>
                <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
            </Form-item>
		</Form>
	</div>
</template>

<script>
import Util from '@/libs/util';

export default {
	components: {
    },
    data () {
        return {
			roleAll: [],
            formValidate: {
                id: "",
                name: "",
                role_ids: [],
            },
            ruleValidate: {
                role_ids: [
                    { required: true, type: 'array', min: 1, message: '请选择角色', trigger: 'change' },
					// { type: 'array', max: 2, message: 'Choose two hobbies at best', trigger: 'change' }
					// { required: true, type: 'array',  message: 'Choose at least one hobby', trigger: 'change' },
                ]
            },
        }
    },
	methods: {
		handleSubmit (name) {
			var _this = this;

			_this.$refs[name].validate((valid) => {
				if (valid) {
					Util.ajax({
                        url: "/adminapi/admins/setRole",
                        method: "post",
                        data: _this.formValidate,
                        success: function(result){
                            if (result.error == 0) {
                                _this.$Notice.success({ title: '提示', desc: '角色分配成功' });
                                _this.$router.push('/adminManage/admins/index')
                            }else {
                                _this.$Notice.error({ title: '提示', desc: result.info });
                            }
                        }
                    });
				} else {
					_this.$Notice.error({title: '提示', desc: '信息填写不完整'});
				}
			})
		},
		handleReset (name) {                // 表单数据重置, name ,表单数据
            var _this = this;
            _this.$refs[name].resetFields();
        }
	},
	mounted:function(){
	},
	created () {
		var _this = this;
		Util.ajax({
			url: '/adminapi/admins/' + _this.$route.params.id,
			method: 'get',
			data: {type: 'role'},
			success: function(result){
				if (result.error == 0) {
					var info = result.result;
			        _this.formValidate.id = info.id;
			        _this.formValidate.name = info.name;

			        var admin_roles = info.model_has_role;
			        for (var i = 0; i < admin_roles.length; i++) {
			            _this.formValidate.role_ids.push(admin_roles[i].role_id);
			        }
				}else {
					_this.$Notice.error({title: '提示', desc: result.info});
				}
			}
		});

		Util.ajax({
			url: "/adminapi/roles/roleAll",
			method: "get",
			success: function(result){
				_this.roleAll = result.roles;
			}
		});
	}
}
</script>

<style lang="css">

</style>
