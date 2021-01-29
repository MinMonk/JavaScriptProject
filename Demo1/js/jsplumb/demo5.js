$(function(){

    var data = [
        {
            "id": "1",
            "status": "Y",
            "label_text": "label_text1",
            "line": "2",
            "style": ""
        }, {
            "id": "2",
            "status": "Y",
            "label_text": "label_text2",
            "line": "24",
            "style": "left:150px;"
        }, {
            "id": "3",
            "status": "N",
            "label_text": "label_text3",
            "line": "24",
            "style": "left:150px;top:150px"
        }, {
            "id": "4",
            "status": "Y",
            "label_text": "label_text4",
            "line": "4",
            "style": "left:350px;"
        }, {
            "id": "5",
            "status": "Y",
            "label_text": "label_text5",
            "line": "4",
            "style": "left:350px;top:150px"
        }
        
    ]


    var contains = $("#diagramContainer").drawPic({
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



