<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
.size{
    width: 100%;
    height: 100%;
}
html,body{
    .size;
    overflow: hidden;
    margin: 0;
    padding: 0;
}
#app {
    .size;
}

form.form-edit .ivu-cascader, form.form-edit .ivu-input-wrapper, form.form-edit .ivu-select {
    width: 400px;
}

// 表单输入提示
.form-hints {
    color: #f59052;
    margin-left: 10px;
}

</style>
