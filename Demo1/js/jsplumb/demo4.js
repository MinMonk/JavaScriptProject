
/**
 * 计算元素之间的间距
 * @param {*} docuemntId 元素所在父容器的docuemntId
 * @param {*} _num 元素的个数
 * @param {*} _type 计算的类型[width:左右间距, height:上下间距]
 * @param {*} _padding 元素的内间距
 * @param {*} _border 元素的边框总宽度(边框分上下or左右)
 * @param {*} _item 元素的宽度or高度
 * @param {*} _minMargin 元素之间的最小间距
 */
function calcItemMargin(docuemntId, _num, _type, _padding, _border, _item, _minMargin) {
    _type = _type ? _type : "width";
    
    _border = _border ? _border : 2;

    var item = 0;
    if ("width" == _type) {
        _item = _item ? _item : 80;
        _minMargin = _minMargin ? _minMargin : 50;
        _padding = _padding ? _padding : 20;
        item = $("#" + docuemntId).width();
    } else {
        _item = _item ? _item : 60;
        _minMargin = (_minMargin && _minMargin > 20) ? _minMargin : 20;
        _padding = _padding ? _padding : 4;
        item = $("#" + docuemntId).height();
    }
    var _margin = (item - (_item + _border + _padding) * _num) / (_num + 1);
    _margin = _margin >= _minMargin ? _margin : _minMargin;
    return _margin;
}

/**
 * 计算元素位置
 * @param {*} num 元素个数
 * @param {*} margin 元素之间的外间距
 * @param {*} _len 元素的宽度or高度
 * @param {*} _padding 元素的外间距
 * @param {*} _border 元素的边框总宽度(边框分上下or左右)
 */
function calcItemPosition(num, margin, _len, _padding, _border) {
    _padding = _padding ? _padding : 20;
    _border = _border ? _border : 2;
    var positions = [];
    var position = 0;
    for (var i = 0; i < num; i++) {
        if (i > 0) {
            position += (_len + margin + _border + _padding);
        } else {
            position += margin;
        }
        positions.push(position);
    }
    return positions;
}

$(function () {

    var aa = calcItemMargin("diagramContainer", 3, "width");
    var bb = calcItemPosition(3, aa, 80, 20);
    console.log(bb);

    aa = calcItemMargin("diagramContainer", 5, "height");
    bb = calcItemPosition(5, aa, 60, 4);
    console.log(bb);

    console.log(data);

    var contains = $("#diagramContainer").monitorView({
        "data": data,
        enableDraggable: true,
        fnClick: function () {
            alert("重写单击单击");
        }
    });
    // contains.refresh();
    // var c = contains.return_();
    // console.log(c);


})




