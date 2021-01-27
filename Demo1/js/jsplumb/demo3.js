jsPlumb.ready(function () {
    jsPlumb.setContainer('diagramContainer')

    var common = {
        isSource: true,
        isTarget: true,
        connector: ['Straight'],
        endpoint: 'Dot',
        maxConnections: -1,  //设置锚点可以连接的数量，-1表示不做限制
        // 设置锚点样式
        paintStyle: {
            fill: 'red', //设置锚点填充颜色
            outlineStroke: 'blue', // 设置锚点的外border颜色
            strokeWidth: 3 // 设置锚点的外border粗细
        },
        // 设置锚点样式（优先级高于painStyle，可以重写painStyle的样式）
        endpointStyle: {
            fill: 'green', //设置连接端点的颜色
            outlineStroke: 'red', //设置连接端点的border颜色
            strokeWidth: 5 // 设置锚点的外border粗细
        },
        // 设置鼠标悬浮在锚点上的样式
        hoverPaintStyle: {
            outlineStroke: 'lightblue',
            strokeWidth: 5
        },
        // 设置连接线条的样式
        connectorStyle: {
            outlineStroke: 'green',
            strokeWidth: 1
        },
        // 设置鼠标悬浮在连接线上的样式
        connectorHoverStyle: {
            outlineStroke: 'red', // 线条颜色
            strokeWidth: 5 //线条粗细
        }
    }

    // 添加可以连线的锚点
    jsPlumb.addEndpoint('item_left', {
        anchors: ['Right', 'Top'] //不支持传入数组的方式来添加两个锚点，如果要添加多个锚点，需要像下面的方式一个一个的添加锚点
    }, common)

    jsPlumb.addEndpoint('item_right', {
        anchor: 'Left'
    }, common)

    jsPlumb.addEndpoint('item_right', {
        anchor: 'Right'
    }, common)

    // 控制节点是否支持拖拽
    jsPlumb.draggable('item_left')
    jsPlumb.draggable('item_right')


    // 一般来说拖动创建的链接，可以再次拖动，让链接断开。如果不想触发这种行为，可以设置。
    jsPlumb.importDefaults({
        ConnectionsDetachable: false
    })

    // 给连接线绑定单击事件
    jsPlumb.bind('click', function (conn, originalEvent) {
        if (window.prompt('确定删除所点击的链接吗？ 输入1确定') === '1') {
            jsPlumb.detach(conn)
        }
    })

    // 删除节点及节点上的连线
    // setTimeout(function () {
    //     jsPlumb.remove('item_left')
    // }, 3000)
})