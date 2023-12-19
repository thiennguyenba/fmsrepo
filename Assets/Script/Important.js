top.myMessageBox = null;
var replaceAll = function (find, replace, str) {
    while (str.indexOf(find) > -1) {
        str = str.replace(find, replace);
    }
    return str;
};
top.resizecolumn = function (gridId, ignoreDataIndexes) {
    //console.log(ignoreDataIndexes);
    
    window.setTimeout(function () {
        var col;
        var grid = window[0].Ext.getCmp(gridId);
        //console.log(grid);
        if (!grid) {
            //console.log('grid null');
            //console.log(grid);
            return;
        }
        grid.setLoading(false, false);
        if (parseFloat(Ext.net.Version) > 4.1) {
             //ext.net > 4.1
            col = grid.query('gridcolumn:not([hidden])');
        } else {
            //ext.net < 4.1
            col = grid.getColumns();
        }
        grid.setLoading(true, false);
        ignoreDataIndexes = replaceAll(" ", "", ignoreDataIndexes);
        var arr = ignoreDataIndexes.split(",");
        if (arr == null) {
            arr = [];
        };
        var haschild = [];
        for (var i = 0; i < col.length; i++) {
            var dataIndex = col[i].dataIndex;
            if (Ext.Array.indexOf(arr, dataIndex) == -1) {
                col[i].autoSize();
            }
            if (col[i].items.length > 0) {
                haschild.push(i);
            }
            //console.log(col[i]);
        }
         //ext.net > 4.1
        //parent columns has child
        if (parseFloat(Ext.net.Version) > 4.1) {
            for (var i = 0; i < haschild.length; i++) {
                var newwidth = 0;
                for (var j = 0; j < col[haschild[i]].items.length; j++) {
                    newwidth += col[haschild[i]].items.items[j].width;
                }
                col[haschild[i]].width = newwidth;
                col[haschild[i]].hide();
                col[haschild[i]].show();
            }
        }
        grid.setLoading(false, false);
    }, 50);
};
top.configAutoResize = function (item, ignoreDataIndexes) {
    //console.log(item);
    setTimeout(function() {
        var toolbar = item.down("pagingtoolbar");
        var store = item.store;
        //console.log(store);
        //console.log(item.getStore());
        if (store != null) {
            store.on("dataChanged", function () {
                //console.log('data changed');
                top.resizecolumn(item, ignoreDataIndexes);
            });
        }
        if (toolbar != null) {
            toolbar.on("change", function () {
                top.resizecolumn(item, ignoreDataIndexes);
            });
        } else {
            top.resizecolumn(item, ignoreDataIndexes);
        }
    },0);
};
top.configBlurCombobox = function (combobox) {
    combobox.on("Blur", function (item) {
        var count = 0;
        var disSelect;

        item.getStore().each(function (record) {
            if (record.get(item.valueField) == item.getValue()) {
                count++;
            }
            if (record.get(item.displayField) == item.getRawValue()) {
                disSelect = record;
            }
        });
        if (count == 0) {
            item.setActiveError('Invalid Values');
            item.data = false;
        }
        if (typeof disSelect != 'undefined') {
            item.data = true;
            item.select(disSelect);
            item.clearInvalid();
        }
    });

    combobox.validator = function () {
        if (this.data != false)
            return true;
        return false;
    };
};

top.configDateField = function (item) {
    item.on("Change", function (df) {
        df.data = df.rawValue;
    });
    item.on("Blur", function (df) {
        var val = df.data;
        if (typeof val != 'undefined') {
            if (val.length != 10) {
                df.setActiveError("");
                return;
            }
            var dates = val.split('/');
            var date = new Date(parseInt(dates[2]), parseInt(dates[1]) - 1, parseInt(dates[0]));
            if (parseInt(dates[1]) != date.getMonth() + 1) {
                df.setRawValue(df.data);
                df.setActiveError("");
            } else {
                df.unsetActiveError();
            }
        }
    });
    item.validator = function () {
        var val = this.rawValue;
        if (this.rawValue.length != 10)
            return '';
        var dates = val.split('/');
        var date = new Date(parseInt(dates[2]), parseInt(dates[1]) - 1, parseInt(dates[0]));
        if (parseInt(dates[1]) != date.getMonth() + 1)
            return 'DateField have an invalid value';
        return true;
    };
};
top.configLimitPosition = function (window, top, left, right, bottom) {
    window.on("move", function (item, x, y) {
        var h = item.getHeight();
        var w = item.getWidth();
        var bh = 0;
        var bw = 0;
        //console.log(item);
        if (item.id == "WinDetails") {
            var body = $('body')[0];
            //console.log(body);
            bh = body.clientHeight;
            bw = body.clientWidth;
        } else {
            var center = $("#pnlCenter-body");
            //var iframe = $('iframe')[0];
            //console.log(center);
            bh = center.clientHeight;
            bw = center.clientWidth;
        }


        //top
        if (y < 0 && top == 'True') {
            item.setPosition(x, 20);
        }
        //left
        if (x < 0 && left == 'True') {
            item.setPosition(20, y);
        }
        //right
        if (x + w > bw && right == 'True') {
            item.setPosition((bw - w - 20), y);
        }
        //bottom
        if (y + h > bh && bottom == 'True') {
            item.setPosition(x, (bh - h - 20));
        }
    });
};
top.getPageLangById = function (resources, key) {
    for (var i = 0; i < resources.length; i++) {
        if (resources[i].key == key)
            return resources[i].value;
    }
};
top.getCommonLangById = function (key) {
    return top.getLanguageById(top.CommonLang, key);
};
top.searchTemplate = function (text) {
    alert(text);
};

