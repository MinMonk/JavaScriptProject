(function ($) {
    var defaults = {
        processData: {}, //步骤节点数据
        fnRepeat: function () {
            //alert("步骤连接重复");
        },
        fnClick: function () {
            alert("单击");
        },
        fnDbClick: function () {
            alert("双击");
        },
        fnLabelClick: function (to_data, labelOverlay, originalEvent) {
            //alert("Label click");
        },
        canvasMenus: {
            "one": function (t) {
                alert('画面右键')
            }
        },
        processMenus: {
            "one": function (t) {
                alert('步骤右键')
            }
        },
        /*右键菜单样式*/
        menuStyle: {
            border: '1px solid #5a6377',
            minWidth: '150px',
            padding: '5px 0'
        },
        itemStyle: {
            fontFamily: 'verdana',
            color: '#333',
            border: '0',
            /*borderLeft:'5px solid #fff',*/
            padding: '5px 40px 5px 20px'
        },
        itemHoverStyle: {
            border: '0',
            /*borderLeft:'5px solid #49afcd',*/
            color: '#fff',
            backgroundColor: '#e6e6e6'
        },
        mtAfterDrop: function (params) {
            //alert('连接成功后调用');
            //alert("连接："+params.sourceId +" -> "+ params.targetId);
        },
        //这是连接线路的绘画样式
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

    }; /*defaults end*/

    var initEndPoints = function () {
        $(".process-flag").each(function (i, e) {
            var p = $(e).parent();
            var _faces = ["top", "right", "bottom", "left"];

            if (p && p.attr("line")) {
                var line = p.attr("line");
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
                parent: p,
                //anchor:[ "Continuous", { faces:["top","bottom"] }],
                anchor: ["Continuous", {
                    faces: _faces
                }],
                endpoint: ["Dot", {
                    radius: 1
                }],
                connector: ["Flowchart", {
                    stub: [30, 30]
                }],
                connectorStyle: defaults.connectorPaintStyle,
                hoverPaintStyle: defaults.connectorHoverStyle,
                dragOptions: {},
                maxConnections: -1
            });

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

    $.fn.ServiceView = function (options) {
        var _canvas = $(this);
        //右键步骤的步骤号
        _canvas.append('<input type="hidden" id="serviceview_active_id" value="0"/><input type="hidden" id="leipi_copy_id" value="0"/>');
        _canvas.append('<div id="activity_process_info"></div>');


        /*配置*/
        $.each(options, function (i, val) {
            if (typeof val == 'object' && defaults[i])
                $.extend(defaults[i], val);
            else
                defaults[i] = val;
        });
        /*画布右键绑定*/
        var contextmenu = {
            bindings: defaults.canvasMenus,
            menuStyle: defaults.menuStyle,
            itemStyle: defaults.itemStyle,
            itemHoverStyle: defaults.itemHoverStyle
        }
        //$(this).contextMenu('canvasMenu', contextmenu);

        jsPlumb.importDefaults({
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
            Anchor: 'Continuous',
            ConnectorZIndex: 5,
            HoverPaintStyle: defaults.connectorHoverStyle
        });
        //设置容器
        jsPlumb.setContainer(_canvas);

        // if ($.browser.msie && $.browser.version < '9.0') { //ie9以下，用VML画图
        //     jsPlumb.setRenderMode(jsPlumb.VML);
        // } else { //其他浏览器用SVG
        //     jsPlumb.setRenderMode(jsPlumb.SVG);
        // }


        //初始化原步骤
        var lastProcessId = 0;
        var processData = defaults.processData;
        if (processData.list) {
            $.each(processData.list, function (i, row) {
                var nodeDiv = document.createElement('div');
                var nodeId = "window" + row.id,
                    badge = 'badge-inverse element-badge',
                    icon = 'icon-star';
                if (lastProcessId == 0) //第一步
                {
                    badge = 'badge-info';
                    icon = 'icon-play';
                }
                if (row.icon) {
                    icon = row.icon;
                }
                var _nodeDiv = $(nodeDiv)
                _nodeDiv.attr("id", nodeId)
                    .attr("style", row.style);
                //当有设置process_data时优先处理
                if (row.process_data) {
                    var toIds = [];
                    for (var i = 0; i < row.process_data.length; i++) {
                        toIds.push(row.process_data[i].toId);
                    }
                    _nodeDiv.attr("process_to", toIds.join(","));
                } else {
                    _nodeDiv.attr("process_to", row.process_to);
                }
                _nodeDiv.attr("process_id", row.id)
                    .attr("line", row.line)
                    .attr("data-toggle", "tooltip")
                    .attr("activityType", row.activityType);
                //判断process_name是否为数组
                //为数组则视图中包含多个块
                var processName = row.process_name;
                if ((typeof processName == 'object') && processName.constructor == Array) {
                    _nodeDiv.addClass("process-step btn btn-small process_itemgroup " + row.className);
                    var html = '';
                    for (var i = 0; i < processName.length; i++) {
                        _nodeDiv.append('<span class="process-flag badge ' + badge + '"><i class="' + icon + '"></i></span><span id="' + processName[i] + '" class="group-node node-name">' + processName[i] + '</span>');
                    }
                    _nodeDiv.mousedown(function (e) {
                        if (e.which == 3) { //右键绑定
                            _canvas.find('#serviceview_active_id').val(row.id);
                            contextmenu.bindings = defaults.processMenus
                            $(this).contextMenu('processMenu', contextmenu);
                        }
                    });

                    if (row.tipsFormat && typeof row.tipsFormat == 'function') {
                        for (var i = 0; i < processName.length; i++) {
                            var html = row.tipsFormat(row.nodeData, processName[i]);
                            _nodeDiv.find("#" + processName[i]).attr("data-toggle", "tooltip")
                                .attr("data-html", true)
                                .attr("data-original-title", html)
                                .attr("data-placement", "bottom")
                                .mouseover(function (e) {
                                    $(this).tooltip('show');
                                });
                        }
                    }

                } else {
                    _nodeDiv.addClass("process-step btn btn-small " + row.className);
                    var html = '<span class="process-flag badge ' + badge + '"><i class="' + icon + '"></i></span><span class="node-name" >' + processName + '</span>';
                    _nodeDiv.html(html);
                    _nodeDiv.mousedown(function (e) {
                        if (e.which == 3) { //右键绑定
                            _canvas.find('#serviceview_active_id').val(row.id);
                            contextmenu.bindings = defaults.processMenus
                            $(this).contextMenu('processMenu', contextmenu);
                        }
                    });

                    if (row.tipsFormat && typeof row.tipsFormat == 'function') {
                        var html = row.tipsFormat(row.nodeData, processName);
                        _nodeDiv.attr("data-toggle", "tooltip")
                            .attr("data-html", true)
                            .attr("data-original-title", html)
                            .attr("data-placement", "right")
                            .mouseover(function (e) {
                                $(this).tooltip('show');
                            });
                    }
                }

                //data-toggle="tooltip" data-html="true" data-original-title=
                _canvas.append(nodeDiv);
                //索引变量
                lastProcessId = row.id;
            }); //each
        }

        var timeout = null;
        var firstTime = 0;
        var lastTime = 0;
        var interval = 200;
        var clickKey = false;
        //单击事件与拖动冲突
        $(".process-step").on('click', function () {
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

        //使之可拖动
        //add 限定拖拽边界{containment:'parent'}
        jsPlumb.draggable(jsPlumb.getSelector(".process-step"), {
            containment: 'document'
        });
        //    jsPlumb.draggable(jsPlumb.getSelector(".process-step"));
        initEndPoints();

        //绑定添加连接操作。画线-input text值  拒绝重复连接
        jsPlumb.bind("jsPlumbConnection", function (info) {
            setConnections(info.connection)
        });
        //绑定删除connection事件
        jsPlumb.bind("jsPlumbConnectionDetached", function (info) {
            setConnections(info.connection, true);
        });
        //绑定删除确认操作
        //    jsPlumb.bind("click", function(c) {
        //      if(confirm("你确定取消连接吗?"))
        //        jsPlumb.detach(c);
        //    });

        //连接成功回调函数
        function mtAfterDrop(params) {
            defaults.mtAfterDrop({
                sourceId: $("#" + params.sourceId).attr('process_id'),
                targetId: $("#" + params.targetId).attr('process_id')
            });

        }

        $(".process-step").each(function (i, e) {
            var p = $(e);
            var _faces = ["top", "right", "bottom", "left"];
            if (p && p.attr("line")) {
                var line = p.attr("line");
                if (line == 1) {
                    _faces = ["top"];
                }
                if (line == 2) {
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
            jsPlumb.makeTarget($(e), {
                dropOptions: {
                    hoverClass: "hover",
                    activeClass: "active"
                },
                //          anchor: "Continuous",
                anchor: ["Continuous", {
                    faces: _faces
                }],
                maxConnections: -1,
                endpoint: ["Dot", {
                    radius: 1
                }],
                paintStyle: {
                    fillStyle: "#ec912a",
                    radius: 1
                },
                hoverPaintStyle: this.connectorHoverStyle,
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
        //reset  start
        var _canvas_design = function () {

            //连接关联的步骤
            $('.process-step').each(function (i) {
                var sourceId = $(this).attr('process_id');
                //var nodeId = "window"+id;
                var prcsto = $(this).attr('process_to');
                var toArr = prcsto.split(",");
                var processData = defaults.processData;
                var index = 0;
                $.each(toArr, function (j, targetId) {
                    if (targetId != '' && targetId != 0) {
                        //检查 source 和 target是否存在
                        var to_data;
                        var labelText = "";
                        var is_source = false,
                            is_target = false;
                        $.each(processData.list, function (i, row) {
                            if (row.id == sourceId) {
                                is_source = true;
                                if (row.labelTexts) {
                                    labelText = row.labelTexts.split(",")[index];
                                }

                                if (row.to_data) {
                                    to_data = row.to_data[index];
                                }
                            } else if (row.id == targetId) {
                                is_target = true;
                            }
                            if (is_source && is_target)
                                return true;
                        });

                        if (is_source && is_target) {
                            var connect_label;
                            if (to_data) {
                                connect_label = jsPlumb.connect({
                                    source: "window" + sourceId,
                                    target: "window" + targetId,
                                    overlays: [
                                        ["Label", {
                                            label: to_data.name,
                                            cssClass: "component label",
                                            //                                            [ "Label", { label:to_data.name, 
                                            location: 0.5,
                                            events: {
                                                click: function (labelOverlay, originalEvent) {
                                                    defaults.fnLabelClick(to_data, labelOverlay, originalEvent);
                                                }
                                            }
                                        }]
                                    ]
                                });
                            } else {
                                connect_label = jsPlumb.connect({
                                    source: "window" + sourceId,
                                    target: "window" + targetId,
                                    overlays: [
                                        ["Label", {
                                            label: labelText,
                                            cssClass: "component label",
                                            location: 0.5,
                                            //                                            [ "Label", {label:labelText, location:0.5,
                                            events: {
                                                click: function (labelOverlay, originalEvent) {
                                                    defaults.fnLabelClick(null, labelOverlay, originalEvent);
                                                }
                                            }
                                        }]
                                    ]
                                });
                            }
                            connect_label.bind("click", function (conn, originalEvent) {
                                defaults.fnLabelClick(to_data, '', originalEvent);
                            });
                            index++;
                            return;
                        }
                    }

                })
            });
        } //_canvas_design end reset 
        _canvas_design();

        //-----外部调用----------------------

        var ServiceView = {

            addProcess: function (row) {

                if (row.id <= 0) {
                    return false;
                }
                var nodeDiv = document.createElement('div');
                var nodeId = "window" + row.id,
                    badge = 'badge-inverse element-badge',
                    icon = 'icon-star';

                if (row.icon) {
                    icon = row.icon;
                }
                $(nodeDiv).attr("id", nodeId)
                    .attr("style", row.style)
                    .attr("process_to", row.process_to)
                    .attr("process_id", row.id)
                    .attr("activityType", row.activityType)
                    .addClass("process-step btn btn-small " + row.calssName)
                    .html('<span class="process-flag badge ' + badge + '"><i class="' + icon + '"></i></span></br><span class="node-name">' + row.process_name + '</span>')
                    .mousedown(function (e) {
                        if (e.which == 3) { //右键绑定
                            _canvas.find('#serviceview_active_id').val(row.id);
                            contextmenu.bindings = defaults.processMenus
                            $(this).contextMenu('processMenu', contextmenu);
                        }
                    });

                _canvas.append(nodeDiv);
                //使之可拖动 和 连线
                //add 限定拖拽边界{containment:'parent'}
                jsPlumb.draggable(jsPlumb.getSelector(".process-step"), {
                    containment: 'parent'
                });
                initEndPoints();
                //使可以连接线
                jsPlumb.makeTarget(jsPlumb.getSelector(".process-step"), {
                    dropOptions: {
                        hoverClass: "hover",
                        activeClass: "active"
                    },
                    anchor: "Continuous",
                    maxConnections: -1,
                    endpoint: ["Dot", {
                        radius: 1
                    }],
                    paintStyle: {
                        fillStyle: "#ec912a",
                        radius: 1
                    },
                    hoverPaintStyle: this.connectorHoverStyle,
                    beforeDrop: function (params) {
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
                            return true;
                        }
                    }
                });
                return true;

            },
            delProcess: function (activeId) {
                if (activeId <= 0) return false;
                //删除节点连线
                jsPlumb.detachAllConnections($("#window" + activeId));
                //删除节点
                $("#window" + activeId).remove();
                return true;
            },
            getActiveId: function () {
                return _canvas.find("#serviceview_active_id").val();
            },
            copy: function (active_id) {
                if (!active_id)
                    active_id = _canvas.find("#serviceview_active_id").val();

                _canvas.find("#leipi_copy_id").val(active_id);
                return true;
            },
            paste: function () {
                return _canvas.find("#leipi_copy_id").val();
            },
            getProcessInfo: function () {
                try {
                    /*连接关系*/
                    var aProcessData = {
                        "list": []
                    };
                    $("#activity_process_info input[type=hidden]").each(function (i) {
                        var processVal = $(this).val().split(",");
                        if (processVal.length == 2) {
                            /*
                     if(!aProcessData[processVal[0]])
                     {
                         aProcessData[processVal[0]] = {"top":0,"left":0,"process_to":[]};
                     }
                     aProcessData[processVal[0]]["process_to"].push(processVal[1]);
                     */
                            //update 添加属性
                            var isExists = false;
                            //alert("processVal[0]:"+processVal[0])
                            for (var i = 0; i < aProcessData["list"].length; i++) {

                                if (aProcessData["list"][i]["process_id"] == processVal[0]) {
                                    //alert(processVal[0]);
                                    aProcessData["list"][i]["process_to"].push(processVal[1]);
                                    isExists = true;
                                    break;
                                }
                            }

                            if (!isExists) {
                                var process = {};
                                process["process_id"] = processVal[0];
                                process["top"] = 0;
                                process["left"] = 0;
                                process["process_to"] = [];
                                process["process_to"].push(processVal[1]);
                                aProcessData["list"].push(process);
                            }
                        }
                    })
                    /*位置*/
                    _canvas.find("div.process-step").each(function (i) { //生成Json字符串，发送到服务器解析
                        if ($(this).attr('id')) {
                            var pId = $(this).attr('process_id');
                            var pLeft = parseInt($(this).css('left'));
                            var pTop = parseInt($(this).css('top'));
                            var clazz = $(this).find("i").attr("class");
                            var nodeName = $(this).find("span.node-name").html();
                            var activityType = $(this).attr('activityType');
                            /*
                             if(!aProcessData[pId])
                             {
                                 aProcessData[pId] = {"top":0,"left":0,"process_to":[]};
                             }
                             aProcessData[pId]["top"] =pTop;
                             aProcessData[pId]["left"] =pLeft;
                             */


                            //update 添加属性
                            var isExists = false;
                            for (var i = 0; i < aProcessData["list"].length; i++) {

                                if (aProcessData["list"][i]["process_id"] == pId) {
                                    //alert("pId:"+pId);
                                    aProcessData["list"][i]["top"] = pTop;
                                    aProcessData["list"][i]["left"] = pLeft;
                                    aProcessData["list"][i]["icon"] = clazz;
                                    aProcessData["list"][i]["nodeName"] = nodeName;
                                    aProcessData["list"][i]["activityType"] = activityType;

                                    isExists = true;
                                    break;
                                }
                            }

                            if (!isExists) {
                                var process = {};
                                process["process_id"] = pId;
                                process["top"] = pTop;
                                process["left"] = pLeft;
                                process["icon"] = clazz;
                                process["nodeName"] = nodeName;
                                process["activityType"] = activityType;
                                process["process_to"] = [];
                                aProcessData["list"].push(process);
                            }

                        }
                    })
                    return JSON.stringify(aProcessData);
                } catch (e) {
                    return '';
                }

            },
            clear: function () {
                try {

                    jsPlumb.detachEveryConnection();
                    jsPlumb.deleteEveryEndpoint();
                    $('#activity_process_info').html('');
                    jsPlumb.repaintEverything();
                    return true;
                } catch (e) {
                    return false;
                }
            },
            refresh: function () {
                try {
                    //jsPlumb.reset();
                    this.clear();
                    _canvas_design();
                    return true;
                } catch (e) {
                    return false;
                }
            }
        };
        return ServiceView;


    } //$.fn
})(jQuery);