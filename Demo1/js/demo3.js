$(function () {
    var data = [
        { value: 335, name: '直接访问' },
        { value: 310, name: '邮件营销' },
        { value: 234, name: '联盟广告' },
        { value: 135, name: '视频广告' },
        { value: 1548, name: '搜索引擎' }
    ];
    drawPiePic('container', data)
})

/**
 * 画饼状图
 * @param {*} documentId 节点ID
 * @param {*} data 填充数据
 */
function drawPiePic(documentId, data) {
    var legendData = [];
    for(var item in data){
        legendData.push(data[item].name);
    }

    var myChart = echarts.init(document.getElementById(documentId));

    // 指定图表的配置项和数据
    var option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: legendData
        },
        series: [
            {
                // name: '访问来源',
                type: 'pie',
                radius: '25%',
                center: ['50%', '60%'],
                data: data,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}