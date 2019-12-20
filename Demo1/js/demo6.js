var timer = null;
timer = setInterval(function () {
    //move("next");
}, 10000)


function topTab() {
    move("left");
}

function nextTab() {
    move("right");
}


var currFlag = 0;
function move(operation) {
    var obj = $(".child");

    var childrens = obj.children();
    var node = childrens[0];
    obj.append(node);
    // if (currFlag == 0) {
    //     var node = childrens[0];
    //     obj.append(node);
    //     currFlag = 1;
    // } else {
    //     //obj.animate({ right: "" })
    //     var node = childrens[1];
    //     obj.append(node);
    //     currFlag = 0;
    // }
    
    var witdh = obj.children().width();
    if (operation == "right") {
        obj.stop().animate({ right: witdh + "px" });
    } else {
        obj.stop().animate({ left: witdh + "px" });
    }
}