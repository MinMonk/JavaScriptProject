function testFormatXML() {
    var str = $("#inputStr").val();
    var formatStr = formatXml(str);
    // remove multiple newlines
    var reg = /(\r\n\r\n)/g;
    formatStr = formatStr.replace(reg, '\r\n');
    $("#outputStr").val(formatStr);
    console.log();
}