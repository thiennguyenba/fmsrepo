function countVNIByte(input) {
    var text = input.value.toUpperCase();
    var len = text.length;
    var exlen = 0;

    var count = text.match(/Ờ|Ớ|Ợ|Ở|Ỡ|Ừ|Ứ|Ự|Ử|Ữ/g);
    if (count != null) {
        exlen += 3 * count.length;
    }

    count = text.match(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ|È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ|Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ù|Ú|Ụ|Ủ|Ũ|Ỳ|Ý|Ỷ|Ỹ/g);
    if (count != null) {
        exlen += 2 * count.length;
    }

    count = text.match(/Ì|Í|Ị|Ỉ|Ĩ|Ơ|Ư|Ỵ|Đ/g);
    if (count != null) {
        exlen += count.length;
    }

    return len + exlen;
};

var timer;
var overflow = false;
var maxlength = function (text, long) {
    window.clearTimeout(timer);
    if (!overflow) {
        timer = window.setTimeout(function () {
            if (text != null || text.value.length > 0) {
                var maxByte = new Number(long);
                var len = text.value.length;
                var totByte = countVNIByte(text);
                //console.log(totByte);
                if (totByte > maxByte) {
                    overflow = true;
                    text.setValue(text.value.substring(0, len - 1));
                }
            }
        }, 300);
    } else {
        var maxByte = new Number(long);
        var len = text.value.length;
        var totByte = countVNIByte(text);
        //console.log(totByte);
        if (totByte > maxByte) {
            text.setValue(text.value.substring(0, len - 1));
        } else {
            overflow = false;
        }
    }
};

String.format = function () {
    var theString = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
        theString = theString.replace(regEx, arguments[i]);
    }
    return theString;
};

var convertDateToString = function (date) {
    var day = date.getDate().toString();
    if (day.length == 1)
        day = '0' + day;
    var month = (date.getMonth() + 1).toString();
    if (month.length == 1)
        month = '0' + month;
    var year = date.getFullYear().toString();
    return day + '/' + month + '/' + year;
};

var convertDateToFullDateString = function (date) {
    var dateString = convertDateToString(date);
    var hour = date.getHours().toString();
    if (hour.length == 1)
        hour = '0' + hour;
    var minute = date.getMinutes().toString();
    if (minute.length == 1)
        minute = '0' + minute;
    var second = date.getSeconds().toString();
    if (second.length == 1)
        second = '0' + second;
    return dateString + ' ' + hour + ':' + minute + ':' + second;
};

var money = function (text, long) {

    var maxl = 16;

    if (long != null) {

        maxl = new Number(long);

    }

    var moneyf = text.getValue().replace(/[\,]/g, '');

    var len = moneyf.length - 1;

    if (moneyf.length > maxl) {

        var t = moneyf.substring(0, len);

        text.setValue(Ext.util.Format.number(t, '0,0'));

    } else {

        text.setValue(Ext.util.Format.number(moneyf, '0,0'));

    }

};