//var isAjaxLoading = false;
top.callAjax = function (args, isSingle) {
    //if (isSingle && isAjaxLoading) {
    // alert("Working...");
    // return;
    // }
    ;
    // isAjaxLoading = true;
    Ext.net.DirectMethod.request({
        url: args.url,
        cleanRequest: true,
        json: true,
        params: args.params,
        failure: function (err) {
            if (args.failure != null) {
                args.failure.call(this, err);
            }
            //setTimeout(function () { isAjaxLoading = false; }, 300);
        },
        success: function (result) {
            //setTimeout(function () { isAjaxLoading = false; }, 300);
            if (args.success != null) {
                args.success.call(this, result);
            }

        }
    });
};

top.checkUploadConnection = function (onSuccessNetworkOnly, onNetworkAndFileServerSuccess, onNetworkFail) {
    top.callAjax({
        url: "/Core/DocMgmt/Services/UploadService.ashx/CheckNetworkConnection",
        //url: "~/Core/DocMgmt/Services/UploadService.ashx/CheckNetworkConnection",
        cleanRequest: true,
        json: false,
        timeout: 5000,
        success: function (data) {
            try {
                var result = JSON.parse(data);
                if (result == 1) {
                    if (onNetworkAndFileServerSuccess != null) {
                        onNetworkAndFileServerSuccess.call(this, result);
                    } else {
                        alert("Network: OK, File server: OK");
                    }
                } else if (result == 0) {

                    if (onSuccessNetworkOnly != null) {
                        onSuccessNetworkOnly.call(this, result);
                    } else {
                        alert("Network: OK, File server: Fail");
                    }
                }
            } catch (ex) {
                alert("Network: OK, Permission: Fail. " + ex.message);
            }
        },
        failure: function (err) {

            if (onNetworkFail != null) {
                onNetworkFail.call(this, err);
            } else {
                alert("Net work error");
            }
        },
    }, true);
};
top.hidemessage = function () {
    top.myMessageBox.hide();
};
top.ShowMessage = function (Title, Message, Type) {
    var nType;
    switch (Type) {
        case 'i':
            {
                nType = Ext.MessageBox.INFO;
                break;
            }
        case 'e':
            {
                nType = Ext.MessageBox.ERROR;
                break;
            }
        case 'w':
            {
                nType = Ext.MessageBox.WARNING;
                break;
            }
        default:
            {
                nType = Ext.MessageBox.INFO;
            }
    }
    top.myMessageBox = Ext.MessageBox.show({
        title: Title,
        msg: Message,
        buttons: Ext.MessageBox.OK,
        icon: nType
    });
};
top.ShowMessageFunc = function (Title, Message, Type, Func) {
    var nType;
    switch (Type) {
        case 'i':
            {
                nType = Ext.MessageBox.INFO;
                break;
            }
        case 'e':
            {
                nType = Ext.MessageBox.ERROR;
                break;
            }
        case 'w':
            {
                nType = Ext.MessageBox.WARNING;
                break;
            }
        default:
            {
                nType = Ext.MessageBox.INFO;
            }
    }
    myMessageBox = Ext.MessageBox.show({
        title: Title,
        msg: Message,
        buttons: Ext.MessageBox.OK,
        icon: nType,
        fn: Func
    });
};
var GetExtentsion = function (file) {
    var index = -1;
    var len = file.length;
    for (var i = 0; i < len; i++) {

        if (file[i] == ".") {
            index = i;
        }
    }
    return (file.substring(index + 1, len)).toUpperCase();
};
top.loadJsCssFile = function (filename) {
    var filetype = GetExtentsion(filename);
    if (filetype == "JS") { //if filename is a external JavaScript file
        var fileref = document.createElement('script');
        fileref.setAttribute("type", "text/javascript");
        fileref.setAttribute("src", filename + "?build=" + top.build);
    } else if (filetype == "CSS") { //if filename is an external CSS file
        var fileref = document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", filename + "?build=" + top.build);
    }
    if (typeof fileref != "undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref);
};


top.messageStack = [];
top.functionStack = [];
top.showingMessage = false;

top.CheckShowingMessage = function () {
    var messageboxElement = jQuery("[id^=messagebox-]");
    if (messageboxElement.length && !messageboxElement.eq(0).hasClass("x-hidden") && !messageboxElement.eq(0).hasClass("x-hide-offsets")) {
        //alert('showing');
        return true;
    } else {
        //alert('not');
        return false;
    }

    //Ext.window.MessageBox()
};
top.ShowMessageStack = function (title, message, btn, icon, fn) {
    top.functionStack.push(fn);
    top.messageStack.push({
        title: title,
        msg: message,
        buttons: btn,
        fn: function (button) {
            top.DoMessageStack(button);

            //top.CheckShowingMessage();
        },
        icon: icon
    });

    //top.CheckShowingMessage();

    if (!top.CheckShowingMessage() && top.messageStack && top.messageStack.length > 0) {
        top.showingMessage = true;
        var messageConfig = top.messageStack.shift();
        Ext.Msg.show(messageConfig);

        //top.CheckShowingMessage();
    }
};

top.ShowMessageStackWarning = function (title, message, icon) {
    var nType;
    switch (icon) {
        case 'i':
            {
                nType = Ext.MessageBox.INFO;
                break;
            }
        case 'e':
            {
                nType = Ext.MessageBox.ERROR;
                break;
            }
        case 'w':
            {
                nType = Ext.MessageBox.WARNING;
                break;
            }
        default:
            {
                nType = (icon ? icon : Ext.MessageBox.INFO);
            }
    }
    top.ShowMessageStack(title, message, Ext.Msg.OK, nType, null);
};

top.ShowMessageStackAlert = function (title, message) {
    top.ShowMessageStack(title, message, Ext.Msg.OK, Ext.MessageBox.WARNING, null);
};

top.DoMessageStack = function (button) {
    var fn = top.functionStack.shift();
    if (fn) fn(button);

    if (top.messageStack && top.messageStack.length > 0) {
        top.showingMessage = true;
        var messageConfig = top.messageStack.shift();
        Ext.Msg.show(messageConfig);
    } else
        top.showingMessage = false;
};

top.formatJson = function (rawJsonObject) {
    if (!rawJsonObject) {
        return "";
    }

    if (typeof rawJsonObject === "string") {
        rawJsonObject = JSON.parse(rawJsonObject);
    }
    var jsonObject = {};

    for (var key in rawJsonObject) {
        if (!rawJsonObject.hasOwnProperty(key))
            continue;

        var value = rawJsonObject[key];

        var keyEl = key.split("."),
            keyLen = keyEl.length;

        if (keyLen > 1) {
            var valueObject = jsonObject[keyEl[0]] || {};
            for (var i = 1; i < keyLen - 1; i++) {
                valueObject = valueObject[keyEl[i]] || {};
            }

            valueObject[keyEl[keyLen - 1]] = value;
            jsonObject[keyEl[0]] = valueObject;
        }
        else {
            jsonObject[key] = value;
        }
    }

    return jsonObject;
};

top.selectNumericChar = function (valueString, except) {
    var arrayNumber = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9"
    ];

    except = except || [];

    if (valueString && typeof valueString === "string") {
        var length = valueString.length,
            retValue = "";

        for (var i = 0;  i < length; i++) {
            var chr = valueString[i];
            if (chr in arrayNumber || chr in except) {
                retValue += chr;
            }
        }

        return retValue;
    }

    return "";
};

top.checkcontainer = function (value) {
    var con = value;

    if (!con || con == "" || con.length != 11) {
        return false;
    }
    con = con.toUpperCase();
    var re = /^[A-Z]{4}\d{7}/;
    if (re.test(con)) {
        var sum = 0;
        for (i = 0; i < 10; i++) {
            var n = con.substr(i, 1);
            if (i < 4) {
                n = "0123456789A?BCDEFGHIJK?LMNOPQRSTU?VWXYZ".indexOf(con.substr(i, 1));
            }
            n *= Math.pow(2, i);
            sum += n;
        }
        if (con.substr(0, 4) == "HLCU") {
            sum -= 2;
        }
        sum %= 11;
        sum %= 10;
        return sum == con.substr(10);
    } else {
        return false;
    }
};
top.comboboxComlumnRenderer = function (val, store, disF) {
    var record = store.getById(val);
    if (record != null) {
        return record.get(disF);
    }
    return val;
};
