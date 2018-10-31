<template>
    <div>
        <Row :gutter="20">
            <i-col :xs="12" :md="8" :lg="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;padding-bottom: 10px;">
                <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
                    <count-to :end="infor.count" count-class="count-style" />
                    <p>{{ infor.title }}</p>
                </infor-card>
            </i-col>
        </Row>
        <Row :gutter="20" style="margin-top: 10px;">
            <i-col>
                <Card shadow>
                    <chart-bar ref="achievementBar" style="height: 300px;" :value="achievementData" :isHandStart="true" text="近一月销售业绩概览" />
                </Card>
            </i-col>
        </Row>
        <Row :gutter="20" style="margin-top: 20px;">
            <i-col>
                <Card shadow>
                    <chart-bar ref="reimburBar" style="height: 300px;" :value="reimburData" :isHandStart="true" text="近一月报销金额概览" />
                </Card>
            </i-col>
        </Row>
    </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
import Example from './example.vue'
import Util from '@/libs/util';

export default {
    name: 'home',
    components: {
        InforCard,
        CountTo,
        ChartPie,
        ChartBar,
        Example
    },
    data() {
        return {
            inforCardData: [],
            achievementData: {},
            reimburData: {}
        }
    },
    created () {
        var _this = this;
        Util.ajax({
            url: '/adminapi/index/cardInfo',
            method: 'get',
            success: function(result) {
                if (result.error == 0) {
                    var data = result.result;

                    _this.inforCardData = [
                        { title: '近一月销售额', icon: 'md-person-add', count: data.total_achievement, color: '#2d8cf0' },
                        { title: '近一月报销费用', icon: 'md-locate', count: data.total_reimbur, color: '#19be6b' },
                        { title: '近一月kpi 未完成数', icon: 'md-help-circle', count: data.total_kpi_no_finish, color: '#ff9900' },
                        { title: '近一月发放奖金', icon: 'md-share', count: data.total_prize, color: '#ed3f14' },
                        { title: '近一月发放佣金', icon: 'md-chatbubbles', count: data.total_commission, color: '#E46CBB' },
                        // { title: '新增页面', icon: 'md-map', count: 14, color: '#9A66E4' }
                    ]
                } else {
                    _this.$Notice.error({ title: '提示', desc: result.info })
                }
            }
        })

        Util.ajax({
            url: '/adminapi/index/prevAchievement',
            method: 'get',
            success: function(result) {
                if (result.error == 0) {
                    _this.achievementData = result.result;
                    _this.$refs['achievementBar'].show();
                } else {
                    _this.$Notice.error({ title: '提示', desc: result.info })
                }
            }
        })

        Util.ajax({
            url: '/adminapi/index/prevReimbur',
            method: 'get',
            success: function(result) {
                if (result.error == 0) {
                    _this.reimburData = result.result;
                    _this.$refs['reimburBar'].show();
                } else {
                    _this.$Notice.error({ title: '提示', desc: result.info })
                }
            }
        })
    },
    mounted() {
    }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>
