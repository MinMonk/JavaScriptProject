$(function () {

})

function testFormatJSON(type) {
    var str = $("#json_input_" + type).val();
    if (str && str.trim().length > 0) {
        str = '\n' + str.replace(/(<\w+)(\s.*?>)/g, function ($0, name, props) {
            return name + ' ' + props.replace(/\s+(\w+=)/g, " $1");
        }).replace(/>\s*?</g, ">\n<");
        var obj = parse_xml(str, type);
        if (obj) {
            $("#xmlStr_" + type).html(obj.htmlContent);
            var valueData = obj.valueData;
            let index = 0;

            // 部分浏览器不支持foreach这种写法，这里新增兼容性写法
            for (var j = 0; j < valueData.length; j++) {
                let data = eval('(' + valueData[j] + ')');

                /**
                 * update by 2021-2-23
                 * 海大项目：针对rest代理rest的服务日志，将INPUT_JSON字符串手动转换为JSON对象，再格式化展示出来
                 * 这种特殊的报文如下所示：
                 * {
                 * 	"INPUTCOLLECTION": {
                 * 		"INPUTCOLLECTION_ITEM": [
                 * 			{
                 * 				"INPUT_JSON": "{ \"optUser\": \"037251\", \"billnumber\": \"FFY-SPDW2101210067\", \"appCode\": \"FSSC\", \"tenantCode\": \"100\" }"
                 * 			}
                 * 		]
                 * 	},
                 * 	"MSGHEADER": {
                 * 		"SOURCESYSTEMID": "SOA",
                 * 		"TRACE_ID": "1",
                 * 		"USER_ID": "1",
                 * 		"RESERVED_2": "1",
                 * 		"USER_NAME": "1",
                 * 		"RESERVED_1": "1",
                 * 		"USER_PASSWD": "1",
                 * 		"PROVINCE_CODE": "1",
                 * 		"ROUTE_CODE": "1",
                 * 		"SOURCESYSTEMNAME": "1",
                 * 		"SUBMIT_DATE": "2021-01-22T08:42:03",
                 * 		"TOTAL_RECORD": "1",
                 * 		"PAGE_SIZE": "1",
                 * 		"CURRENT_PAGE": "1",
                 * 		"TOKEN": "1"
                 * 	}
                 * }
                 * 
                 */
                if(data.INPUTCOLLECTION){
                    var items = data.INPUTCOLLECTION.INPUTCOLLECTION_ITEM;
                    if(items && items.length > 0){
                        for(var k = 0; k < items.length; k++){
                            var item = items[k];
                            if(item){
                                var inputJson = item.INPUT_JSON;
                                if(typeof inputJson == "string" && isJSON(inputJson)){
                                    item.INPUT_JSON = eval('(' + inputJson + ')');
                                }
                            }
                        }
                    }
                }
                
                let dataLength = getJsonLength(data)
                let collapsedFlag = dataLength >= 15 ? true : false;
                console.log(collapsedFlag);
                $("#json_renderer_" + type + "_" + index++).jsonViewer(data, {
                    collapsed: collapsedFlag,
                    rootCollapsable: true,
                    withQuotes: true,
                    withLinks: false
                });
            }

            // valueData.forEach(item => {
            //     let data = eval('(' + item + ')');
            //     let dataLength = getJsonLength(data)
            //     let collapsedFlag = dataLength >= 15 ? true : false;
            //     console.log(collapsedFlag);
            //     $("#json_renderer_" + type + "_" + index++).jsonViewer(data, {
            //         collapsed: collapsedFlag,
            //         rootCollapsable: true,
            //         withQuotes: true,
            //         withLinks: false
            //     });
            // });
        }
    }
}


function getJsonLength(obj) {
    let length = 0;
    for (const key in obj) {
        length++;
    }
    return length;
}

/**
 * 格式化xml
 * @param content
 * @returns {*}
 */
