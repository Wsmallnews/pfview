<template>
    <div class="my-field">
        <template v-if="item.type == 'text' || item.type == 'number'">
            <Input v-model="currentValue" :placeholder="item.name"></Input>
        </template>
        <template v-else-if="item.type == 'select'">
            <Select v-model="currentValue" style="width:200px" >
                <Option v-for="ite in item.store_range_array" :value="ite.value" :key="ite.value" :label="ite.name"></Option>
            </Select>
        </template>
        <template v-else-if="item.type == 'select_multiple'">
            <Select v-model="currentValue" multiple style="width:200px" >
                <Option v-for="ite in item.store_range_array" :value="ite.value" :key="ite.value" :label="ite.name"></Option>
            </Select>
        </template>
        <template v-else-if="item.type == 'textarea'">
            <Input v-model="currentValue" type="textarea" :autosize="{minRows: 2,maxRows: 5}" ></Input>
        </template>
        <template v-else-if="item.type == 'color_picker'">
            <ColorPicker v-model="currentValue" />
        </template>
    </div>
</template>
<script>
    import Util from '@/libs/util';

    export default {
        props: [
            'item',
            'value'
        ],
        data () {
            return {
                currentValue: '',
            }
        },
        watch: {
            currentValue (newVal) {
                this.$emit('input', newVal)
            }
        },
        created() {
            this.currentValue = (this.value === undefined || this.value === null) ? '' :
                                this.value;
        }
    };
</script>

<style scoped>
.my-field {
    float: left;
}
</style>
