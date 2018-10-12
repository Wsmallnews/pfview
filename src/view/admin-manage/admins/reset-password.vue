<template lang="html">
	<div class="admin-reset-password">
		<Form class="form-edit" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
			<Form-item label="新密码" prop="password" required>
                <Input v-model="formValidate.password" type="password" placeholder="新密码"></Input>
            </Form-item>

			<Form-item label="确认新密码" prop="password_confirmation" required>
                <Input v-model="formValidate.password_confirmation" type="password" placeholder="确认新密码"></Input>
            </Form-item>

			<FormItem>
	            <Button type="primary" @click.native="handleSubmit('formValidate')">提交</Button>
	        </FormItem>
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
			formValidate:{
				password:'',
				password_confirmation: ''
			},
			ruleValidate: {
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' }
				],
				password_confirmation: [
					{ required: true, message: '请输入确认密码', trigger: 'blur' }
				]
			}
        }
    },
	methods: {
		handleSubmit (name) {
			var _this = this;

			_this.$refs[name].validate((valid) => {
				if (valid) {
					Util.ajax({
						url: '/adminapi/admins/resetPassword/' + _this.$route.params.id,
						method: "patch",
						data: _this.formValidate,
						success: function(result){
							if (result.error == 0) {
								_this.$Notice.success({title: '提示', desc: '保存成功'});
								_this.$router.push('/roles/list')
							}else {
								_this.$Notice.error({title: '提示', desc: result.info});
							}
						}
					});
				} else {
					_this.$Notice.error({title: '提示', desc: '信息填写不完整'});
				}
			})
		}
	},
	mounted:function(){
	},
	created () {
	}
}
</script>

<style lang="css">

</style>
