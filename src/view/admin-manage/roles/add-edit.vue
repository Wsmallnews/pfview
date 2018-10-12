<template lang="html">
	<div class="roles-add-edit">
		<Form class="form-edit" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
			<FormItem label="角色名称" prop="name" required>
				<Input type="text" placeholder="角色名称" v-model="formValidate.name"></Input>
			</FormItem>
			<FormItem>
	            <Button type="primary" @click.native="handleSubmit('formValidate')">提交</Button>
				<Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
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
				name:'',
			},
			ruleValidate: {
				name: [
					{ required: true, message: '请输入角色名称', trigger: 'blur' }
				]
			}
        }
    },
	methods: {
		handleSubmit (name) {
			var _this = this;
			_this.$refs[name].validate((valid) => {
				if (valid) {
					if(_this.$route.params.id != undefined){
						Util.ajax({
							url: '/adminapi/roles/' + _this.$route.params.id,
							method: "patch",
							data: _this.formValidate,
							success: function(result){
								if (result.error == 0) {
									_this.$Notice.success({title: '提示', desc: '保存成功'});
									_this.$router.push('/adminManage/roles/index')
								}else {
									_this.$Notice.error({title: '提示', desc: result.info});
								}
							}
						});
					}else{
						Util.ajax({
							url: '/adminapi/roles',
							method: "post",
							data: _this.formValidate,
							success: function(result){
								if (result.error == 0) {
									_this.$Notice.success({title: '提示', desc: '保存成功'});
									_this.$router.push('/adminManage/roles/index')
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
			Util.ajax({
				url: '/adminapi/roles/' + _this.$route.params.id,
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