this.parse_xml = function (content, type) {
    let result = {};
    let valueData = [];
    let jsonDataFlag = 0;
    let xml_doc = null;
    try {
        xml_doc = (new DOMParser()).parseFromString(content.replace(/[\n\r]/g, ""), 'text/xml');
    } catch (e) {
        return false;
    }

    function build_xml(index, list, element) {
        let t = [];
        for (let i = 0; i < index; i++) {
            t.push('&nbsp;&nbsp;&nbsp;&nbsp;');
        }
        t = t.join("");
        index++;
        if (element.childNodes.length >= 1) {
            list.push(t + generateContent(element));
        } else {
            if ("#comment" == element.nodeName) {
                list.push(t + generateContent(element));
                return;
            } else if (null == element.nodeValue) {
                list.push(t + generateContent(element));
                return;
            } else {

            }
        }

        for (let i = 0; i < element.childNodes.length; i++) {
            let childNode = element.childNodes[i];
            let nodeName = childNode.nodeName;
            if (childNode.childNodes.length == 1) {
                let value = childNode.childNodes[0].nodeValue;
                if (null == value && childNode.childNodes[0].childNodes.length > 0) {
                    build_xml(index, list, childNode);
                } else {
                    let value_txt;
                    let item;
                    if (isJSON(value)) {
                        valueData.push(value);
                        value_txt = "<pre style=\"padding:0em 0em 0em " + index * 2 + "em\" id=\"json_renderer_" + type + "_" + jsonDataFlag++ + "\"></pre>";
                        item = t + '&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span class="code-key">' + nodeName +
                            '</span>&gt;' + value_txt + t + '&nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span class="code-key">' + nodeName + '</span>&gt;</br>';
                    } else {
                        let value_color = !isNaN(Number(value)) ? 'code-number' : 'code-string';
                        value_txt = '<span class="' + value_color + '">' + value + '</span>';
                        item = t + '&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span class="code-key">' + nodeName +
                            '</span>&gt;' + value_txt + '&lt;/<span class="code-key">' + nodeName + '</span>&gt;</br>';
                    }

                    list.push(item);
                }
            } else {
                build_xml(index, list, childNode);
            }
        }
        if (null == element.nodeValue && element.childNodes.length > 0) {
            list.push(t + '&lt;/<span class="code-key">' + element.nodeName + '</span>&gt;</br>');
        } else {
            list.push('&lt;/<span class="code-key">' + element.nodeName + '</span>&gt;</br>');
        }
    }

    let list = [];
    build_xml(0, list, xml_doc.documentElement);

    result.htmlContent = list.join("");
    result.valueData = valueData;
    return result;
};

/**
 * 判断值是不是json类型
 * @param {*} str 要判断的值
 */
function isJSON(str) {
    if (typeof str == 'string') {
        try {
            if (str.indexOf('{') > -1) {
                var obj = eval('(' + str + ')');
                if (typeof obj == "object") {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }

        } catch (e) {
            console.log(e);
            return false;
        }
    }
    return false;
}

/**
 * 格式化XML，生成标签前半部分
 *
 * @param {*} element
 * @returns
 */
function generateContent(element) {
    let content;
    if ("#comment" == element.nodeName) {
        content = '&lt;<span class="coment-content">!--' + element.nodeValue + '--';
    } else {
        content = '&lt;<span class="code-key">' + element.nodeName;
        if (element.attributes && element.attributes.length > 0) {
            for (let i = 0; i < element.attributes.length; i++) {
                let attr = element.attributes[i];
                if (i <= element.attributes.length) {
                    content += "&nbsp;";
                }
                content += attr.nodeName + "=\"" + attr.nodeValue + "\"";
            }
        }
    }

    if (null == element.nodeValue && element.childNodes.length == 0) {
        content += '</span>/&gt;</br>';
    } else {
        content += '</span>&gt;</br>';
    }

    return content;
}