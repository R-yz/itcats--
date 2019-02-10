<template>
    <div id="echart">

    </div>
</template>

<script>
export default {
    mounted() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = this.$echarts.init(document.getElementById('echart'));

        // 指定图表的配置项和数据
        var option = {
            title: {
                text: '图表'
            },
            tooltip: {},
            legend: {
                data: ['销量']
            },
            xAxis: {
                data: ["a", "b", "c", "d", "e", "f"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [6, 23, 2, 43, 76, 23]
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }
}
</script>

<style>
#echart {
    width: 100%;
    height: 100%;
}
</style>
