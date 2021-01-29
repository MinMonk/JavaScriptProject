(function ($) {
    var defaults = {
        data: {},
        fnClick: function () {
            alert("单击");
        },
        fnRepeat: function () {
            console.log("步骤连接重复");
        },
        mtAfterDrop: function (params) {

        },
        connectorPaintStyle: {
            lineWidth: 3,
            strokeStyle: "#49afcd",
            joinstyle: "round"
        },
        //鼠标经过样式
        connectorHoverStyle: {
            lineWidth: 3,
            strokeStyle: "#8ec22e"
        }
    }

    /**
     * 初始化jsPlumb默认参数
     */
    var initJsPlumbDefaultParam = function () {
        // jsPlumb.importDefaults({
        //     DragOptions: {
        //         cursor: 'pointer'
        //     },
        //     EndpointStyle: {
        //         fillStyle: '#225588'
        //     },
        //     Endpoint: ["Dot", {
        //         radius: 1
        //     }],
        //     ConnectionOverlays: [
        //         ["Arrow", {
        //             location: 1
        //         }],
        //         ["Label", {
        //             location: 0.25,
        //             id: "label",
        //             cssClass: "aLabel"
        //         }]
        //     ],
        //     Anchor: 'Continuous',
        //     ConnectorZIndex: 5,
        //     ConnectionsDetachable: false
        // });

        // 设置页面上的控件允许拖拽,并设置只能在容器范围内拖拽
        var enableDraggable = defaults.enableDraggable;
        if (enableDraggable) {
            jsPlumb.draggable(jsPlumb.getSelector(".item"), {
                containment: 'parent'
            });
        }

        //绑定添加连接操作。画线-input text值  拒绝重复连接
        jsPlumb.bind("connection", function (info) {
            setConnections(info.connection)
        });
        //绑定删除connection事件
        jsPlumb.bind("jsPlumbConnectionDetached", function (info) {
            setConnections(info.connection, true);
        });
    }


    /**
     * 根据data初始化界面中的元素item
     * @param {*} data 
     */
    var initItem = function (_canvas, data) {
        $.each(data, function (i, row) {
            var itemDiv = document.createElement('div');
            var itemId = "item_" + row.id,
                style = row.style,
                status = row.status,
                label_text = row.label_text;
            var _class = "success-item";
            if (status && "N" == status) {
                _class = "error-item "
            }

            var _itemDiv = $(itemDiv)
            _itemDiv.attr("id", itemId);
            _itemDiv.attr("style", style);
            _itemDiv.attr("line", row.line);
            _itemDiv.attr("process_id", row.id);
            _itemDiv.addClass("item btn-small  " + _class);
            _itemDiv.html(label_text);
            _canvas.append(_itemDiv);
        })
    }

    /**
     * 初始化端点
     */
    var initEndPoints = function () {
        $(".item").each(function (i, e) {
            var _faces = ["top", "right", "bottom", "left"];
            var e = $(e);
            if (e && $(e.attr("line"))) {
                var line = e.attr("line");
                if (line == 1) {
                    _faces = ["top"];
                } else if (line == 2) {
                    _faces = ["right"];
                } else if (line == 3) {
                    _faces = ["bottom"];
                } else if (line == 4) {
                    _faces = ["left"];
                } else if (line == 13) {
                    _faces = ["top", "bottom"];
                } else if (line == 24) {
                    _faces = ["right", "left"];
                }
            }

            jsPlumb.makeSource($(e), {
                anchor: ["Continuous", {
                    faces: _faces
                }],
                endpoint: ["Dot", {
                    radius: 1
                }],
                connector: ["Flowchart", {
                    stub: [30, 30]
                }],
                dragOptions: {},
                maxConnections: -1
            });

            jsPlumb.makeTarget($(e), {
                anchor: ["Continuous", {
                    faces: _faces
                }],
                dropOptions: {
                    hoverClass: "hover",
                    activeClass: "active"
                },
                endpoint: ["Dot", {
                    radius: 1
                }],
                maxConnections: -1,
                beforeDrop: function (params) {
                    if (params.sourceId == params.targetId) return false;
                    var j = 0;
                    $('#activity_process_info').find('input').each(function (i) {
                        var str = $('#' + params.sourceId).attr('process_id') + ',' + $('#' + params.targetId).attr('process_id');
                        if (str == $(this).val()) {
                            j++;
                            return;
                        }
                    })
                    if (j > 0) {
                        defaults.fnRepeat();
                        return false;
                    } else {
                        mtAfterDrop(params);
                        return true;
                    }
                }
            });
        });
    }

    //连接成功回调函数
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


    $.fn.drawPic = function (options) {
        var _canvas = $(this);
        //右键步骤的步骤号
        _canvas.append('<input type="hidden" id="serviceview_active_id" value="0"/><input type="hidden" id="leipi_copy_id" value="0"/>');
        _canvas.append('<div id="activity_process_info"></div>');

        /**
         * 将入参绑定到当前类的私有变量defaults中，完成值的覆盖.
         * 有点类似于java的构造方法，defauls变量为当前类的私有变量
         *  */
        $.each(options, function (i, val) {
            if (typeof val == 'object' && defaults[i])
                $.extend(defaults[i], val);
            else
                defaults[i] = val;
        });

        jsPlumb.setContainer(_canvas);
        // if ($.browser.msie && $.browser.version < '9.0') { //ie9以下，用VML画图
        //     jsPlumb.setRenderMode(jsPlumb.VML);
        // } else { //其他浏览器用SVG
        //     jsPlumb.setRenderMode(jsPlumb.SVG);
        // }

        var processData = defaults.data;
        initItem(_canvas, processData);
        initJsPlumbDefaultParam();
        initEndPoints();

        // 绑定单击事件
        $(".item").on('click', function () {
            defaults.fnClick();
        });

        jsPlumb.ready(function () {
            jsPlumb.connect({
                source: 'item_3',
                target: 'item_4'
            })
            jsPlumb.connect({
                source: 'item_3',
                target: 'item_5'
            })
        })

        var extendFunction = {
            refresh: function () {
                alert('refresh');
            }
        }
        return extendFunction;
    }



})(jQuery);