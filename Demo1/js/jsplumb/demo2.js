jsPlumb.ready(function () {
    // 定义公共样式
    var commonStyle = {
        endpoint: 'Dot', //控制端点类型，形状[Dot:圆点 Rectangle：方块]
        connector: ['Straight'],
        anchor: ['Left', 'Right'], // 设置连接锚点的位置(Top|Right|Bottom|Left 首字母要大写)
        paintStyle: {
            stroke: 'lightgray', // 控制连接线条颜色
            strokeWidth: 3 // 控制连接线条粗细
        },
        endpointStyle: {
            fill: 'green', //设置连接端点的颜色
            outlineStroke: 'red', //设置连接端点的border颜色
            outlineWidth: 5 //怀疑是设置border宽度的，但是设置了么有作用
        },
        overlays: [
            ['Arrow', { //[Arrow:一个可配置的箭头, Label:标签，可以在链接上显示文字信息, PlainArrow:原始类型的箭头, Diamond:菱形箭头, Custom:自定义类型 ]
                width: 30, //设置连接线上箭头的宽度
                length: 30, //设置连接线上箭头的长度
                location: 0.8 //设置连接线上箭头的位置
            }]
        ]
    }

    // 控制连接的方法，第二个参数commonStyle会和第一个参数合并为一个对象
    jsPlumb.connect({
        source: 'item_left',
        target: 'item_right'
    }, commonStyle)

    // 控制节点是否支持拖拽
    jsPlumb.draggable('item_left', {
        containment: 'diagramContainer'
    })
    jsPlumb.draggable('item_right')
})