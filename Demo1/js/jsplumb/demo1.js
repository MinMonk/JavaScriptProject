jsPlumb.ready(function () {
    jsPlumb.connect({
        source: 'item_left',
        target: 'item_right',
        endpoint: 'Rectangle' //控制端点类型，形状[Dot:圆点 Rectangle：方块] 默认值Dot
    })
})