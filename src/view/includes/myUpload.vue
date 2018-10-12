<template>
    <div class="upload-index">
        <div class="upload-list" v-for="(item,index) in uploadList">
            <template v-if="item.status === 'finished'">
                <img :src="item.url + '?imageView2/5/w/100/h/100'">
                <div class="upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                    <Icon v-if="!noEdit" type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                </div>
            </template>
            <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
        </div>
        <Upload
            v-show="!noEdit"
            ref="upload"
            :show-upload-list="showUploadList"
            :default-file-list="defaultList"
            :headers="headers"
            :name="filename"
            :data="data"
            :on-success="handleSuccess"
            :format="format"
            :max-size="maxSize"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            :multiple="multiple"
            :type="type"
            :action="uploadUrl"
            style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="ios-camera" size="20"></Icon>
            </div>
        </Upload>
        <Modal title="查看图片" v-model="maxVisible">
            <img :src="maxImgUrl" v-if="maxVisible" style="width: 100%">
        </Modal>
    </div>
</template>
<script>
    import Util from '@/libs/util';
    import {getToken} from '@/libs/util';

    export default {
        props: {
            multiple: {
                default: false
            },
            img_num: {  // 最多上传多少张，多选有效
                default: 10
            },
            uploadUrl: {
                default: Util.apiUrl('/adminapi/myUpload', true)
            },
            data: {
                default: function () {
    				return {
                        file_type: "defaults"
                    };
    			}
            },
            defaultImgs: {
                default: ''
            },
            headers: {
                default: function () {
                    var token = getToken();
                    if (token && token != undefined && token != null && token != '') {
                        var token = JSON.parse(token);
                        return {
                            Authorization: token.token_type + ' ' + token.access_token
                        }
                    }
                    return {}
                }
            },
            noEdit: {
                default: false
            }
        },
        data () {
            return {
                showUploadList: false,
                format: ['jpg','jpeg','png', 'gif'],
                filename: "FileContent",
                maxSize: 10240,      // 10M,
                type: "drag",
                maxVisible: false,
                maxImgUrl: '',
                uploadList: []
            }
        },
        computed: {
            defaultList () {
                var defaultImgs = this.defaultImgs;
                var newImgs = [];

                if (defaultImgs == '') {

                } else if (typeof defaultImgs == 'string') {
                    newImgs[0] = {name: "default_0", url: defaultImgs};
                } else if (defaultImgs[0] != undefined) {
                    if (defaultImgs[0]['name'] == undefined) {   // 初始化成 name ,url 下标模式
                        for (var i in defaultImgs) {
                            newImgs[i] = {name: "default_" + i, url: defaultImgs[i]}; // 生成一个 唯一名称
                        }
                    } else {
                        newImgs = this.defaultImgs;
                    }
                }

                return newImgs;
            }
        },
        watch: {
            defaultImgs (newVal, oldVal) {
                this.initDefaultImgs();
            }
        },
        methods: {
            handleProgress (events, file) {
                // console.log(events)
                // console.log(file)
                // if (this.multiple) {
                //     this.uploadList.push(file);
                // }else {
                //     this.uploadList = [file];
                // }
            },
            handleSuccess (res, file) {
                // res 服务端返回，file 处理之后的结果，res == file.response;
                if (res.error == 0) {
                    file.url = res.filename;
                    file.name = file.name;

                    if (this.multiple) {
                        // this.uploadList.push(file);
                    }else {
                        this.uploadList = [file];
                    }
                }else {
                    this.$Notice.warning({
                        title: '图片上传失败',
                        desc: res.info
                    });
                }
            },
            handleFormatError (file) {
                // file 原始文件内容，包括，原始文件名， 修改时间大小，类型
                var format_str = " ";
                var format = this.format;
                for (var i in format) {
                    format_str += format[i] + " ";
                }
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请上传'+ format_str +'格式的图片。'
                });
            },
            handleMaxSize (file) {
                this.$Notice.warning({
                    title: '超出文件大小限制',
                    desc: '文件 ' + file.name + ' 太大，不能超过 10M。'
                });
            },
            handleBeforeUpload (file) {
                const img_length = this.multiple ? this.img_num : 1;
                const check = this.uploadList.length < img_length;

                if (!check && this.multiple) {
                    this.$Notice.warning({
                        title: '最多只能上传 '+ img_length +' 张图片。'
                    });
                }

                if (!this.multiple) {
                    this.uploadList = [];
                }

                // if (this.multiple) {
                //     this.uploadList.push(file);
                // }else {
                //     this.uploadList = [file];
                // }

                return check || !this.multiple;
            },
            handleRemove (file) {
                const fileList = this.uploadList;
                this.uploadList.splice(fileList.indexOf(file), 1);
            },
            handleView (file) {
                this.maxImgUrl = file['url'];
                this.maxVisible = true;
            },
            imgList () {
                var imgList = this.uploadList;

                if (this.multiple) {
                    var newImgs = [];
                    for (var i in imgList) {
                        newImgs[i] = imgList[i]['url'];
                    }
                } else {
                    var newImgs = imgList[0] != undefined ? imgList[0]['url'] : '';
                }

                return newImgs;
            },
            imgNameList () {
                var imgList = this.uploadList;

                if (this.multiple) {
                    var newImgs = [];
                    for (var i in imgList) {
                        newImgs[i] = {name: imgList[i]['name'], url: imgList[i]['url']};
                    }
                } else {
                    var newImgs = imgList[0] != undefined ? imgList[0]['url'] : '';
                }

                return newImgs;
            },
            imgFullList () {
                if (!this.multiple) {
                    return this.uploadList[0] != undefined ? this.uploadList[0]['url'] : '';
                }
                return this.uploadList;
            },
            initDefaultImgs () {
                var _this = this;
                _this.$nextTick(() => {
                    _this.uploadList = _this.$refs.upload.fileList;
                });
            }
        },
        created: function () {
        },
        mounted: function (){
            var _this = this;

            _this.initDefaultImgs();
        }
    };
</script>

<style scoped>
    .upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .upload-list img{
        width: 100%;
        height: 100%;
    }
    .upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .upload-list:hover .upload-list-cover{
        display: block;
    }
    .upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>
