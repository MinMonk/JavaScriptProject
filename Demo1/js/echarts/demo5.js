$(function () {
    drawMain1();

    // var colorBox = ['white', '#FFE9BB', '#FFD1A7', '#FFBB95', '#FFA383', '#FF8D70', '#FF745C', '#FF5C4A', '#FF4638', '#FF2E26', '#FF1812'];
    // generatePieces(Math.floor(Math.random() * 100000), colorBox);
    // generatePieces(76769, colorBox);

})


function drawMain1() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main1'));


    var mydate = new Date();
    var year = mydate.getFullYear();
    var first_half_year = getBetweenDay(year + '-01-01', year + '-06-30');
    var second_half_year = getBetweenDay(year + '-07-01', year + '-12-31');


    var maxValue = getMaxValue(first_half_year);
    maxValue = getMaxValue(second_half_year, maxValue);
    maxValue = getRoundNum(maxValue);

    var colorBox = ['white', '#FFE9BB', '#FFD1A7', '#FFBB95', '#FFA383', '#FF8D70', '#FF745C', '#FF5C4A', '#FF4638', '#FF2E26', '#FF1812'];

    // 指定图表的配置项和数据
    var option = {
        backgroundColor: '#fff',
        title: {
            top: 30,
            left: 'center',
            text: year + '年某人每天的步数'
        },
        tooltip: {
            position: 'top',
            formatter: function (params) {
                return params.value[0] + '<br/>' + params.marker + '交易量:'
                    + params.value[1];
            }
        },
        visualMap: {
            min: 0,
            max: maxValue,
            type: 'piecewise',
            align: 'left',
            orient: 'vertical',  //vertical  horizontal
            left: 'right',
            top: 'bottom',
            textGap: 5,
            itemGap: 5,
            pieces: generatePieces(maxValue, colorBox)
        },
        calendar: [{
            top: 90,
            left: 30,
            right: 150,
            cellSize: ['auto', 15],
            range: [year + '-01-01', year + '-06-30'],
            itemStyle: {
                normal: {
                    borderWidth: 0.5
                }
            },
            yearLabel: {
                show: false
            }
        }, {
            left: '5%',
            right: 150,
            top: '55%',
            yearLabel: {
                show: false
            },
            range: [year + '-07-01', year + '-12-31'],
            cellSize: ['auto', '15']
        }],
        series: [{
            type: 'heatmap',
            coordinateSystem: 'calendar',
            calendarIndex: 0,
            data: first_half_year
        },
        {
            type: 'heatmap',
            coordinateSystem: 'calendar',
            calendarIndex: 1,
            data: second_half_year
        }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

// 获取指定日期间的所有日期
function getBetweenDay(begin, end) {
    var betweenTimeArr = [];
    var ab = begin.split('-');
    var ae = end.split('-');
    var db = new Date();
    db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
    var de = new Date();
    de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
    var unixDb = db.getTime();
    var unixDe = de.getTime();
    for (var k = unixDb; k <= unixDe;) {
        betweenTimeArr.push([new Date(parseInt(k)).format(), Math.floor(Math.random() * 100000)]);
        k = k + 24 * 60 * 60 * 1000;
    }
    return betweenTimeArr;
}


//获取日期
Date.prototype.format = function (pra) {
    var s = '';
    var mouth = (this.getMonth() + 1) >= 10 ? (this.getMonth() + 1)
        : ('0' + (this.getMonth() + 1));
    var day = this.getDate() >= 10 ? this.getDate() : ('0' + this.getDate());
    s += this.getFullYear() + '-'; // 获取年份。
    s += mouth + "-"; // 获取月份。
    if (pra == "01") {
        s += "01";
    } else {
        s += day; // 获取日。
    }

    return (s); // 返回日期。
};

/**
 * 获取数据中的最大值
 * @param {*} data 数据
 * @param {*} maxValue 最大值
 */
function getMaxValue(data, maxValue) {
    if (!maxValue) {
        maxValue = 0;
    }
    for (var d in data) {
        if (maxValue < data[d][1]) {
            maxValue = data[d][1];
        }
    }
    maxValue = maxValue <= 100 ? 100 : maxValue;
    return maxValue;
}

/**
 * 封装服务次数区间数据
 * @param {*} maxValue 最大值
 * @param {*} colorBox 区间颜色集
 */
function generatePieces(maxValue, colorBox) {
    var pieces = [];
    var quotient = 1;
    var temp = {};
    temp.lt = 1;
    temp.label = '0';
    temp.color = colorBox[0];
    pieces.push(temp);

    if (maxValue && maxValue >= 10) {

        quotient = Math.floor(maxValue / 10);

        for (var i = 1; i <= 10; i++) {
            var temp = {};
            if (i == 1) {
                temp.gte = 1;
            } else {
                temp.gte = quotient * (i - 1);
            }
            temp.lte = quotient * i;
            temp.color = colorBox[i];
            // temp.label = '等级'+i;
            pieces.push(temp);
        }
    }

    return pieces;
}

/**
 * 获取最大值的整数
 * @param {*} num 最大值
 */
function getRoundNum(num) {
    if (num % 10 == 0) {
        return num;
    }
    var index = Math.floor(num.toString().length / 2);
    var flag = num.toString().length % 2 == 0 ? true : false;
    var temp = (num + getNum(index)).toString();
    index = flag ? index - 1 : index;
    var result = '';
    for (var i = 0; i < temp.length; i++) {
        if (i <= index) {
            result += temp[i];
        } else {
            result += '0';
        }
    }
    return parseInt(result);
}

/**
 * 获取对应位数的整数，如100,1000,1000
 * @param {*} num '0'的个数
 */
function getNum(num) {
    var result = '1';
    while (num > 0) {
        result += '0';
        num--;
    }
    return parseInt(result);
}
