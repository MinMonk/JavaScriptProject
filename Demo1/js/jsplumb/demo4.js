$(function(){

    var data = [
        {
            "id": "1",
            "status": "Y",
            "label_text": "label_text1",
            "process_to": "2,3",
            "style": ""
        }, {
            "id": "2",
            "status": "Y",
            "label_text": "label_text2",
            "process_to": "",
            "style": "left:150px;"
        }, {
            "id": "3",
            "status": "N",
            "label_text": "label_text3",
            "process_to": "4, 5",
            "style": "left:150px;top:150px"
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



