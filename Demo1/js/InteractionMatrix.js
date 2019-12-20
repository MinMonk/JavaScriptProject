/**
 * 使用easyUI实现交互矩阵
 */

var $obj_;
var columns;
$(function() {
	init();
	initData(columns);
});

/**
 * 初始化grid行信息
 * @returns 行信息
 */
function init() {
	$.ajax({
		url : root + 'esbService/getAllApplicationCode.do',
		type : 'POST',
		async : false,
		timeout : 60000,
		success : function(data) {
			columns = generateColumns(data);
		}
	});
}

/**
 * 生成grid列信息
 * @param data 数据
 * @returns
 */
var appDataDic= {};
function generateColumns(data){
	var col = [];
	var columnNames = [];
	var dataResult = [];
	
	for (var i = 0; i < data.length; i++) {
		var attr = {};
		var app ={};
		var appCode = data[i].applicationCode;
		var appName = data[i].applicationName;
		attr.field = appCode;
		attr.title = appName;
		attr.align = 'left';
		attr.sortable = 'false';
		attr.formatter = function(value, rowData, rowIndex) {
			return formatRow(value, rowData)
		};
		dataResult.push(attr);
		app.code = appCode;
		app.name = appName;
		appDataDic[appCode] = appName;
		columnNames.push(app);
	}
	
	col.push(dataResult);
	$obj_ = $("#matrixGrid");
	$obj_.datagrid({
		fitColumns : true,
		autoRowHeight : true,
		nowrap : true,
		border : false,
		showFooter : false,
		frozenColumns:[[
		    {field:'appCode'}
		]],
		columns : col
	});
	
	return columnNames;
}

/**
 * 格式化显示的值
 * @param value 值
 * @param rowData 行记录信息
 * @returns
 */
function formatRow(value, rowData) {
	var opt = "";
	var val = value.split(",");
	if (!val[1]) {
		return;
	} else {
		var codes = val[0].split("_");
		opt += "<a href='#' onClick='showDetail(\"" + codes[0] + "\",\""
				+ codes[1] + "\")'>" + val[1] + "</a>";
	}
	return opt;
}

/**
 * 填充grid数据
 * @param columnNames  列名
 * @returns
 */
function initData(columnNames) {
	$.ajax({
		url : '****/****/***',
		type : 'POST',
		timeout : 60000,
		success : function(data) {
			var dataResult = formatData(columnNames, data);
			$obj_.datagrid('loadData', dataResult);
		}
	});
}

/**
 * 构造数据
 * @param col 列名
 * @returns
 */
function formatData(col, map){
	var data = [];
	for (var i = 0; i < columns.length; i++) {
        var attr = {};
        attr.appCode = columns[i]["name"];
        for (var j = 0; j < columns.length; j++) {
        	var key = columns[j]["code"] + "_" + columns[i]["code"];
            var value = map[key];
            if(value){
                attr[columns[j]["code"]] = key + "," + value;
            }else{
                attr[columns[j]["code"]] = key + ", ";
            }
        }
        data.push(attr);
    }

    var result = {};
    result.total = data.length;
    result.rows = data;
    return result;
}


/**
 * 查看交互的服务列表
 * @param cusAppCode  消费方系统编码
 * @param proAppCode  提供方系统编码
 * @returns
 */
function showDetail(cusAppCode, proAppCode) {
	var cusAppName = appDataDic[cusAppCode];
	var proAppName = appDataDic[proAppCode];
	$('#serviceQueryId').dialog({title: cusAppName + " > " + proAppName});
	$('#serviceQueryId').dialog('open');
	
	var json = {};
	json.cusAppCode = cusAppCode;
	json.proAppCode = proAppCode;
	var serviceNameEn = $("#serviceNameEn").val();
	var serviceNameCn = $("#serviceNameCn").val();
	
	$obj = $("#serviceList");
	$obj.datagrid({
		loadMsg : globalLoadMsg,
		url : root + 'esbService/getSeriveInfoByAppCode.do',
		fitColumns : true,
		autoRowHeight : true,
		rownumbers : true,
		nowrap : true,
		border : false,
		showFooter : false,
		queryParams : json,
		columns : [ [ {
			field : 'serviceNameEn',
			title : "服务英文名",
			align : 'left',
			width : 250,
			sortable : false
		},{
			field : 'serviceNameCn',
			title : "服务中文名",
			align : 'left',
			width : 250,
			sortable : false
		},{
			field : 'standardVersion',
			title : "服务版本",
			align : 'center',
			width : 100,
			sortable : false,
			formatter: function(value) {
                return formatterGridColumn(value);
            }
		},{
			field : 'providerAppName',
			title : "提供方系统",
			align : 'left',
			width : 150,
			sortable : false,
			formatter: function(value) {
				return formatterGridColumn(value);
			}
		}] ]
	});
}

/**
 * 服务窗体取消按钮
 * @returns
 */
function popupCancel(){
	$('#serviceQueryId').dialog('close');
}
