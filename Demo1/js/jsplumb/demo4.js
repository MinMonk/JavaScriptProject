/**
 * 计算元素位置
 *
 */
function calcPosition(num, width, height, margin){
    margin = margin ? margin : 10;
    width = width ? width : 80;
    height = height ? height : 60;
    var _height = $("#diagramContainer").height();
    var _width = $("#diagramContainer").width();
    console.log("_height:" + _height);
    console.log("_width:" + _width);

    var position = "";
    var _top = (_height - height - margin * (num-1))/(num + 1);
    console.log("_top:" + _top)
};

$(function(){

    calcPosition(1);
    calcPosition(2);


    var data = [
        {
            "id": "1",
            "status": "Y",
            "label_text": "label_text1",
            "process_to": "2,3",
            "style": "top:170px;"
        }, {
            "id": "2",
            "status": "Y",
            "label_text": "label_text2",
            "process_to": "",
            "style": "left:200px;top:110px"
        }, {
            "id": "3",
            "status": "N",
            "label_text": "label_text3",
            "process_to": "4, 5",
            "style": "left:200px;top:190px"
        }, {
            "id": "4",
            "status": "Y",
            "label_text": "label_text4",
            "process_to": "",
            "style": "left:350px;"
        }, {
            "id": "5",
            "status": "Y",
            "label_text": "label_text5",
            "process_to": "",
            "style": "left:350px;top:150px"
        }
        
    ]


    var contains = $("#diagramContainer").monitorView({
        "data" : data,
        enableDraggable: true,
        fnClick: function(){
            alert("重写单击单击");
        }
    });
    // contains.refresh();
    // var c = contains.return_();
    // console.log(c);

   
})




