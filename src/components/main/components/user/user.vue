<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Avatar :src="userAvator"/>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="editpass">修改密码</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>

    <Modal v-model="editPasswordModal" :closable='false' :mask-closable=false :width="500">
        <h3 slot="header" style="color:#2D8CF0">修改密码</h3>
        <Form ref="editPasswordForm" :model="editPasswordForm" :label-width="100" label-position="right" :rules="passwordValidate">
            <FormItem label="原密码" prop="old_password" :error="oldPassError">
                <Input type="password" v-model="editPasswordForm.old_password" placeholder="请输入现在使用的密码" ></Input>
            </FormItem>
            <FormItem label="新密码" prop="password">
                <Input type="password" v-model="editPasswordForm.password" placeholder="请输入新密码，至少6位字符" ></Input>
            </FormItem>
            <FormItem label="确认新密码" prop="password_confirmation">
                <Input type="password" v-model="editPasswordForm.password_confirmation" placeholder="请再次输入新密码" ></Input>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="text" @click="cancelEditPass">取消</Button>
            <Button type="primary" :loading="savePassLoading" @click="saveEditPass">保存</Button>
        </div>
    </Modal>

  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
import Util from '@/libs/util'

export default {
  name: 'User',
  props: {
    userAvator: {
      type: String,
      default: ''
    }
  },
  data () {
    const valideRePassword = (rule, value, callback) => {
        if (value !== this.editPasswordForm.password) {
            callback(new Error('两次输入密码不一致'));
        } else {
            callback();
        }
    };
    return {
      editPasswordModal: false,
      savePassLoading: false,
      oldPassError: '',
      editPasswordForm: {
        old_password: '',
        password: '',
        password_confirmation: ''
      },
      passwordValidate: {
        old_password: [
            { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        password: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { min: 6, message: '请至少输入6个字符', trigger: 'blur' },
            { max: 32, message: '最多输入32个字符', trigger: 'blur' }
        ],
        password_confirmation: [
            { required: true, message: '请再次输入新密码', trigger: 'blur' },
            { validator: valideRePassword, trigger: 'blur' }
        ]
      },
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    handleClick (name) {
      switch (name) {
        case 'logout':
          this.handleLogOut().then(() => {
            this.$router.push({
              name: 'login'
            })
          })
          break;
        case 'editpass':
          this.showEditPassword();
          break;
      }
    },
    showEditPassword () {
      this.editPasswordModal = true;
    },
    cancelEditPass () {
        this.editPasswordModal = false;
        for (var i in this.editPasswordForm) {
            this.editPasswordForm[i] = '';
        }
    },
    saveEditPass () {
        var _this = this;
        _this.$refs['editPasswordForm'].validate((valid) => {
            if (valid) {
                _this.savePassLoading = true;
                Util.ajax({
        			url: '/adminapi/admins/modifySelfPassword',
                    method: 'patch',
                    data: _this.editPasswordForm,
                    success: function(result){
                        _this.savePassLoading = false;
                        if (result.error == 0) {
                            _this.$Notice.success({title: '提示', desc: result.info});
                            _this.cancelEditPass();
                        } else {
                            _this.$Notice.error({title: '提示', desc: result.info});
                        }
                    }
        		})
            }
        });
    },
  }
}
</script>
