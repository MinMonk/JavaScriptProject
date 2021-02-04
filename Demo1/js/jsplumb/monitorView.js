(function ($) {
    var defaults = {
        data: {},
        reDraw: true,//每次重绘
        enableDraggable: true,//允许拖拽
        fnClick: function () {
        	console.log("单击");
        },
        fnRepeat: function () {
            console.log("步骤连接重复");
        },
        mtAfterDrop: function (params) {

        }
    }

    /**
     * 初始化jsPlumb默认参数
     */
    var initJsPlumbDefaultParam = function () {
        // 设置页面上的控件允许拖拽,并设置只能在容器范围内拖拽
        var enableDraggable = defaults.enableDraggable;
        if (enableDraggable) {
            jsPlumb.draggable(jsPlumb.getSelector(".item"), {
                containment: 'parent'
            });
        }

        //绑定添加连接操作。画线-input text值  拒绝重复连接
        jsPlumb.bind("jsPlumbConnection", function (info) {
            setConnections(info.connection)
        });

        //绑定删除connection事件
        jsPlumb.bind("jsPlumbConnectionDetached", function (info) {
            setConnections(info.connection, true);
        });
    }


    /**
     * 根据data初始化界面中的元素item
     * @param {*} _canvas  画布div
     * @param {*} data 画图数据
     */
    var initItem = function (_canvas, data) {
        $.each(data, function (i, row) {
            var itemId = "item_" + row.id,
                style = row.style,
                status = row.status,
                label_text = row.label_text;

            if (!label_text) {
                return false;
            }

            var _class = "success-item";
            if (status && "N" == status) {
                _class = "error-item "
            }

            var itemDiv = document.createElement('div');
            var _itemDiv = $(itemDiv)
            _itemDiv.attr("id", itemId);
            _itemDiv.attr("style", style);
            _itemDiv.attr("line", row.line);
            _itemDiv.attr("process_id", row.id);
            _itemDiv.attr("process_to", row.process_to);
            _itemDiv.addClass("item btn-small  " + _class);
            _itemDiv.html(label_text);
            _canvas.append(_itemDiv);
        })
    }

    /**
     * 连接成功的回调函数
     * @param {*} params 
     */
    function mtAfterDrop(params) {
        defaults.mtAfterDrop({
            sourceId: $("#" + params.sourceId).attr('process_id'),
            targetId: $("#" + params.targetId).attr('process_id')
        });
    }

    /*设置隐藏域保存关系信息*/
    var aConnections = [];
    var setConnections = function (conn, remove) {
        if (!remove) aConnections.push(conn);
        else {
            var idx = -1;
            for (var i = 0; i < aConnections.length; i++) {
                if (aConnections[i] == conn) {
                    idx = i;
                    break;
                }
            }
            if (idx != -1) aConnections.splice(idx, 1);
        }
        if (aConnections.length > 0) {
            var s = "";
            for (var j = 0; j < aConnections.length; j++) {
                var from = $('#' + aConnections[j].sourceId).attr('process_id');
                var target = $('#' + aConnections[j].targetId).attr('process_id');
                s = s + "<input type='hidden' value=\"" + from + "," + target + "\">";
            }
            $('#activity_process_info').html(s);
        } else {
            $('#activity_process_info').html('');
        }
        jsPlumb.repaintEverything(); //重画
    };

    /**
     * 遍历页面元素，完成连线操作
     */
    var conn_ = function () {
        $(".item").each(function (i, e) {
            var item = $(this);
            var process_id = item.attr("process_id");
            var process_to = item.attr("process_to");

            if (process_to) {
                if(process_to.indexOf(",") > 0){
                    var _to = process_to.split(",");
                    _to.forEach(function (e) {
                        if (e) {
                            connect(process_id, e.trim())
                        }
                    })
                }else{
                    connect(process_id, process_to.trim())
                }
            }
        });
    }

    // 连线方法
    var connect = function (sourceId, targetId) {
        // 设置连线的公共样式
        var commonStyle = {
            endpoint: ["Dot", {
                radius: 0.5
            }], //控制端点类型，形状[Dot:圆点 Rectangle：方块]
            paintStyle: {
                stroke: '#49afcd', // 控制连接线条颜色
                strokeWidth: 3 // 控制连接线条粗细
            },
            connector: ["Flowchart", {//设置连线为折线图,连接线的样式种类有[Bezier],[Flowchart],[StateMachine ],[Straight ]
                stub: [0, 0],
                // gap: 0, // 连线到锚点的距离
                // cornerRadius: 5, // 流程线转角的圆角
                // alwaysRespectStubs: true
            }],
            anchor: 'Continuous',
            connectorZIndex: 5,
            overlays: [
                ["Arrow", {
                    location: 1  //设置箭头的位置
                }]
            ]
        }

        // 如果目标段的状态是失败的，就让连线为红色
        var _error = $("#item_" + targetId).hasClass("error-item");
        if (_error) {
            commonStyle.paintStyle = {
                stroke: 'red', // 控制连接线条颜色
                strokeWidth: 3 // 控制连接线条粗细
            }
        }

        jsPlumb.connect({
            source: "item_" + sourceId,
            target: "item_" + targetId
        }, commonStyle);
    }
    

    $.fn.monitorView = function (options) {
        /**
         * 将入参绑定到当前类的私有变量defaults中，完成值的覆盖.
         * 有点类似于java的构造方法，defauls变量为当前类的私有变量
         *  */
        $.each(options, function (i, val) {
            defaults[i] = val;
        });

        if(defaults.reDraw){
        	$(".item").remove();
        	jsPlumb.ready(function () {
        		jsPlumb.deleteEveryEndpoint();
        		jsPlumb.deleteEveryConnection();
        		$('#activity_process_info').html('');
        		jsPlumb.repaintEverything();
        	})
        }

        //右键步骤的步骤号
        var _canvas = $(this);
        jsPlumb.setContainer(_canvas);
        _canvas.append('<input type="hidden" id="serviceview_active_id" value="0"/><input type="hidden" id="leipi_copy_id" value="0"/>');
        _canvas.append('<div id="activity_process_info"></div>');
        
        var processData = defaults.data;
        initItem(_canvas, processData);
        initJsPlumbDefaultParam();

        // 绑定单击事件
        var firstTime = 0;
        var lastTime = 0;
        var interval = 200;
        var clickKey = false;
        $(".item").on('click', function () {
            //激活
            _canvas.find('#serviceview_active_id').val($(this).attr("process_id"));
            var obj = this;
            if (clickKey) {
                defaults.fnClick();
                clickKey = false;
            }
        }).on('mousedown', function () {
            firstTime = new Date().getTime();
        }).on('mouseup', function () {
            lastTime = new Date().getTime();
            if (lastTime - firstTime < interval) {
                clickKey = true;
            }
        });

        jsPlumb.ready(function () {
        	jsPlumb.deleteEveryEndpoint();
        	jsPlumb.deleteEveryConnection();
        	$('#activity_process_info').html('');
            jsPlumb.repaintEverything();
            conn_();
        })

        var extendFunction = {
            refresh: function () {
                alert('refresh');
            }
        }
        return extendFunction;
    }
})(jQuery);
