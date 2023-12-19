var initialW;
var initialH;
var wtop;
var mouseDown = false;
$(document).bind("mousedown", fnMousedown);
$(document).bind("mouseup", fnMouseUp);
$(document).bind("mousemove", fnMouseMove);
function fnMousedown(e) {
    var wrapper = document.getElementById("wrapper");
    var rect = wrapper.getBoundingClientRect();
    wtop = rect.top;
    $(".selection-mask").css({
        'left': e.pageX,
        'top': e.pageY - wtop,
        'width': 0,
        'height': 0
    });
    initialW = e.pageX;
    initialH = e.pageY - wtop;
    mouseDown = true;
}

function fnMouseUp(e) {
    $(".selection-mask").removeClass("selection-mask-active");
    $(".selection-mask").css({
        'width': 0,
        'height': 0
    });
    mouseDown = false;
    return;
}

function fnMouseMove(e) {
    if (!mouseDown) return;
    var pageY = e.pageY - wtop;
    var pageX = e.pageX;
    var w = Math.abs(initialW - pageX);
    var h = Math.abs(initialH - pageY);
    if (!$(".selection-mask").hasClass("selection-mask-active")) {
        $(".selection-mask").addClass("selection-mask-active");
    }
    $(".selection-mask").css({
        'width': w,
        'height': h
    });
    if (pageX <= initialW && pageY >= initialH) {
        $(".selection-mask").css({
            'left': pageX
        });
    } else if (pageY <= initialH && pageX >= initialW) {
        $(".selection-mask").css({
            'top': pageY
        });
    } else if (pageY < initialH && pageX < initialW) {
        $(".selection-mask").css({
            'left': pageX + 2,
            "top": pageY + 2
        });
    }
    return;
}
