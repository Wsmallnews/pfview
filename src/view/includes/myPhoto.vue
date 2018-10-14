<template>
    <div class="upload-index">
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
            :multiple="true"
            :type="type"
            :action="uploadUrl"
            style="width:200px;"
            >
            <div style="padding: 10px 0; width:200px;">
                <Icon type="ios-cloud-upload" size="32" style="color: #3399ff"></Icon>
                <p>点击或者将图片拖拽到此区域</p>
            </div>
        </Upload>


        <div class="photo">
            <div class="img-box" v-for="(item, index) in uploadList">
                <Button type="error" class="close" shape="circle" icon="md-close" @click="handleRemove(item)" ></Button>
                <img :src="item.url" />
            </div>
        </div>
    </div>
</template>
<script>
    import Util from '@/libs/util';
    import $ from 'jquery';

    export default {
        props: {
            multiple: {
                default: true
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
                    return {};
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
                maxSize: 51200,      // 10M,
                type: "drag",
                maxVisible: false,
                maxImgUrl: '',
                uploadList: [],
                tempList: []
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
            draw () {
                this.tempList = JSON.parse(JSON.stringify(this.uploadList));
            },
            handleSuccess (res, file) {
                // res 服务端返回，file 处理之后的结果，res == file.response;
                if (res.error == 0) {
                    file.url = res.filename;
                    file.name = file.name;

                    // 不知道什么原因，不同于 myUpload,数据变化， 视图却不更新
                    for (var i in this.uploadList) {
                        this.$set(this.uploadList, i, this.uploadList[i]);
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
                    desc: '文件 ' + file.name + ' 太大，不能超过 50M。'
                });
            },
            handleBeforeUpload (file) {
                const img_length = 50;
                const check = this.uploadList.length < img_length;

                file.url = '';

                if (!check) {
                    this.$Notice.warning({
                        title: '最多只能上传 '+ img_length +' 张图片。'
                    });
                }
                return check;
            },
            handleRemove (file) {
                const fileList = this.uploadList;
                // console.log(file)
                // console.log(fileList)

                this.uploadList.splice(fileList.indexOf(file), 1);
                // this.draw();
            },
            handleView (file) {
                this.maxImgUrl = file['url'];
                this.maxVisible = true;
            },
            imgList () {
                var imgList = this.uploadList;

                var newImgs = [];
                for (var i in imgList) {
                    newImgs[i] = imgList[i]['url'];
                }

                return newImgs;
            },
            imgNameList () {
                var imgList = this.uploadList;

                var newImgs = [];
                for (var i in imgList) {
                    newImgs[i] = {name: imgList[i]['name'], url: imgList[i]['url']};
                }

                return newImgs;
            },
            imgFullList () {
                return this.uploadList;
            },
            initDefaultImgs () {
                var _this = this;
                _this.$nextTick(() => {
                    _this.uploadList = _this.$refs.upload.fileList;
                    _this.draw();
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
.photo {
    /* position: fixed;
    right: 100px;
    top: 100px; */
    margin-top: 10px;
    border: 1px solid #929292;
    overflow: auto;
    width: 375px;
    height: 667px;
}

.photo img {
    margin: 0;
    padding: 0;
    width: 100%;
}

.photo .img-box {
    position: relative;
}

.photo .img-box .close{
    position: absolute;
    right: 5px;
    top: 5px;
    width: 25px;
    height: 25px;
}
</style>
