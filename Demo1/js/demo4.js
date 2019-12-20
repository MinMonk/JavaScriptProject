$(function () {

    //模拟后台接口返回的数据
    var data = [{ "MAX_PAYLOAD_SIZE": 7514, "MIN_PAYLOAD_SIZE": 7514, "MAX_DURATION": 41, "AVG_PAYLOAD_SIZE": 2817, "MIN_DURATION": 8, "SERVICE_NAME_CN": "导入预算检查与保留信息路由服务(1)", "TOTAL_TIMES": 16, "SUCCESS_TIMES": 10, "AVG_DURATION": 7, "ERROR_TIMES": 6 },
    { "MAX_PAYLOAD_SIZE": 7514, "MIN_PAYLOAD_SIZE": 7514, "MAX_DURATION": 41, "AVG_PAYLOAD_SIZE": 7514, "MIN_DURATION": 8, "SERVICE_NAME_CN": "导入预算检查与保留信息路由服务(2)", "TOTAL_TIMES": 6, "SUCCESS_TIMES": 0, "AVG_DURATION": 19, "ERROR_TIMES": 6 },
    { "MAX_PAYLOAD_SIZE": 7514, "MIN_PAYLOAD_SIZE": 7514, "MAX_DURATION": 41, "AVG_PAYLOAD_SIZE": 7514, "MIN_DURATION": 8, "SERVICE_NAME_CN": "导入预算检查与保留信息路由服务(3)", "TOTAL_TIMES": 6, "SUCCESS_TIMES": 0, "AVG_DURATION": 19, "ERROR_TIMES": 6 },
    { "MAX_PAYLOAD_SIZE": 7514, "MIN_PAYLOAD_SIZE": 7514, "MAX_DURATION": 41, "AVG_PAYLOAD_SIZE": 7514, "MIN_DURATION": 8, "SERVICE_NAME_CN": "导入预算检查与保留信息路由服务(4)", "TOTAL_TIMES": 6, "SUCCESS_TIMES": 0, "AVG_DURATION": 19, "ERROR_TIMES": 6 }];

    //数据字典
    var dataDic = {
        MAX_PAYLOAD_SIZE: '最大数据量', MIN_PAYLOAD_SIZE: '最小数据量', AVG_PAYLOAD_SIZE: '平均数据量',
        SUCCESS_TIMES: '成功次数', ERROR_TIMES: '失败次数', TOTAL_TIMES: '总次数', SERVICE_NAME_CN: '服务名称',
        MAX_DURATION: '最大运行时间', MIN_DURATION: '最小运行时间', AVG_DURATION: '平均运行时间'
    };

    //颜色盒子，针对不同的图例显示不同的颜色
    var colorBox = {
        MAX_PAYLOAD_SIZE: '#33acfb', MIN_PAYLOAD_SIZE: '#8dc21f', AVG_PAYLOAD_SIZE: '#f24444',
        MAX_DURATION: '#33acfb', MIN_DURATION: '#8dc21f', AVG_DURATION: '#f24444',
        SUCCESS_TIMES: '#33acfb', ERROR_TIMES: '#f24444', PEAK_TIMES: '#33acfb'
    };

    //处理数据
    var resultData = generateData(data);
    var drawData = ininDrawData(resultData, dataDic, colorBox, ['MAX_DURATION', 'MIN_DURATION', 'AVG_DURATION']);

    // 画图
    drawBarPic('pic_one', drawData);

})

/**
 * 封装处理后台数据
 * @param {*} data 后台返回的数据
 */
function generateData(data) {
    var resultData = {};
    for (var item in data) {
        for (var key in data[item]) {
            var attr = {};
            attr.name = data[item].SERVICE_NAME_CN;
            attr.num = data[item][key];
            if (!resultData[key]) {
                resultData[key] = [attr];
            } else {
                resultData[key].push(attr);
            }

        }
    }
    return resultData;
}

/**
 * 初始化画图数据
 * @param {*} resultData 封装过后的后台数据
 * @param {*} dataDic 数据字典
 * @param {*} items 画图的项目
 */
function ininDrawData(resultData, dataDic, colorBox, items) {
    var drawData = {};
    for (var item in items) {
        drawData[items[item]] = resultData[items[item]];
    }
    var seriesData = [];
    var xAxisData = [];
    var temp;
    for (var item in drawData) {
        var attr = {};
        attr.type = "bar";
        attr.data = [];
        for (var i = 0; i < drawData[item].length; i++) {
            attr.data.push(drawData[item][i].num);
            if (!temp) {
                xAxisData.push(drawData[item][i].name);
            }
        }
        attr.name = dataDic[item];
        attr.itemStyle = { normal: { color: colorBox[item] } };
        temp = item;
        seriesData.push(attr);
    }

    var result = {};
    result.xAxisData = xAxisData;
    result.seriesData = seriesData;
    return result;
}

/**
 * 画柱状图
 * @param {*} id 节点ID
 * @param {*} drawData 画图的参数（xAxisData：X轴参数，seriesData：Y轴参数）
 */
function drawBarPic(id, drawData) {
    var xAxisData = drawData['xAxisData'];
    var seriesData = drawData['seriesData'];
    var legends = [];
    for (var i = 0; i < seriesData.length; i++) {
        legends.push(seriesData[i].name);
    }

    var myChart = echarts.init(document.getElementById(id));

    // 指定图表的配置项和数据
    var option = {
        //图例的设置
        legend: {
            orient: 'vertical',
            x: 'right',
            y: 'center',
            align: 'left',
            data: legends
        },
        //区域缩放组件
        dataZoom: [{
            type: 'inside',
            start: 0,
            end: 50
        },
        {
            show: true,
            xAxisIndex: 0,
            type: 'slider',
            bottom: 10,
            start: 0,
            end: 50
        }
        ],
        xAxis: {
            type: 'category',
            axisLabel: {
                interval: 0,
                rotate: 45,
                margin: 2,
                textStyle: {
                    color: "#222"
                }
            },
            data: xAxisData
        },
        yAxis: {
            type: 'value',
        },
        backgroundColor: '#fff',
        grid: {
            top: '6%',       //柱状图距离父容器div顶端的距离
            left: '2%',      //柱状图距离父容器div左端的距离
            right: '15%',    //柱状图距离父容器div右端的距离
            bottom: '0%',    //柱状图距离父容器div底端的距离
            containLabel: true  //grid 区域是否包含坐标轴的刻度标签
        },
        tooltip: {
            show: true
        },
        series: seriesData
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}