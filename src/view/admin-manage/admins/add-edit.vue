<template lang="html">
	<div class="admin-add-edit">
		<Form class="form-edit" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
			<Form-item label="名称" prop="name">
                <Input v-model="formValidate.name" placeholder="名称"></Input>
            </Form-item>

            <Form-item label="手机" prop="phone" required>
                <Input v-model="formValidate.phone" placeholder="手机" :disabled="type == 'edit'"></Input>
            </Form-item>

			<Form-item label="头像" prop="avatar">
				<myUpload ref="avatar" :data="uploadData" :defaultImgs="formValidate.avatar"></myUpload>
            </Form-item>

            <Form-item label="邮箱" prop="email" required>
                <Input v-model="formValidate.email" placeholder="邮箱"></Input>
            </Form-item>

            <Form-item v-if="type == 'add'" label="密码" prop="password" required >
                <Input v-model="formValidate.password" type="password" placeholder="密码"></Input>
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
import myUpload from '@/view/includes/myUpload';

export default {
	components: {
		myUpload
    },
    data () {
        return {
			type: 'add',
			uploadData: {
				file_type: "admins"
			},
			formValidate: {
                name: "",
				avatar: "",
                phone: "",
                email: "",
                password: "",
            },
			ruleValidate: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '请输入电话', trigger: 'blur' }
                ],
                email: [
                    { required: true, type:"email", message: '请输入邮箱', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ]
            },
        }
    },
	methods: {
		handleSubmit (name) {
			var _this = this;

			_this.$refs[name].validate((valid) => {
				if (valid) {
					if(_this.$route.params.id != undefined){
						Util.ajax({
							url: '/adminapi/admins/' + _this.$route.params.id,
							method: "patch",
							data: _this.formValidate,
							success: function(result){
								if (result.error == 0) {
									_this.$Notice.success({title: '提示', desc: '保存成功'});
									_this.$router.push('/adminManage/admins/index')
								}else {
									_this.$Notice.error({title: '提示', desc: result.info});
								}
							}
						});
					}else{
						Util.ajax({
							url: '/adminapi/admins',
							method: "post",
							data: _this.formValidate,
							success: function(result){
								if (result.error == 0) {
									_this.$Notice.success({title: '提示', desc: '保存成功'});
									_this.$router.push('/adminManage/admins/index')
								}else {
									_this.$Notice.error({title: '提示', desc: result.info});
								}
							}
						});
					}
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
		if (_this.$route.params.id != undefined) {
			_this.type = 'edit';
			Util.ajax({
				url: '/adminapi/admins/' + _this.$route.params.id,
				method: 'get',
				success: function(result){
					if (result.error == 0) {
						var info = result.result;
						for (var i in _this.formValidate) {
							_this.formValidate[i] = info[i];
						}
					}else {
						_this.$Notice.error({title: '提示', desc: result.info});
					}
				}
			});
		}
	}
}
</script>

<style lang="css">

</style>
