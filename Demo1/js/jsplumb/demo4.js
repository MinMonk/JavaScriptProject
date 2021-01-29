// $(function(){
//     $("#diagramContainer").draggable({containment: '#background'});
// })


var successStyle={
    PaintStyle: {
        stroke: '#49afcd', // 控制连接线条颜色
        strokeWidth: 3 // 控制连接线条粗细
    },
    ConnectorStyle: {
        lineWidth: 3,
        strokeStyle: "#49afcd",
        joinstyle: "round"
    },
    //鼠标经过样式
    HoverPaintStyle: {
        lineWidth: 3,
        strokeStyle: "#8ec22e"
    }
}

var errorStyle={
    PaintStyle: {
        stroke: 'red', // 控制连接线条颜色
        strokeWidth: 3 // 控制连接线条粗细
    },
    ConnectorStyle: {
        lineWidth: 3,
        strokeStyle: "red",
        joinstyle: "round"
    },
    //鼠标经过样式
    HoverPaintStyle: {
        lineWidth: 3,
        strokeStyle: "#8ec22e"
    }
}


jsPlumb.importDefaults({
    Connector: ['Flowchart'],
    DragOptions: {
        cursor: 'pointer'
    },
    EndpointStyle: {
        fillStyle: '#225588'
    },
    Endpoint: ["Dot", {
        radius: 1
    }],
    ConnectionOverlays: [
        ["Arrow", {
            location: 1
        }],
        ["Label", {
            location: 0.25,
            id: "label",
            cssClass: "aLabel"
        }]
    ],
    PaintStyle: successStyle.PaintStyle,
    ConnectorStyle: successStyle.ConnectorStyle,
    HoverPaintStyle: successStyle.HoverPaintStyle,
    Anchor: 'Continuous',
    ConnectorZIndex: 5,
    ConnectionsDetachable: false
})


jsPlumb.ready(function () {
    jsPlumb.setContainer(document.getElementById("diagramContainer"))
    jsPlumb.makeSource(jsPlumb.getSelector(".item"), {
        dropOptions: {
            hoverClass: "hover",
            activeClass: "active"
        },
        maxConnections: -1
    });

    jsPlumb.makeTarget(jsPlumb.getSelector(".item"), {
        dropOptions: {
            hoverClass: "hover",
            activeClass: "active"
        },
        maxConnections: -1
    });


    // 控制节点是否支持拖拽
    jsPlumb.draggable(jsPlumb.getSelector(".item"), {
        containment: 'parent'
    });

    jsPlumb.connect({
        source: 'item_left',
        target: 'item_right',
    })
    jsPlumb.connect({
        source: 'item_left',
        target: 'item_right2_1',
        paintStyle: errorStyle.PaintStyle,
        connectorStyle: errorStyle.ConnectorStyle,
        hoverPaintStyle: errorStyle.HoverPaintStyle
    })
    jsPlumb.connect({
        source: 'item_right2_1',
        target: 'item_right2',
    })
    jsPlumb.connect({
        source: 'item_right2_1',
        target: 'item_right3',
    })
})