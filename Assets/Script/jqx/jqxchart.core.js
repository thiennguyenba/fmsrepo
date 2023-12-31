/*
jQWidgets v4.5.4 (2017-June)
Copyright (c) 2011-2017 jQWidgets.
License: http://jqwidgets.com/license/
*/
!function (a) {
    a.jqx.jqxWidget("jqxChart", "", {}),
    a.extend(a.jqx._jqxChart.prototype, {
        defineInstance: function () {
            return a.extend(!0, this, this._defaultSettings),
            this._createColorsCache(),
            this._defaultSettings
        },
        _defaultSettings: {
            title: "Title",
            description: "Description",
            source: [],
            seriesGroups: [],
            categoryAxis: null,
            xAxis: {},
            valueAxis: null,
            renderEngine: "",
            enableAnimations: !0,
            enableAxisTextAnimation: !1,
            backgroundImage: "",
            background: "#FFFFFF",
            padding: {
                left: 5,
                top: 5,
                right: 5,
                bottom: 5
            },
            backgroundColor: "#FFFFFF",
            showBorderLine: !0,
            borderLineWidth: 1,
            borderLineColor: null,
            borderColor: null,
            titlePadding: {
                left: 5,
                top: 5,
                right: 5,
                bottom: 10
            },
            showLegend: !0,
            legendLayout: null,
            enabled: !0,
            colorScheme: "scheme01",
            animationDuration: 500,
            showToolTips: !0,
            toolTipShowDelay: 500,
            toolTipDelay: 500,
            toolTipHideDelay: 4e3,
            toolTipMoveDuration: 300,
            toolTipFormatFunction: null,
            toolTipAlignment: "dataPoint",
            localization: null,
            columnSeriesOverlap: !1,
            rtl: !1,
            legendPosition: null,
            greyScale: !1,
            axisPadding: 5,
            enableCrosshairs: !1,
            crosshairsColor: "#BCBCBC",
            crosshairsDashStyle: "2,2",
            crosshairsLineWidth: 1,
            enableEvents: !0,
            _itemsToggleState: [],
            _isToggleRefresh: !1,
            _isSelectorRefresh: !1,
            _sliders: [],
            _selectorRange: [],
            _rangeSelectorInstances: {},
            _resizeState: {},
            renderer: null,
            _isRangeSelectorInstance: !1,
            drawBefore: null,
            draw: null,
            _renderData: {},
            enableSampling: !0
        },
        _defaultLineColor: "#BCBCBC",
        _touchEvents: {
            mousedown: a.jqx.mobile.getTouchEventName("touchstart"),
            click: a.jqx.mobile.getTouchEventName("touchstart"),
            mouseup: a.jqx.mobile.getTouchEventName("touchend"),
            mousemove: a.jqx.mobile.getTouchEventName("touchmove"),
            mouseenter: "mouseenter",
            mouseleave: "mouseleave"
        },
        _getEvent: function (a) {
            return this._isTouchDevice ? this._touchEvents[a] : a
        },
        destroy: function () {
            this.host.remove()
        },
        _jqxPlot: null,
        createInstance: function (b) {
            if (!a.jqx.dataAdapter)
                throw "jqxdata.js is not loaded";
            var c = this;
            c._refreshOnDownloadComlete(),
            c._isTouchDevice = a.jqx.mobile.isTouchDevice(),
            c._jqxPlot || (c._jqxPlot = new jqxPlot),
            c.addHandler(c.host, c._getEvent("mousemove"), function (b) {
                if (0 != c.enabled) {
                    c._isRangeSelectorInstance || c.host.css("cursor", "default");
                    var d = b.pageX || b.clientX || b.screenX
                      , e = b.pageY || b.clientY || b.screenY
                      , f = c.host.offset();
                    if (c._isTouchDevice) {
                        var g = a.jqx.position(b);
                        d = g.left,
                        e = g.top
                    }
                    d -= f.left,
                    e -= f.top,
                    c.onmousemove(d, e)
                }
            }),
            c.addHandler(c.host, c._getEvent("mouseleave"), function (a) {
                if (0 != c.enabled) {
                    var b = c._mouseX
                      , d = c._mouseY
                      , e = c._plotRect;
                    e && b >= e.x && b <= e.x + e.width && d >= e.y && d <= e.y + e.height || (c._cancelTooltipTimer(),
                    c._hideToolTip(0),
                    c._unselect())
                }
            }),
            c.addHandler(c.host, "click", function (b) {
                if (0 != c.enabled) {
                    var d = b.pageX || b.clientX || b.screenX
                      , e = b.pageY || b.clientY || b.screenY
                      , f = c.host.offset();
                    if (c._isTouchDevice) {
                        var g = a.jqx.position(b);
                        d = g.left,
                        e = g.top
                    }
                    d -= f.left,
                    e -= f.top,
                    c._mouseX = d,
                    c._mouseY = e,
                    !isNaN(c._lastClickTs) && (new Date).valueOf() - c._lastClickTs < 100 || (this._hostClickTimer = setTimeout(function () {
                        if (c._isTouchDevice || (c._cancelTooltipTimer(),
                        c._hideToolTip(),
                        c._unselect()),
                        c._pointMarker && c._pointMarker.element) {
                            var a = c.seriesGroups[c._pointMarker.gidx]
                              , d = a.series[c._pointMarker.sidx];
                            b.stopImmediatePropagation(),
                            c._raiseItemEvent("click", a, d, c._pointMarker.iidx)
                        }
                    }, 100))
                }
            });
            var d = c.element.style;
            if (d) {
                var e = !1;
                null != d.width && (e |= -1 != d.width.toString().indexOf("%")),
                null != d.height && (e |= -1 != d.height.toString().indexOf("%")),
                e && a.jqx.utilities.resize(this.host, function () {
                    c.timer && clearTimeout(c.timer);
                    c.timer = setTimeout(function () {
                        var a = c.enableAnimations;
                        c.enableAnimations = !1,
                        c.refresh(),
                        c.enableAnimations = a
                    }, 1)
                }, !1, !0)
            }
        },
        _refreshOnDownloadComlete: function () {
            var b = this
              , c = this.source;
            if (c instanceof a.jqx.dataAdapter) {
                var d = c._options;
                (void 0 == d || void 0 != d && !d.autoBind) && (c.autoSync = !1,
                c.dataBind());
                var e = this.element.id;
                if (0 == c.records.length) {
                    var f = function () {
                        b.ready && b.ready(),
                        b.refresh()
                    };
                    c.unbindDownloadComplete(e),
                    c.bindDownloadComplete(e, f)
                } else
                    b.ready && b.ready();
                c.unbindBindingUpdate(e),
                c.bindBindingUpdate(e, function () {
                    b._supressBindingRefresh || b.refresh()
                })
            }
        },
        propertyChangedHandler: function (a, b, c, d) {
            void 0 != this.isInitialized && 0 != this.isInitialized && ("source" == b && this._refreshOnDownloadComlete(),
            this.refresh())
        },
        _initRenderer: function (b) {
            if (!a.jqx.createRenderer)
                throw "Please include jqxdraw.js";
            return a.jqx.createRenderer(this, b)
        },
        _internalRefresh: function () {
            var b = this;
            if (!a.jqx.isHidden(b.host)) {
                b._stopAnimations(),
                b.renderer && (b._isToggleRefresh || b._isUpdate) || (b._hideToolTip(0),
                b._isVML = !1,
                b.host.empty(),
                b._measureDiv = void 0,
                b._initRenderer(b.host));
                var c = b.renderer;
                if (c) {
                    var d = c.getRect();
                    b._render({
                        x: 1,
                        y: 1,
                        width: d.width,
                        height: d.height
                    }),
                    this._raiseEvent("refreshBegin", {
                        instance: this
                    }),
                    c instanceof a.jqx.HTML5Renderer && c.refresh(),
                    b._isUpdate = !1,
                    this._raiseEvent("refreshEnd", {
                        instance: this
                    })
                }
            }
        },
        saveAsPNG: function (a, b, c) {
            return this._saveAsImage("png", a, b, c)
        },
        saveAsJPEG: function (a, b, c) {
            return this._saveAsImage("jpeg", a, b, c)
        },
        saveAsPDF: function (a, b, c) {
            return this._saveAsImage("pdf", a, b, c)
        },
        _saveAsImage: function (b, c, d, e) {
            for (var f = !1, g = 0; g < this.seriesGroups.length && !f; g++) {
                var h = this._getXAxis(g);
                h && h.rangeSelector && (f = !0)
            }
            return a.jqx._widgetToImage(this, b, c, d, e, f ? this._selectorSaveAsImageCallback : void 0)
        },
        _selectorSaveAsImageCallback: function (b, c) {
            for (var d = b, e = 0; e < d.seriesGroups.length; e++) {
                var f = d._getXAxis(e);
                if (f && f.rangeSelector && !f.rangeSelector.renderTo) {
                    var g = d._rangeSelectorInstances[e];
                    if (g) {
                        var h = g.jqxChart("getInstance")
                          , i = (h.renderEngine,
                        h.renderer.getRect())
                          , j = h.renderer.getContainer().find("canvas")[0]
                          , k = j.getContext("2d")
                          , l = d._sliders[e]
                          , m = "horizontal" == d.seriesGroups[e].orientation
                          , n = m ? "height" : "width"
                          , o = m ? "width" : "height"
                          , p = m ? "y" : "x"
                          , q = m ? "x" : "y"
                          , r = {};
                        r[p] = l.startOffset + l.rect[p],
                        r[q] = l.rect[q],
                        r[n] = l.endOffset - l.startOffset,
                        r[o] = l.rect[o];
                        var s = f.rangeSelector.colorSelectedRange || "blue"
                          , t = (f.rangeSelector.colorUnselectedRange,
                        f.rangeSelector.colorRangeLine || "grey")
                          , u = [];
                        u.push(h.renderer.rect(r.x, r.y, r.width, r.height, {
                            fill: s,
                            opacity: .1
                        })),
                        m ? (u.push(h.renderer.line(a.jqx._ptrnd(l.rect.x + l.rect.width), a.jqx._ptrnd(l.rect.y), a.jqx._ptrnd(l.rect.x + l.rect.width), a.jqx._ptrnd(r.y), {
                            stroke: t,
                            opacity: .5
                        })),
                        u.push(h.renderer.line(a.jqx._ptrnd(l.rect.x + l.rect.width), a.jqx._ptrnd(r.y + r.height), a.jqx._ptrnd(l.rect.x + l.rect.width), a.jqx._ptrnd(l.rect.y + l.rect.height), {
                            stroke: t,
                            opacity: .5
                        })),
                        u.push(h.renderer.line(a.jqx._ptrnd(l.rect.x), a.jqx._ptrnd(r.y), a.jqx._ptrnd(l.rect.x + l.rect.width), a.jqx._ptrnd(r.y), {
                            stroke: t,
                            opacity: .5
                        })),
                        u.push(h.renderer.line(a.jqx._ptrnd(l.rect.x), a.jqx._ptrnd(r.y + r.height), a.jqx._ptrnd(l.rect.x + l.rect.width), a.jqx._ptrnd(r.y + r.height), {
                            stroke: t,
                            opacity: .5
                        }))) : (u.push(h.renderer.line(a.jqx._ptrnd(l.rect.x), a.jqx._ptrnd(l.rect.y), a.jqx._ptrnd(r.x), a.jqx._ptrnd(l.rect.y), {
                            stroke: t,
                            opacity: .5
                        })),
                        u.push(h.renderer.line(a.jqx._ptrnd(r.x + r.width), a.jqx._ptrnd(l.rect.y), a.jqx._ptrnd(l.rect.x + l.rect.width), a.jqx._ptrnd(l.rect.y), {
                            stroke: t,
                            opacity: .5
                        })),
                        u.push(h.renderer.line(a.jqx._ptrnd(r.x), a.jqx._ptrnd(l.rect.y), a.jqx._ptrnd(r.x), a.jqx._ptrnd(l.rect.y + l.rect.height), {
                            stroke: t,
                            opacity: .5
                        })),
                        u.push(h.renderer.line(a.jqx._ptrnd(r.x + r.width), a.jqx._ptrnd(l.rect.y), a.jqx._ptrnd(r.x + r.width), a.jqx._ptrnd(l.rect.y + l.rect.height), {
                            stroke: t,
                            opacity: .5
                        }))),
                        h.renderer.refresh();
                        var v = k.getImageData(i.x, i.y, i.width, i.height);
                        c.getContext("2d").putImageData(v, parseInt(g.css("left")), parseInt(g.css("top")), 1, 1, i.width, i.height);
                        for (var w = 0; w < u.length; w++)
                            h.renderer.removeElement(u[w]);
                        h.renderer.refresh()
                    }
                }
            }
            return !0
        },
        refresh: function () {
            this._internalRefresh()
        },
        update: function () {
            this._isUpdate = !0,
            this._internalRefresh()
        },
        _seriesTypes: ["line", "stackedline", "stackedline100", "spline", "stackedspline", "stackedspline100", "stepline", "stackedstepline", "stackedstepline100", "area", "stackedarea", "stackedarea100", "splinearea", "stackedsplinearea", "stackedsplinearea100", "steparea", "stackedsteparea", "stackedsteparea100", "rangearea", "splinerangearea", "steprangearea", "column", "stackedcolumn", "stackedcolumn100", "rangecolumn", "scatter", "stackedscatter", "stackedscatter100", "bubble", "stackedbubble", "stackedbubble100", "pie", "donut", "candlestick", "ohlc", "waterfall", "stackedwaterfall"],
        clear: function () {
            var a = this;
            for (var b in a._defaultSettings)
                a[b] = a._defaultSettings[b];
            a.title = "",
            a.description = "",
            a.refresh()
        },
        _validateSeriesGroups: function () {
            if (!a.isArray(this.seriesGroups))
                throw "Invalid property: 'seriesGroups' property is required and must be a valid array.";
            for (var b = 0; b < this.seriesGroups.length; b++) {
                var c = this.seriesGroups[b];
                if (!c.type)
                    throw "Invalid property: Each series group must have a valid 'type' property.";
                if (!a.isArray(c.series))
                    throw "Invalid property: Each series group must have a 'series' property which must be a valid array."
            }
        },
        _render: function (b) {
            var c = this
              , d = c.renderer;
            c._validateSeriesGroups(),
            c._colorsCache.clear(),
            !c._isToggleRefresh && c._isUpdate && c._renderData && c._renderDataClone(),
            c._renderData = [],
            d.clear(),
            c._unselect(),
            c._hideToolTip(0);
            var e = c.backgroundImage;
            void 0 == e || "" == e ? c.host.css({
                "background-image": ""
            }) : c.host.css({
                "background-image": -1 != e.indexOf("(") ? e : "url('" + e + "')"
            }),
            c._rect = b;
            var f = c.padding || {
                left: 5,
                top: 5,
                right: 5,
                bottom: 5
            }
              , g = d.createClipRect(b)
              , h = d.beginGroup();
            d.setClip(h, g);
            var i = d.rect(b.x, b.y, b.width - 2, b.height - 2);
            if (void 0 == e || "" == e ? d.attr(i, {
                fill: c.backgroundColor || c.background || "white"
            }) : d.attr(i, {
                fill: "transparent"
            }),
            0 != c.showBorderLine) {
                var j = void 0 == c.borderLineColor ? c.borderColor : c.borderLineColor;
                void 0 == j && (j = c._defaultLineColor);
                var k = this.borderLineWidth;
                (isNaN(k) || k < 0 || k > 10) && (k = 1),
                d.attr(i, {
                    "stroke-width": k,
                    stroke: j
                })
            } else
                a.jqx.browser.msie && a.jqx.browser.version < 9 && d.attr(i, {
                    "stroke-width": 1,
                    stroke: c.backgroundColor || "white"
                });
            a.isFunction(c.drawBefore) && c.drawBefore(d, b);
            var l = {
                x: f.left,
                y: f.top,
                width: b.width - f.left - f.right,
                height: b.height - f.top - f.bottom
            };
            c._paddedRect = l;
            var m, n = c.titlePadding || {
                left: 2,
                top: 2,
                right: 2,
                bottom: 2
            };
            if (c.title && c.title.length > 0) {
                var o = c.toThemeProperty("jqx-chart-title-text", null);
                m = d.measureText(c.title, 0, {
                    class: o
                }),
                d.text(c.title, l.x + n.left, l.y + n.top, l.width - (n.left + n.right), m.height, 0, {
                    class: o
                }, !0, "center", "center"),
                l.y += m.height,
                l.height -= m.height
            }
            if (c.description && c.description.length > 0) {
                var p = c.toThemeProperty("jqx-chart-title-description", null);
                m = d.measureText(c.description, 0, {
                    class: p
                }),
                d.text(c.description, l.x + n.left, l.y + n.top, l.width - (n.left + n.right), m.height, 0, {
                    class: p
                }, !0, "center", "center"),
                l.y += m.height,
                l.height -= m.height
            }
            (c.title || c.description) && (l.y += n.bottom + n.top,
            l.height -= n.bottom + n.top);
            var q = {
                x: l.x,
                y: l.y,
                width: l.width,
                height: l.height
            };
            c._plotRect = q,
            c._buildStats(q);
            for (var r, s = c._isPieOnlySeries(), t = c.seriesGroups, u = {
                xAxis: {},
                valueAxis: {}
            }, v = 0; v < t.length && !s; v++)
                if ("pie" != t[v].type && "donut" != t[v].type) {
                    var w = c._getXAxis(v);
                    if (!w)
                        throw "seriesGroup[" + v + "] is missing xAxis definition";
                    var x = w == c._getXAxis() ? -1 : v;
                    u.xAxis[x] = 0
                }
            var y = c.axisPadding;
            isNaN(y) && (y = 5);
            var z = {
                left: 0,
                right: 0,
                leftCount: 0,
                rightCount: 0
            }
              , A = [];
            for (v = 0; v < t.length; v++) {
                var B = t[v];
                if ("pie" != B.type && "donut" != B.type && 1 != B.spider && 1 != B.polar) {
                    r = "horizontal" == B.orientation;
                    var w = c._getXAxis(v)
                      , x = w == c._getXAxis() ? -1 : v
                      , C = c._getValueAxis(v)
                      , D = C == c._getValueAxis() ? -1 : v
                      , E = r ? w.axisSize : C.axisSize
                      , F = {
                          x: 0,
                          y: q.y,
                          width: q.width,
                          height: q.height
                      }
                      , G = r ? c._getXAxis(v).position : C.position;
                    E && "auto" != E || (r ? (E = this._renderXAxis(v, F, !0, q).width,
                    1 == (1 & u.xAxis[x]) ? E = 0 : E > 0 && (u.xAxis[x] |= 1)) : (E = c._renderValueAxis(v, F, !0, q).width,
                    1 == (1 & u.valueAxis[D]) ? E = 0 : E > 0 && (u.valueAxis[D] |= 1))),
                    "left" != G && 1 == c.rtl && (G = "right"),
                    "right" != G && (G = "left"),
                    z[G + "Count"] > 0 && z[G] > 0 && E > 0 && (z[G] += y),
                    A.push({
                        width: E,
                        position: G,
                        xRel: z[G]
                    }),
                    z[G] += E,
                    z[G + "Count"]++
                } else
                    A.push({
                        width: 0,
                        position: 0,
                        xRel: 0
                    })
            }
            var H = Math.max(1, Math.max(b.width, b.height))
              , I = {
                  top: 0,
                  bottom: 0,
                  topCount: 0,
                  bottomCount: 0
              }
              , J = [];
            for (v = 0; v < t.length; v++) {
                var B = t[v];
                if ("pie" != B.type && "donut" != B.type && 1 != B.spider && 1 != B.polar) {
                    r = "horizontal" == B.orientation;
                    var C = this._getValueAxis(v)
                      , D = C == c._getValueAxis() ? -1 : v
                      , w = c._getXAxis(v)
                      , x = w == c._getXAxis() ? -1 : v
                      , K = r ? C.axisSize : w.axisSize
                      , G = r ? C.position : w.position;
                    K && "auto" != K || (r ? (K = c._renderValueAxis(v, {
                        x: 0,
                        y: 0,
                        width: H,
                        height: 0
                    }, !0, q).height,
                    2 == (2 & u.valueAxis[D]) ? K = 0 : K > 0 && (u.valueAxis[D] |= 2)) : (K = c._renderXAxis(v, {
                        x: 0,
                        y: 0,
                        width: H,
                        height: 0
                    }, !0).height,
                    2 == (2 & u.xAxis[x]) ? K = 0 : K > 0 && (u.xAxis[x] |= 2))),
                    "top" != G && (G = "bottom"),
                    I[G + "Count"] > 0 && I[G] > 0 && K > 0 && (I[G] += y),
                    J.push({
                        height: K,
                        position: G,
                        yRel: I[G]
                    }),
                    I[G] += K,
                    I[G + "Count"]++
                } else
                    J.push({
                        height: 0,
                        position: 0,
                        yRel: 0
                    })
            }
            c._createAnimationGroup("series");
            var L = 0 != c.showLegend
              , M = L ? c._renderLegend(c.legendLayout ? c._rect : l, !0) : {
                  width: 0,
                  height: 0
              };
            if (!this.legendLayout || isNaN(this.legendLayout.left) && isNaN(this.legendLayout.top) || (M = {
                width: 0,
                height: 0
            }),
            l.height < I.top + I.bottom + M.height || l.width < z.left + z.right)
                return void d.endGroup();
            q.height -= I.top + I.bottom + M.height,
            q.x += z.left,
            q.width -= z.left + z.right,
            q.y += I.top;
            var N = [];
            if (!s) {
                c._getXAxis().tickMarksColor || c._defaultLineColor;
                for (v = 0; v < t.length; v++) {
                    var B = t[v];
                    if (1 != B.polar && 1 != B.spider && "pie" != B.type && "donut" != B.type) {
                        r = "horizontal" == B.orientation;
                        var x = c._getXAxis(v) == c._getXAxis() ? -1 : v
                          , D = c._getValueAxis(v) == c._getValueAxis() ? -1 : v
                          , F = {
                              x: q.x,
                              y: 0,
                              width: q.width,
                              height: J[v].height
                          };
                        if ("top" != J[v].position ? F.y = q.y + q.height + J[v].yRel : F.y = q.y - J[v].yRel - J[v].height,
                        r) {
                            if (4 == (4 & u.valueAxis[D]))
                                continue;
                            if (!c._isGroupVisible(v))
                                continue;
                            c._renderValueAxis(v, F, !1, q),
                            u.valueAxis[D] |= 4
                        } else {
                            if (N.push(F),
                            4 == (4 & u.xAxis[x]))
                                continue;
                            if (!c._isGroupVisible(v))
                                continue;
                            c._renderXAxis(v, F, !1, q),
                            u.xAxis[x] |= 4
                        }
                    }
                }
            }
            if (L) {
                var O = c.legendLayout ? c._rect : l
                  , P = l.x + a.jqx._ptrnd((l.width - M.width) / 2)
                  , Q = q.y + q.height + I.bottom
                  , E = l.width
                  , K = M.height;
                c.legendLayout && (isNaN(c.legendLayout.left) || (P = c.legendLayout.left),
                isNaN(c.legendLayout.top) || (Q = c.legendLayout.top),
                isNaN(c.legendLayout.width) || (E = c.legendLayout.width),
                isNaN(c.legendLayout.height) || (K = c.legendLayout.height)),
                P + E > O.x + O.width && (E = O.x + O.width - P),
                Q + K > O.y + O.height && (K = O.y + O.height - Q),
                c._renderLegend({
                    x: P,
                    y: Q,
                    width: E,
                    height: K
                })
            }
            if (c._hasHorizontalLines = !1,
            !s)
                for (v = 0; v < t.length; v++) {
                    var B = t[v];
                    if (1 != B.polar && 1 != B.spider && "pie" != B.type && "donut" != B.type) {
                        r = "horizontal" == t[v].orientation;
                        var F = {
                            x: q.x - A[v].xRel - A[v].width,
                            y: q.y,
                            width: A[v].width,
                            height: q.height
                        };
                        "left" != A[v].position && (F.x = q.x + q.width + A[v].xRel);
                        var x = c._getXAxis(v) == c._getXAxis() ? -1 : v
                          , D = c._getValueAxis(v) == c._getValueAxis() ? -1 : v;
                        if (r) {
                            if (N.push(F),
                            8 == (8 & u.xAxis[x]))
                                continue;
                            if (!c._isGroupVisible(v))
                                continue;
                            c._renderXAxis(v, F, !1, q),
                            u.xAxis[x] |= 8
                        } else {
                            if (8 == (8 & u.valueAxis[D]))
                                continue;
                            if (!c._isGroupVisible(v))
                                continue;
                            c._renderValueAxis(v, F, !1, q),
                            u.valueAxis[D] |= 8
                        }
                    }
                }
            if (!(q.width <= 0 || q.height <= 0)) {
                for (c._plotRect = {
                    x: q.x,
                    y: q.y,
                    width: q.width,
                    height: q.height
                },
                v = 0; v < t.length; v++)
                    this._drawPlotAreaLines(v, !0, {
                        gridLines: !1,
                        tickMarks: !1,
                        alternatingBackground: !0
                    }),
                    this._drawPlotAreaLines(v, !1, {
                        gridLines: !1,
                        tickMarks: !1,
                        alternatingBackground: !0
                    });
                for (v = 0; v < t.length; v++)
                    this._drawPlotAreaLines(v, !0, {
                        gridLines: !0,
                        tickMarks: !0,
                        alternatingBackground: !1
                    }),
                    this._drawPlotAreaLines(v, !1, {
                        gridLines: !0,
                        tickMarks: !0,
                        alternatingBackground: !1
                    });
                var R = !1;
                for (v = 0; v < t.length && !R; v++) {
                    var B = t[v];
                    if (void 0 !== B.annotations || a.isFunction(B.draw) || a.isFunction(B.drawBefore)) {
                        R = !0;
                        break
                    }
                }
                var S = d.beginGroup();
                if (!R) {
                    var T = d.createClipRect({
                        x: q.x - 2,
                        y: q.y,
                        width: q.width + 4,
                        height: q.height
                    });
                    d.setClip(S, T)
                }
                for (v = 0; v < t.length; v++) {
                    var B = t[v]
                      , U = !1;
                    for (var V in c._seriesTypes)
                        if (c._seriesTypes[V] == B.type) {
                            U = !0;
                            break
                        }
                    if (!U)
                        throw 'Invalid serie type "' + B.type + '"';
                    a.isFunction(B.drawBefore) && B.drawBefore(d, b, v, this),
                    1 != B.polar && 1 != B.spider || -1 == B.type.indexOf("pie") && -1 == B.type.indexOf("donut") && c._renderSpiderAxis(v, q),
                    c._renderAxisBands(v, q, !0),
                    c._renderAxisBands(v, q, !1)
                }
                for (v = 0; v < t.length; v++) {
                    var B = t[v];
                    if (c._isColumnType(B.type) ? c._renderColumnSeries(v, q) : -1 != B.type.indexOf("pie") || -1 != B.type.indexOf("donut") ? c._renderPieSeries(v, q) : -1 != B.type.indexOf("line") || -1 != B.type.indexOf("area") ? c._renderLineSeries(v, q) : -1 != B.type.indexOf("scatter") || -1 != B.type.indexOf("bubble") ? c._renderScatterSeries(v, q) : -1 == B.type.indexOf("candlestick") && -1 == B.type.indexOf("ohlc") || c._renderCandleStickSeries(v, q, -1 != B.type.indexOf("ohlc")),
                    B.annotations) {
                        if (!this._moduleAnnotations)
                            throw "Please include 'jqxchart.annotations.js'";
                        for (var W = 0; W < B.annotations.length; W++)
                            c._renderAnnotation(v, B.annotations[W], q)
                    }
                    a.isFunction(B.draw) && c.draw(d, b, v, this)
                }
                if (d.endGroup(),
                0 == c.enabled) {
                    var X = d.rect(b.x, b.y, b.width, b.height);
                    d.attr(X, {
                        fill: "#777777",
                        opacity: .5,
                        stroke: "#00FFFFFF"
                    })
                }
                a.isFunction(c.draw) && c.draw(d, b),
                d.endGroup(),
                c._startAnimation("series"),
                c._credits && c._credits();
                for (var Y = !1, v = 0; v < c.seriesGroups.length && !Y; v++) {
                    var w = c._getXAxis(v);
                    w && w.rangeSelector && (Y = !0)
                }
                if (Y) {
                    if (!this._moduleRangeSelector)
                        throw "Please include 'jqxchart.rangeselector.js'";
                    var Z = [];
                    for (this._isSelectorRefresh || (c.removeHandler(a(document), c._getEvent("mousemove"), c._onSliderMouseMove),
                    c.removeHandler(a(document), c._getEvent("mousedown"), c._onSliderMouseDown),
                    c.removeHandler(a(document), c._getEvent("mouseup"), c._onSliderMouseUp)),
                    c._isSelectorRefresh || (c._rangeSelectorInstances = {}),
                    v = 0; v < c.seriesGroups.length; v++) {
                        var $ = this._getXAxis(v);
                        -1 == Z.indexOf($) && this._renderXAxisRangeSelector(v, N[v]) && Z.push($)
                    }
                }
            }
        },
        _credits: function () {
            var b = this
              , c = String.fromCharCode(119, 119, 119, 46, 106, 113, 119, 105, 100, 103, 101, 116, 115, 46, 99, 111, 109);
            if (!b._isRangeSelectorInstance && -1 == location.hostname.indexOf(c.substring(4))) {
                var d = b.renderer
                  , e = b._rect
                  , f = {
                      class: b.toThemeProperty("jqx-chart-legend-text", null),
                      opacity: .5
                  }
                  , g = d.measureText(c, 0, f)
                  , h = d.text(c, e.x + e.width - g.width - 5, e.y + e.height - g.height - 5, g.width, g.height, 0, f);
                a(h).on("click", function () {
                    location.href = "http://" + c + "/?ref=" + b.widgetName
                })
            }
        },
        _isPieOnlySeries: function () {
            var a = this.seriesGroups;
            if (0 == a.length)
                return !1;
            for (var b = 0; b < a.length; b++)
                if ("pie" != a[b].type && "donut" != a[b].type)
                    return !1;
            return !0
        },
        _renderChartLegend: function (b, c, d, e) {
            var f = this
              , g = f.renderer
              , h = {
                  x: c.x,
                  y: c.y,
                  width: c.width,
                  height: c.height
              };
            h.width >= 6 && (h.x += 3,
            h.width -= 6),
            h.height >= 6 && (h.y += 3,
            h.height -= 6);
            for (var i = {
                width: h.width,
                height: 0
            }, j = 0, k = 0, l = 20, m = 0, n = 0, o = 0; o < b.length; o++) {
                var p = b[o].css;
                p || (p = f.toThemeProperty("jqx-chart-legend-text", null)),
                l = 20;
                var q = b[o].text
                  , r = g.measureText(q, 0, {
                      class: p
                  });
                r.height > l && (l = r.height),
                r.width > n && (n = r.width),
                e ? (0 != o && (k += l),
                k > h.height && (k = 0,
                j += n + 20 + 10,
                n = r.width,
                i.width = j + n)) : (0 != j && (j += 10),
                j + 20 + r.width > h.width && r.width < h.width && (j = 0,
                k += l,
                l = 20,
                m = h.width,
                i.height = k + l));
                var s = !1;
                if (r.width > h.width) {
                    s = !0;
                    for (var t = h.width, u = q, v = u.split(/\s+/), w = [], x = "", y = 0; y < v.length; y++) {
                        var z = x + (x.length > 0 ? " " : "") + v[y]
                          , A = f.renderer.measureText(z, 0, {
                              class: p
                          });
                        A.width > t && z.length > 0 && x.length > 0 ? (w.push({
                            text: x
                        }),
                        x = v[y]) : x = z,
                        y + 1 == v.length && w.push({
                            text: x
                        })
                    }
                    r.width = 0;
                    for (var B = 0, C = 0; C < w.length; C++) {
                        var D = w[C].text
                          , A = f.renderer.measureText(D, 0, {
                              class: p
                          });
                        r.width = Math.max(r.width, A.width),
                        B += r.height
                    }
                    r.height = B
                }
                var E = j + r.width < h.width && k + r.height < c.height;
                if (f.legendLayout)
                    var E = h.x + j + r.width < f._rect.x + f._rect.width && h.y + k + r.height < f._rect.y + f._rect.height;
                if (!d && E) {
                    var F = b[o].seriesIndex
                      , G = b[o].groupIndex
                      , H = b[o].itemIndex
                      , I = b[o].fillColor
                      , J = b[o].lineColor
                      , K = f._isSerieVisible(G, F, H)
                      , L = g.beginGroup()
                      , M = K ? b[o].opacity : .1;
                    if (s) {
                        for (var u = q, t = h.width, v = u.split(/\s+/), N = 0, w = [], x = "", y = 0; y < v.length; y++) {
                            var z = x + (x.length > 0 ? " " : "") + v[y]
                              , A = f.renderer.measureText(z, 0, {
                                  class: p
                              });
                            A.width > t && z.length > 0 && x.length > 0 ? (w.push({
                                text: x,
                                dy: N
                            }),
                            N += A.height,
                            x = v[y]) : x = z,
                            y + 1 == v.length && w.push({
                                text: x,
                                dy: N
                            })
                        }
                        for (var C = 0; C < w.length; C++) {
                            var D = w[C].text;
                            N = w[C].dy;
                            var A = f.renderer.measureText(D, 0, {
                                class: p
                            });
                            e ? f.renderer.text(D, h.x + j + 15, h.y + k + N, r.width, l, 0, {
                                class: p
                            }, !1, "left", "center") : f.renderer.text(D, h.x + j + 15, h.y + k + N, r.width, l, 0, {
                                class: p
                            }, !1, "center", "center")
                        }
                        var O = g.rect(h.x + j, h.y + k + 5 + N / 2, 10, 10);
                        e && (k += N),
                        f.renderer.attr(O, {
                            fill: I,
                            "fill-opacity": M,
                            stroke: J,
                            "stroke-width": 1,
                            "stroke-opacity": b[o].opacity
                        })
                    } else {
                        var O = g.rect(h.x + j, h.y + k + 5, 10, 10);
                        f.renderer.attr(O, {
                            fill: I,
                            "fill-opacity": M,
                            stroke: J,
                            "stroke-width": 1,
                            "stroke-opacity": b[o].opacity
                        }),
                        e ? f.renderer.text(q, h.x + j + 15, h.y + k, r.width, r.height + 5, 0, {
                            class: p
                        }, !1, "left", "center") : f.renderer.text(q, h.x + j + 15, h.y + k, r.width, l, 0, {
                            class: p
                        }, !1, "center", "center")
                    }
                    f.renderer.endGroup(),
                    f._setLegendToggleHandler(G, F, H, L)
                }
                e || (j += r.width + 20,
                m < j && (m = j))
            }
            if (d)
                return i.height = a.jqx._ptrnd(k + l + 5),
                i.width = a.jqx._ptrnd(m),
                i
        },
        isSerieVisible: function (a, b, c) {
            return this._isSerieVisible(a, b, c)
        },
        _isSerieVisible: function (b, c, d) {
            for (; this._itemsToggleState.length < b + 1;)
                this._itemsToggleState.push([]);
            for (var e = this._itemsToggleState[b]; e.length < c + 1;)
                e.push(!!isNaN(d) || []);
            var f = e[c];
            if (isNaN(d))
                return f;
            for (a.isArray(f) || (e[c] = f = []) ; f.length < d + 1;)
                f.push(!0);
            return f[d]
        },
        isGroupVisible: function (a) {
            return this._isGroupVisible(a)
        },
        _isGroupVisible: function (a) {
            var b = !1
              , c = this.seriesGroups[a].series;
            if (!c)
                return b;
            for (var d = 0; d < c.length; d++)
                if (this._isSerieVisible(a, d)) {
                    b = !0;
                    break
                }
            return b
        },
        _toggleSerie: function (b, c, d, e) {
            var f = !this._isSerieVisible(b, c, d);
            void 0 != e && (f = e);
            var g = this.seriesGroups[b]
              , h = g.series[c];
            if (this._raiseEvent("toggle", {
                state: f,
                seriesGroup: g,
                serie: h,
                elementIndex: d
            }),
            isNaN(d))
                this._itemsToggleState[b][c] = f;
            else {
                var i = this._itemsToggleState[b][c];
                for (a.isArray(i) || (i = []) ; i.length < d;)
                    i.push(!0);
                i[d] = f
            }
            this._isToggleRefresh = !0,
            this.update(),
            this._isToggleRefresh = !1
        },
        showSerie: function (a, b, c) {
            this._toggleSerie(a, b, c, !0)
        },
        hideSerie: function (a, b, c) {
            this._toggleSerie(a, b, c, !1)
        },
        _setLegendToggleHandler: function (a, b, c, d) {
            var e = this.seriesGroups[a]
              , f = e.series[b]
              , g = f.enableSeriesToggle;
            if (void 0 == g && (g = 0 != e.enableSeriesToggle),
            g) {
                var h = this;
                this.renderer.addHandler(d, "click", function (d) {
                    h._toggleSerie(a, b, c)
                })
            }
        },
        _renderLegend: function (a, b) {
            for (var c = this, d = [], e = 0; e < c.seriesGroups.length; e++) {
                var f = c.seriesGroups[e];
                if (0 != f.showLegend)
                    for (var g = 0; g < f.series.length; g++) {
                        var h = f.series[g];
                        if (0 != h.showLegend) {
                            var i, j = c._getSerieSettings(e, g);
                            if ("pie" != f.type && "donut" != f.type) {
                                var k = h.legendFormatSettings || f.legendFormatSettings
                                  , l = h.legendFormatFunction || f.legendFormatFunction;
                                i = c._formatValue(h.displayText || h.dataField || "", k, l, e, g, NaN);
                                var m = c._getSeriesColors(e, g)
                                  , n = this._get([h.legendFillColor, h.legendColor, m.fillColor])
                                  , o = this._get([h.legendLineColor, h.legendColor, m.lineColor]);
                                d.push({
                                    groupIndex: e,
                                    seriesIndex: g,
                                    text: i,
                                    css: h.displayTextClass,
                                    fillColor: n,
                                    lineColor: o,
                                    opacity: j.opacity
                                })
                            } else
                                for (var p = c._getXAxis(e), k = h.legendFormatSettings || f.legendFormatSettings || p.formatSettings || h.formatSettings || f.formatSettings, l = h.legendFormatFunction || f.legendFormatFunction || p.formatFunction || h.formatFunction || f.formatFunction, q = c._getDataLen(e), r = 0; r < q; r++) {
                                    i = c._getDataValue(r, h.displayText, e),
                                    i = c._formatValue(i, k, l, e, g, r);
                                    var m = c._getColors(e, g, r);
                                    d.push({
                                        groupIndex: e,
                                        seriesIndex: g,
                                        itemIndex: r,
                                        text: i,
                                        css: h.displayTextClass,
                                        fillColor: m.fillColor,
                                        lineColor: m.lineColor,
                                        opacity: j.opacity
                                    })
                                }
                        }
                    }
            }
            return c._renderChartLegend(d, a, b, c.legendLayout && "vertical" == c.legendLayout.flow)
        },
        _getInterval: function (a, b) {
            if (!a)
                return b;
            var c = this._get([a.unitInterval, b]);
            return isNaN(a.step) || (c = a.step * b),
            c
        },
        _getOffsets: function (a, b, c, d, e, f, g, h, i) {
            var j = this._getInterval(e[a], h)
              , k = [];
            ("" == a || e[a].visible && "custom" != e[a].visible) && (k = this._generateIntervalValues(d, j, h, g, i));
            var l;
            if ("labels" != a) {
                var m = g ? f.left : 0;
                if (!g && h > 1 && (m = f.left * (h + 1)),
                1 == k.length && (m *= 2),
                l = this._valuesToOffsets(k, b, d, c, f, !1, m),
                !g) {
                    var n = (f.left + f.right) * j / h;
                    b.flip ? l.unshift(l[0] + n) : l.push(l[l.length - 1] + n)
                }
            } else {
                var m = f.left;
                1 == k.length && (m *= 2),
                l = this._valuesToOffsets(k, b, d, c, f, g, m)
            }
            var o = this._arraysToObjectsArray([k, l], ["value", "offset"]);
            if (b[a] && b[a].custom)
                for (var p = this._objectsArraysToArray(b[a].custom, "value"), q = this._objectsArraysToArray(b[a].custom, "offset"), r = this._valuesToOffsets(p, b, d, c, f, g, f.left), s = 0; s < b[a].custom.length; s++)
                    o.push({
                        value: p[s],
                        offset: isNaN(q[s]) ? r[s] : q[s]
                    });
            return o
        },
        _renderXAxis: function (b, c, d, e) {
            var f = this
              , g = f._getXAxis(b)
              , h = f.seriesGroups[b]
              , i = "horizontal" == h.orientation
              , j = {
                  width: 0,
                  height: 0
              }
              , k = f._getAxisSettings(g);
            if (!g || !k.visible || "spider" == h.type)
                return j;
            if (!f._isGroupVisible(b) || this._isPieGroup(b))
                return j;
            for (var l = f._alignValuesWithTicks(b) ; f._renderData.length < b + 1;)
                f._renderData.push({});
            f.rtl && (g.flip = !0);
            var m = i ? c.height : c.width
              , n = g.text
              , o = f._calculateXOffsets(b, m)
              , p = o.axisStats
              , q = g.rangeSelector
              , r = 0;
            if (q) {
                if (!this._moduleRangeSelector)
                    throw "Please include 'jqxchart.rangeselector.js'";
                r = this._selectorGetSize(g)
            }
            var s = i && "right" == g.position || !i && "top" == g.position;
            !d && q && (i ? (c.width -= r,
            "right" != g.position && (c.x += r)) : (c.height -= r,
            "top" == g.position && (c.y += r)));
            var t = {
                rangeLength: o.rangeLength,
                itemWidth: o.itemWidth,
                intervalWidth: o.intervalWidth,
                data: o,
                settings: k,
                isMirror: s,
                rect: c
            };
            f._renderData[b].xAxis = t;
            var u = p.interval;
            if (isNaN(u))
                return j;
            i && (k.title.angle -= 90,
            k.labels.angle -= 90);
            var v, w = this._getInterval(k.gridLines, u), x = this._getInterval(k.tickMarks, u), y = this._getInterval(k.labels, u), z = p.min, A = p.max, B = o.padding, C = 1 == g.flip || f.rtl, D = {
                min: z,
                max: A
            };
            p.logAxis.enabled && (D.min = p.logAxis.minPow,
            D.max = p.logAxis.maxPow),
            "date" == g.type ? (k.gridLines.offsets = this._generateDTOffsets(z, A, m, B, w, u, p.dateTimeUnit, l, NaN, !1, C),
            k.tickMarks.offsets = this._generateDTOffsets(z, A, m, B, x, u, p.dateTimeUnit, l, NaN, !1, C),
            v = this._generateDTOffsets(z, A, m, B, y, u, p.dateTimeUnit, l, NaN, !0, C)) : (k.gridLines.offsets = this._getOffsets("gridLines", g, m, p, k, B, l, u),
            k.tickMarks.offsets = this._getOffsets("tickMarks", g, m, p, k, B, l, u),
            v = this._getOffsets("labels", g, m, p, k, B, l, u));
            var E, F = f.renderer.getRect();
            F.width,
            c.x,
            c.width,
            f._getDataLen(b);
            f._elementRenderInfo && f._elementRenderInfo.length > b && (E = f._elementRenderInfo[b].xAxis);
            var G, H = [];
            k.labels.formatFunction && (G = k.labels.formatFunction);
            var I;
            k.labels.formatSettings && (I = a.extend({}, k.labels.formatSettings)),
            "date" == g.type && (g.dateFormat && !G ? I ? I.dateFormat = I.dateFormat || g.dateFormat : I = {
                dateFormat: g.dateFormat
            } : G || I && (!I || I.dateFormat) || (G = this._getDefaultDTFormatFn(g.baseUnit || "day")));
            for (var J = 0; J < v.length; J++) {
                var K = v[J].value
                  , L = v[J].offset;
                if (!isNaN(L)) {
                    var M = void 0;
                    "date" != g.type && p.useIndeces && g.dataField && (M = Math.round(K),
                    void 0 == (K = f._getDataValue(M, g.dataField)) && (K = ""));
                    var n = f._formatValue(K, I, G, b, void 0, M);
                    void 0 != n && "" != n.toString() || (isNaN(M) && (M = J),
                    M >= p.filterRange.min && M <= p.filterRange.max && (n = p.useIndeces ? (p.min + M).toString() : void 0 == K ? "" : K.toString()));
                    var N = {
                        key: K,
                        text: n,
                        targetX: L,
                        x: L
                    };
                    E && E.itemOffsets[K] && (N.x = E.itemOffsets[K].x,
                    N.y = E.itemOffsets[K].y),
                    H.push(N)
                }
            }
            var O = f._getAnimProps(b)
              , P = O.enabled && H.length < 500 ? O.duration : 0;
            0 == f.enableAxisTextAnimation && (P = 0);
            var Q = {
                items: H,
                renderData: t
            }
              , R = f._renderAxis(i, s, k, {
                  x: c.x,
                  y: c.y,
                  width: c.width,
                  height: c.height
              }, e, u, !1, !0, Q, d, P);
            return i ? R.width += r : R.height += r,
            R
        },
        _animateAxisText: function (a, b) {
            for (var c = a.items, d = a.textSettings, e = 0; e < c.length; e++) {
                var f = c[e];
                if (f && f.visible) {
                    var g = f.targetX
                      , h = f.targetY;
                    isNaN(f.x) || isNaN(f.y) || (g = f.x + (g - f.x) * b,
                    h = f.y + (h - f.y) * b),
                    f.element && (this.renderer.removeElement(f.element),
                    f.element = void 0),
                    f.element = this.renderer.text(f.text, g, h, f.width, f.height, d.angle, {
                        class: d.style
                    }, !1, d.halign, d.valign, d.textRotationPoint)
                }
            }
        },
        _getPolarAxisCoords: function (b, c) {
            var d = this.seriesGroups[b]
              , e = c.x + a.jqx.getNum([d.offsetX, c.width / 2])
              , f = c.y + a.jqx.getNum([d.offsetY, c.height / 2])
              , g = Math.min(c.width, c.height)
              , h = d.radius;
            this._isPercent(h) && (h = parseFloat(h) / 100 * g / 2),
            isNaN(h) && (h = g / 2 * .6);
            var i = this._alignValuesWithTicks(b)
              , j = this._get([d.startAngle, d.minAngle, 0]) - 90;
            j = isNaN(j) ? 0 : 2 * Math.PI * j / 360;
            var k = this._get([d.endAngle, d.maxAngle, 360]) - 90;
            if (k = isNaN(k) ? 2 * Math.PI : 2 * Math.PI * k / 360,
            j > k) {
                var l = j;
                j = k,
                k = l
            }
            var m = a.jqx._rnd(Math.abs(j - k) / (2 * Math.PI), .001, !0)
              , n = 2 * Math.PI * h * m
              , o = this._calcGroupOffsets(b, c).xoffsets;
            if (o) {
                var p = !(Math.abs(Math.abs(k - j) - 2 * Math.PI) > 1e-5);
                if (d.spider) {
                    axisStats = this._getXAxisStats(b, this._getXAxis(b), n);
                    var q = axisStats.interval;
                    (isNaN(q) || 0 == q) && (q = 1);
                    var r = (axisStats.max - axisStats.min) / q + (p ? 1 : 0);
                    if ((r = Math.round(r)) > 2) {
                        var s = Math.cos(Math.abs(k - j) / 2 / r);
                        s = a.jqx._rnd(s, .01),
                        0 == s && (s = 1);
                        var t = h / s;
                        t > h && i && (h = t)
                    }
                }
                return h = a.jqx._ptrnd(h),
                {
                    x: e,
                    y: f,
                    r: h,
                    adjR: this._get([t, h]),
                    itemWidth: o.itemWidth,
                    rangeLength: o.rangeLength,
                    valuesOnTicks: i,
                    startAngle: j,
                    endAngle: k,
                    isClosedCircle: p,
                    axisSize: n
                }
            }
        },
        _toPolarCoord: function (b, c, d, e) {
            var f = Math.abs(b.startAngle - b.endAngle) / (2 * Math.PI)
              , g = 2 * (d - c.x) * Math.PI * f / Math.max(1, c.width) + b.startAngle
              , h = (c.height + c.y - e) * b.r / Math.max(1, c.height)
              , i = b.x + h * Math.cos(g)
              , j = b.y + h * Math.sin(g);
            return {
                x: a.jqx._ptrnd(i),
                y: a.jqx._ptrnd(j)
            }
        },
        _renderSpiderAxis: function (b, c) {
            var d = this
              , e = d._getXAxis(b)
              , f = this._getAxisSettings(e);
            if (e && f.visible) {
                var g = d.seriesGroups[b]
                  , h = d._getPolarAxisCoords(b, c);
                if (h) {
                    var i = a.jqx._ptrnd(h.x)
                      , j = a.jqx._ptrnd(h.y)
                      , k = h.adjR
                      , l = h.startAngle
                      , m = h.endAngle;
                    if (!(k < 1)) {
                        var n = a.jqx._rnd(Math.abs(l - m) / (2 * Math.PI), .001, !0)
                          , o = 2 * Math.PI * k * n
                          , p = h.isClosedCircle
                          , q = this._renderData[b].xoffsets;
                        if (q.rangeLength) {
                            var r = q.axisStats.interval;
                            (isNaN(r) || r < 1) && (r = 1);
                            var s = "horizontal" == g.orientation;
                            for (s && "right" == e.position || !s && e.position; d._renderData.length < b + 1;)
                                d._renderData.push({});
                            var t = {
                                rangeLength: q.rangeLength,
                                itemWidth: q.itemWidth,
                                data: q,
                                rect: c,
                                settings: f
                            };
                            d._renderData[b].xAxis = t,
                            d._renderData[b].polarCoords = h;
                            for (var u = !0, v = 0; v < b; v++) {
                                var w = (d._renderData[v].xAxis,
                                d._renderData[v].polarCoords)
                                  , x = d._getXAxis(v)
                                  , y = !1;
                                for (var z in h)
                                    if (h[z] != w[z]) {
                                        y = !0;
                                        break
                                    }
                                y && x == e || (u = !1)
                            }
                            var A, B = f.gridLines, C = f.tickMarks, D = f.labels, E = this._getInterval(B, r), F = this._getInterval(C, r), G = this._getInterval(D, r), H = d._alignValuesWithTicks(b), I = d.renderer, J = q.axisStats, K = J.min, L = J.max, M = this._getPaddingSize(q.axisStats, e, H, o, !0, p, !1), N = 1 == e.flip || d.rtl;
                            "date" == e.type ? (B.offsets = this._generateDTOffsets(K, L, o, M, E, r, e.baseUnit, !0, 0, !1, N),
                            C.offsets = this._generateDTOffsets(K, L, o, M, F, r, e.baseUnit, !0, 0, !1, N),
                            A = this._generateDTOffsets(K, L, o, M, G, r, e.baseUnit, !0, 0, !0, N)) : (f.gridLines.offsets = this._getOffsets("gridLines", e, o, J, f, M, !0, r),
                            f.tickMarks.offsets = this._getOffsets("tickMarks", e, o, J, f, M, !0, r),
                            A = this._getOffsets("labels", e, o, J, f, M, !0, r));
                            var O, P = d.renderer.getRect();
                            P.width,
                            c.x,
                            c.width,
                            d._getDataLen(b);
                            d._elementRenderInfo && d._elementRenderInfo.length > b && (O = d._elementRenderInfo[b].xAxis);
                            for (var Q = [], R = this._getDataLen(b), v = 0; v < A.length; v++) {
                                var S = A[v].offset
                                  , T = A[v].value;
                                if ("date" != e.type && J.useIndeces && e.dataField) {
                                    var U = Math.round(T);
                                    if (U >= R)
                                        continue;
                                    T = d._getDataValue(U, e.dataField),
                                    void 0 == T && (T = "")
                                }
                                var V = d._formatValue(T, D.formatSettings, D.formatFunction, b, void 0, U);
                                void 0 != V && "" != V.toString() || (V = J.useIndeces ? (J.min + v).toString() : void 0 == T ? "" : T.toString());
                                var W = {
                                    key: T,
                                    text: V,
                                    targetX: S,
                                    x: S
                                };
                                O && O.itemOffsets[T] && (W.x = O.itemOffsets[T].x,
                                W.y = O.itemOffsets[T].y),
                                Q.push(W)
                            }
                            var X = {
                                stroke: B.color,
                                fill: "none",
                                "stroke-width": B.width,
                                "stroke-dasharray": B.dashStyle || ""
                            };
                            if (!g.spider)
                                if (1 == n)
                                    I.circle(i, j, k, X);
                                else {
                                    var Y = -l / Math.PI * 180
                                      , Z = -m / Math.PI * 180;
                                    this.renderer.pieslice(i, j, 0, k, Math.min(Y, Z), Math.max(Y, Z), void 0, X)
                                }
                            var $ = Q.length
                              , _ = (Math.PI,
                            l);
                            if (B.visible && u) {
                                H || p || B.offsets.unshift({
                                    offset: -M.right
                                });
                                for (var v = 0; v < B.offsets.length; v++) {
                                    var aa = B.offsets[v].offset;
                                    H || (aa += p ? M.right / 2 : M.right);
                                    var ba = _ + 2 * aa * Math.PI * n / Math.max(1, o);
                                    if (!(ba - m > .01)) {
                                        var ca = a.jqx._ptrnd(i + k * Math.cos(ba))
                                          , da = a.jqx._ptrnd(j + k * Math.sin(ba));
                                        I.line(i, j, ca, da, X)
                                    }
                                }
                            }
                            if (C.visible && u) {
                                var ea = {
                                    stroke: C.color,
                                    fill: "none",
                                    "stroke-width": C.width,
                                    "stroke-dasharray": C.dashStyle || ""
                                };
                                H || p || C.offsets.unshift({
                                    offset: -M.right
                                });
                                for (var v = 0; v < C.offsets.length; v++) {
                                    var aa = C.offsets[v].offset;
                                    H || (aa += p ? M.right / 2 : M.right);
                                    var ba = _ + 2 * aa * Math.PI * n / Math.max(1, o);
                                    if (!(ba - m > .01)) {
                                        var fa = {
                                            x: i + k * Math.cos(ba),
                                            y: j + k * Math.sin(ba)
                                        }
                                          , ga = {
                                              x: i + (k + 5) * Math.cos(ba),
                                              y: j + (k + 5) * Math.sin(ba)
                                          };
                                        I.line(a.jqx._ptrnd(fa.x), a.jqx._ptrnd(fa.y), a.jqx._ptrnd(ga.x), a.jqx._ptrnd(ga.y), ea)
                                    }
                                }
                            }
                            var ha = [];
                            if (g.spider) {
                                var ia = [];
                                ia = "date" == e.type ? this._generateDTOffsets(K, L, o, M, r, r, e.baseUnit, !0, 0, !1, N) : this._getOffsets("", e, o, J, f, M, !0, r),
                                H || p || ia.unshift({
                                    offset: -M.right
                                });
                                for (var v = 0; v < ia.length; v++) {
                                    var aa = ia[v].offset;
                                    H || (aa += p ? M.right / 2 : M.right);
                                    var ba = _ + 2 * aa * Math.PI * n / Math.max(1, o);
                                    ba - m > .01 || ha.push(ba)
                                }
                                t.offsetAngles = ha
                            }
                            var ja = d._renderSpiderValueAxis(b, c, H ? h.adjR : h.r, ha);
                            if (ja || (ja = []),
                            g.spider) {
                                if (!H)
                                    for (var v = 0; v < ja.length; v++)
                                        ja[v] = ja[v] * h.adjR / h.r;
                                ja.push(k),
                                this._renderSpiderLines(i, j, ja, h, ha, X)
                            }
                            if (u && D.visible) {
                                t.polarLabels = [];
                                for (var v = 0; v < Q.length; v++) {
                                    var aa = Q[v].x
                                      , ba = _ + 2 * aa * Math.PI * n / Math.max(1, o);
                                    ba = (360 - ba / (2 * Math.PI) * 360) % 360,
                                    ba < 0 && (ba = 360 + ba);
                                    var ka, la = I.measureText(Q[v].text, 0, {
                                        class: f.labels.style
                                    }), ma = (H ? h.adjR : h.r) + (C.visible ? 7 : 2), na = f.labels;
                                    if (na.autoRotate) {
                                        var oa = a.jqx._ptRotate(i - la.width / 2, j - ma - la.height, i, j, -ba / 180 * Math.PI)
                                          , pa = a.jqx._ptRotate(i + la.width / 2, j - ma, i, j, -ba / 180 * Math.PI);
                                        la.width = Math.abs(oa.x - pa.x),
                                        la.height = Math.abs(oa.y - pa.y),
                                        ka = {
                                            x: Math.min(oa.x, pa.x),
                                            y: Math.min(oa.y, pa.y)
                                        }
                                    } else
                                        ka = this._adjustTextBoxPosition(i, j, la, ma, ba, !1, !1, !1);
                                    t.polarLabels.push({
                                        x: ka.x,
                                        y: ka.y,
                                        value: Q[v].text
                                    }),
                                    I.text(Q[v].text, ka.x, ka.y, la.width, la.height, na.autoRotate ? 90 - ba : na.angle, {
                                        class: na.style
                                    }, !1, na.halign, na.valign)
                                }
                            }
                        }
                    }
                }
            }
        },
        _renderSpiderLines: function (b, c, d, e, f, g) {
            for (var h = this.renderer, i = (e.startAngle,
            e.endAngle,
            e.isClosedCircle), j = 0; j < d.length; j++) {
                for (var k = d[j], l = void 0, m = void 0, n = 0; n < f.length; n++) {
                    var o = f[n]
                      , p = a.jqx._ptrnd(b + k * Math.cos(o))
                      , q = a.jqx._ptrnd(c + k * Math.sin(o));
                    l && h.line(l.x, l.y, p, q, g),
                    l = {
                        x: p,
                        y: q
                    },
                    m || (m = {
                        x: p,
                        y: q
                    })
                }
                m && i && h.line(l.x, l.y, m.x, m.y, g)
            }
        },
        _renderSpiderValueAxis: function (b, c, d, e) {
            var f = this.seriesGroups[b]
              , g = this._getPolarAxisCoords(b, c);
            if (g) {
                var h = a.jqx._ptrnd(g.x)
                  , i = a.jqx._ptrnd(g.y);
                d = d || g.r;
                var j = g.startAngle
                  , k = g.endAngle
                  , l = a.jqx._rnd(Math.abs(j - k) / (2 * Math.PI), .001, !0);
                if (!(d < 1)) {
                    d = a.jqx._ptrnd(d);
                    var m = this._getValueAxis(b);
                    if (settings = this._getAxisSettings(m),
                    m && 0 != settings.visible) {
                        var n = this._stats.seriesGroups[b].mu
                          , o = settings.labels
                          , p = o.formatSettings;
                        -1 != f.type.indexOf("stacked") && -1 != f.type.indexOf("100") && !p && (p = {
                            sufix: "%"
                        });
                        var q = this._get([o.step, o.unitInterval / n]);
                        isNaN(q) && (q = 1),
                        q = Math.max(1, Math.round(q)),
                        this._calcValueAxisItems(b, d, q);
                        var r = settings.gridLines
                          , s = settings.tickMarks
                          , t = (this._getInterval(r, n),
                        this._getInterval(s, n),
                        settings.labels)
                          , u = {
                              stroke: r.color,
                              fill: "none",
                              "stroke-width": 1,
                              "stroke-dasharray": r.dashStyle || ""
                          }
                          , v = this._renderData[b].valueAxis
                          , w = v.items
                          , x = j;
                        if (w.length && settings.line.visible) {
                            isNaN(settings.line.angle) || (x = 2 * Math.PI * settings.line.angle / 360);
                            var y = h + Math.cos(x) * d
                              , z = i + Math.sin(x) * d;
                            if (-1 == e.indexOf(x)) {
                                var A = a.extend({}, u);
                                A["stroke-width"] = settings.line.lineWidth,
                                A.stroke = settings.line.color,
                                A["stroke-dasharray"] = settings.line.dashStyle,
                                this.renderer.line(h, i, y, z, A)
                            }
                        }
                        w = w.reverse();
                        var B = this.renderer;
                        v.polarLabels = [];
                        for (var C = 0; C < w.length - 1; C++) {
                            var D = w[C];
                            if (!isNaN(D)) {
                                var E = t.formatFunction ? t.formatFunction(D) : this._formatNumber(D, p)
                                  , F = B.measureText(E, 0, {
                                      class: t.style
                                  })
                                  , G = h + (0 != m.showTickMarks ? 3 : 2)
                                  , H = i - v.itemWidth * C - F.height / 2
                                  , I = a.jqx._ptRotate(G, H, h, i, x)
                                  , J = a.jqx._ptRotate(G + F.width, H + F.height, h, i, x);
                                G = Math.min(I.x, J.x),
                                H = Math.min(I.y, J.y),
                                F.width = Math.abs(I.x - J.x),
                                F.height = Math.abs(I.y - J.y),
                                G += settings.labels.textOffset.x,
                                H += settings.labels.textOffset.y,
                                v.polarLabels.push({
                                    x: G,
                                    y: H,
                                    value: E
                                }),
                                B.text(E, G, H, F.width, F.height, t.autoRotate ? 90 + 180 * j / Math.PI : t.angle, {
                                    class: t.style
                                }, !1, t.halign, t.valign)
                            }
                        }
                        var K = 1 == m.logarithmicScale
                          , L = K ? w.length : v.rangeLength;
                        aIncrement = 2 * Math.PI / L;
                        var M = 0 != m.valuesOnTicks
                          , N = this._stats.seriesGroups[b]
                          , O = N.mu
                          , P = 1 == m.logarithmicScale;
                        m.logarithmicScaleBase;
                        P && (O = 1);
                        var Q = {
                            min: N.min,
                            max: N.max,
                            logAxis: {
                                enabled: 1 == P,
                                base: m.logarithmicScaleBase,
                                minPow: N.minPow,
                                maxPow: N.maxPow
                            }
                        };
                        (r.visible || f.spider || m.alternatingBackgroundColor || m.alternatingBackgroundColor2) && (r.offsets = this._getOffsets("gridLines", m, d, Q, settings, {
                            left: 0,
                            right: 0
                        }, M, O));
                        var R = [];
                        if (r.visible || f.spider)
                            for (var u = {
                                stroke: r.color,
                                fill: "none",
                                "stroke-width": 1,
                                "stroke-dasharray": r.dashStyle || ""
                            }, C = 0; C < r.offsets.length; C++) {
                                var H = a.jqx._ptrnd(r.offsets[C].offset);
                                if (H != d)
                                    if (f.spider)
                                        R.push(H);
                                    else if (1 != l) {
                                        var S = -j / Math.PI * 180
                                          , T = -k / Math.PI * 180;
                                        this.renderer.pieslice(h, i, 0, H, Math.min(S, T), Math.max(S, T), void 0, u)
                                    } else
                                        B.circle(h, i, H, u)
                            }
                        if (m.tickMarks && (m.tickMarks.visible || m.showTickMarks) || (s.visible = !1),
                        s.visible) {
                            s.offsets = this._getOffsets("tickMarks", m, d, Q, settings, {
                                left: 0,
                                right: 0
                            }, M, O),
                            tickMarkSize = 2 * s.size;
                            for (var u = {
                                stroke: s.color,
                                fill: "none",
                                "stroke-width": 1,
                                "stroke-dasharray": s.dashStyle || ""
                            }, C = 0; C < s.offsets.length; C++) {
                                var U = s.offsets[C].offset
                                  , I = {
                                      x: h + U * Math.cos(x) - tickMarkSize / 2 * Math.sin(x + Math.PI / 2),
                                      y: i + U * Math.sin(x) - tickMarkSize / 2 * Math.cos(x + Math.PI / 2)
                                  }
                                  , J = {
                                      x: h + U * Math.cos(x) + tickMarkSize / 2 * Math.sin(x + Math.PI / 2),
                                      y: i + U * Math.sin(x) + tickMarkSize / 2 * Math.cos(x + Math.PI / 2)
                                  };
                                B.line(a.jqx._ptrnd(I.x), a.jqx._ptrnd(I.y), a.jqx._ptrnd(J.x), a.jqx._ptrnd(J.y), u)
                            }
                        }
                        return R
                    }
                }
            }
        },
        _renderAxis: function (b, c, d, e, f, g, h, i, j, k, l) {
            if (d.customDraw && !k)
                return {
                    width: NaN,
                    height: NaN
                };
            var m = d.title
              , n = d.labels
              , o = (d.gridLines,
            d.tickMarks)
              , p = d.padding
              , q = o.visible ? o.size : 0
              , r = {
                  width: 0,
                  height: 0
              }
              , s = {
                  width: 0,
                  height: 0
              };
            b ? r.height = s.height = e.height : r.width = s.width = e.width,
            !k && c && b && (e.x -= e.width);
            var t = j.renderData
              , u = t.itemWidth;
            if (m.visible && void 0 != m.text && "" != m) {
                var v = m.angle
                  , w = this.renderer.measureText(m.text, v, {
                      class: m.style
                  });
                s.width = w.width,
                s.height = w.height,
                k || this.renderer.text(m.text, e.x + m.offset.x + (b ? c ? -p.right - 2 + 2 * e.width - s.width : 2 + p.left : 0), e.y + m.offset.y + (b ? 0 : c ? p.top + 2 : e.height - 2 - s.height - p.bottom), b ? s.width : e.width, b ? e.height : s.height, v, {
                    class: m.style
                }, !0, m.halign, m.valign, m.rotationPoint)
            }
            var x = 0
              , y = i ? -u / 2 : 0;
            i && !b && (n.halign = "center");
            var z = e.x
              , A = e.y
              , B = n.textOffset;
            B && (isNaN(B.x) || (z += B.x),
            isNaN(B.y) || (A += B.y)),
            b ? (z += p.left + 2 + (s.width > 0 ? s.width + 2 : 0) + (c ? e.width - s.width : 0),
            A += y) : (z += y,
            c ? (A += s.height > 0 ? s.height + 6 : 4,
            A += q - (i ? q : q / 4)) : A += i ? q : q / 4,
            A += p.top);
            var C = 0
              , D = 0
              , E = j.items;
            t.itemOffsets = {},
            !this._isToggleRefresh && this._isUpdate || (l = 0);
            for (var F = !1, G = 0, H = 0; H < E.length && n.visible; H++,
            x += u)
                if (E[H] && !isNaN(u)) {
                    var I = E[H].text;
                    isNaN(E[H].targetX) || (x = E[H].targetX);
                    var w = this.renderer.measureText(I, n.angle, {
                        class: n.style
                    });
                    if (w.width > D && (D = w.width),
                    w.height > C && (C = w.height),
                    G += b ? C : D,
                    !k) {
                        if (b && x > e.height + 2 || !b && x > e.width + 2)
                            continue;
                        var J = b ? z + (c ? 0 == s.width ? q : q - 2 : 0) : z + x
                          , K = b ? A + x : A;
                        t.itemOffsets[E[H].key] = {
                            x: J,
                            y: K
                        },
                        F || (!isNaN(E[H].x) || !isNaN(E[H].y) && l) && (F = !0),
                        E[H].targetX = J,
                        E[H].targetY = K,
                        E[H].width = b ? e.width - p.left - p.right - 4 - q - (s.width > 0 ? s.width + 2 : 0) : u,
                        E[H].height = b ? u : e.height - p.top - p.bottom - 4 - q - (s.height > 0 ? s.height + 2 : 0),
                        E[H].visible = !0
                    }
                }
            if (t.avgWidth = 0 == E.length ? 0 : G / E.length,
            !k) {
                var L = {
                    items: E,
                    textSettings: n
                };
                if (!isNaN(l) && F || (l = 0),
                this._animateAxisText(L, 0 == l ? 1 : 0),
                0 != l) {
                    var M = this;
                    this._enqueueAnimation("series", void 0, void 0, l, function (a, b, c) {
                        M._animateAxisText(b, c)
                    }, L)
                }
            }
            r.width += 4 + q + s.width + D + (b && s.width > 0 ? 2 : 0),
            r.height += 4 + q + s.height + C + (!b && s.height > 0 ? 2 : 0),
            b ? r.width += p.left + p.right : r.height += p.top + p.bottom;
            if (!k && d.line.visible) {
                var N = {
                    stroke: d.line.color,
                    "stroke-width": d.line.width,
                    "stroke-dasharray": d.line.dashStyle || ""
                };
                if (b) {
                    var J = e.x + e.width + (c ? p.left : -p.right);
                    J = a.jqx._ptrnd(J),
                    this.renderer.line(J, e.y, J, e.y + e.height, N)
                } else {
                    var K = a.jqx._ptrnd(e.y + (c ? e.height - p.bottom : p.top));
                    this.renderer.line(a.jqx._ptrnd(e.x), K, a.jqx._ptrnd(e.x + e.width + 1), K, N)
                }
            }
            return r.width = a.jqx._rup(r.width),
            r.height = a.jqx._rup(r.height),
            r
        },
        _drawPlotAreaLines: function (b, c, d) {
            var e = this.seriesGroups[b]
              , f = "horizontal" != e.orientation;
            if (this._renderData && !(this._renderData.length <= b)) {
                var g = c ? "valueAxis" : "xAxis"
                  , h = this._renderData[b][g];
                if (h) {
                    var i = this._renderData.axisDrawState;
                    i || (i = this._renderData.axisDrawState = {});
                    var j, k = "";
                    c ? (k = "valueAxis_" + (e.valueAxis ? b : "") + (f ? "swap" : ""),
                    j = this._getValueAxis(b)) : (k = "xAxis_" + (e.xAxis || e.categoryAxis ? b : "") + (f ? "swap" : ""),
                    j = this._getXAxis(b)),
                    i = i[k] ? i[k] : i[k] = {},
                    c || (f = !f);
                    var l = h.settings;
                    if (l && !l.customDraw) {
                        var m = l.gridLines
                          , n = l.tickMarks
                          , o = l.padding
                          , p = h.rect
                          , q = this._plotRect;
                        if (m && n) {
                            var r = {}
                              , s = {
                                  stroke: m.color,
                                  "stroke-width": m.width,
                                  "stroke-dasharray": m.dashStyle || ""
                              }
                              , t = c ? p.y + p.height : p.x
                              , u = m.offsets;
                            if (c && !j.flip && (u = a.extend([], u),
                            u = u.reverse()),
                            u && u.length > 0)
                                for (var v = NaN, w = (u.length,
                                0) ; w < u.length; w++)
                                    if (f ? (lineOffset = a.jqx._ptrnd(p.y + u[w].offset),
                                    lineOffset < p.y - .5 && (lineOffset = a.jqx._ptrnd(p.y)),
                                    lineOffset > p.y + p.height && (lineOffset = p.y + p.height)) : (lineOffset = a.jqx._ptrnd(p.x + u[w].offset),
                                    lineOffset > p.x + p.width + .5 && (lineOffset = a.jqx._ptrnd(p.x + p.width))),
                                    !isNaN(lineOffset) && (isNaN(v) || !(Math.abs(lineOffset - v) < 2))) {
                                        if (v = lineOffset,
                                        d.gridLines && 0 != m.visible && 1 != i.gridLines && (f ? this.renderer.line(a.jqx._ptrnd(q.x), lineOffset, a.jqx._ptrnd(q.x + q.width), lineOffset, s) : this.renderer.line(lineOffset, a.jqx._ptrnd(q.y), lineOffset, a.jqx._ptrnd(q.y + q.height), s)),
                                        r[lineOffset] = !0,
                                        d.alternatingBackground && (m.alternatingBackgroundColor || m.alternatingBackgroundColor2) && 1 != i.alternatingBackground) {
                                            var x = w % 2 == 0 ? m.alternatingBackgroundColor2 : m.alternatingBackgroundColor;
                                            if (w > 0 && x) {
                                                var y;
                                                y = f ? this.renderer.rect(a.jqx._ptrnd(q.x), t, a.jqx._ptrnd(q.width - 1), lineOffset - t, s) : this.renderer.rect(t, a.jqx._ptrnd(q.y), lineOffset - t, a.jqx._ptrnd(q.height), s),
                                                this.renderer.attr(y, {
                                                    "stroke-width": 0,
                                                    fill: x,
                                                    opacity: m.alternatingBackgroundOpacity || 1
                                                })
                                            }
                                        }
                                        t = lineOffset
                                    }
                            var s = {
                                stroke: n.color,
                                "stroke-width": n.width,
                                "stroke-dasharray": n.dashStyle || ""
                            };
                            if (d.tickMarks && n.visible && 1 != i.tickMarks)
                                for (var z = n.size, u = n.offsets, v = NaN, w = 0; w < u.length; w++)
                                    if (f ? (lineOffset = a.jqx._ptrnd(p.y + u[w].offset),
                                    lineOffset < p.y - .5 && (lineOffset = a.jqx._ptrnd(p.y)),
                                    lineOffset > p.y + p.height && (lineOffset = p.y + p.height)) : (lineOffset = a.jqx._ptrnd(p.x + u[w].offset),
                                    lineOffset > p.x + p.width + .5 && (lineOffset = a.jqx._ptrnd(p.x + p.width))),
                                    !isNaN(lineOffset) && (isNaN(v) || !(Math.abs(lineOffset - v) < 2))) {
                                        if (r[lineOffset - 1] ? lineOffset-- : r[lineOffset + 1] && lineOffset++,
                                        f) {
                                            if (lineOffset > p.y + p.height + .5)
                                                break
                                        } else if (lineOffset > p.x + p.width + .5)
                                            break;
                                        v = lineOffset;
                                        var A = h.isMirror ? z : -z;
                                        if (f) {
                                            var B = p.x + p.width + ("right" == j.position ? o.left : -o.right);
                                            c || (B = p.x + (h.isMirror ? o.left : -o.right + p.width)),
                                            this.renderer.line(B, lineOffset, B + A, lineOffset, s)
                                        } else {
                                            var C = p.y + (h.isMirror ? p.height : 0);
                                            C += h.isMirror ? -o.bottom : o.top,
                                            C = a.jqx._ptrnd(C),
                                            this.renderer.line(lineOffset, C, lineOffset, C - A, s)
                                        }
                                    }
                            i.tickMarks = i.tickMarks || d.tickMarks,
                            i.gridLines = i.gridLines || d.gridLines,
                            i.alternatingBackground = i.alternatingBackground || d.alternatingBackground
                        }
                    }
                }
            }
        },
        _calcValueAxisItems: function (a, b, c) {
            var d = this._stats.seriesGroups[a];
            if (!d || !d.isValid)
                return !1;
            var e = this.seriesGroups[a]
              , f = (e.orientation,
            this._getValueAxis(a))
              , g = 0 != f.valuesOnTicks
              , h = (f.dataField,
            d.intervals)
              , i = b / h
              , j = d.min
              , k = d.mu
              , l = 1 == f.logarithmicScale
              , m = f.logarithmicScaleBase || 10
              , n = -1 != e.type.indexOf("stacked") && -1 != e.type.indexOf("100");
            for (l && (k = isNaN(f.unitInterval) ? 1 : f.unitInterval),
            g || (h = Math.max(h - 1, 1)) ; this._renderData.length < a + 1;)
                this._renderData.push({});
            this._renderData[a].valueAxis = {};
            var o = this._renderData[a].valueAxis;
            o.itemWidth = o.intervalWidth = i,
            o.items = [];
            for (var p = o.items, q = 0; q <= h; q++) {
                var r = 0;
                r = l ? n ? d.max / Math.pow(m, h - q) : j * Math.pow(m, q) : g ? j + q * k : j + (q + .5) * k,
                q % c == 0 ? p.push(r) : p.push(NaN)
            }
            return o.rangeLength = l && !n ? d.intervals : d.intervals * k,
            1 != f.flip && (p = p.reverse()),
            !0
        },
        _getDecimalPlaces: function (a, b, c) {
            var d = 0;
            isNaN(c) && (c = 10);
            for (var e = 0; e < a.length; e++) {
                var f = void 0 === b ? a[e] : a[e][b];
                if (!isNaN(f)) {
                    for (var g = f.toString(), h = 0; h < g.length; h++)
                        if ((g[h] < "0" || g[h] > "9") && (d = g.length - (h + 1)) >= 0)
                            return Math.min(d, c);
                    for (d > 0 && (f *= Math.pow(10, d)) ; Math.round(f) != f && d < c;)
                        d++,
                        f *= 10
                }
            }
            return d
        },
        _renderValueAxis: function (a, b, c, d) {
            var e = this.seriesGroups[a]
              , f = "horizontal" == e.orientation
              , g = this._getValueAxis(a);
            if (!g)
                throw "SeriesGroup " + a + " is missing valueAxis definition";
            var h = {
                width: 0,
                height: 0
            };
            if (!this._isGroupVisible(a) || this._isPieOnlySeries() || "spider" == e.type)
                return h;
            var i = 0 != g.valuesOnTicks
              , j = this._stats.seriesGroups[a]
              , k = j.mu
              , l = 1 == g.logarithmicScale;
            g.logarithmicScaleBase;
            if (l && (k = isNaN(g.unitInterval) ? 1 : g.unitInterval),
            0 == k && (k = 1),
            isNaN(k))
                return h;
            var m = this._getAxisSettings(g)
              , n = m.title
              , o = m.labels
              , p = g.labels || {};
            this._get([g.horizontalTextAlignment, p.horizontalAlignment]) || 0 != o.angle || (o.halign = f ? "center" : "right" == g.position ? "left" : "right");
            var q = this._get([o.step, o.unitInterval / k]);
            if (isNaN(q) && (q = 1),
            q = Math.max(1, Math.round(q)),
            !this._calcValueAxisItems(a, f ? b.width : b.height, q) || !m.visible)
                return h;
            f || (n.angle = this.rtl ? 90 : -90,
            "centercenter" == n.rotationPoint && ("top" == n.valign ? n.rotationPoint = "rightcenter" : "bottom" == n.valign && (n.rotationPoint = "leftcenter")));
            var r = this._renderData[a].valueAxis
              , s = o.formatSettings;
            -1 != e.type.indexOf("stacked") && -1 != e.type.indexOf("100") && !s && (s = {
                sufix: "%"
            }),
            o.formatFunction || s && s.decimalPlaces || (s = s || {},
            s.decimalPlaces = this._getDecimalPlaces([j.min, j.max, k], void 0, 3));
            var t = m.gridLines
              , u = (l || this._getInterval(t, k),
            f ? b.width : b.height)
              , v = 1 == g.flip;
            g.flip = !v;
            var w = {
                min: j.min,
                max: j.max,
                logAxis: {
                    enabled: 1 == l,
                    base: g.logarithmicScaleBase,
                    minPow: j.minPow,
                    maxPow: j.maxPow
                }
            };
            (t.visible || g.alternatingBackgroundColor || g.alternatingBackgroundColor2) && (t.offsets = this._getOffsets("gridLines", g, u, w, m, {
                left: 0,
                right: 0
            }, i, k));
            var x = m.tickMarks;
            x.visible && (x.offsets = this._getOffsets("tickMarks", g, u, w, m, {
                left: 0,
                right: 0
            }, i, k)),
            labelOffsets = this._getOffsets("labels", g, u, w, m, {
                left: 0,
                right: 0
            }, i, k, !i),
            g.flip = v;
            var y, z = [];
            this._elementRenderInfo && this._elementRenderInfo.length > a && (y = this._elementRenderInfo[a].valueAxis);
            for (var A = 0; A < labelOffsets.length; A++) {
                var B = labelOffsets[A].value;
                if (isNaN(labelOffsets[A].offset))
                    z.push(void 0);
                else {
                    var C = o.formatFunction ? o.formatFunction(B) : isNaN(B) ? B : this._formatNumber(B, s)
                      , D = {
                          key: B,
                          text: C
                      };
                    y && y.itemOffsets[B] && (D.x = y.itemOffsets[B].x,
                    D.y = y.itemOffsets[B].y),
                    D.targetX = labelOffsets[A].offset,
                    isNaN(D.targetX) || z.push(D)
                }
            }
            var E = f && "top" == g.position || !f && "right" == g.position || !f && this.rtl && "left" != g.position
              , F = {
                  items: z,
                  renderData: r
              }
              , G = this._getAnimProps(a)
              , H = G.enabled && z.length < 500 ? G.duration : 0;
            return 0 == this.enableAxisTextAnimation && (H = 0),
            r.settings = m,
            r.isMirror = E,
            r.rect = b,
            this._renderAxis(!f, E, m, b, d, k, l, !0, F, c, H)
        },
        _objectsArraysToArray: function (b, c) {
            var d = [];
            if (!a.isArray(b))
                return d;
            for (var e = 0; e < b.length; e++)
                d.push(b[e][c]);
            return d
        },
        _arraysToObjectsArray: function (a, b) {
            var c = [];
            if (a.length != b.length)
                return c;
            for (var d = 0; d < a.length; d++)
                for (var e = 0; e < a[d].length; e++)
                    c.length <= e && c.push({}),
                    c[e][b[d]] = a[d][e];
            return c
        },
        _valuesToOffsets: function (b, c, d, e, f, g, h) {
            var i = [];
            if (!c || !a.isArray(b))
                return i;
            var j = d.logAxis.base
              , k = d.logAxis.enabled ? "logarithmic" : "linear"
              , l = c.flip
              , m = e
              , n = 0
              , o = 0;
            f && !isNaN(f.left) && (n = f.left),
            f && !isNaN(f.right) && (o = f.right),
            m = e - n - o,
            e = m;
            for (var p = 0; p < b.length; p++)
                x = this._jqxPlot.scale(b[p], {
                    min: d.min.valueOf(),
                    max: d.max.valueOf(),
                    type: k,
                    base: j
                }, {
                    min: 0,
                    max: g ? e : m,
                    flip: l
                }, {}),
                isNaN(x) ? i.push(NaN) : (isNaN(h) || (x += h),
                x <= e + n + o + 1 ? i.push(a.jqx._ptrnd(x)) : i.push(NaN));
            return i
        },
        _generateIntervalValues: function (a, b, c, d, e) {
            var f = []
              , g = a.min
              , h = a.max;
            if (a.logAxis && a.logAxis.enabled && (g = a.logAxis.minPow,
            h = a.logAxis.maxPow),
            void 0 == g || void 0 == h)
                return f;
            if (g == h)
                return a.logAxis && a.logAxis.enabled ? [Math.pow(a.logAxis.base, g)] : [g];
            var i = 1;
            c < 1 && (i = 1e6,
            g *= i,
            h *= i,
            c *= i);
            for (var j = g; j <= h; j += c)
                f.push(j / i + (e ? c / 2 : 0));
            if (b > c) {
                for (var k = [], l = Math.round(b / c), j = 0; j < f.length; j++)
                    j % l == 0 && k.push(f[j]);
                f = k
            }
            if (a.logAxis && a.logAxis.enabled)
                for (var j = 0; j < f.length; j++)
                    f[j] = Math.pow(a.logAxis.base, f[j]);
            return f
        },
        _generateDTOffsets: function (b, c, d, e, f, g, h, i, j, k, l) {
            h || (h = "day");
            var m = [];
            if (b > c)
                return m;
            if (b == c)
                return k ? m.push({
                    offset: i ? d / 2 : e.left,
                    value: b
                }) : i && m.push({
                    offset: d / 2,
                    value: b
                }),
                m;
            var n = d - e.left - e.right
              , o = b
              , p = e.left
              , q = p;
            g = Math.max(g, 1);
            var r = g
              , s = Math.min(1, g);
            for (g > 1 && "millisecond" != h && (g = 1) ; a.jqx._ptrnd(q) <= a.jqx._ptrnd(e.left + n + (i ? 0 : e.right)) ;) {
                m.push({
                    offset: q,
                    value: o
                });
                var t = new Date(o.valueOf());
                if ("millisecond" == h)
                    t.setMilliseconds(o.getMilliseconds() + g);
                else if ("second" == h)
                    t.setSeconds(o.getSeconds() + g);
                else if ("minute" == h)
                    t.setMinutes(o.getMinutes() + g);
                else if ("hour" == h) {
                    var u = t.valueOf();
                    t.setHours(o.getHours() + g),
                    u == t.valueOf() && t.setHours(o.getHours() + g + 1)
                } else
                    "day" == h ? t.setDate(o.getDate() + g) : "month" == h ? t.setMonth(o.getMonth() + g) : "year" == h && t.setFullYear(o.getFullYear() + g);
                o = t,
                q = p + (o.valueOf() - b.valueOf()) * s / (c.valueOf() - b.valueOf()) * n
            }
            if (l)
                for (var v = 0; v < m.length; v++)
                    m[v].offset = d - m[v].offset;
            if (r > 1 && "millisecond" != h) {
                for (var w = [], v = 0; v < m.length; v += r)
                    w.push({
                        offset: m[v].offset,
                        value: m[v].value
                    });
                m = w
            }
            if (!i && !k && m.length > 1) {
                var w = [];
                w.push({
                    offset: 0,
                    value: void 0
                });
                for (var v = 1; v < m.length; v++)
                    w.push({
                        offset: m[v - 1].offset + (m[v].offset - m[v - 1].offset) / 2,
                        value: void 0
                    });
                var x = w.length;
                x > 1 ? w.push({
                    offset: w[x - 1].offset + (w[x - 1].offset - w[x - 2].offset)
                }) : w.push({
                    offset: d,
                    value: void 0
                }),
                m = w
            }
            if (f > g) {
                for (var w = [], y = Math.round(f / r), v = 0; v < m.length; v++)
                    v % y == 0 && w.push({
                        offset: m[v].offset,
                        value: m[v].value
                    });
                m = w
            }
            return m
        },
        _hasStackValueReversal: function (a, b) {
            var c = this.seriesGroups[a];
            if (-1 == c.type.indexOf("stacked"))
                return !1;
            for (var d = -1 != c.type.indexOf("waterfall"), e = this._getDataLen(a), f = 0, g = !1, h = [], i = 0; i < c.series.length; i++)
                h[i] = this._isSerieVisible(a, i);
            for (var j = 0; j < e; j++) {
                var k = void 0;
                d || (g = !1);
                for (var l = 0; l < c.series.length; l++)
                    if (h[l] && (val = this._getDataValueAsNumber(j, c.series[l].dataField, a),
                    !isNaN(val))) {
                        if (c.series[l].summary) {
                            var m = this._getDataValue(j, c.series[l].summary, a);
                            if (void 0 !== m)
                                continue
                        }
                        var n = g ? val < 0 : val < b;
                        if (g = !0,
                        void 0 == k && (k = n),
                        n != k)
                            return !0;
                        k = n,
                        f += val
                    }
            }
            return !1
        },
        _getValueAxis: function (a) {
            var b = void 0 == a ? this.valueAxis : this.seriesGroups[a].valueAxis || this.valueAxis;
            return b || (b = this.valueAxis = {}),
            b
        },
        _buildStats: function (a) {
            var b = {
                seriesGroups: []
            };
            this._stats = b;
            for (var c = 0; c < this.seriesGroups.length; c++) {
                var d = this.seriesGroups[c];
                b.seriesGroups[c] = {};
                var e = this._getXAxis(c)
                  , f = this._getValueAxis(c)
                  , g = this._getXAxisStats(c, e, "horizontal" != d.orientation ? a.width : a.height)
                  , h = b.seriesGroups[c];
                h.isValid = !0;
                var i = "horizontal" == d.orientation ? a.width : a.height
                  , j = 1 == f.logarithmicScale
                  , k = f.logarithmicScaleBase;
                isNaN(k) && (k = 10);
                var l = -1 != d.type.indexOf("stacked")
                  , m = l && -1 != d.type.indexOf("100")
                  , n = -1 != d.type.indexOf("range")
                  , o = -1 != d.type.indexOf("waterfall");
                if (o && !this._moduleWaterfall)
                    throw "Please include 'jqxchart.waterfall.js'";
                m && (h.psums = [],
                h.nsums = []);
                var p = NaN
                  , q = NaN
                  , r = NaN
                  , s = NaN
                  , t = f ? f.baselineValue : NaN;
                isNaN(t) && (t = j && !m ? 1 : 0);
                var u = !1;
                0 != t && l && (u = this._hasStackValueReversal(c, t)) && (t = 0),
                l && o && (u = this._hasStackValueReversal(c, t));
                var v = this._getDataLen(c)
                  , w = 0
                  , x = NaN
                  , y = [];
                if (o)
                    for (var z = 0; z < d.series.length; z++)
                        y.push(NaN);
                for (var A = NaN, B = 0; B < v && h.isValid; B++) {
                    if (e.rangeSelector) {
                        var C = e.dataField ? this._getDataValue(B, e.dataField, c) : B;
                        if (C && g.isDateTime && (C = this._castAsDate(C, e.dateFormat)),
                        g.useIndeces && (C = B),
                        C && (C.valueOf() < g.min.valueOf() || C.valueOf() > g.max.valueOf()))
                            continue
                    }
                    var D = f.minValue
                      , E = f.maxValue;
                    f.baselineValue && (D = isNaN(D) ? t : Math.min(t, D),
                    E = isNaN(E) ? t : Math.max(t, E));
                    for (var F = 0, G = 0, z = 0; d.series && z < d.series.length; z++)
                        if (this._isSerieVisible(c, z)) {
                            var H = NaN
                              , I = NaN
                              , J = NaN;
                            if (-1 != d.type.indexOf("candle") || -1 != d.type.indexOf("ohlc")) {
                                var K = ["Open", "Low", "Close", "High"];
                                for (var L in K) {
                                    var M = this._getDataValueAsNumber(B, d.series[z]["dataField" + K[L]], c);
                                    isNaN(M) || (J = isNaN(I) ? M : Math.min(J, M),
                                    I = isNaN(I) ? M : Math.max(I, M))
                                }
                            } else if (n) {
                                var N = this._getDataValueAsNumber(B, d.series[z].dataFieldFrom, c)
                                  , O = this._getDataValueAsNumber(B, d.series[z].dataFieldTo, c);
                                I = Math.max(N, O),
                                J = Math.min(N, O)
                            } else {
                                if (H = this._getDataValueAsNumber(B, d.series[z].dataField, c),
                                o) {
                                    if (this._isSummary(c, B)) {
                                        var P = this._getDataValue(B, d.series[z].summary, c);
                                        if (void 0 !== P)
                                            continue
                                    }
                                    l ? (isNaN(A) || (H += A),
                                    A = H) : (isNaN(y[z]) ? y[z] = H : H += y[z],
                                    y[z] = H)
                                }
                                if (isNaN(H) || j && H <= 0)
                                    continue;
                                J = I = H
                            }
                            (isNaN(E) || I > E) && (isNaN(f.maxValue) || I <= f.maxValue) && (E = I),
                            (isNaN(D) || J < D) && (isNaN(f.minValue) || J >= f.minValue) && (D = J),
                            isNaN(H) || !l || o || (H > t ? F += H : H < t && (G += H))
                        }
                    if (m || (isNaN(f.maxValue) || (F = Math.min(f.maxValue, F)),
                    isNaN(f.minValue) || (G = Math.max(f.minValue, G))),
                    j && m)
                        for (var z = 0; z < d.series.length; z++)
                            if (this._isSerieVisible(c, z)) {
                                var H = this._getDataValueAsNumber(B, d.series[z].dataField, c);
                                if (isNaN(H) || H <= 0)
                                    x = .01;
                                else {
                                    var Q = 0 == F ? 0 : H / F;
                                    (isNaN(x) || Q < x) && (x = Q)
                                }
                            } else
                                x = .01;
                    var R = F - G;
                    w < R && (w = R),
                    m && (h.psums[B] = F,
                    h.nsums[B] = G),
                    (E > q || isNaN(q)) && (q = E),
                    (D < p || isNaN(p)) && (p = D),
                    (F > r || isNaN(r)) && (r = F),
                    (G < s || isNaN(s)) && (s = G)
                }
                m && (r = 0 == r ? 0 : Math.max(r, -s),
                s = 0 == s ? 0 : Math.min(s, -r)),
                p == q && (!isNaN(f.minValue) && isNaN(f.maxValue) ? (p = f.minValue,
                q = j ? p * k : p + 1) : isNaN(f.minValue) && !isNaN(f.maxValue) && (q = f.maxValue,
                p = j ? q / k : q - 1)),
                p == q && (0 == p ? (p = -1,
                q = 1) : p < 0 ? q = 0 : j ? 1 == p && (p /= k,
                q *= k) : p = 0);
                var S = {
                    gmin: p,
                    gmax: q,
                    gsumP: r,
                    gsumN: s,
                    gbase: t,
                    isLogAxis: j,
                    logBase: k,
                    minPercent: x,
                    gMaxRange: w,
                    isStacked: l,
                    isStacked100: m,
                    isWaterfall: o,
                    hasStackValueReversal: u,
                    valueAxis: f,
                    valueAxisSize: i
                };
                S.isStacked && (S.gsumN < 0 && (S.gmin = Math.min(S.gmin, S.gbase + S.gsumN)),
                S.gsumP > 0 && (S.gmax = Math.max(S.gmax, S.gbase + S.gsumP))),
                h.context = S
            }
            this._mergeCommonValueAxisStats();
            for (var B = 0; B < b.seriesGroups.length; B++) {
                var h = b.seriesGroups[B];
                if (h.isValid) {
                    var T = this._calcOutputGroupStats(h.context);
                    for (var L in T)
                        h[L] = T[L];
                    delete h.context
                }
            }
        },
        _mergeCommonValueAxisStats: function () {
            for (var a = {}, b = 0; b < this.seriesGroups.length; b++)
                if (this._isGroupVisible(b) && !this.seriesGroups[b].valueAxis) {
                    var c = this._stats.seriesGroups[b].context;
                    a.gbase = c.gbase,
                    (isNaN(a.gmin) || c.gmin < a.gmin) && (a.gmin = c.gmin),
                    (isNaN(a.gmax) || c.gmax > a.gmax) && (a.gmax = c.gmax),
                    (isNaN(a.gsumP) || c.gsumP > a.gsumP) && (a.gsumP = c.gsumP),
                    (isNaN(a.gsumN) || c.gsumN < a.gsumN) && (a.gsumN = c.gsumN),
                    (isNaN(a.logBase) || c.logBase < a.logBase) && (a.logBase = c.logBase),
                    (isNaN(a.minPercent) || c.minPercent < a.minPercent) && (a.minPercent = c.minPercent),
                    a.gsumN > 0 && (a.gmin = Math.min(a.gmin, a.gbase + a.gsumN)),
                    a.gsumP > 0 && (a.gmax = Math.max(a.gmax, a.gbase + a.gsumP))
                }
            for (var b = 0; b < this.seriesGroups.length; b++)
                if (!this.seriesGroups[b].valueAxis) {
                    var d = this._stats.seriesGroups[b].context;
                    for (var e in a)
                        d[e] = a[e]
                }
        },
        _calcOutputGroupStats: function (b) {
            var c = b.gmin
              , d = b.gmax
              , e = b.gsumP
              , f = b.gsumN
              , g = b.gbase
              , h = b.isLogAxis
              , i = b.logBase
              , j = b.minPercent
              , k = b.gMaxRange
              , l = b.isStacked
              , m = b.isStacked100
              , n = b.isWaterfall
              , o = b.hasStackValueReversal
              , p = b.valueAxis
              , q = b.valueAxisSize
              , r = b.valueAxis.unitInterval;
            r || (r = this._calcInterval(c, d, Math.max(q / 80, 2))),
            c == d && (c = g,
            d *= 2);
            var s = NaN
              , t = 0
              , u = 0;
            if (h) {
                if (m) {
                    s = 0;
                    var v = 1;
                    for (t = u = a.jqx.log(100, i) ; v > j;)
                        v /= i,
                        t--,
                        s++;
                    c = Math.pow(i, t)
                } else
                    l && !n && (d = Math.max(d, e)),
                    u = a.jqx._rnd(a.jqx.log(d, i), 1, !0),
                    d = Math.pow(i, u),
                    t = a.jqx._rnd(a.jqx.log(c, i), 1, !1),
                    c = Math.pow(i, t);
                r = i
            }
            c < f && (f = c),
            d > e && (e = d);
            var w = h ? c : a.jqx._rnd(c, r, !1)
              , x = h ? d : a.jqx._rnd(d, r, !0);
            if (m && x > 100 && (x = 100),
            m && !h && (x = x > 0 ? 100 : 0,
            w = w < 0 ? -100 : 0,
            r = p.unitInterval,
            (isNaN(r) || r <= 0 || r >= 100) && (r = 10),
            100 % r != 0))
                for (; r >= 1 && 100 % r != 0; r--)
                    ;
            return isNaN(x) || isNaN(w) || isNaN(r) ? {} : (isNaN(s) && (s = parseInt(((x - w) / (0 == r ? 1 : r)).toFixed())),
            h && !m && (s = u - t,
            k = Math.pow(i, s)),
            s < 1 ? {} : {
                min: w,
                max: x,
                logarithmic: h,
                logBase: i,
                base: h ? w : g,
                minPow: t,
                maxPow: u,
                sumP: e,
                sumN: f,
                mu: r,
                maxRange: k,
                intervals: s,
                hasStackValueReversal: o
            })
        },
        _getDataLen: function (b) {
            var c = this.source;
            return void 0 != b && -1 != b && this.seriesGroups[b].source && (c = this.seriesGroups[b].source),
            c instanceof a.jqx.dataAdapter && (c = c.records),
            c ? c.length : 0
        },
        _getDataValue: function (b, c, d) {
            var e = this.source;
            if (void 0 != d && -1 != d && (e = this.seriesGroups[d].source || e),
            e instanceof a.jqx.dataAdapter && (e = e.records),
            !(!e || b < 0 || b > e.length - 1))
                return a.isFunction(c) ? c(b, e) : c && "" != c ? e[b][c] : e[b]
        },
        _getDataValueAsNumber: function (a, b, c) {
            var d = this._getDataValue(a, b, c);
            return this._isDate(d) ? d.valueOf() : ("number" != typeof d && (d = parseFloat(d)),
            "number" != typeof d && (d = void 0),
            d)
        },
        _isPieGroup: function (a) {
            var b = this.seriesGroups[a];
            return !(!b || !b.type) && (-1 != b.type.indexOf("pie") || -1 != b.type.indexOf("donut"))
        },
        _renderPieSeries: function (b, c) {
            for (var d = this._getDataLen(b), e = this.seriesGroups[b], f = this._calcGroupOffsets(b, c).offsets, g = 0; g < e.series.length; g++) {
                var h = e.series[g];
                if (!h.customDraw) {
                    var i = this._getSerieSettings(b, g)
                      , j = (h.colorScheme || e.colorScheme || this.colorScheme,
                    this._getAnimProps(b, g))
                      , k = j.enabled && d < 5e3 && !this._isToggleRefresh && 1 != this._isVML ? j.duration : 0;
                    a.jqx.mobile.isMobileBrowser() && this.renderer instanceof a.jqx.HTML5Renderer && (k = 0);
                    var l = this._get([h.minAngle, h.startAngle]);
                    (isNaN(l) || l < 0 || l > 360) && (l = 0);
                    var m = this._get([h.maxAngle, h.endAngle]);
                    (isNaN(m) || m < 0 || m > 360) && (m = 360);
                    for (var n = {
                        rect: c,
                        minAngle: l,
                        maxAngle: m,
                        groupIndex: b,
                        serieIndex: g,
                        settings: i,
                        items: []
                    }, o = 0; o < d; o++) {
                        var p = f[g][o];
                        if (p.visible) {
                            var q = p.fromAngle
                              , r = p.toAngle
                              , s = this.renderer.pieslice(p.x, p.y, p.innerRadius, p.outerRadius, q, 0 == k ? r : q, p.centerOffset);
                            this._setRenderInfo(b, g, o, {
                                element: s
                            });
                            var t = {
                                displayValue: p.displayValue,
                                itemIndex: o,
                                visible: p.visible,
                                x: p.x,
                                y: p.y,
                                innerRadius: p.innerRadius,
                                outerRadius: p.outerRadius,
                                fromAngle: q,
                                toAngle: r,
                                centerOffset: p.centerOffset
                            };
                            n.items.push(t)
                        }
                    }
                    this._animatePieSlices(n, 0);
                    var u = this;
                    this._enqueueAnimation("series", void 0, void 0, k, function (a, b, c) {
                        u._animatePieSlices(b, c)
                    }, n)
                }
            }
        },
        _sliceSortFunction: function (a, b) {
            return a.fromAngle - b.fromAngle
        },
        _animatePieSlices: function (a, b) {
            var c;
            this._elementRenderInfo && this._elementRenderInfo.length > a.groupIndex && this._elementRenderInfo[a.groupIndex].series && this._elementRenderInfo[a.groupIndex].series.length > a.serieIndex && (c = this._elementRenderInfo[a.groupIndex].series[a.serieIndex]);
            for (var d = this.seriesGroups[a.groupIndex], e = this._getLabelsSettings(a.groupIndex, a.serieIndex, NaN), f = e.visible, g = [], h = 0; h < a.items.length; h++) {
                var i = a.items[h];
                if (i.visible) {
                    var j = i.fromAngle
                      , k = i.fromAngle + b * (i.toAngle - i.fromAngle);
                    if (c && c[i.displayValue]) {
                        var l = c[i.displayValue].fromAngle
                          , m = c[i.displayValue].toAngle;
                        j = l + (j - l) * b,
                        k = m + (k - m) * b
                    }
                    g.push({
                        index: h,
                        from: j,
                        to: k
                    })
                }
            }
            c && g.sort(this._sliceSortFunction);
            for (var n = NaN, h = 0; h < g.length; h++) {
                var i = a.items[g[h].index]
                  , o = this._getRenderInfo(a.groupIndex, a.serieIndex, i.itemIndex)
                  , j = g[h].from
                  , k = g[h].to;
                c && (!isNaN(n) && j > n && (j = n),
                n = k,
                h == g.length - 1 && k != g[0].from && (k = a.maxAngle + g[0].from));
                var p = this.renderer.pieSlicePath(i.x, i.y, i.innerRadius, i.outerRadius, j, k, i.centerOffset);
                this.renderer.attr(o.element, {
                    d: p
                });
                var q = this._getColors(a.groupIndex, a.serieIndex, i.itemIndex, "radialGradient", i.outerRadius)
                  , r = a.settings;
                o.colors = q,
                o.settings = r,
                this.renderer.attr(o.element, {
                    fill: q.fillColor,
                    stroke: q.lineColor,
                    "stroke-width": r.stroke,
                    "fill-opacity": r.opacity,
                    "stroke-opacity": r.opacity,
                    "stroke-dasharray": "none"
                });
                d.series[a.serieIndex];
                f && this._showPieLabel(a.groupIndex, a.serieIndex, i.itemIndex, e),
                1 == b && this._installHandlers(o.element, "pieslice", a.groupIndex, a.serieIndex, i.itemIndex)
            }
        },
        _showPieLabel: function (b, c, d, e, f) {
            var g = this._renderData[b].offsets[c][d];
            if (g.elementInfo.labelElement && this.renderer.removeElement(g.elementInfo.labelElement),
            e || (e = this._getLabelsSettings(b, c, NaN)),
            e.visible) {
                var h = g.fromAngle
                  , i = g.toAngle
                  , j = Math.abs(h - i);
                j > 360 && (h = 0,
                i = 360);
                var k = (Math.PI,
                Math.PI,
                j / 2 + h);
                k %= 360;
                var l, m = k * Math.PI * 2 / 360;
                1 == e.autoRotate && (l = k < 90 || k > 270 ? 360 - k : 180 - k);
                var n = e.linesEnabled
                  , o = this._showLabel(b, c, d, {
                      x: 0,
                      y: 0,
                      width: 0,
                      height: 0
                  }, "center", "center", !0, !1, !1, l)
                  , p = e.radius || g.outerRadius + Math.max(o.width, o.height);
                this._isPercent(p) && (p = parseFloat(p) / 100 * Math.min(this._plotRect.width, this._plotRect.height) / 2),
                p += g.centerOffset,
                isNaN(f) && (f = 0),
                p += f;
                var q = this.seriesGroups[b]
                  , r = q.series[c]
                  , s = a.jqx.getNum([r.offsetX, q.offsetX, this._plotRect.width / 2])
                  , t = a.jqx.getNum([r.offsetY, q.offsetY, this._plotRect.height / 2])
                  , u = this._plotRect.x + s
                  , v = this._plotRect.y + t
                  , w = this._adjustTextBoxPosition(u, v, o, p, k, g.outerRadius > p, 0 != e.linesAngles, 1 == e.autoRotate)
                  , x = {};
                if (g.elementInfo.labelElement = this._showLabel(b, c, d, {
                    x: w.x,
                    y: w.y,
                    width: o.width,
                    height: o.height
                }, "left", "top", !1, !1, !1, l, x),
                p > g.outerRadius + 5 && 0 != n) {
                    var y = {
                        lineColor: g.elementInfo.colors.lineColor,
                        stroke: g.elementInfo.settings.stroke,
                        opacity: g.elementInfo.settings.opacity,
                        dashStyle: g.elementInfo.settings.dashStyle
                    };
                    g.elementInfo.labelArrowPath = this._updateLebelArrowPath(g.elementInfo.labelArrowPath, u, v, p, g.outerRadius + f, m, 0 != e.linesAngles, y, x)
                }
            }
        },
        _updateLebelArrowPath: function (b, c, d, e, f, g, h, i, j) {
            var k = a.jqx._ptrnd(c + (e - 0) * Math.cos(g))
              , l = a.jqx._ptrnd(d - (e - 0) * Math.sin(g))
              , m = a.jqx._ptrnd(c + (f + 2) * Math.cos(g))
              , n = a.jqx._ptrnd(d - (f + 2) * Math.sin(g))
              , o = [];
            o.push({
                x: j.x + j.width / 2,
                y: j.y
            }),
            o.push({
                x: j.x + j.width / 2,
                y: j.y + j.height
            }),
            o.push({
                x: j.x,
                y: j.y + j.height / 2
            }),
            o.push({
                x: j.x + j.width,
                y: j.y + j.height / 2
            }),
            h || (o.push({
                x: j.x,
                y: j.y
            }),
            o.push({
                x: j.x + j.width,
                y: j.y
            }),
            o.push({
                x: j.x + j.width,
                y: j.y + j.height
            }),
            o.push({
                x: j.x,
                y: j.y + j.height
            })),
            o = o.sort(function (b, e) {
                return a.jqx._ptdist(b.x, b.y, c, d) - a.jqx._ptdist(e.x, e.y, c, d)
            }),
            o = o.sort(function (a, b) {
                return Math.abs(a.x - c) + Math.abs(a.y - d) - (Math.abs(b.x - c) + Math.abs(b.y - d))
            });
            for (var p = 0; p < o.length; p++)
                o[p].x = a.jqx._ptrnd(o[p].x),
                o[p].y = a.jqx._ptrnd(o[p].y);
            k = o[0].x,
            l = o[0].y;
            var q = "M " + k + "," + l + " L" + m + "," + n;
            return h && (q = "M " + k + "," + l + " L" + m + "," + l + " L" + m + "," + n),
            b ? this.renderer.attr(b, {
                d: q
            }) : b = this.renderer.path(q, {}),
            this.renderer.attr(b, {
                fill: "none",
                stroke: i.lineColor,
                "stroke-width": i.stroke,
                "stroke-opacity": i.opacity,
                "stroke-dasharray": "none"
            }),
            b
        },
        _adjustTextBoxPosition: function (b, c, d, e, f, g, h, i) {
            var j = f * Math.PI * 2 / 360
              , k = a.jqx._ptrnd(b + e * Math.cos(j))
              , l = a.jqx._ptrnd(c - e * Math.sin(j));
            if (i) {
                var m = d.width
                  , n = d.height
                  , o = Math.atan(n / m) % (2 * Math.PI)
                  , p = j % (2 * Math.PI)
                  , q = 0;
                p <= o ? q = m / 2 * Math.cos(j) : p >= o && p < Math.PI - o ? q = n / 2 * Math.sin(j) : p >= Math.PI - o && p < Math.PI + o ? q = m / 2 * Math.cos(j) : p >= Math.PI + o && p < 2 * Math.PI - o ? q = n / 2 * Math.sin(j) : p >= 2 * Math.PI - o && p < 2 * Math.PI && (q = m / 2 * Math.cos(j)),
                e += Math.abs(q) + 3;
                var k = a.jqx._ptrnd(b + e * Math.cos(j))
                  , l = a.jqx._ptrnd(c - e * Math.sin(j));
                return k -= d.width / 2,
                l -= d.height / 2,
                {
                    x: k,
                    y: l
                }
            }
            return g ? (k -= d.width / 2,
            l -= d.height / 2) : h ? f >= 90 && f < 270 ? (l -= d.height / 2,
            k -= d.width) : l -= d.height / 2 : f >= 0 && f < 45 || f >= 315 && f < 360 ? l -= d.height / 2 : f >= 45 && f < 135 ? (l -= d.height,
            k -= d.width / 2) : f >= 135 && f < 225 ? (l -= d.height / 2,
            k -= d.width) : f >= 225 && f < 315 && (k -= d.width / 2),
            {
                x: k,
                y: l
            }
        },
        _isColumnType: function (a) {
            return -1 != a.indexOf("column") || -1 != a.indexOf("waterfall")
        },
        _getColumnGroupsCount: function (a) {
            var b = 0;
            a = a || "vertical";
            for (var c = this.seriesGroups, d = 0; d < c.length; d++) {
                var e = c[d].orientation || "vertical";
                this._isColumnType(c[d].type) && e == a && b++
            }
            return this.columnSeriesOverlap && (b = 1),
            b
        },
        _getColumnGroupIndex: function (a) {
            for (var b = 0, c = this.seriesGroups[a].orientation || "vertical", d = 0; d < a; d++) {
                var e = this.seriesGroups[d]
                  , f = e.orientation || "vertical";
                this._isColumnType(e.type) && f == c && b++
            }
            return b
        },
        _renderAxisBands: function (b, c, d) {
            var e = d ? this._getXAxis(b) : this._getValueAxis(b)
              , f = this.seriesGroups[b]
              , g = d ? void 0 : f.bands;
            if (!g) {
                for (var h = 0; h < b; h++) {
                    if ((d ? this._getXAxis(h) : this._getValueAxis(h)) == e)
                        return
                }
                g = e.bands
            }
            if (a.isArray(g)) {
                var i = c
                  , j = "horizontal" == f.orientation;
                j && (i = {
                    x: c.y,
                    y: c.x,
                    width: c.height,
                    height: c.width
                }),
                this._calcGroupOffsets(b, i);
                for (var h = 0; h < g.length; h++) {
                    var k, l = g[h], m = this._get([l.minValue, l.from]), n = this._get([l.maxValue, l.to]), o = d ? this.getXAxisDataPointOffset(m, b) : this.getValueAxisDataPointOffset(m, b), p = d ? this.getXAxisDataPointOffset(n, b) : this.getValueAxisDataPointOffset(n, b), q = Math.abs(o - p);
                    if (f.polar || f.spider) {
                        var r = this._renderData[b]
                          , s = r.polarCoords;
                        if (d)
                            if (f.spider) {
                                p1 = this.getPolarDataPointOffset(m, this._stats.seriesGroups[b].max, b),
                                p2 = this.getPolarDataPointOffset(n, this._stats.seriesGroups[b].max, b);
                                var t = "M " + s.x + "," + s.y;
                                t += " L " + p1.x + "," + p1.y,
                                t += " L " + p2.x + "," + p2.y,
                                k = this.renderer.path(t)
                            } else {
                                var u = {}
                                  , v = {
                                      x: Math.min(o, p),
                                      y: c.y,
                                      width: q,
                                      height: c.height
                                  };
                                this._columnAsPieSlice(u, c, s, v),
                                k = u.element
                            }
                        else {
                            var w = this._toPolarCoord(s, c, c.x, r.baseOffset)
                              , x = this._toPolarCoord(s, c, c.x, o)
                              , y = this._toPolarCoord(s, c, c.x, p)
                              , z = a.jqx._ptdist(w.x, w.y, x.x, x.y)
                              , A = a.jqx._ptdist(w.x, w.y, y.x, y.y)
                              , B = Math.round(360 * -s.startAngle / (2 * Math.PI))
                              , C = Math.round(360 * -s.endAngle / (2 * Math.PI));
                            if (B > C) {
                                var D = B;
                                B = C,
                                C = D
                            }
                            if (f.spider) {
                                var E = r.xAxis.offsetAngles
                                  , t = ""
                                  , F = [A, z]
                                  , G = E;
                                s.isClosedCircle && (G = a.extend([], E),
                                G.push(G[0]));
                                for (var H in F) {
                                    for (var I = 0; I < G.length; I++) {
                                        var J = 0 == H ? I : E.length - I - 1
                                          , K = s.x + F[H] * Math.cos(G[J])
                                          , L = s.y + F[H] * Math.sin(G[J]);
                                        t += "" == t ? "M " : " L",
                                        t += a.jqx._ptrnd(K) + "," + a.jqx._ptrnd(L)
                                    }
                                    if (0 == H) {
                                        var K = s.x + F[1] * Math.cos(G[J])
                                          , L = s.y + F[1] * Math.sin(G[J]);
                                        t += " L" + a.jqx._ptrnd(K) + "," + a.jqx._ptrnd(L)
                                    }
                                }
                                t += " Z",
                                k = this.renderer.path(t)
                            } else
                                k = this.renderer.pieslice(s.x, s.y, z, A, B, C)
                        }
                    } else {
                        var M = {
                            x: Math.min(o, p),
                            y: i.y,
                            width: q,
                            height: i.height
                        };
                        if (d || (M = {
                            x: i.x,
                            y: Math.min(o, p),
                            width: i.width,
                            height: q
                        }),
                        j) {
                            var D = M.x;
                            M.x = M.y,
                            M.y = D,
                            D = M.width,
                            M.width = M.height,
                            M.height = D
                        }
                        k = 0 == q || 1 == q ? this.renderer.line(a.jqx._ptrnd(M.x), a.jqx._ptrnd(M.y), a.jqx._ptrnd(M.x + (j ? 0 : M.width)), a.jqx._ptrnd(M.y + (j ? M.height : 0))) : this.renderer.rect(M.x, M.y, M.width, M.height)
                    }
                    var N = l.fillColor || l.color || "#AAAAAA"
                      , O = l.lineColor || N
                      , P = l.lineWidth;
                    isNaN(P) && (P = 1);
                    var Q = l.opacity;
                    (isNaN(Q) || Q < 0 || Q > 1) && (Q = 1),
                    this.renderer.attr(k, {
                        fill: N,
                        "fill-opacity": Q,
                        stroke: O,
                        "stroke-opacity": Q,
                        "stroke-width": P,
                        "stroke-dasharray": l.dashStyle
                    })
                }
            }
        },
        _getColumnGroupWidth: function (a, b, c) {
            var d = this.seriesGroups[a]
              , e = -1 != d.type.indexOf("stacked")
              , f = (e || d.series.length,
            this._getColumnGroupsCount(d.orientation));
            (isNaN(f) || 0 == f) && (f = 1);
            var g = b.rangeLength >= 1 ? b.itemWidth : .9 * c
              , h = d.columnsMinWidth;
            isNaN(h) && (h = 1),
            isNaN(d.columnsMaxWidth) || (h = Math.min(d.columnsMaxWidth, h)),
            h > g && b.length > 0 && (g = Math.max(g, .9 * c / b.length));
            var i = h;
            if (!e) {
                var j = d.seriesGapPercent;
                (isNaN(j) || j < 0) && (j = 10),
                j /= 100;
                var k = h;
                k *= 1 + j,
                i += d.series.length * k
            }
            return {
                requiredWidth: i,
                availableWidth: g,
                targetWidth: Math.max(g / f, i)
            }
        },
        _getColumnSerieWidthAndOffset: function (a, b) {
            var c = this.seriesGroups[a]
              , d = (c.series[b],
            "horizontal" == c.orientation)
              , e = this._plotRect;
            d && (e = {
                x: e.y,
                y: e.x,
                width: e.height,
                height: e.width
            });
            var f = this._calcGroupOffsets(a, e);
            if (f && 0 != f.xoffsets.length) {
                var g = this._getColumnGroupsCount(c.orientation);
                "candlestick" != c.type && "ohlc" != c.type || (g = 1);
                var h = this._getColumnGroupIndex(a)
                  , i = this._getColumnGroupWidth(a, f.xoffsets, d ? e.height : e.width)
                  , j = 0
                  , k = i.targetWidth;
                (1 == this.columnSeriesOverlap || Math.round(k) > Math.round(i.availableWidth / g)) && (g = 1,
                h = 0),
                j -= k * g / 2,
                j += k * h;
                var l = c.columnsGapPercent;
                l <= 0 && (l = 0),
                (isNaN(l) || l >= 100) && (l = 25),
                l /= 100;
                var m = k * l;
                m + i.requiredWidth > i.targetWidth && (m = Math.max(0, i.targetWidth - i.requiredWidth)),
                Math.round(k) > Math.round(i.availableWidth) && (m = 0),
                k -= m,
                j += m / 2;
                var n = c.seriesGapPercent;
                (isNaN(n) || n < 0) && (n = 10);
                var o = -1 != c.type.indexOf("stacked")
                  , p = k;
                o || (p /= c.series.length);
                var q = this._get([c.seriesGap, k * n / 100 / (c.series.length - 1)]);
                (1 == c.polar || 1 == c.spider || o || c.series.length <= 1) && (q = 0);
                var r = q * (c.series.length - 1);
                c.series.length > 1 && r > k - 1 * c.series.length && (r = k - 1 * c.series.length,
                q = r / Math.max(1, c.series.length - 1));
                var s = p - r / c.series.length
                  , t = 0
                  , u = c.columnsMaxWidth;
                isNaN(u) || s > u && (t = s - u,
                s = u);
                var v = 0;
                if (o)
                    v = t / 2;
                else {
                    v = (k - s * c.series.length - r) / 2 + s * b + Math.max(0, b) * q
                }
                return {
                    width: s,
                    offset: j + v
                }
            }
        },
        _renderColumnSeries: function (b, c) {
            var d = this.seriesGroups[b];
            if (d.series && 0 != d.series.length) {
                var e = (this._getDataLen(b),
                "horizontal" == d.orientation)
                  , f = c;
                e && (f = {
                    x: c.y,
                    y: c.x,
                    width: c.height,
                    height: c.width
                });
                var g = this._calcGroupOffsets(b, f);
                if (g && 0 != g.xoffsets.length) {
                    var h;
                    1 != d.polar && 1 != d.spider || (h = this._getPolarAxisCoords(b, f));
                    var i = {
                        groupIndex: b,
                        rect: c,
                        vertical: !e,
                        seriesCtx: [],
                        renderData: g,
                        polarAxisCoords: h
                    };
                    i.columnGroupWidth = this._getColumnGroupWidth(b, g.xoffsets, e ? f.height : f.width);
                    for (var j = this._getGroupGradientType(b), k = 0; k < d.series.length; k++) {
                        var l = d.series[k];
                        if (!l.customDraw) {
                            var m = (l.dataField,
                            this._getAnimProps(b, k))
                              , n = m.enabled && !this._isToggleRefresh && g.xoffsets.length < 100 ? m.duration : 0
                              , o = this._getColumnSerieWidthAndOffset(b, k)
                              , p = this._isSerieVisible(b, k)
                              , q = this._getSerieSettings(b, k)
                              , r = this._getColors(b, k, NaN, this._getGroupGradientType(b), 4)
                              , s = [];
                            if (a.isFunction(l.colorFunction) && !h)
                                for (var t = g.xoffsets.first; t <= g.xoffsets.last; t++)
                                    s.push(this._getColors(b, k, t, j, 4));
                            var u = {
                                seriesIndex: k,
                                serieColors: r,
                                itemsColors: s,
                                settings: q,
                                columnWidth: o.width,
                                xAdjust: o.offset,
                                isVisible: p
                            };
                            i.seriesCtx.push(u)
                        }
                    }
                    this._animColumns(i, 0 == n ? 1 : 0);
                    var v = this;
                    this._enqueueAnimation("series", void 0, void 0, n, function (a, b, c) {
                        v._animColumns(b, c)
                    }, i)
                }
            }
        },
        _getPercent: function (a, b, c, d) {
            return isNaN(a) && (a = b),
            !isNaN(c) && !isNaN(a) && a < c && (a = c),
            !isNaN(d) && !isNaN(a) && a > d && (a = d),
            isNaN(a) ? NaN : a
        },
        _getColumnVOffsets: function (a, b, c, d, e, f) {
            var g = this.seriesGroups[b]
              , h = this._getPercent(g.columnsTopWidthPercent, 100, 0, 100)
              , i = this._getPercent(g.columnsBottomWidthPercent, 100, 0, 100);
            0 == h && 0 == i && (i = 100);
            for (var j = this._getPercent(g.columnsNeckHeightPercent, NaN, 0, 100) / 100, k = this._getPercent(g.columnsNeckWidthPercent, 100, 0, 100) / 100, l = [], m = NaN, n = 0; n < c.length; n++) {
                var o, p = c[n], q = p.seriesIndex, r = (g.series[q],
                a.offsets[q][d].from), s = a.offsets[q][d].to, t = a.xoffsets.data[d], u = p.isVisible;
                u || (s = r);
                var v = this._elementRenderInfo;
                if (u && v && v.length > b && v[b].series.length > q) {
                    var w = a.xoffsets.xvalues[d];
                    o = v[b].series[q][w],
                    !o || isNaN(o.from) || isNaN(o.to) || (r = o.from + (r - o.from) * f,
                    s = o.to + (s - o.to) * f,
                    t = o.xoffset + (t - o.xoffset) * f)
                }
                o || (s = r + (s - r) * (e ? 1 : f)),
                isNaN(r) && (r = isNaN(m) ? a.baseOffset : m),
                m = !isNaN(s) && e ? s : r,
                isNaN(s) && (s = r);
                var x = {
                    from: r,
                    to: s,
                    xOffset: t
                };
                100 == h && 100 == i || (x.funnel = !0,
                x.toWidthPercent = h,
                x.fromWidthPercent = i),
                l.push(x)
            }
            if (e && l.length > 1 && !(this._elementRenderInfo && this._elementRenderInfo.length > b)) {
                for (var y = 0, z = 0, A = -1 / 0, B = 1 / 0, C = 1 / 0, D = -1 / 0, E = 0; E < l.length; E++) {
                    var p = c[E];
                    p.isVisible && (l[E].to >= l[E].from ? (z += l[E].to - l[E].from,
                    C = Math.min(C, l[E].from),
                    D = Math.max(D, l[E].to)) : (y += l[E].from - l[E].to,
                    A = Math.max(A, l[E].from),
                    B = Math.min(B, l[E].to)))
                }
                var F = y
                  , G = z;
                y *= f,
                z *= f;
                for (var H = 0, I = 0, E = 0; E < l.length; E++)
                    if (l[E].to >= l[E].from) {
                        var J = l[E].to - l[E].from;
                        J + I > z && (J = Math.max(0, z - I),
                        l[E].to = l[E].from + J),
                        100 == h && 100 == i || (l[E].funnel = !0,
                        !isNaN(j) && G * j >= I ? l[E].fromWidthPercent = 100 * k : l[E].fromWidthPercent = Math.abs(l[E].from - C) / G * (h - i) + i,
                        !isNaN(j) && G * j >= 0 + (I + J) ? l[E].toWidthPercent = 100 * k : l[E].toWidthPercent = Math.abs(l[E].to - C) / G * (h - i) + i),
                        I += J
                    } else {
                        var J = l[E].from - l[E].to;
                        J + H > y && (J = Math.max(0, y - H),
                        l[E].to = l[E].from - J),
                        100 == h && 100 == i || (l[E].funnel = !0,
                        !isNaN(j) && F * j >= H ? l[E].fromWidthPercent = 100 * k : l[E].fromWidthPercent = Math.abs(l[E].from - A) / F * (h - i) + i,
                        !isNaN(j) && F * j >= 0 + (H + J) ? l[E].toWidthPercent = 100 * k : l[E].toWidthPercent = Math.abs(l[E].to - A) / F * (h - i) + i),
                        H += J
                    }
            }
            return l
        },
        _columnAsPieSlice: function (b, c, d, e) {
            var f = this._toPolarCoord(d, c, e.x, e.y)
              , g = this._toPolarCoord(d, c, e.x, e.y + e.height)
              , h = a.jqx._ptdist(d.x, d.y, g.x, g.y)
              , i = a.jqx._ptdist(d.x, d.y, f.x, f.y)
              , j = c.width
              , k = 180 * Math.abs(d.startAngle - d.endAngle) / Math.PI
              , l = -(e.x - c.x) * k / j
              , m = -(e.x + e.width - c.x) * k / j
              , n = d.startAngle;
            if (n = 360 * n / (2 * Math.PI),
            l -= n,
            m -= n,
            b)
                if (void 0 != b.element) {
                    var o = this.renderer.pieSlicePath(d.x, d.y, h, i, m, l, 0);
                    o += " Z",
                    this.renderer.attr(b.element, {
                        d: o
                    })
                } else
                    b.element = this.renderer.pieslice(d.x, d.y, h, i, m, l, 0);
            return {
                fromAngle: m,
                toAngle: l,
                innerRadius: h,
                outerRadius: i
            }
        },
        _setRenderInfo: function (a, b, c, d) {
            this._renderData[a].offsets[b][c].elementInfo = d
        },
        _getRenderInfo: function (a, b, c) {
            return this._renderData[a].offsets[b][c].elementInfo || {}
        },
        _animColumns: function (b, c) {
            for (var d = this, e = b.groupIndex, f = this.seriesGroups[e], g = b.renderData, h = -1 != f.type.indexOf("waterfall"), i = this._getXAxis(e), j = -1 != f.type.indexOf("stacked"), k = b.polarAxisCoords, l = (this._getGroupGradientType(e),
            b.columnGroupWidth.targetWidth,
            -1), m = 0; m < f.series.length; m++)
                if (this._isSerieVisible(e, m)) {
                    l = m;
                    break
                }
            for (var n = NaN, o = NaN, m = 0; m < b.seriesCtx.length; m++) {
                var p = b.seriesCtx[m];
                (isNaN(n) || n > p.xAdjust) && (n = p.xAdjust),
                (isNaN(o) || o < p.xAdjust + p.columnWidth) && (o = p.xAdjust + p.columnWidth)
            }
            var q = Math.abs(o - n)
              , r = this._get([f.columnsGapPercent, 25]) / 100;
            (isNaN(r) < 0 || r >= 1) && (r = .25);
            for (var s = r * q, t = b.renderData.xoffsets, u = -1, v = {}, w = 1 == f.skipOverlappingPoints, x = t.first; x <= t.last; x++) {
                var y = t.data[x];
                if (!isNaN(y) && !(-1 != u && Math.abs(y - u) < q - 1 + s && w)) {
                    u = y;
                    var z = this._getColumnVOffsets(g, e, b.seriesCtx, x, j, c)
                      , A = !1;
                    if (h)
                        for (var B = 0; B < f.series.length; B++)
                            f.series[B].summary && t.xvalues[x][f.series[B].summary] && (A = !0);
                    for (var B = 0; B < b.seriesCtx.length; B++) {
                        var p = b.seriesCtx[B]
                          , C = p.seriesIndex
                          , D = f.series[C]
                          , E = z[B].from
                          , F = z[B].to
                          , G = z[B].xOffset
                          , H = (b.vertical ? b.rect.x : b.rect.y) + p.xAdjust
                          , I = p.settings
                          , J = 0 != p.itemsColors.length ? p.itemsColors[x - g.xoffsets.first] : p.serieColors
                          , K = this._isSerieVisible(e, C);
                        if (K) {
                            var y = a.jqx._ptrnd(H + G)
                              , L = {
                                  x: y,
                                  width: p.columnWidth
                              };
                            z[B].funnel && (L.fromWidthPercent = z[B].fromWidthPercent,
                            L.toWidthPercent = z[B].toWidthPercent);
                            var M = !0;
                            b.vertical ? (L.y = E,
                            L.height = F - E,
                            L.height < 0 && (L.y += L.height,
                            L.height = -L.height,
                            M = !1)) : (L.x = E < F ? E : F,
                            L.width = Math.abs(E - F),
                            M = E - F < 0,
                            L.y = y,
                            L.height = p.columnWidth);
                            var N = E - F;
                            if (!isNaN(N)) {
                                N = Math.abs(N);
                                var O = void 0
                                  , P = d._getRenderInfo(e, C, x)
                                  , Q = P.element
                                  , R = P.labelElement
                                  , S = void 0 == Q;
                                if (R && (d.renderer.removeElement(R),
                                R = void 0),
                                k) {
                                    var T = {
                                        element: Q
                                    };
                                    O = this._columnAsPieSlice(T, b.rect, k, L),
                                    Q = T.element;
                                    var J = this._getColors(e, C, void 0, "radialGradient", O.outerRadius)
                                } else if (z[B].funnel) {
                                    var U = this._getTrapezoidPath(a.extend({}, L), b.vertical, M);
                                    S ? Q = this.renderer.path(U, {}) : this.renderer.attr(Q, {
                                        d: U
                                    })
                                } else
                                    S ? Q = this.renderer.rect(L.x, L.y, b.vertical ? L.width : 0, b.vertical ? 0 : L.height) : 1 == b.vertical ? this.renderer.attr(Q, {
                                        x: L.x,
                                        y: L.y,
                                        height: N
                                    }) : this.renderer.attr(Q, {
                                        x: L.x,
                                        y: L.y,
                                        width: N
                                    });
                                if (N < 1 && (1 != c || k) ? this.renderer.attr(Q, {
                                    display: "none"
                                }) : this.renderer.attr(Q, {
                                    display: "block"
                                }),
                                S && this.renderer.attr(Q, {
                                    fill: J.fillColor,
                                    "fill-opacity": I.opacity,
                                    "stroke-opacity": I.opacity,
                                    stroke: J.lineColor,
                                    "stroke-width": I.stroke,
                                    "stroke-dasharray": I.dashStyle
                                }),
                                R && this.renderer.removeElement(R),
                                !K || 0 == N && c < 1)
                                    P = {
                                        element: Q,
                                        labelElement: R
                                    },
                                    d._setRenderInfo(e, C, x, P);
                                else {
                                    if (h && 0 != this._get([D.showWaterfallLines, f.showWaterfallLines])) {
                                        if (!j || j && B == l) {
                                            var V = j ? -1 : B;
                                            if (1 == c && !isNaN(g.offsets[B][x].from) && !isNaN(g.offsets[B][x].to)) {
                                                var W = v[V];
                                                if (void 0 != W) {
                                                    var X = {
                                                        x: W.x,
                                                        y: a.jqx._ptrnd(W.y)
                                                    }
                                                      , Y = {
                                                          x: y,
                                                          y: X.y
                                                      }
                                                      , Z = f.columnsTopWidthPercent / 100;
                                                    isNaN(Z) ? Z = 1 : (Z > 1 || Z < 0) && (Z = 1);
                                                    var $ = f.columnsBottomWidthPercent / 100;
                                                    isNaN($) ? $ = 1 : ($ > 1 || $ < 0) && ($ = 1);
                                                    var _ = b.vertical ? L.width : L.height;
                                                    if (X.x = X.x - _ / 2 + _ / 2 * Z,
                                                    A) {
                                                        var aa = _ * Z / 2;
                                                        Y.x = Y.x + _ / 2 - (i.flip ? -aa : aa)
                                                    } else {
                                                        var aa = _ * $ / 2;
                                                        Y.x = Y.x + _ / 2 - (i.flip ? -aa : aa)
                                                    }
                                                    b.vertical || (this._swapXY([X]),
                                                    this._swapXY([Y])),
                                                    this.renderer.line(X.x, X.y, Y.x, Y.y, {
                                                        stroke: W.color,
                                                        "stroke-width": I.stroke,
                                                        "stroke-opacity": I.opacity,
                                                        "fill-opacity": I.opacity,
                                                        "stroke-dasharray": I.dashStyle
                                                    })
                                                }
                                            }
                                        }
                                        1 == c && 0 != N && (v[j ? -1 : B] = {
                                            y: F,
                                            x: b.vertical ? L.x + L.width : L.y + L.height,
                                            color: J.lineColor
                                        })
                                    }
                                    if (k) {
                                        var _ = (this._toPolarCoord(k, b.rect, L.x + L.width / 2, L.y),
                                        this._showLabel(e, C, x, L, void 0, void 0, !0))
                                          , ba = O.outerRadius + 10;
                                        labelOffset = this._adjustTextBoxPosition(k.x, k.y, _, ba, (O.fromAngle + O.toAngle) / 2, !0, !1, !1),
                                        R = this._showLabel(e, C, x, {
                                            x: labelOffset.x,
                                            y: labelOffset.y
                                        }, void 0, void 0, !1, !1, !1)
                                    } else
                                        R = this._showLabel(e, C, x, L, void 0, void 0, !1, !1, M);
                                    P = {
                                        element: Q,
                                        labelElement: R
                                    },
                                    d._setRenderInfo(e, C, x, P),
                                    1 == c && this._installHandlers(Q, "column", e, C, x)
                                }
                            }
                        }
                    }
                }
            }
        },
        _getTrapezoidPath: function (b, c, d) {
            var e = ""
              , f = b.fromWidthPercent / 100
              , g = b.toWidthPercent / 100;
            if (!c) {
                var h = b.width;
                b.width = b.height,
                b.height = h,
                h = b.x,
                b.x = b.y,
                b.y = h
            }
            var i = b.x + b.width / 2
              , j = [{
                  x: i - b.width * (d ? g : f) / 2,
                  y: b.y + b.height
              }, {
                  x: i - b.width * (d ? f : g) / 2,
                  y: b.y
              }, {
                  x: i + b.width * (d ? f : g) / 2,
                  y: b.y
              }, {
                  x: i + b.width * (d ? g : f) / 2,
                  y: b.y + b.height
              }];
            c || this._swapXY(j),
            e += "M " + a.jqx._ptrnd(j[0].x) + "," + a.jqx._ptrnd(j[0].y);
            for (var k = 1; k < j.length; k++)
                e += " L " + a.jqx._ptrnd(j[k].x) + "," + a.jqx._ptrnd(j[k].y);
            return e += " Z"
        },
        _swapXY: function (a) {
            for (var b = 0; b < a.length; b++) {
                var c = a[b].x;
                a[b].x = a[b].y,
                a[b].y = c
            }
        },
        _renderCandleStickSeries: function (b, c, d) {
            var e = this
              , f = e.seriesGroups[b];
            if (f.series && 0 != f.series.length) {
                var g = "horizontal" == f.orientation
                  , h = c;
                g && (h = {
                    x: c.y,
                    y: c.x,
                    width: c.height,
                    height: c.width
                });
                var i = e._calcGroupOffsets(b, h);
                if (i && 0 != i.xoffsets.length) {
                    var j;
                    h.width;
                    (f.polar || f.spider) && (j = e._getPolarAxisCoords(b, h),
                    2 * j.r);
                    for (var k = (e._alignValuesWithTicks(b),
                    e._getGroupGradientType(b)), l = [], m = 0; m < f.series.length; m++)
                        l[m] = e._getColumnSerieWidthAndOffset(b, m);
                    for (var m = 0; m < f.series.length; m++)
                        if (this._isSerieVisible(b, m)) {
                            var n = e._getSerieSettings(b, m)
                              , o = f.series[m];
                            if (!o.customDraw) {
                                var p = a.isFunction(o.colorFunction) ? void 0 : e._getColors(b, m, NaN, k)
                                  , q = {
                                      rect: c,
                                      inverse: g,
                                      groupIndex: b,
                                      seriesIndex: m,
                                      symbolType: o.symbolType,
                                      symbolSize: o.symbolSize,
                                      "fill-opacity": n.opacity,
                                      "stroke-opacity": n.opacity,
                                      "stroke-width": n.stroke,
                                      "stroke-dasharray": n.dashStyle,
                                      gradientType: k,
                                      colors: p,
                                      renderData: i,
                                      polarAxisCoords: j,
                                      columnsInfo: l,
                                      isOHLC: d,
                                      items: [],
                                      self: e
                                  }
                                  , r = e._getAnimProps(b, m)
                                  , s = r.enabled && !e._isToggleRefresh && i.xoffsets.length < 5e3 ? r.duration : 0;
                                e._animCandleStick(q, 0);
                                e._enqueueAnimation("series", void 0, void 0, s, function (a, b, c) {
                                    e._animCandleStick(b, c)
                                }, q)
                            }
                        }
                }
            }
        },
        _animCandleStick: function (b, c) {
            var d = ["Open", "Low", "Close", "High"]
              , e = b.columnsInfo[b.seriesIndex].width
              , f = b.self.seriesGroups[b.groupIndex]
              , g = b.renderData.xoffsets
              , h = -1
              , i = Math.abs(g.data[g.last] - g.data[g.first]);
            i *= c;
            for (var j = NaN, k = NaN, l = 0; l < b.columnsInfo.length; l++) {
                var m = b.columnsInfo[l];
                (isNaN(j) || j > m.offset) && (j = m.offset),
                (isNaN(k) || k < m.offset + m.width) && (k = m.offset + m.width)
            }
            for (var n = Math.abs(k - j), o = 0 != f.skipOverlappingPoints, p = g.first; p <= g.last; p++) {
                var q = g.data[p];
                if (!isNaN(q) && !(-1 != h && Math.abs(q - h) < n && o)) {
                    if (Math.abs(g.data[p] - g.data[g.first]) > i)
                        break;
                    h = q;
                    var r = b.items[p] = b.items[p] || {};
                    for (var l in d) {
                        var s = b.self._getDataValueAsNumber(p, f.series[b.seriesIndex]["dataField" + d[l]], b.groupIndex);
                        if (isNaN(s))
                            break;
                        var t = b.renderData.offsets[b.seriesIndex][p][d[l]];
                        if (isNaN(t))
                            break;
                        r[d[l]] = t
                    }
                    if (q += b.inverse ? b.rect.y : b.rect.x,
                    b.polarAxisCoords) {
                        var u = this._toPolarCoord(b.polarAxisCoords, this._plotRect, q, t);
                        q = u.x,
                        t = u.y
                    }
                    q = a.jqx._ptrnd(q);
                    for (var v in d)
                        r[v] = a.jqx._ptrnd(r[v]);
                    var w = b.colors;
                    if (w || (w = b.self._getColors(b.groupIndex, b.seriesIndex, p, b.gradientType)),
                    b.isOHLC) {
                        var x = "M" + q + "," + r.Low + " L" + q + "," + r.High + " M" + (q - e / 2) + "," + r.Open + " L" + q + "," + r.Open + " M" + (q + e / 2) + "," + r.Close + " L" + q + "," + r.Close;
                        b.inverse && (x = "M" + r.Low + "," + q + " L" + r.High + "," + q + " M" + r.Open + "," + (q - e / 2) + " L" + r.Open + "," + q + " M" + r.Close + "," + q + " L" + r.Close + "," + (q + e / 2));
                        var y = r.lineElement;
                        y || (y = this.renderer.path(x, {}),
                        this.renderer.attr(y, {
                            fill: w.fillColor,
                            "fill-opacity": b["fill-opacity"],
                            "stroke-opacity": b["fill-opacity"],
                            stroke: w.lineColor,
                            "stroke-width": b["stroke-width"],
                            "stroke-dasharray": b["stroke-dasharray"]
                        }),
                        r.lineElement = y),
                        1 == c && this._installHandlers(y, "column", b.groupIndex, b.seriesIndex, p)
                    } else {
                        var y = r.lineElement;
                        y || (y = b.inverse ? this.renderer.line(r.Low, q, r.High, q) : this.renderer.line(q, r.Low, q, r.High),
                        this.renderer.attr(y, {
                            fill: w.fillColor,
                            "fill-opacity": b["fill-opacity"],
                            "stroke-opacity": b["fill-opacity"],
                            stroke: w.lineColor,
                            "stroke-width": b["stroke-width"],
                            "stroke-dasharray": b["stroke-dasharray"]
                        }),
                        r.lineElement = y);
                        var z = r.stickElement;
                        if (q -= e / 2,
                        !z) {
                            var A = w.fillColor;
                            r.Close <= r.Open && w.fillColorAlt && (A = w.fillColorAlt),
                            z = b.inverse ? this.renderer.rect(Math.min(r.Open, r.Close), q, Math.abs(r.Close - r.Open), e) : this.renderer.rect(q, Math.min(r.Open, r.Close), e, Math.abs(r.Close - r.Open)),
                            this.renderer.attr(z, {
                                fill: A,
                                "fill-opacity": b["fill-opacity"],
                                "stroke-opacity": b["fill-opacity"],
                                stroke: w.lineColor,
                                "stroke-width": b["stroke-width"],
                                "stroke-dasharray": b["stroke-dasharray"]
                            }),
                            r.stickElement = z
                        }
                        1 == c && this._installHandlers(z, "column", b.groupIndex, b.seriesIndex, p)
                    }
                }
            }
        },
        _renderScatterSeries: function (b, c, d) {
            var e = this.seriesGroups[b];
            if (e.series && 0 != e.series.length) {
                var f = -1 != e.type.indexOf("bubble")
                  , g = "horizontal" == e.orientation
                  , h = c;
                g && (h = {
                    x: c.y,
                    y: c.x,
                    width: c.height,
                    height: c.width
                });
                var i = this._calcGroupOffsets(b, h);
                if (i && 0 != i.xoffsets.length) {
                    var j, k = h.width;
                    (e.polar || e.spider) && (j = this._getPolarAxisCoords(b, h),
                    k = 2 * j.r);
                    var l = (this._alignValuesWithTicks(b),
                    this._getGroupGradientType(b));
                    d || (d = "to");
                    for (var m = 0; m < e.series.length; m++) {
                        var n = this._getSerieSettings(b, m)
                          , o = e.series[m];
                        if (!o.customDraw) {
                            var p = o.dataField
                              , q = a.isFunction(o.colorFunction)
                              , r = this._getColors(b, m, NaN, l)
                              , s = NaN
                              , t = NaN;
                            if (f)
                                for (var u = i.xoffsets.first; u <= i.xoffsets.last; u++) {
                                    var v = this._getDataValueAsNumber(u, o.radiusDataField || o.sizeDataField, b);
                                    if ("number" != typeof v)
                                        throw "Invalid radiusDataField value at [" + u + "]";
                                    isNaN(v) || ((isNaN(s) || v < s) && (s = v),
                                    (isNaN(t) || v > t) && (t = v))
                                }
                            var w = o.minRadius || o.minSymbolSize;
                            isNaN(w) && (w = k / 50);
                            var x = o.maxRadius || o.maxSymbolSize;
                            isNaN(x) && (x = k / 25),
                            w > x && (x = w);
                            var y = o.radius;
                            y = isNaN(y) && !isNaN(o.symbolSize) ? "circle" == o.symbolType ? o.symbolSize / 2 : o.symbolSize : 5;
                            for (var z = this._getAnimProps(b, m), A = z.enabled && !this._isToggleRefresh && i.xoffsets.length < 5e3 ? z.duration : 0, B = {
                                groupIndex: b,
                                seriesIndex: m,
                                symbolType: o.symbolType,
                                symbolSize: o.symbolSize,
                                "fill-opacity": n.opacity,
                                "stroke-opacity": n.opacity,
                                "stroke-width": n.stroke,
                                "stroke-width-symbol": n.strokeSymbol,
                                "stroke-dasharray": n.dashStyle,
                                items: [],
                                polarAxisCoords: j
                            }, C = void 0, u = i.xoffsets.first; u <= i.xoffsets.last; u++) {
                                var v = this._getDataValueAsNumber(u, p, b);
                                if ("number" == typeof v) {
                                    var D = i.xoffsets.data[u]
                                      , E = i.xoffsets.xvalues[u]
                                      , F = i.offsets[m][u][d];
                                    if (!(F < h.y || F > h.y + h.height || isNaN(D) || isNaN(F))) {
                                        if (g) {
                                            var G = D;
                                            D = F,
                                            F = G + c.y
                                        } else
                                            D += c.x;
                                        if (!(!q && C && this.enableSampling && a.jqx._ptdist(C.x, C.y, D, F) < 1)) {
                                            C = {
                                                x: D,
                                                y: F
                                            };
                                            var H = y;
                                            if (f) {
                                                var I = this._getDataValueAsNumber(u, o.radiusDataField || o.sizeDataField, b);
                                                if ("number" != typeof I)
                                                    continue;
                                                H = w + (x - w) * (I - s) / Math.max(1, t - s),
                                                isNaN(H) && (H = w)
                                            }
                                            i.offsets[m][u].radius = H;
                                            var J = NaN
                                              , K = NaN
                                              , L = 0
                                              , M = this._elementRenderInfo;
                                            if (void 0 != E && M && M.length > b && M[b].series.length > m) {
                                                var N = M[b].series[m][E];
                                                if (N && !isNaN(N.to)) {
                                                    if (J = N.to,
                                                    K = N.xoffset,
                                                    L = y,
                                                    g) {
                                                        var G = K;
                                                        K = J,
                                                        J = G + c.y
                                                    } else
                                                        K += c.x;
                                                    f && (L = w + (x - w) * (N.valueRadius - s) / Math.max(1, t - s),
                                                    isNaN(L) && (L = w))
                                                }
                                            }
                                            q && (r = this._getColors(b, m, u, l)),
                                            B.items.push({
                                                from: L,
                                                to: H,
                                                itemIndex: u,
                                                fill: r.fillColor,
                                                stroke: r.lineColor,
                                                x: D,
                                                y: F,
                                                xFrom: K,
                                                yFrom: J
                                            })
                                        }
                                    }
                                }
                            }
                            this._animR(B, 0);
                            var O = this;
                            this._enqueueAnimation("series", void 0, void 0, A, function (a, b, c) {
                                O._animR(b, c)
                            }, B)
                        }
                    }
                }
            }
        },
        _animR: function (b, c) {
            for (var d = b.items, e = b.symbolType || "circle", f = b.symbolSize, g = 0; g < d.length; g++) {
                var h = d[g]
                  , i = h.x
                  , j = h.y
                  , k = Math.round((h.to - h.from) * c + h.from);
                if (isNaN(h.yFrom) || (j = h.yFrom + (j - h.yFrom) * c),
                isNaN(h.xFrom) || (i = h.xFrom + (i - h.xFrom) * c),
                b.polarAxisCoords) {
                    var l = this._toPolarCoord(b.polarAxisCoords, this._plotRect, i, j);
                    i = l.x,
                    j = l.y
                }
                i = a.jqx._ptrnd(i),
                j = a.jqx._ptrnd(j),
                k = a.jqx._ptrnd(k);
                var m = this._getRenderInfo(b.groupIndex, b.seriesIndex, d[g].itemIndex)
                  , n = m.element
                  , o = m.labelElement;
                "circle" == e ? (n || (n = this.renderer.circle(i, j, k),
                this.renderer.attr(n, {
                    fill: h.fill,
                    "fill-opacity": b["fill-opacity"],
                    "stroke-opacity": b["fill-opacity"],
                    stroke: h.stroke,
                    "stroke-width": b["stroke-width"],
                    "stroke-dasharray": b["stroke-dasharray"]
                })),
                this._isVML ? this.renderer.updateCircle(n, void 0, void 0, k) : this.renderer.attr(n, {
                    r: k,
                    cy: j,
                    cx: i
                })) : (n && this.renderer.removeElement(n),
                n = this._drawSymbol(e, i, j, h.fill, b["fill-opacity"], h.stroke, b["stroke-opacity"] || b["fill-opacity"], b["stroke-width-symbol"], b["stroke-dasharray"], f || k)),
                o && this.renderer.removeElement(o),
                o = this._showLabel(b.groupIndex, b.seriesIndex, h.itemIndex, {
                    x: i - k,
                    y: j - k,
                    width: 2 * k,
                    height: 2 * k
                }),
                c >= 1 && this._installHandlers(n, "circle", b.groupIndex, b.seriesIndex, h.itemIndex),
                this._setRenderInfo(b.groupIndex, b.seriesIndex, d[g].itemIndex, {
                    element: n,
                    labelElement: o
                })
            }
        },
        _showToolTip: function (b, c, d, e, f) {
            var g = this
              , h = g._getXAxis(d)
              , i = g._getValueAxis(d);
            if (!g._ttEl || d != g._ttEl.gidx || e != g._ttEl.sidx || f != g._ttEl.iidx) {
                var j = g.seriesGroups[d]
                  , k = j.series[e]
                  , l = g.enableCrosshairs;
                g._pointMarker ? (b = parseInt(g._pointMarker.x + 5),
                c = parseInt(g._pointMarker.y - 5)) : l = !1;
                var m = l && 0 == g.showToolTips;
                b = a.jqx._ptrnd(b),
                c = a.jqx._ptrnd(c);
                g._ttEl;
                if (0 != j.showToolTips && 0 != k.showToolTips) {
                    var n = g._get([k.toolTipFormatSettings, j.toolTipFormatSettings, i.toolTipFormatSettings, g.toolTipFormatSettings])
                      , o = g._get([k.toolTipFormatFunction, j.toolTipFormatFunction, i.toolTipFormatFunction, g.toolTipFormatFunction])
                      , p = g._getColors(d, e, f)
                      , q = g._getDataValue(f, h.dataField, d);
                    void 0 != h.dataField && "" != h.dataField || (q = f),
                    "date" == h.type && (q = g._castAsDate(q, (n ? n.dateFormat : void 0) || h.dateFormat));
                    var r = "";
                    if (a.isFunction(o)) {
                        var s = {}
                          , t = 0;
                        for (var u in k)
                            0 == u.indexOf("dataField") && (s[u.substring(9, u.length).toLowerCase()] = g._getDataValue(f, k[u], d),
                            t++);
                        0 == t ? s = g._getDataValue(f, void 0, d) : 1 == t && (s = s[""]),
                        r = o(s, f, k, j, q, h)
                    } else {
                        r = g._getFormattedValue(d, e, f, n, o);
                        var v = this._getAxisSettings(h)
                          , w = v.toolTipFormatSettings
                          , x = v.toolTipFormatFunction;
                        x || w || "date" != h.type || (x = this._getDefaultDTFormatFn(h.baseUnit || "day"));
                        var y = g._formatValue(q, w, x, d, e, f);
                        if (g._isPieGroup(d))
                            q = g._getDataValue(f, k.displayText || k.dataField, d),
                            y = g._formatValue(q, w, x, d, e, f),
                            r = y + ": " + r;
                        else {
                            var z = h.displayText || h.dataField || "";
                            r = z.length > 0 ? z + ": " + y + "<br>" + r : y + "<br>" + r
                        }
                    }
                    if (g._ttEl || (g._ttEl = {}),
                    g._ttEl.sidx = e,
                    g._ttEl.gidx = d,
                    g._ttEl.iidx = f,
                    rect = g.renderer.getRect(),
                    l) {
                        var A = a.jqx._ptrnd(g._pointMarker.x)
                          , B = a.jqx._ptrnd(g._pointMarker.y)
                          , C = g.crosshairsColor || g._defaultLineColor;
                        if (j.polar || j.spider) {
                            var D = this._getPolarAxisCoords(d, this._plotRect);
                            if (a.jqx._ptdist(A, B, D.x, D.y) > D.r)
                                return;
                            var E = Math.atan2(B - D.y, A - D.x)
                              , F = Math.cos(E) * D.r + D.x
                              , G = Math.sin(E) * D.r + D.y;
                            g._ttEl.vLine ? g.renderer.attr(g._ttEl.vLine, {
                                x1: D.x,
                                y1: D.y,
                                x2: F,
                                y2: G
                            }) : g._ttEl.vLine = g.renderer.line(D.x, D.y, F, G, {
                                stroke: C,
                                "stroke-width": g.crosshairsLineWidth || 1,
                                "stroke-dasharray": g.crosshairsDashStyle || ""
                            })
                        } else
                            g._ttEl.vLine && g._ttEl.hLine ? (g.renderer.attr(g._ttEl.vLine, {
                                x1: A,
                                x2: A
                            }),
                            g.renderer.attr(g._ttEl.hLine, {
                                y1: B,
                                y2: B
                            })) : (g._ttEl.vLine = g.renderer.line(A, g._plotRect.y, A, g._plotRect.y + g._plotRect.height, {
                                stroke: C,
                                "stroke-width": g.crosshairsLineWidth || 1,
                                "stroke-dasharray": g.crosshairsDashStyle || ""
                            }),
                            g._ttEl.hLine = g.renderer.line(g._plotRect.x, B, g._plotRect.x + g._plotRect.width, B, {
                                stroke: C,
                                "stroke-width": g.crosshairsLineWidth || 1,
                                "stroke-dasharray": g.crosshairsDashStyle || ""
                            }))
                    }
                    if (!m && 0 != g.showToolTips) {
                        var H = k.toolTipClass || j.toolTipClass || this.toThemeProperty("jqx-chart-tooltip-text", null)
                          , I = k.toolTipBackground || j.toolTipBackground || "#FFFFFF"
                          , J = k.toolTipLineColor || j.toolTipLineColor || p.lineColor
                          , K = this._get([k.toolTipOpacity, j.toolTipOpacity, 1])
                          , L = this.getItemCoord(d, e, f)
                          , M = 0;
                        g._pointMarker && g._pointMarker.element && (M = k.symbolSizeSelected,
                        isNaN(M) && (M = k.symbolSize),
                        (isNaN(M) || M > 50 || M < 0) && (M = j.symbolSize),
                        (isNaN(M) || M > 50 || M < 0) && (M = 8)),
                        g._createTooltip(L, j, r, {
                            css: H,
                            fill: I,
                            stroke: J,
                            fillOpacity: K,
                            symbolSize: M
                        })
                    }
                }
            }
        },
        _fitTooltip: function (a, b, c, d, e) {
            var f = {}
              , g = 2 + e / 2;
            if (b.x - c.width - 7 - g > a.x && b.y + b.height / 2 - c.height / 2 > a.y && b.y + b.height / 2 + c.height / 2 < a.y + a.height && (f.left = {
                arrowLocation: "right",
                x: b.x - c.width - 7 - g,
                y: b.y + b.height / 2 - c.height / 2,
                width: c.width + 7,
                height: c.height
            }),
            b.x + b.width + c.width + 7 + g < a.x + a.width && b.y + b.height / 2 - c.height / 2 > a.y && b.y + b.height / 2 + c.height / 2 < a.y + a.height && (f.right = {
                arrowLocation: "left",
                x: b.x + b.width + g,
                y: b.y + b.height / 2 - c.height / 2,
                width: c.width + 7,
                height: c.height
            }),
            b.y - c.height - g - 7 > a.y && b.x + b.width / 2 - c.width / 2 > a.x && b.x + b.width / 2 + c.width / 2 < a.x + a.width && (f.top = {
                arrowLocation: "bottom",
                x: b.x + b.width / 2 - c.width / 2,
                y: b.y - c.height - g - 7,
                width: c.width,
                height: c.height + 7
            }),
            b.y + b.height + c.height + 7 + g < a.y + a.height && b.x + b.width / 2 - c.width / 2 > a.x && b.x + b.width / 2 + c.width / 2 < a.x + a.width && (f.bottom = {
                arrowLocation: "top",
                x: b.x + b.width / 2 - c.width / 2,
                y: b.y + b.height + g,
                width: c.width,
                height: c.height + 7
            }),
            b.width > b.height || (-1 != d.type.indexOf("stackedcolumn") || -1 != d.type.indexOf("stackedwaterfall")) && "horizontal" != d.orientation) {
                if (f.left)
                    return f.left;
                if (f.right)
                    return f.right
            } else {
                if (f.top)
                    return f.top;
                if (f.bottom)
                    return f.bottom
            }
            for (var h in f)
                if (f[h])
                    return f[h];
            return {
                arrowLocation: ""
            }
        },
        _createTooltip: function (b, c, d, e) {
            var f = this
              , g = c.type
              , h = !1
              , i = f._ttEl.box;
            if (!i) {
                h = !0,
                i = f._ttEl.box = document.createElement("div");
                i.style.position = "absolute",
                i.style.cursor = "default",
                a(j).css({
                    "z-index": 1e7,
                    "box-sizing": "content-box"
                }),
                a(i).css({
                    "z-index": 1e7
                }),
                a(document.body).append(i);
                var j = document.createElement("div");
                j.id = "arrowOuterDiv",
                j.style.width = "0px",
                j.style.height = "0px",
                j.style.position = "absolute",
                a(j).css({
                    "z-index": 1e7 + 1,
                    "box-sizing": "content-box"
                });
                var k = document.createElement("div");
                k.id = "arrowInnerDiv",
                k.style.width = "0px",
                k.style.height = "0px",
                k.style.position = "absolute";
                var l = document.createElement("div");
                l.id = "contentDiv",
                l.style.position = "absolute",
                a(l).css({
                    "box-sizing": "content-box"
                }),
                a(l).addClass("jqx-rc-all jqx-button"),
                a(l).appendTo(a(i)),
                a(j).appendTo(a(i)),
                a(k).appendTo(a(i)),
                a(k).css({
                    "z-index": 1e7 + 2,
                    "box-sizing": "content-box"
                })
            }
            if (!d || 0 == d.length)
                return void a(i).fadeTo(0, 0);
            l = a(i).find("#contentDiv")[0],
            j = a(i).find("#arrowOuterDiv")[0],
            k = a(i).find("#arrowInnerDiv")[0],
            k.style.opacity = j.style.opacity = e.fillOpacity,
            l.style.backgroundColor = e.fill,
            l.style.borderColor = e.stroke,
            l.style.opacity = e.fillOpacity;
            var m = "<span class='" + e.css + "'>" + d + "</span>";
            a(l).html(m);
            var n = this._measureHtml(m, "jqx-rc-all jqx-button");
            if (rect = f._plotRect,
            !(n.width > rect.width || n.height > rect.height)) {
                var o = {
                    width: n.width,
                    height: n.height
                };
                arrowLocation = "";
                var p = f._isColumnType(g);
                if (x = Math.max(b.x, rect.x),
                y = Math.max(b.y, rect.y),
                "dataPoint" == f.toolTipAlignment) {
                    if (-1 != g.indexOf("pie") || -1 != g.indexOf("donut")) {
                        var q = (b.fromAngle + b.toAngle) / 2;
                        q *= Math.PI / 180;
                        var r = !isNaN(b.innerRadius) && b.innerRadius > 0 ? (b.innerRadius + b.outerRadius) / 2 : .75 * b.outerRadius;
                        x = b.x = b.center.x + Math.cos(q) * r,
                        y = b.y = b.center.y - Math.sin(q) * r,
                        b.width = b.height = 1
                    } else
                        p && (c.polar || c.spider) && (b.width = b.height = 1);
                    var s = this._fitTooltip(this._plotRect, b, o, c, e.symbolSize);
                    "" != s.arrowLocation && (arrowLocation = s.arrowLocation,
                    x = s.x,
                    y = s.y,
                    o.width = s.width,
                    o.height = s.height)
                } else
                    arrowLocation = "";
                "top" == arrowLocation || "bottom" == arrowLocation ? (o.height += 7,
                x -= 3.5,
                "bottom" == arrowLocation && (y -= 7)) : "left" != arrowLocation && "right" != arrowLocation || (o.width += 7,
                y -= 3.5,
                "right" == arrowLocation && (x -= 7)),
                x + o.width > rect.x + rect.width && (arrowLocation = "",
                x = rect.x + rect.width - o.width),
                y + o.height > rect.y + rect.height && (arrowLocation = "",
                y = rect.y + rect.height - o.height);
                var t = {
                    x: 0,
                    y: 0
                };
                a(l).css({
                    width: n.width,
                    height: n.height,
                    left: 0,
                    top: 0
                }),
                j.style["margin-top"] = j.style["margin-left"] = 0,
                k.style["margin-top"] = k.style["margin-left"] = 0,
                l.style["margin-top"] = l.style["margin-left"] = 0;
                switch (arrowLocation) {
                    case "left":
                        t = {
                            x: 0,
                            y: (n.height - 7) / 2
                        },
                        contentPostion = {
                            x: 7,
                            y: 0
                        },
                        l.style["margin-left"] = "7px",
                        j.style["margin-left"] = "0px",
                        j.style["margin-top"] = t.y + "px",
                        j.style["border-left"] = "",
                        j.style["border-right"] = "7px solid " + e.stroke,
                        j.style["border-top"] = "7px solid transparent",
                        j.style["border-bottom"] = "7px solid transparent",
                        k.style["margin-left"] = "1px",
                        k.style["margin-top"] = t.y + "px",
                        k.style["border-left"] = "",
                        k.style["border-right"] = "7px solid " + e.fill,
                        k.style["border-top"] = "7px solid transparent",
                        k.style["border-bottom"] = "7px solid transparent";
                        break;
                    case "right":
                        t = {
                            x: o.width - 7,
                            y: (n.height - 7) / 2
                        },
                        contentPostion = {
                            x: 0,
                            y: 0
                        },
                        j.style["margin-left"] = t.x + "px",
                        j.style["margin-top"] = t.y + "px",
                        j.style["border-left"] = "7px solid " + e.stroke,
                        j.style["border-right"] = "",
                        j.style["border-top"] = "7px solid transparent",
                        j.style["border-bottom"] = "7px solid transparent",
                        k.style["margin-left"] = t.x - 1 + "px",
                        k.style["margin-top"] = t.y + "px",
                        k.style["border-left"] = "7px solid " + e.fill,
                        k.style["border-right"] = "",
                        k.style["border-top"] = "7px solid transparent",
                        k.style["border-bottom"] = "7px solid transparent";
                        break;
                    case "top":
                        t = {
                            x: o.width / 2 - 3.5,
                            y: 0
                        },
                        contentPostion = {
                            x: 0,
                            y: 7
                        },
                        l.style["margin-top"] = contentPostion.y + "px",
                        j.style["margin-left"] = t.x + "px",
                        j.style["border-top"] = "",
                        j.style["border-bottom"] = "7px solid " + e.stroke,
                        j.style["border-left"] = "7px solid transparent",
                        j.style["border-right"] = "7px solid transparent",
                        k.style["margin-left"] = t.x + "px",
                        k.style["margin-top"] = "1px",
                        k.style["border-top"] = "",
                        k.style["border-bottom"] = "7px solid " + e.fill,
                        k.style["border-left"] = "7px solid transparent",
                        k.style["border-right"] = "7px solid transparent";
                        break;
                    case "bottom":
                        t = {
                            x: o.width / 2 - 3.5,
                            y: o.height - 7
                        },
                        contentPostion = {
                            x: 0,
                            y: 0
                        },
                        j.style["margin-left"] = t.x + "px",
                        j.style["margin-top"] = t.y + "px",
                        j.style["border-top"] = "7px solid " + e.stroke,
                        j.style["border-bottom"] = "",
                        j.style["border-left"] = "7px solid transparent",
                        j.style["border-right"] = "7px solid transparent",
                        k.style["margin-left"] = t.x + "px",
                        k.style["margin-top"] = t.y - 1 + "px",
                        k.style["border-top"] = "7px solid " + e.fill,
                        k.style["border-bottom"] = "",
                        k.style["border-left"] = "7px solid transparent",
                        k.style["border-right"] = "7px solid transparent"
                }
                "" == arrowLocation ? (a(j).hide(),
                a(k).hide()) : (a(j).show(),
                a(k).show()),
                a(i).css({
                    width: o.width + "px",
                    height: o.height + "px"
                });
                var u = f.host.coord();
                h && (a(i).fadeOut(0, 0),
                i.style.left = x + u.left + "px",
                i.style.top = y + u.top + "px"),
                a(i).clearQueue(),
                a(i).animate({
                    left: x + u.left,
                    top: y + u.top,
                    opacity: 1
                }, f.toolTipMoveDuration, "easeInOutCirc"),
                a(i).fadeTo(400, 1)
            }
        },
        _measureHtml: function (b, c) {
            var d = this._measureDiv;
            d || (this._measureDiv = d = document.createElement("div"),
            d.style.position = "absolute",
            d.style.cursor = "default",
            d.style.overflow = "hidden",
            d.style.display = "none",
            a(d).addClass(c),
            this.host.append(d)),
            a(d).html(b);
            var e = {
                width: a(d).width() + 2,
                height: a(d).height() + 2
            };
            return a.jqx.browser && a.jqx.browser.mozilla && (e.height += 3),
            e
        },
        _hideToolTip: function (b) {
            this._ttEl && (this._ttEl.box && (0 == b ? a(this._ttEl.box).hide() : a(this._ttEl.box).fadeOut()),
            this._hideCrosshairs(),
            this._ttEl.gidx = void 0)
        },
        _hideCrosshairs: function () {
            this._ttEl && (this._ttEl.vLine && (this.renderer.removeElement(this._ttEl.vLine),
            this._ttEl.vLine = void 0),
            this._ttEl.hLine && (this.renderer.removeElement(this._ttEl.hLine),
            this._ttEl.hLine = void 0))
        },
        _get: function (b) {
            return a.jqx.getByPriority(b)
        },
        _getAxisSettings: function (a) {
            if (!a)
                return {};
            var b = this
              , c = a.gridLines || {}
              , d = {
                  visible: this._get([c.visible, a.showGridLines, !0]),
                  color: b._get([c.color, a.gridLinesColor, b._defaultLineColor]),
                  unitInterval: b._get([c.unitInterval, c.interval, a.gridLinesInterval]),
                  step: b._get([c.step, a.gridLinesStep]),
                  dashStyle: b._get([c.dashStyle, a.gridLinesDashStyle]),
                  width: b._get([c.lineWidth, 1]),
                  offsets: [],
                  alternatingBackgroundColor: a.alternatingBackgroundColor,
                  alternatingBackgroundColor2: a.alternatingBackgroundColor2,
                  alternatingBackgroundOpacity: a.alternatingBackgroundOpacity
              }
              , e = a.tickMarks || {}
              , f = {
                  visible: this._get([e.visible, a.showTickMarks, !0]),
                  color: b._get([e.color, a.tickMarksColor, b._defaultLineColor]),
                  unitInterval: b._get([e.unitInterval, e.interval, a.tickMarksInterval]),
                  step: b._get([e.step, a.tickMarksStep]),
                  dashStyle: b._get([e.dashStyle, a.tickMarksDashStyle]),
                  width: b._get([e.lineWidth, 1]),
                  size: b._get([e.size, 4]),
                  offsets: []
              }
              , g = a.title || {}
              , h = {
                  visible: b._get([g.visible, !0]),
                  text: b._get([a.description, g.text]),
                  style: b._get([a.descriptionClass, g.class, b.toThemeProperty("jqx-chart-axis-description", null)]),
                  halign: b._get([a.horizontalDescriptionAlignment, g.horizontalAlignment, "center"]),
                  valign: b._get([a.verticalDescriptionAlignment, g.verticalAlignment, "center"]),
                  angle: 0,
                  rotationPoint: b._get([g.rotationPoint, "centercenter"]),
                  offset: b._get([g.offset, {
                      x: 0,
                      y: 0
                  }])
              }
              , i = a.line || {}
              , j = {
                  visible: b._get([i.visible, !0]),
                  color: b._get([i.color, d.color, b._defaultLineColor]),
                  dashStyle: b._get([i.dashStyle, d.dashStyle, ""]),
                  width: b._get([i.lineWidth, 1]),
                  angle: b._get([i.angle, NaN])
              }
              , k = a.padding || {};
            k = {
                left: k.left || 0,
                right: k.right || 0,
                top: k.top || 0,
                bottom: k.bottom || 0
            };
            var l = this._getAxisLabelsSettings(a);
            return {
                visible: this._get([a.visible, a.showValueAxis, a.showXAxis, a.showCategoryAxis, !0]),
                customDraw: this._get([a.customDraw, !1]),
                gridLines: d,
                tickMarks: f,
                line: j,
                title: h,
                labels: l,
                padding: k,
                toolTipFormatFunction: this._get([a.toolTipFormatFunction, a.formatFunction, l.formatFunction]),
                toolTipFormatSettings: this._get([a.toolTipFormatSettings, a.formatSettings, l.formatSettings])
            }
        },
        _getAxisLabelsSettings: function (a) {
            var b = this
              , c = a.labels || {};
            return {
                visible: b._get([a.showLabels, c.visible, !0]),
                unitInterval: b._get([c.unitInterval, c.interval, a.labelsInterval]),
                step: b._get([c.step, a.labelsStep]),
                angle: b._get([a.textRotationAngle, c.angle, 0]),
                style: b._get([a.class, c.class, b.toThemeProperty("jqx-chart-axis-text", null)]),
                halign: b._get([a.horizontalTextAlignment, c.horizontalAlignment, "center"]),
                valign: b._get([a.verticalTextAlignment, c.verticalAlignment, "center"]),
                textRotationPoint: b._get([a.textRotationPoint, c.rotationPoint, "auto"]),
                textOffset: b._get([a.textOffset, c.offset, {
                    x: 0,
                    y: 0
                }]),
                autoRotate: b._get([a.labelsAutoRotate, c.autoRotate, !1]),
                formatSettings: b._get([a.formatSettings, c.formatSettings, void 0]),
                formatFunction: b._get([a.formatFunction, c.formatFunction, void 0])
            }
        },
        _getLabelsSettings: function (b, c, d, e) {
            for (var f = this.seriesGroups[b], g = f.series[c], h = isNaN(d) ? void 0 : this._getDataValue(d, g.dataField, b), i = e || ["Visible", "Offset", "Angle", "HorizontalAlignment", "VerticalAlignment", "Class", "BackgroundColor", "BorderColor", "BorderOpacity", "Padding", "Opacity", "BackgroundOpacity", "LinesAngles", "LinesEnabled", "AutoRotate", "Radius"], j = {}, k = 0; k < i.length; k++) {
                var l = i[k]
                  , m = "labels" + l
                  , n = "label" + l
                  , o = l.substring(0, 1).toLowerCase() + l.substring(1)
                  , p = void 0;
                f.labels && "object" == typeof f.labels && (p = f.labels[o]),
                g.labels && "object" == typeof g.labels && void 0 != g.labels[o] && (p = g.labels[o]),
                p = this._get([g[m], g[n], p, f[m], f[n]]),
                a.isFunction(p) ? j[o] = p(h, d, g, f) : j[o] = p
            }
            j.class = j.class || this.toThemeProperty("jqx-chart-label-text", null),
            j.visible = this._get([j.visible, g.showLabels, f.showLabels, void 0 != g.labels || void 0, void 0 != f.labels || void 0]);
            var q = j.padding || 1;
            return j.padding = {
                left: this._get([q.left, isNaN(q) ? 1 : q]),
                right: this._get([q.right, isNaN(q) ? 1 : q]),
                top: this._get([q.top, isNaN(q) ? 1 : q]),
                bottom: this._get([q.bottom, isNaN(q) ? 1 : q])
            },
            j
        },
        _showLabel: function (a, b, c, d, e, f, g, h, i, j, k) {
            var l = this.seriesGroups[a]
              , m = (l.series[b],
            {
                width: 0,
                height: 0
            });
            if (!isNaN(c)) {
                var n = this._getLabelsSettings(a, b, c);
                if (!n.visible)
                    return g ? m : void 0;
                if (d.width < 0 || d.height < 0)
                    return g ? m : void 0;
                var o = n.angle;
                isNaN(j) || (o = j);
                var p = n.offset || {}
                  , q = {
                      x: p.x,
                      y: p.y
                  };
                isNaN(q.x) && (q.x = 0),
                isNaN(q.y) && (q.y = 0),
                e = e || n.horizontalAlignment || "center",
                f = f || n.verticalAlignment || "center";
                var r = this._getFormattedValue(a, b, c, void 0, void 0, !0)
                  , s = d.width
                  , t = d.height;
                if (1 == h && "center" != e && (e = "right" == e ? "left" : "right"),
                1 == i && "center" != f && "middle" != f && (f = "top" == f ? "bottom" : "top",
                q.y *= -1),
                m = this.renderer.measureText(r, o, {
                    class: n.class
                }),
                g)
                    return m;
                var u = 0
                  , v = 0;
                s > 0 && ("" == e || "center" == e ? u += (s - m.width) / 2 : "right" == e && (u += s - m.width)),
                t > 0 && ("" == f || "center" == f ? v += (t - m.height) / 2 : "bottom" == f && (v += t - m.height)),
                u += d.x + q.x,
                v += d.y + q.y;
                var w = this._plotRect;
                u <= w.x && (u = w.x + 2),
                v <= w.y && (v = w.y + 2);
                var x = {
                    width: Math.max(m.width, 1),
                    height: Math.max(m.height, 1)
                };
                v + x.height >= w.y + w.height && (v = w.y + w.height - x.height - 2),
                u + x.width >= w.x + w.width && (u = w.x + w.width - x.width - 2);
                var y, z = n.backgroundColor, A = n.borderColor, B = n.padding;
                if (z || A) {
                    y = this.renderer.beginGroup();
                    var d = this.renderer.rect(u - B.left, v - B.top, m.width + B.left + B.right, m.height + B.bottom + B.bottom, {
                        fill: z || "transparent",
                        "fill-opacity": n.backgroundOpacity || 1,
                        stroke: A || "transparent",
                        "stroke-opacity": n.borderOpacity,
                        "stroke-width": 1
                    })
                }
                var C = this.renderer.text(r, u, v, m.width, m.height, o, {
                    class: n.class,
                    opacity: n.opacity || 1
                }, !1, "center", "center");
                return k && (k.x = u - B.left,
                k.y = v - B.top,
                k.width = m.width + B.left + B.right,
                k.height = m.height + B.bottom + B.bottom),
                this._isVML && (this.renderer.removeElement(C),
                this.renderer.getContainer()[0].appendChild(C)),
                y && this.renderer.endGroup(),
                y || C
            }
        },
        _getAnimProps: function (a, b) {
            var c = this.seriesGroups[a]
              , d = isNaN(b) ? void 0 : c.series[b]
              , e = 1 == this.enableAnimations;
            c.enableAnimations && (e = 1 == c.enableAnimations),
            d && d.enableAnimations && (e = 1 == d.enableAnimations);
            var f = this.animationDuration;
            isNaN(f) && (f = 1e3);
            var g = c.animationDuration;
            if (isNaN(g) || (f = g),
            d) {
                var h = d.animationDuration;
                isNaN(h) || (f = h)
            }
            return f > 5e3 && (f = 1e3),
            {
                enabled: e,
                duration: f
            }
        },
        _isColorTransition: function (a, b, c, d) {
            if (d - 1 < c.xoffsets.first)
                return !1;
            var e = this._getColors(a, b, d, this._getGroupGradientType(a))
              , f = this._getColors(a, b, d - 1, this._getGroupGradientType(a));
            return e.fillColor != f.fillColor
        },
        _renderLineSeries: function (b, c) {
            var d = this.seriesGroups[b];
            if (d.series && 0 != d.series.length) {
                var e = -1 != d.type.indexOf("area")
                  , f = -1 != d.type.indexOf("stacked")
                  , g = f && -1 != d.type.indexOf("100")
                  , h = -1 != d.type.indexOf("spline")
                  , i = -1 != d.type.indexOf("step")
                  , j = -1 != d.type.indexOf("range")
                  , k = 1 == d.polar || 1 == d.spider;
                if (k && (i = !1),
                !i || !h) {
                    var l = this._getDataLen(b)
                      , m = (c.width,
                    "horizontal" == d.orientation)
                      , n = 1 == this._getXAxis(b).flip
                      , o = c;
                    m && (o = {
                        x: c.y,
                        y: c.x,
                        width: c.height,
                        height: c.width
                    });
                    var p = this._calcGroupOffsets(b, o);
                    if (p && 0 != p.xoffsets.length) {
                        this._linesRenderInfo || (this._linesRenderInfo = {}),
                        this._linesRenderInfo[b] = {};
                        for (var q = d.series.length - 1; q >= 0; q--) {
                            var r = this._getSerieSettings(b, q)
                              , s = {
                                  groupIndex: b,
                                  rect: o,
                                  serieIndex: q,
                                  swapXY: m,
                                  isArea: e,
                                  isSpline: h,
                                  isRange: j,
                                  isPolar: k,
                                  settings: r,
                                  segments: [],
                                  pointsLength: 0
                              };
                            if (this._isSerieVisible(b, q)) {
                                var t = d.series[q];
                                if (!t.customDraw) {
                                    var u, v = a.isFunction(t.colorFunction), w = p.xoffsets.first, x = w, y = this._getColors(b, q, NaN, this._getGroupGradientType(b));
                                    do {
                                        var z = []
                                          , A = []
                                          , B = []
                                          , C = 0
                                          , D = 0
                                          , E = NaN
                                          , F = NaN
                                          , G = NaN;
                                        if (!(p.xoffsets.length < 1)) {
                                            var H = this._getAnimProps(b, q)
                                              , I = H.enabled && !this._isToggleRefresh && p.xoffsets.length < 1e4 && 1 != this._isVML ? H.duration : 0
                                              , J = w;
                                            u = !1;
                                            for (var K = (this._getColors(b, q, w, this._getGroupGradientType(b)),
                                            void 0), L = w; L <= p.xoffsets.last; L++) {
                                                w = L;
                                                var M = p.xoffsets.data[L]
                                                  , N = p.xoffsets.xvalues[L];
                                                if (!isNaN(M) && (M = Math.max(M, 1),
                                                C = M,
                                                D = p.offsets[q][L].to,
                                                !(!v && K && this.enableSampling && a.jqx._ptdist(K.x, K.y, C, D) < 1))) {
                                                    K = {
                                                        x: C,
                                                        y: D
                                                    };
                                                    var O = p.offsets[q][L].from;
                                                    if (isNaN(D) || isNaN(O)) {
                                                        if ("connect" == t.emptyPointsDisplay)
                                                            continue;
                                                        if ("zero" != t.emptyPointsDisplay) {
                                                            u = !0;
                                                            break
                                                        }
                                                        isNaN(D) && (D = p.baseOffset),
                                                        isNaN(O) && (O = p.baseOffset)
                                                    }
                                                    if (v && this._isColorTransition(b, q, p, w) && z.length > 1) {
                                                        w--;
                                                        break
                                                    }
                                                    var P = this._elementRenderInfo;
                                                    if (P && P.length > b && P[b].series.length > q) {
                                                        var Q = P[b].series[q][N]
                                                          , G = a.jqx._ptrnd(Q ? Q.to : void 0)
                                                          , R = a.jqx._ptrnd(o.x + (Q ? Q.xoffset : void 0));
                                                        B.push(m ? {
                                                            y: R,
                                                            x: G,
                                                            index: L
                                                        } : {
                                                            x: R,
                                                            y: G,
                                                            index: L
                                                        })
                                                    }
                                                    x = L,
                                                    r.stroke < 2 && (D - o.y <= 1 && (D = o.y + 1),
                                                    O - o.y <= 1 && (O = o.y + 1),
                                                    o.y + o.height - D <= 1 && (D = o.y + o.height - 1),
                                                    o.y + o.height - O <= 1 && (O = o.y + o.height - 1)),
                                                    !e && g && (D <= o.y && (D = o.y + 1),
                                                    D >= o.y + o.height && (D = o.y + o.height - 1),
                                                    O <= o.y && (O = o.y + 1),
                                                    O >= o.y + o.height && (O = o.y + o.height - 1)),
                                                    M = Math.max(M, 1),
                                                    C = M + o.x,
                                                    1 == d.skipOverlappingPoints && !isNaN(E) && Math.abs(E - C) <= 1 || (!i || isNaN(E) || isNaN(F) || F != D && z.push(m ? {
                                                        y: C,
                                                        x: a.jqx._ptrnd(F)
                                                    } : {
                                                        x: C,
                                                        y: a.jqx._ptrnd(F)
                                                    }),
                                                    z.push(m ? {
                                                        y: C,
                                                        x: a.jqx._ptrnd(D),
                                                        index: L
                                                    } : {
                                                        x: C,
                                                        y: a.jqx._ptrnd(D),
                                                        index: L
                                                    }),
                                                    A.push(m ? {
                                                        y: C,
                                                        x: a.jqx._ptrnd(O),
                                                        index: L
                                                    } : {
                                                        x: C,
                                                        y: a.jqx._ptrnd(O),
                                                        index: L
                                                    }),
                                                    E = C,
                                                    F = D,
                                                    isNaN(G) && (G = D))
                                                }
                                            }
                                            if (0 != z.length) {
                                                var S = z[z.length - 1].index;
                                                v && (y = this._getColors(b, q, S, this._getGroupGradientType(b)));
                                                var T = o.x + p.xoffsets.data[J]
                                                  , U = o.x + p.xoffsets.data[x];
                                                if (e && 1 == d.alignEndPointsWithIntervals) {
                                                    if (T > o.x && (T = o.x),
                                                    U < o.x + o.width && (U = o.x + o.width),
                                                    n) {
                                                        var V = T;
                                                        T = U,
                                                        U = V
                                                    }
                                                }
                                                U = a.jqx._ptrnd(U),
                                                T = a.jqx._ptrnd(T);
                                                var W = p.baseOffset;
                                                G = a.jqx._ptrnd(G);
                                                var X = a.jqx._ptrnd(D) || W;
                                                j && (z = z.concat(A.reverse())),
                                                s.pointsLength += z.length;
                                                var Y = {
                                                    lastItemIndex: S,
                                                    colorSettings: y,
                                                    pointsArray: z,
                                                    pointsStart: B,
                                                    left: T,
                                                    right: U,
                                                    pyStart: G,
                                                    pyEnd: X,
                                                    yBase: W,
                                                    labelElements: [],
                                                    symbolElements: []
                                                };
                                                s.segments.push(Y)
                                            } else
                                                w++
                                        }
                                    } while (w < p.xoffsets.first + p.xoffsets.length - 1 || u); this._linesRenderInfo[b][q] = s
                                }
                            } else
                                this._linesRenderInfo[b][q] = s
                        }
                        var Z = this._linesRenderInfo[b]
                          , $ = [];
                        for (var L in Z)
                            $.push(Z[L]);
                        $ = $.sort(function (a, b) {
                            return a.serieIndex - b.serieIndex
                        }),
                        e && f && $.reverse();
                        for (var L = 0; L < $.length; L++) {
                            var s = $[L];
                            this._animateLine(s, 0 == I ? 1 : 0);
                            var _ = this;
                            this._enqueueAnimation("series", void 0, void 0, I, function (a, b, c) {
                                _._animateLine(b, c)
                            }, s)
                        }
                    }
                }
            }
        },
        _animateLine: function (a, b) {
            var c = a.settings
              , d = a.groupIndex
              , e = a.serieIndex
              , f = this.seriesGroups[d]
              , g = f.series[e]
              , h = this._getSymbol(d, e)
              , i = this._getLabelsSettings(d, e, NaN, ["Visible"]).visible
              , j = !0;
            a.isPolar && (isNaN(f.endAngle) || 360 == Math.round(Math.abs((isNaN(f.startAngle) ? 0 : f.startAngle) - f.endAngle)) || (j = !1));
            for (var k = 0, l = 0; l < a.segments.length; l++) {
                var m = a.segments[l]
                  , n = this._calculateLine(d, a.pointsLength, k, m.pointsArray, m.pointsStart, m.yBase, b, a.isArea, a.swapXY);
                if (k += m.pointsArray.length,
                "" != n) {
                    var o = n.split(" ")
                      , p = (o.length,
                    n);
                    p = "" != p ? this._buildLineCmd(n, a.isRange, m.left, m.right, m.pyStart, m.pyEnd, m.yBase, a.isArea, a.isPolar, j, a.isSpline, a.swapXY) : "M 0 0";
                    var q = m.colorSettings;
                    if (m.pathElement ? this.renderer.attr(m.pathElement, {
                        d: p
                    }) : (m.pathElement = this.renderer.path(p, {
                        "stroke-width": c.stroke,
                        stroke: q.lineColor,
                        "stroke-opacity": c.opacity,
                        "fill-opacity": c.opacity,
                        "stroke-dasharray": c.dashStyle,
                        fill: a.isArea ? q.fillColor : "none"
                    }),
                    this._installHandlers(m.pathElement, "path", d, e, m.lastItemIndex)),
                    m.labelElements) {
                        for (var r = 0; r < m.labelElements.length; r++)
                            this.renderer.removeElement(m.labelElements[r]);
                        m.labelElements = []
                    }
                    if (m.symbolElements) {
                        for (var r = 0; r < m.symbolElements.length; r++)
                            this.renderer.removeElement(m.symbolElements[r]);
                        m.symbolElements = []
                    }
                    if (m.pointsArray.length == o.length && ("none" != h || i))
                        for (var s = g.symbolSize, t = this._plotRect, r = 0; r < o.length; r++) {
                            var u = o[r].split(",");
                            if (u = {
                                x: parseFloat(u[0]),
                                y: parseFloat(u[1])
                            },
                            !(u.x < t.x || u.x > t.x + t.width || u.y < t.y || u.y > t.y + t.height)) {
                                if ("none" != h) {
                                    var v = this._getColors(d, e, m.pointsArray[r].index, this._getGroupGradientType(d))
                                      , w = this._drawSymbol(h, u.x, u.y, v.fillColorSymbol, c.opacity, v.lineColorSymbol, c.opacity, c.strokeSymbol, void 0, s);
                                    m.symbolElements.push(w)
                                }
                                if (i) {
                                    var x = (r > 0 ? o[r - 1] : o[r]).split(",");
                                    x = {
                                        x: parseFloat(x[0]),
                                        y: parseFloat(x[1])
                                    };
                                    var y = (r < o.length - 1 ? o[r + 1] : o[r]).split(",");
                                    if (y = {
                                        x: parseFloat(y[0]),
                                        y: parseFloat(y[1])
                                    },
                                    u = this._adjustLineLabelPosition(d, e, m.pointsArray[r].index, u, x, y)) {
                                        var z = this._showLabel(d, e, m.pointsArray[r].index, {
                                            x: u.x,
                                            y: u.y,
                                            width: 0,
                                            height: 0
                                        });
                                        m.labelElements.push(z)
                                    }
                                }
                            }
                        }
                    if (1 == b && "none" != h)
                        for (var r = 0; r < m.symbolElements.length; r++)
                            isNaN(m.pointsArray[r].index) || this._installHandlers(m.symbolElements[r], "symbol", d, e, m.pointsArray[r].index)
                }
            }
        },
        _adjustLineLabelPosition: function (a, b, c, d, e, f) {
            var g = this._showLabel(a, b, c, {
                width: 0,
                height: 0
            }, "", "", !0);
            if (g) {
                var h = {
                    x: d.x - g.width / 2,
                    y: 0
                };
                return h.y = d.y - 1.5 * g.height,
                h
            }
        },
        _calculateLine: function (b, c, d, e, f, g, h, i, j) {
            var k, l = this.seriesGroups[b];
            1 != l.polar && 1 != l.spider || (k = this._getPolarAxisCoords(b, this._plotRect));
            var m = ""
              , n = e.length;
            if (!i && 0 == f.length) {
                n = c * h - d
            }
            for (var o = 0; o < n + 1 && o < e.length; o++) {
                o > 0 && (m += " ");
                var p = e[o].y
                  , q = e[o].x
                  , r = i ? g : p
                  , s = q;
                if (f && f.length > o && (r = f[o].y,
                s = f[o].x,
                (isNaN(r) || isNaN(s)) && (r = p,
                s = q)),
                s,
                n <= e.length && o > 0 && o == n && (s = e[o - 1].x,
                r = e[o - 1].y),
                j ? (q = a.jqx._ptrnd((q - r) * (i ? h : 1) + r),
                p = a.jqx._ptrnd(p)) : (q = a.jqx._ptrnd((q - s) * h + s),
                p = a.jqx._ptrnd((p - r) * h + r)),
                k) {
                    var t = this._toPolarCoord(k, this._plotRect, q, p);
                    q = t.x,
                    p = t.y
                }
                m += q + "," + p
            }
            return m
        },
        _buildLineCmd: function (a, b, c, d, e, f, g, h, i, j, k, l) {
            var m = a
              , n = l ? g + "," + c : c + "," + g
              , o = l ? g + "," + d : d + "," + g;
            !h || i || b || (m = n + " " + a + " " + o),
            k && (m = this._getBezierPoints(m));
            var p = m.split(" ");
            if (0 == p.length)
                return "";
            if (1 == p.length) {
                var q = p[0].split(",");
                return "M " + p[0] + " L" + (parseFloat(q[0]) + 1) + "," + (parseFloat(q[1]) + 1)
            }
            var r = p[0].replace("M", "");
            return h && !i ? m = b ? "M " + r + " L " + r + (k ? "" : " L " + r + " ") + m : "M " + n + " L " + r + " " + m : k || (m = "M " + r + " L " + r + " " + m),
            (i && j || b) && (m += " Z"),
            m
        },
        _getSerieSettings: function (a, b) {
            var c = this.seriesGroups[a]
              , d = -1 != c.type.indexOf("area")
              , e = -1 != c.type.indexOf("line")
              , f = c.series[b]
              , g = f.dashStyle || c.dashStyle || ""
              , h = f.opacity || c.opacity;
            (isNaN(h) || h < 0 || h > 1) && (h = 1);
            var i = f.lineWidth;
            isNaN(i) && "auto" != i && (i = c.lineWidth),
            ("auto" == i || isNaN(i) || i < 0 || i > 15) && (i = d ? 2 : e ? 3 : 1);
            var j = f.lineWidthSymbol;
            return isNaN(j) && (j = 1),
            {
                stroke: i,
                strokeSymbol: j,
                opacity: h,
                dashStyle: g
            }
        },
        _getColors: function (b, c, d, e, f) {
            var g = this.seriesGroups[b]
              , h = g.series[c]
              , i = this._get([h.useGradientColors, g.useGradientColors, g.useGradient, !0])
              , j = this._getSeriesColors(b, c, d);
            j.fillColor || (j.fillColor = t,
            j.fillColorSelected = a.jqx.adjustColor(t, 1.1),
            j.fillColorAlt = a.jqx.adjustColor(t, 4),
            j.fillColorAltSelected = a.jqx.adjustColor(t, 3),
            j.lineColor = j.symbolColor = a.jqx.adjustColor(t, .9),
            j.lineColorSelected = j.symbolColorSelected = a.jqx.adjustColor(t, .9));
            var k = [[0, 1.4], [100, 1]]
              , l = [[0, 1], [25, 1.1], [50, 1.4], [100, 1]]
              , m = [[0, 1.3], [90, 1.2], [100, 1]]
              , n = NaN;
            if (isNaN(f) || (n = 2 == f ? k : l),
            i) {
                var o = {};
                for (var p in j)
                    o[p] = j[p];
                if (j = o,
                "verticalLinearGradient" == e || "horizontalLinearGradient" == e) {
                    var q = "verticalLinearGradient" == e ? n || k : n || l
                      , r = ["fillColor", "fillColorSelected", "fillColorAlt", "fillColorAltSelected"];
                    for (var s in r) {
                        var t = j[r[s]];
                        t && (j[r[s]] = this.renderer._toLinearGradient(t, "verticalLinearGradient" == e, q))
                    }
                } else if ("radialGradient" == e) {
                    var u, n = k;
                    ("pie" == g.type || "donut" == g.type || g.polar) && void 0 != d && this._renderData[b] && this._renderData[b].offsets[c] && (u = this._renderData[b].offsets[c][d],
                    n = m),
                    j.fillColor = this.renderer._toRadialGradient(j.fillColor, n, u),
                    j.fillColorSelected = this.renderer._toRadialGradient(j.fillColorSelected, n, u)
                }
            }
            return j
        },
        _installHandlers: function (a, b, c, d, e) {
            if (!this.enableEvents)
                return !1;
            var f = this
              , g = this.seriesGroups[c]
              , h = this.seriesGroups[c].series[d]
              , i = -1 != g.type.indexOf("line") || -1 != g.type.indexOf("area");
            i || 0 == g.enableSelection || 0 == h.enableSelection || (this.renderer.addHandler(a, "mousemove", function (a) {
                var b = f._selected;
                if (!b || !b.isLineType || "click" != b.linesUnselectMode || b.group == c && b.series == d) {
                    var g = a.pageX || a.clientX || a.screenX
                      , h = a.pageY || a.clientY || a.screenY
                      , i = f.host.offset();
                    g -= i.left,
                    h -= i.top,
                    f._mouseX == g && f._mouseY == h || f._ttEl && f._ttEl.gidx == c && f._ttEl.sidx == d && f._ttEl.iidx == e || f._startTooltipTimer(c, d, e)
                }
            }),
            this.renderer.addHandler(a, "mouseout", function (a) {
                return
            })),
            0 != g.enableSelection && 0 != h.enableSelection && this.renderer.addHandler(a, "mouseover", function (g) {
                var h = f._selected;
                h && h.isLineType && "click" == h.linesUnselectMode && (h.group != c || h.series != d) || f._select(a, b, c, d, e, e)
            }),
            this.renderer.addHandler(a, "click", function (a) {
                clearTimeout(f._hostClickTimer),
                f._lastClickTs = (new Date).valueOf(),
                i && "symbol" != b && "pointMarker" != b || (f._isColumnType(g.type) && f._unselect(),
                isNaN(e) || (a.stopImmediatePropagation(),
                f._raiseItemEvent("click", g, h, e)))
            })
        },
        _getHorizontalOffset: function (b, c, d, e) {
            var f = this._plotRect;
            if (0 == this._getDataLen(b))
                return {
                    index: void 0,
                    value: d
                };
            var g = this._calcGroupOffsets(b, this._plotRect);
            if (0 == g.xoffsets.length)
                return {
                    index: void 0,
                    value: void 0
                };
            var h, i = d, j = e, k = this.seriesGroups[b];
            (k.polar || k.spider) && (h = this._getPolarAxisCoords(b, f));
            for (var l, m, n, o, p = (this._getXAxis(b).flip,
            g.xoffsets.first) ; p <= g.xoffsets.last; p++) {
                var q = g.xoffsets.data[p]
                  , r = g.offsets[c][p].to
                  , s = 0;
                if (h) {
                    var t = this._toPolarCoord(h, f, q + f.x, r);
                    q = t.x,
                    r = t.y,
                    s = a.jqx._ptdist(i, j, q, r)
                } else if ("horizontal" == k.orientation) {
                    q += f.y;
                    var u = r;
                    r = q,
                    q = u,
                    s = a.jqx._ptdist(i, j, q, r)
                } else
                    q += f.x,
                    s = Math.abs(i - q);
                (isNaN(l) || l > s) && (l = s,
                m = p,
                n = q,
                o = r)
            }
            return {
                index: m,
                value: g.xoffsets.data[m],
                polarAxisCoords: h,
                x: n,
                y: o
            }
        },
        onmousemove: function (b, c) {
            if ((this._mouseX != b || this._mouseY != c) && (this._mouseX = b,
            this._mouseY = c,
            this._selected)) {
                var d = this._selected.group
                  , e = this._selected.series
                  , f = this.seriesGroups[d]
                  , g = f.series[e]
                  , h = this._plotRect;
                if (this.renderer && (h = this.renderer.getRect(),
                h.x += 5,
                h.y += 5,
                h.width -= 10,
                h.height -= 10),
                b < h.x || b > h.x + h.width || c < h.y || c > h.y + h.height)
                    return this._hideToolTip(),
                    void this._unselect();
                var i = "horizontal" == f.orientation
                  , h = this._plotRect;
                if (-1 != f.type.indexOf("line") || -1 != f.type.indexOf("area")) {
                    var j = this._getHorizontalOffset(d, this._selected.series, b, c)
                      , k = j.index;
                    if (void 0 == k)
                        return;
                    if (this._selected.item != k) {
                        for (var l = this._linesRenderInfo[d][e].segments, m = 0; k > l[m].lastItemIndex;)
                            if (++m >= l.length)
                                return;
                        var n = l[m].pathElement
                          , o = l[m].lastItemIndex;
                        this._unselect(!1),
                        this._select(n, "path", d, e, k, o)
                    }
                    var p = this._getSymbol(this._selected.group, this._selected.series);
                    "none" == p && (p = "circle");
                    var q = this._calcGroupOffsets(d, h)
                      , r = q.offsets[this._selected.series][k].to
                      , s = r;
                    -1 != f.type.indexOf("range") && (s = q.offsets[this._selected.series][k].from);
                    var t = i ? b : c;
                    if (c = !isNaN(s) && Math.abs(t - s) < Math.abs(t - r) ? s : r,
                    isNaN(c))
                        return;
                    if (b = j.value,
                    i) {
                        var u = b;
                        b = c,
                        c = u + h.y
                    } else
                        b += h.x;
                    if (j.polarAxisCoords && (b = j.x,
                    c = j.y),
                    c = a.jqx._ptrnd(c),
                    b = a.jqx._ptrnd(b),
                    this._pointMarker && this._pointMarker.element && (this.renderer.removeElement(this._pointMarker.element),
                    this._pointMarker.element = void 0),
                    isNaN(b) || isNaN(c))
                        return;
                    var v = this._getSeriesColors(d, e, k)
                      , w = this._getSerieSettings(d, e)
                      , x = g.symbolSizeSelected;
                    isNaN(x) && (x = g.symbolSize),
                    (isNaN(x) || x > 50 || x < 0) && (x = f.symbolSize),
                    (isNaN(x) || x > 50 || x < 0) && (x = 8),
                    (this.showToolTips || this.enableCrosshairs) && (this._pointMarker = {
                        type: p,
                        x: b,
                        y: c,
                        gidx: d,
                        sidx: e,
                        iidx: k
                    },
                    this._pointMarker.element = this._drawSymbol(p, b, c, v.fillColorSymbolSelected, w.opacity, v.lineColorSymbolSelected, w.opacity, w.strokeSymbol, w.dashStyle, x),
                    this._installHandlers(this._pointMarker.element, "pointMarker", d, e, k)),
                    this._startTooltipTimer(d, this._selected.series, k)
                }
            }
        },
        _drawSymbol: function (a, b, c, d, e, f, g, h, i, j) {
            var k, l = j || 6, m = l / 2;
            switch (a) {
                case "none":
                    return;
                case "circle":
                    k = this.renderer.circle(b, c, l / 2);
                    break;
                case "square":
                    l -= 1,
                    m = l / 2,
                    k = this.renderer.rect(b - m, c - m, l, l);
                    break;
                case "diamond":
                    var n = "M " + (b - m) + "," + c + " L" + b + "," + (c - m) + " L" + (b + m) + "," + c + " L" + b + "," + (c + m) + " Z";
                    k = this.renderer.path(n);
                    break;
                case "triangle_up":
                case "triangle":
                    var n = "M " + (b - m) + "," + (c + m) + " L " + (b + m) + "," + (c + m) + " L " + b + "," + (c - m) + " Z";
                    k = this.renderer.path(n);
                    break;
                case "triangle_down":
                    var n = "M " + (b - m) + "," + (c - m) + " L " + b + "," + (c + m) + " L " + (b + m) + "," + (c - m) + " Z";
                    k = this.renderer.path(n);
                    break;
                case "triangle_left":
                    var n = "M " + (b - m) + "," + c + " L " + (b + m) + "," + (c + m) + " L " + (b + m) + "," + (c - m) + " Z";
                    k = this.renderer.path(n);
                    break;
                case "triangle_right":
                    var n = "M " + (b - m) + "," + (c - m) + " L " + (b - m) + "," + (c + m) + " L " + (b + m) + "," + c + " Z";
                    k = this.renderer.path(n);
                    break;
                default:
                    k = this.renderer.circle(b, c, l)
            }
            return this.renderer.attr(k, {
                fill: d,
                "fill-opacity": e,
                stroke: f,
                "stroke-width": h,
                "stroke-opacity": g,
                "stroke-dasharray": i || ""
            }),
            "circle" != a && (this.renderer.attr(k, {
                r: l / 2
            }),
            "square" != a && this.renderer.attr(k, {
                x: b,
                y: c
            })),
            k
        },
        _getSymbol: function (a, b) {
            var c, d = ["circle", "square", "diamond", "triangle_up", "triangle_down", "triangle_left", "triangle_right"], e = this.seriesGroups[a], f = e.series[b];
            return void 0 != f.symbolType && (c = f.symbolType),
            void 0 == c && (c = e.symbolType),
            "default" == c ? d[b % d.length] : void 0 != c ? c : "none"
        },
        _startTooltipTimer: function (a, b, c, d, e, f, g) {
            this._cancelTooltipTimer();
            var h = this
              , i = (h.seriesGroups[a],
            this.toolTipShowDelay || this.toolTipDelay);
            (isNaN(i) || i > 1e4 || i < 0) && (i = 500),
            (this._ttEl || 1 == this.enableCrosshairs && 0 == this.showToolTips) && (i = 0),
            isNaN(f) || (i = f),
            clearTimeout(this._tttimerHide),
            isNaN(d) && (d = h._mouseX),
            isNaN(e) && (e = h._mouseY - 3),
            0 == i && h._showToolTip(d, e, a, b, c),
            this._tttimer = setTimeout(function () {
                0 != i && h._showToolTip(d, e, a, b, c);
                var f = h.toolTipHideDelay;
                isNaN(g) || (f = g),
                isNaN(f) && (f = 4e3),
                h._tttimerHide = setTimeout(function () {
                    h._hideToolTip(),
                    h._unselect()
                }, f)
            }, i)
        },
        _cancelTooltipTimer: function () {
            clearTimeout(this._tttimer)
        },
        _getGroupGradientType: function (a) {
            var b = this.seriesGroups[a];
            return -1 != b.type.indexOf("area") ? "horizontal" == b.orientation ? "horizontalLinearGradient" : "verticalLinearGradient" : this._isColumnType(b.type) || -1 != b.type.indexOf("candle") ? b.polar ? "radialGradient" : "horizontal" == b.orientation ? "verticalLinearGradient" : "horizontalLinearGradient" : -1 != b.type.indexOf("scatter") || -1 != b.type.indexOf("bubble") || this._isPieGroup(a) ? "radialGradient" : void 0
        },
        _select: function (a, b, c, d, e, f) {
            if (this._selected) {
                if (this._selected.item == e && this._selected.series == d && this._selected.group == c)
                    return;
                this._unselect()
            }
            var g = this.seriesGroups[c]
              , h = g.series[d];
            if (0 != g.enableSelection && 0 != h.enableSelection) {
                var i = -1 != g.type.indexOf("line") && -1 == g.type.indexOf("area");
                this._selected = {
                    element: a,
                    type: b,
                    group: c,
                    series: d,
                    item: e,
                    iidxBase: f,
                    isLineType: i,
                    linesUnselectMode: h.linesUnselectMode || g.linesUnselectMode
                };
                var j = this._getColors(c, d, f || e, this._getGroupGradientType(c))
                  , k = j.fillColorSelected;
                i && (k = "none");
                var l = this._getSerieSettings(c, d)
                  , m = "symbol" == b ? j.lineColorSymbolSelected : j.lineColorSelected;
                k = "symbol" == b ? j.fillColorSymbolSelected : k;
                var n = "symbol" == b ? 1 : l.stroke;
                this.renderer.getAttr(a, "fill") == j.fillColorAlt && (k = j.fillColorAltSelected),
                this.renderer.attr(a, {
                    stroke: m,
                    fill: k,
                    "stroke-width": n
                }),
                -1 == g.type.indexOf("pie") && -1 == g.type.indexOf("donut") || this._applyPieSelect(),
                this._raiseItemEvent("mouseover", g, h, e)
            }
        },
        _applyPieSelect: function () {
            var a = this;
            a._createAnimationGroup("animPieSlice");
            var b = this._selected;
            if (b) {
                var c = this.getItemCoord(b.group, b.series, b.item);
                if (c) {
                    var d = this._getRenderInfo(b.group, b.series, b.item)
                      , e = {
                          element: d,
                          coord: c
                      };
                    this._enqueueAnimation("animPieSlice", void 0, void 0, 300, function (c, d, e) {
                        var f = d.coord
                          , g = f.selectedRadiusChange * e
                          , h = a.renderer.pieSlicePath(f.center.x, f.center.y, 0 == f.innerRadius ? 0 : f.innerRadius + g, f.outerRadius + g, f.fromAngle, f.toAngle, f.centerOffset);
                        a.renderer.attr(d.element.element, {
                            d: h
                        }),
                        a._showPieLabel(b.group, b.series, b.item, void 0, g)
                    }, e),
                    a._startAnimation("animPieSlice")
                }
            }
        },
        _applyPieUnselect: function () {
            this._stopAnimations();
            var a = this._selected;
            if (a) {
                var b = this.getItemCoord(a.group, a.series, a.item);
                if (b && b.center) {
                    var c = this.renderer.pieSlicePath(b.center.x, b.center.y, b.innerRadius, b.outerRadius, b.fromAngle, b.toAngle, b.centerOffset);
                    this.renderer.attr(a.element, {
                        d: c
                    }),
                    this._showPieLabel(a.group, a.series, a.item, void 0, 0)
                }
            }
        },
        _unselect: function () {
            var a = this;
            if (a._selected) {
                var b = a._selected.group
                  , c = a._selected.series
                  , d = a._selected.item
                  , e = a._selected.iidxBase
                  , f = a._selected.type
                  , g = a.seriesGroups[b]
                  , h = g.series[c]
                  , i = -1 != g.type.indexOf("line") && -1 == g.type.indexOf("area")
                  , j = a._getColors(b, c, e || d, a._getGroupGradientType(b))
                  , k = j.fillColor;
                i && (k = "none");
                var l = a._getSerieSettings(b, c)
                  , m = "symbol" == f ? j.lineColorSymbol : j.lineColor;
                k = "symbol" == f ? j.fillColorSymbol : k,
                this.renderer.getAttr(a._selected.element, "fill") == j.fillColorAltSelected && (k = j.fillColorAlt);
                var n = "symbol" == f ? 1 : l.stroke;
                a.renderer.attr(a._selected.element, {
                    stroke: m,
                    fill: k,
                    "stroke-width": n
                }),
                -1 == g.type.indexOf("pie") && -1 == g.type.indexOf("donut") || this._applyPieUnselect(),
                a._selected = void 0,
                isNaN(d) || a._raiseItemEvent("mouseout", g, h, d)
            }
            a._pointMarker && (a._pointMarker.element && (a.renderer.removeElement(a._pointMarker.element),
            a._pointMarker.element = void 0),
            a._pointMarker = void 0,
            a._hideCrosshairs())
        },
        _raiseItemEvent: function (b, c, d, e) {
            for (var f = d[b] || c[b], g = 0; g < this.seriesGroups.length && this.seriesGroups[g] != c; g++)
                ;
            if (g != this.seriesGroups.length) {
                var h = {
                    event: b,
                    seriesGroup: c,
                    serie: d,
                    elementIndex: e,
                    elementValue: this._getDataValue(e, d.dataField, g)
                };
                f && a.isFunction(f) && f(h),
                this._raiseEvent(b, h)
            }
        },
        _raiseEvent: function (b, c) {
            var d = new a.Event(b);
            return d.owner = this,
            c.event = b,
            d.args = c,
            this.host.trigger(d)
        },
        _calcInterval: function (a, b, c) {
            var d = Math.abs(b - a)
              , e = d / c
              , f = [1, 2, 3, 4, 5, 10, 15, 20, 25, 50, 100]
              , g = [.5, .25, .125, .1]
              , h = .1
              , i = f;
            e < 1 && (i = g,
            h = 10);
            var j = 0;
            do {
                j = 0,
                e >= 1 ? h *= 10 : h /= 10;
                for (var k = 1; k < i.length && Math.abs(i[j] * h - e) > Math.abs(i[k] * h - e) ; k++)
                    j = k
            } while (j == i.length - 1); return i[j] * h
        },
        _renderDataClone: function () {
            if (this._renderData && !this._isToggleRefresh) {
                var a = this._elementRenderInfo = [];
                if (!this._isSelectorRefresh)
                    for (var b = 0; b < this._renderData.length; b++) {
                        for (this._getXAxis(b).dataField; a.length <= b;)
                            a.push({});
                        var c = a[b]
                          , d = this._renderData[b];
                        if (d.offsets) {
                            if (d.valueAxis) {
                                c.valueAxis = {
                                    itemOffsets: {}
                                };
                                for (var e in d.valueAxis.itemOffsets)
                                    c.valueAxis.itemOffsets[e] = d.valueAxis.itemOffsets[e]
                            }
                            if (d.xAxis) {
                                c.xAxis = {
                                    itemOffsets: {}
                                };
                                for (var e in d.xAxis.itemOffsets)
                                    c.xAxis.itemOffsets[e] = d.xAxis.itemOffsets[e]
                            }
                            c.series = [];
                            for (var f = c.series, g = this._isPieGroup(b), h = 0; h < d.offsets.length; h++) {
                                f.push({});
                                for (var i = 0; i < d.offsets[h].length; i++)
                                    if (g) {
                                        var j = d.offsets[h][i];
                                        f[h][j.displayValue] = {
                                            value: j.value,
                                            x: j.x,
                                            y: j.y,
                                            fromAngle: j.fromAngle,
                                            toAngle: j.toAngle
                                        }
                                    } else
                                        f[h][d.xoffsets.xvalues[i]] = {
                                            value: d.offsets[h][i].value,
                                            valueRadius: d.offsets[h][i].valueRadius,
                                            xoffset: d.xoffsets.data[i],
                                            from: d.offsets[h][i].from,
                                            to: d.offsets[h][i].to
                                        }
                            }
                        }
                    }
            }
        },
        getPolarDataPointOffset: function (a, b, c) {
            var d = this._renderData[c];
            if (!d)
                return {
                    x: NaN,
                    y: NaN
                };
            var e = this.getValueAxisDataPointOffset(b, c)
              , f = this.getXAxisDataPointOffset(a, c)
              , g = this._toPolarCoord(d.polarCoords, d.xAxis.rect, f, e);
            return {
                x: g.x,
                y: g.y
            }
        },
        _getDataPointOffsetDiff: function (a, b, c, d, e, f, g) {
            var h = this._getDataPointOffset(a, c, d, e, f, g)
              , i = this._getDataPointOffset(b, c, d, e, f, g);
            return Math.abs(h - i)
        },
        _getXAxisRenderData: function (a) {
            if (!(a >= this._renderData.length)) {
                var b = this.seriesGroups[a]
                  , c = this._renderData[a].xAxis;
                if (c) {
                    if (void 0 == b.xAxis) {
                        for (var d = 0; d <= a && void 0 != this.seriesGroups[d].xAxis; d++)
                            ;
                        c = this._renderData[d].xAxis
                    }
                    return c
                }
            }
        },
        getXAxisDataPointOffset: function (a, b) {
            var c = this.seriesGroups[b];
            if (isNaN(a))
                return NaN;
            if (renderData = this._getXAxisRenderData(b),
            !renderData)
                return NaN;
            var d = renderData.data.axisStats
              , e = d.min.valueOf()
              , f = d.max.valueOf()
              , g = f - e;
            if (0 == g && (g = 1),
            a.valueOf() > f || a.valueOf() < e)
                return NaN;
            var h = this._getXAxis(b)
              , i = "horizontal" == c.orientation ? "height" : "width"
              , j = "horizontal" == c.orientation ? "y" : "x"
              , k = (a.valueOf() - e) / g
              , l = renderData.rect[i] - renderData.data.padding.left - renderData.data.padding.right;
            if (c.polar || c.spider) {
                this._renderData[b].polarCoords.isClosedCircle && (l = renderData.data.axisSize)
            }
            return this._plotRect[j] + renderData.data.padding.left + l * (h.flip ? 1 - k : k)
        },
        getValueAxisDataPointOffset: function (a, b) {
            var c = this._getValueAxis(b);
            if (!c)
                return NaN;
            var d = this._renderData[b];
            if (!d)
                return NaN;
            var e = 1 == c.flip
              , f = d.logBase
              , g = d.scale
              , h = d.gbase
              , i = d.baseOffset;
            return this._getDataPointOffset(a, h, f, g, i, e)
        },
        _getDataPointOffset: function (b, c, d, e, f, g) {
            var h;
            return isNaN(b) && (b = c),
            h = isNaN(d) ? (b - c) * e : (a.jqx.log(b, d) - a.jqx.log(c, d)) * e,
            this._isVML && (h = Math.round(h)),
            h = g ? f + h : f - h
        },
        _calcGroupOffsets: function (b, c) {
            for (var d = this.seriesGroups[b]; this._renderData.length < b + 1;)
                this._renderData.push({});
            if (null != this._renderData[b] && void 0 != this._renderData[b].offsets)
                return this._renderData[b];
            if (this._isPieGroup(b))
                return this._calcPieSeriesGroupOffsets(b, c);
            var e = this._getValueAxis(b);
            if (!e || !d.series || 0 == d.series.length)
                return this._renderData[b];
            var f = 1 == e.flip
              , g = 1 == e.logarithmicScale
              , h = e.logarithmicScaleBase || 10
              , i = []
              , j = -1 != d.type.indexOf("stacked")
              , k = j && -1 != d.type.indexOf("100")
              , l = -1 != d.type.indexOf("range")
              , m = this._isColumnType(d.type)
              , n = -1 != d.type.indexOf("waterfall")
              , o = this._getDataLen(b)
              , p = d.baselineValue || e.baselineValue || 0;
            k && (p = 0);
            var q = this._stats.seriesGroups[b];
            if (q && q.isValid) {
                var r = q.hasStackValueReversal;
                if (r && (p = 0),
                n && j) {
                    if (r)
                        return;
                    p = q.base
                }
                p > q.max && (p = q.max),
                p < q.min && (p = q.min);
                var s = k || g ? q.maxRange : q.max - q.min
                  , t = q.min
                  , u = q.max
                  , v = c.height / (g ? q.intervals : s)
                  , w = 0;
                k ? t * u < 0 ? (s /= 2,
                w = -(s + p) * v) : w = -p * v : w = -(p - t) * v,
                f ? w = c.y - w : w += c.y + c.height;
                var x, y = [], z = [], A = [];
                g && (x = a.jqx.log(u, h) - a.jqx.log(p, h),
                j && (x = q.intervals,
                p = k ? 0 : t),
                q.intervals - x,
                f || (w = c.y + x / q.intervals * c.height)),
                w = a.jqx._ptrnd(w);
                var B = t * u < 0 ? c.height / 2 : c.height
                  , C = []
                  , D = []
                  , E = j && (m || g)
                  , F = [];
                i = new Array(d.series.length);
                for (var G = 0; G < d.series.length; G++)
                    i[G] = new Array(o);
                for (var H = 0; H < o; H++) {
                    !n && j && (D = []);
                    for (var G = 0; G < d.series.length; G++) {
                        !j && g && (C = []);
                        var I = d.series[G]
                          , J = I.dataField
                          , K = I.dataFieldFrom
                          , L = I.dataFieldTo
                          , M = I.radiusDataField || I.sizeDataField;
                        i[G][H] = {};
                        var N = this._isSerieVisible(b, G);
                        if (-1 == d.type.indexOf("candle") && -1 == d.type.indexOf("ohlc")) {
                            if (j)
                                for (; D.length <= H;)
                                    D.push(0);
                            var O = NaN;
                            l && (O = this._getDataValueAsNumber(H, K, b),
                            isNaN(O) && (O = p));
                            var P = NaN;
                            P = l ? this._getDataValueAsNumber(H, L, b) : this._getDataValueAsNumber(H, J, b);
                            var Q = this._getDataValueAsNumber(H, M, b);
                            if (j && (D[H] += N ? P : 0),
                            N || (P = NaN),
                            isNaN(P) || g && P <= 0)
                                i[G][H] = {
                                    from: void 0,
                                    to: void 0
                                };
                            else {
                                var R;
                                j && (E ? R = P >= p ? y : z : P = D[H]);
                                var S = v * (P - p);
                                if (l && (S = v * (P - O)),
                                j && E && (F[H] ? S = v * P : (F[H] = !0,
                                S = v * (P - p))),
                                g) {
                                    for (; C.length <= H;)
                                        C.push({
                                            p: {
                                                value: 0,
                                                height: 0
                                            },
                                            n: {
                                                value: 0,
                                                height: 0
                                            }
                                        });
                                    var T = l || l ? O : p
                                      , U = P > T ? C[H].p : C[H].n;
                                    U.value += P,
                                    k ? (P = U.value / (q.psums[H] + q.nsums[H]) * 100,
                                    S = (a.jqx.log(P, h) - q.minPow) * v) : (S = a.jqx.log(U.value, h) - a.jqx.log(T, h),
                                    S *= v),
                                    S -= U.height,
                                    U.height += S
                                }
                                var V = w;
                                if (l) {
                                    var W = 0;
                                    W = g ? (a.jqx.log(O, h) - a.jqx.log(p, h)) * v : (O - p) * v,
                                    V += f ? W : -W
                                }
                                if (j) {
                                    if (k && !g) {
                                        var X = q.psums[H] - q.nsums[H];
                                        P > p ? (S = q.psums[H] / X * B,
                                        0 != q.psums[H] && (S *= P / q.psums[H])) : (S = q.nsums[H] / X * B,
                                        0 != q.nsums[H] && (S *= P / q.nsums[H]))
                                    }
                                    E && (isNaN(R[H]) && (R[H] = V),
                                    V = R[H])
                                }
                                isNaN(A[H]) && (A[H] = 0);
                                var Y = A[H];
                                S = Math.abs(S);
                                var Z = S;
                                if (S >= 1 && (h_new = this._isVML ? Math.round(S) : a.jqx._ptrnd(S) - 1,
                                S = Math.abs(S - h_new) > .5 ? Math.round(S) : h_new),
                                Y += S - Z,
                                j || (Y = 0),
                                Math.abs(Y) > .5 && (Y > 0 ? (S -= 1,
                                Y -= 1) : (S += 1,
                                Y += 1)),
                                A[H] = Y,
                                G == d.series.length - 1 && k) {
                                    for (var $ = 0, _ = 0; _ < G; _++)
                                        $ += Math.abs(i[_][H].to - i[_][H].from);
                                    if (($ += S) < B)
                                        if (S > .5)
                                            S = a.jqx._ptrnd(S + B - $);
                                        else
                                            for (var _ = G - 1; _ >= 0;) {
                                                var aa = Math.abs(i[_][H].to - i[_][H].from);
                                                if (aa > 1) {
                                                    i[_][H].from > i[_][H].to && (i[_][H].from += B - $);
                                                    break
                                                }
                                                _--
                                            }
                                }
                                f && (S *= -1);
                                var ba = P < p;
                                l && (ba = O > P);
                                var ca = isNaN(O) ? P : {
                                    from: O,
                                    to: P
                                };
                                ba ? (E && (R[H] += S),
                                i[G][H] = {
                                    from: V,
                                    to: V + S,
                                    value: ca,
                                    valueRadius: Q
                                }) : (E && (R[H] -= S),
                                i[G][H] = {
                                    from: V,
                                    to: V - S,
                                    value: ca,
                                    valueRadius: Q
                                })
                            }
                        } else {
                            var da = ["Open", "Close", "High", "Low"];
                            for (var ea in da) {
                                var fa = "dataField" + da[ea];
                                I[fa] && (i[G][H][da[ea]] = this._getDataPointOffset(this._getDataValueAsNumber(H, I[fa], b), p, g ? h : NaN, v, w, f))
                            }
                        }
                    }
                }
                var ga = this._renderData[b];
                return ga.baseOffset = w,
                ga.gbase = p,
                ga.logBase = g ? h : NaN,
                ga.scale = v,
                ga.offsets = n ? this._applyWaterfall(i, o, b, w, p, g ? h : NaN, v, f, j) : i,
                ga.xoffsets = this._calculateXOffsets(b, c.width),
                this._renderData[b]
            }
        },
        _isPercent: function (a) {
            return "string" == typeof a && a.length > 0 && a.indexOf("%") == a.length - 1
        },
        _calcPieSeriesGroupOffsets: function (b, c) {
            for (var d = this, e = this._getDataLen(b), f = this.seriesGroups[b], g = this._renderData[b] = {}, h = g.offsets = [], i = 0; i < f.series.length; i++) {
                var j = f.series[i]
                  , k = this._get([j.minAngle, j.startAngle]);
                (isNaN(k) || k < 0 || k > 360) && (k = 0);
                var l = this._get([j.maxAngle, j.endAngle]);
                (isNaN(l) || l < 0 || l > 360) && (l = 360);
                var m = l - k
                  , n = j.initialAngle || 0;
                n < k && (n = k),
                n > l && (n = l);
                var o = j.centerOffset || 0
                  , p = a.jqx.getNum([j.offsetX, f.offsetX, c.width / 2])
                  , q = a.jqx.getNum([j.offsetY, f.offsetY, c.height / 2])
                  , r = Math.min(c.width, c.height) / 2
                  , s = n
                  , t = j.radius;
                d._isPercent(t) && (t = parseFloat(t) / 100 * r),
                isNaN(t) && (t = .4 * r);
                var u = j.innerRadius;
                d._isPercent(u) && (u = parseFloat(u) / 100 * r),
                (isNaN(u) || u >= t) && (u = 0);
                var v = j.selectedRadiusChange;
                d._isPercent(v) && (v = parseFloat(v) / 100 * (t - u)),
                isNaN(v) && (v = .1 * (t - u)),
                h.push([]);
                for (var w = 0, x = 0, y = 0; y < e; y++) {
                    var z = this._getDataValueAsNumber(y, j.dataField, b);
                    isNaN(z) || (this._isSerieVisible(b, i, y) || 1 == j.hiddenPointsDisplay) && (z > 0 ? w += z : x += z)
                }
                var A = w - x;
                0 == A && (A = 1);
                for (var y = 0; y < e; y++) {
                    var z = this._getDataValueAsNumber(y, j.dataField, b);
                    if (isNaN(z))
                        h[i].push({});
                    else {
                        var B = j.displayText || j.displayField
                          , C = this._getDataValue(y, B, b);
                        void 0 == C && (C = y);
                        var D = 0
                          , E = this._isSerieVisible(b, i, y);
                        (E || 1 == j.hiddenPointsDisplay) && (D = Math.abs(z) / A * m);
                        var F = c.x + p
                          , G = c.y + q
                          , H = o;
                        a.isFunction(o) && (H = o({
                            seriesIndex: i,
                            seriesGroupIndex: b,
                            itemIndex: y
                        })),
                        isNaN(H) && (H = 0);
                        var I = {
                            key: b + "_" + i + "_" + y,
                            value: z,
                            displayValue: C,
                            x: F,
                            y: G,
                            fromAngle: s,
                            toAngle: s + D,
                            centerOffset: H,
                            innerRadius: u,
                            outerRadius: t,
                            selectedRadiusChange: v,
                            visible: E
                        };
                        h[i].push(I),
                        s += D
                    }
                }
            }
            return g
        },
        _isPointSeriesOnly: function () {
            for (var a = 0; a < this.seriesGroups.length; a++) {
                var b = this.seriesGroups[a];
                if (-1 == b.type.indexOf("line") && -1 == b.type.indexOf("area") && -1 == b.type.indexOf("scatter") && -1 == b.type.indexOf("bubble"))
                    return !1
            }
            return !0
        },
        _hasColumnSeries: function () {
            for (var a = ["column", "ohlc", "candlestick", "waterfall"], b = 0; b < this.seriesGroups.length; b++) {
                var c = this.seriesGroups[b];
                for (var d in a)
                    if (-1 != c.type.indexOf(a[d]))
                        return !0
            }
            return !1
        },
        _alignValuesWithTicks: function (a) {
            var b = this._isPointSeriesOnly()
              , c = this.seriesGroups[a]
              , d = this._getXAxis(a)
              , e = void 0 == d.valuesOnTicks ? b : 0 != d.valuesOnTicks;
            return d.logarithmicScale && (e = !0),
            void 0 == a ? e : void 0 == c.valuesOnTicks ? e : c.valuesOnTicks
        },
        _getYearsDiff: function (a, b) {
            return b.getFullYear() - a.getFullYear()
        },
        _getMonthsDiff: function (a, b) {
            return 12 * (b.getFullYear() - a.getFullYear()) + b.getMonth() - a.getMonth()
        },
        _getDateDiff: function (b, c, d, e) {
            var f = 0;
            switch ("year" != d && "month" != d && (f = c.valueOf() - b.valueOf()),
            d) {
                case "year":
                    f = this._getYearsDiff(b, c);
                    break;
                case "month":
                    f = this._getMonthsDiff(b, c);
                    break;
                case "day":
                    f /= 864e5;
                    break;
                case "hour":
                    f /= 36e5;
                    break;
                case "minute":
                    f /= 6e4;
                    break;
                case "second":
                    f /= 1e3
            }
            return "year" != d && "month" != d && 0 != e && (f = a.jqx._rnd(f, 1, !0)),
            f
        },
        _getBestDTUnit: function (a, b, c, d, e) {
            var f = "day"
              , g = b.valueOf() - a.valueOf();
            f = g < 1e3 ? "second" : g < 36e5 ? "minute" : g < 864e5 ? "hour" : g < 2592e6 ? "day" : g < 31104e6 ? "month" : "year";
            for (var h = [{
                key: "year",
                cnt: g / 31536e6
            }, {
                key: "month",
                cnt: g / 2592e6
            }, {
                key: "day",
                cnt: g / 864e5
            }, {
                key: "hour",
                cnt: g / 36e5
            }, {
                key: "minute",
                cnt: g / 6e4
            }, {
                key: "second",
                cnt: g / 1e3
            }, {
                key: "millisecond",
                cnt: g
            }], i = -1, j = 0; j < h.length; j++)
                if (h[j].key == f) {
                    i = j;
                    break
                }
            for (var k = -1, l = -1; i < h.length && !(h[i].cnt / 100 > d) ; i++) {
                var m = this._estAxisInterval(a, b, c, d, h[i].key, e)
                  , n = this._getDTIntCnt(a, b, m, h[i].key);
                (-1 == k || k < n) && (k = n,
                l = i)
            }
            return f = h[l].key
        },
        _getXAxisStats: function (b, c, d) {
            var e = this._getDataLen(b)
              , f = "date" == c.type || "time" == c.type;
            if (f && !this._autoDateFormats) {
                this._autoDateFormats || (this._autoDateFormats = []);
                var g = this._testXAxisDateFormat();
                g && this._autoDateFormats.push(g)
            }
            var h = f ? this._castAsDate(c.minValue, c.dateFormat) : this._castAsNumber(c.minValue)
              , i = f ? this._castAsDate(c.maxValue, c.dateFormat) : this._castAsNumber(c.maxValue);
            if (this._selectorRange && this._selectorRange[b]) {
                var j = this._selectorRange[b].min;
                isNaN(j) || (h = f ? this._castAsDate(j, c.dateFormat) : this._castAsNumber(j));
                var k = this._selectorRange[b].max;
                isNaN(k) || (i = f ? this._castAsDate(k, c.dateFormat) : this._castAsNumber(k))
            }
            for (var l, m, n = h, o = i, p = void 0 == c.type || "auto" == c.type, q = p || "basic" == c.type, r = 0, s = 0, t = 0; t < e && c.dataField; t++) {
                var u = this._getDataValue(t, c.dataField, b);
                u = f ? this._castAsDate(u, c.dateFormat) : this._castAsNumber(u),
                isNaN(u) || (f ? r++ : s++,
                (isNaN(l) || u < l) && (l = u),
                (isNaN(m) || u >= m) && (m = u))
            }
            p && (!f && s == e || f && r == e) && (q = !1),
            q && (l = 0,
            m = Math.max(0, e - 1)),
            isNaN(n) && (n = l),
            isNaN(o) && (o = m),
            f ? (this._isDate(n) || (n = this._isDate(o) ? o : new Date),
            this._isDate(o) || (o = this._isDate(n) ? n : new Date)) : (isNaN(n) && (n = 0),
            isNaN(o) && (o = q ? Math.max(0, e - 1) : n)),
            void 0 == l && (l = n),
            void 0 == m && (m = o);
            var v = c.rangeSelector;
            if (v) {
                var w = v.minValue || n;
                w && f && (w = this._castAsDate(w, v.dateFormat || c.dateFormat));
                var x = v.maxValue || o;
                x && f && (x = this._castAsDate(x, v.dateFormat || c.rangeSelector)),
                n < w && (n = w),
                o < w && (o = x),
                n > x && (n = w),
                o > x && (o = x)
            }
            var y, z, A = c.unitInterval;
            f && (y = c.baseUnit,
            y || (y = this._getBestDTUnit(n, o, b, d)),
            z = "hour" == y || "minute" == y || "second" == y || "millisecond" == y);
            var B = 1 == c.logarithmicScale
              , C = c.logarithmicScaleBase;
            (isNaN(C) || C <= 1) && (C = 10);
            var A = c.unitInterval;
            B ? A = 1 : (isNaN(A) || A <= 0) && (A = this._estAxisInterval(n, o, b, d, y));
            var D = {
                min: n,
                max: o
            }
              , E = this.seriesGroups[b];
            if (B) {
                n || (n = 1,
                o && n > o && (n = o)),
                o || (o = n),
                D = {
                    min: n,
                    max: o
                };
                var F = a.jqx._rnd(a.jqx.log(n, C), 1, !1)
                  , G = a.jqx._rnd(a.jqx.log(o, C), 1, !0);
                o = Math.pow(C, G),
                n = Math.pow(C, F)
            } else
                f || !E.polar && !E.spider || (n = a.jqx._rnd(n, A, !1),
                o = a.jqx._rnd(o, A, !0));
            return {
                min: n,
                max: o,
                logAxis: {
                    enabled: B,
                    base: C,
                    minPow: F,
                    maxPow: G
                },
                dsRange: {
                    min: l,
                    max: m
                },
                filterRange: D,
                useIndeces: q,
                isDateTime: f,
                isTimeUnit: z,
                dateTimeUnit: y,
                interval: A
            }
        },
        _getDefaultDTFormatFn: function (a) {
            var b = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return "year" == a || "month" == a || "day" == a ? function (a) {
                return a.getDate() + "-" + b[a.getMonth()] + "-" + a.getFullYear()
            }
            : function (a) {
                return a.getDate() + "-" + b[a.getMonth()] + "-" + a.getFullYear() + "<br>" + a.getHours() + ":" + a.getMinutes() + ":" + a.getSeconds()
            }
        },
        _getDTIntCnt: function (a, b, c, d) {
            var e = 0
              , f = new Date(a)
              , g = new Date(b);
            if (g = g.valueOf(),
            c <= 0)
                return 1;
            for (; f.valueOf() < g;)
                "millisecond" == d ? f = new Date(f.valueOf() + c) : "second" == d ? f = new Date(f.valueOf() + 1e3 * c) : "minute" == d ? f = new Date(f.valueOf() + 6e4 * c) : "hour" == d ? f = new Date(f.valueOf() + 6e4 * c * 24) : "day" == d ? f.setDate(f.getDate() + c) : "month" == d ? f.setMonth(f.getMonth() + c) : "year" == d && f.setFullYear(f.getFullYear() + c),
                e++;
            return e
        },
        _estAxisInterval: function (a, b, c, d, e, f) {
            if (isNaN(a) || isNaN(b))
                return NaN;
            var g = [1, 2, 5, 10, 15, 20, 50, 100, 200, 500]
              , h = 0
              , i = d / (!isNaN(f) && f > 0 ? f : 50);
            if (this._renderData && this._renderData.length > c && this._renderData[c].xAxis && !isNaN(this._renderData[c].xAxis.avgWidth)) {
                var j = Math.max(1, this._renderData[c].xAxis.avgWidth);
                0 != j && isNaN(f) && (i = .9 * d / j)
            }
            if (i <= 1)
                return Math.abs(b - a);
            for (; ;) {
                var k = h >= g.length ? Math.pow(10, 3 + h - g.length) : g[h];
                if ((this._isDate(a) && this._isDate(b) ? this._getDTIntCnt(a, b, k, e) : (b - a) / k) <= i)
                    break;
                h++
            }
            var l = this.seriesGroups[c];
            return (l.spider || l.polar) && 2 * k > b - a && (k = b - a),
            k
        },
        _getPaddingSize: function (a, b, c, d, e, f, g) {
            var h = a.min
              , i = a.max;
            a.logAxis.enabled && (h = a.logAxis.minPow,
            i = a.logAxis.maxPow);
            var j = a.interval
              , k = a.dateTimeUnit;
            if (e) {
                var l = d / Math.max(1, i - h + j) * j;
                return f ? {
                    left: 0,
                    right: l
                } : c ? {
                    left: 0,
                    right: 0
                } : {
                    left: l / 2,
                    right: l / 2
                }
            }
            if (c && !g)
                return {
                    left: 0,
                    right: 0
                };
            if (this._isDate(h) && this._isDate(i)) {
                var m = this._getDTIntCnt(h, i, Math.min(j, i - h), k)
                  , n = d / Math.max(2, m);
                return {
                    left: n / 2,
                    right: n / 2
                }
            }
            var m = Math.max(1, i - h);
            if (1 == m)
                return sz = d / 4,
                {
                    left: sz,
                    right: sz
                };
            var n = d / (m + 1);
            return {
                left: n / 2,
                right: n / 2
            }
        },
        _calculateXOffsets: function (b, c) {
            var d = this.seriesGroups[b]
              , e = this._getXAxis(b)
              , f = []
              , g = []
              , h = this._getDataLen(b)
              , i = this._getXAxisStats(b, e, c)
              , j = i.min
              , k = i.max
              , l = i.isDateTime
              , m = i.isTimeUnit
              , n = this._hasColumnSeries()
              , o = d.polar || d.spider
              , p = this._get([d.startAngle, d.minAngle, 0])
              , q = this._get([d.endAngle, d.maxAngle, 360])
              , r = o && !(Math.abs(Math.abs(q - p) - 360) > 1e-4)
              , s = this._alignValuesWithTicks(b)
              , t = this._getPaddingSize(i, e, s, c, o, r, n)
              , u = k - j
              , v = i.filterRange;
            0 == u && (u = 1);
            var w = c - t.left - t.right;
            o && s && !r && (t.left = t.right = 0);
            for (var x = -1, y = -1, z = 0; z < h; z++) {
                var A = void 0 === e.dataField ? z : this._getDataValue(z, e.dataField, b);
                if (i.useIndeces) {
                    if (z < v.min || z > v.max) {
                        f.push(NaN),
                        g.push(void 0);
                        continue
                    }
                    if (C = t.left + (z - j) / u * w,
                    1 == i.logAxis.enabled) {
                        var B = i.logAxis.base;
                        C = this._jqxPlot.scale(A, {
                            min: j.valueOf(),
                            max: k.valueOf(),
                            type: "logarithmic",
                            base: B
                        }, {
                            min: 0,
                            max: w,
                            flip: !1
                        })
                    }
                    f.push(a.jqx._ptrnd(C)),
                    g.push(A),
                    -1 == x && (x = z),
                    (-1 == y || y < z) && (y = z)
                } else if (A = l ? this._castAsDate(A, e.dateFormat) : this._castAsNumber(A),
                isNaN(A) || A < v.min || A > v.max)
                    f.push(NaN),
                    g.push(void 0);
                else {
                    var C = 0;
                    if (1 == i.logAxis.enabled) {
                        var B = i.logAxis.base;
                        C = this._jqxPlot.scale(A, {
                            min: j.valueOf(),
                            max: k.valueOf(),
                            type: "logarithmic",
                            base: B
                        }, {
                            min: 0,
                            max: w,
                            flip: !1
                        })
                    } else
                        !l || l && m ? (diffFromMin = A - j,
                        C = (A - j) * w / u) : C = (A.valueOf() - j.valueOf()) / (k.valueOf() - j.valueOf()) * w;
                    C = a.jqx._ptrnd(t.left + C),
                    f.push(C),
                    g.push(A),
                    -1 == x && (x = z),
                    (-1 == y || y < z) && (y = z)
                }
            }
            if (1 == e.flip)
                for (var z = 0; z < f.length; z++)
                    isNaN(f[z]) || (f[z] = c - f[z]);
            (m || l) && (u = this._getDateDiff(j, k, e.baseUnit),
            u = a.jqx._rnd(u, 1, !1));
            var D = Math.max(1, u)
              , E = w / D;
            return x == y && 1 == D && (f[x] = t.left + w / 2),
            {
                axisStats: i,
                data: f,
                xvalues: g,
                first: x,
                last: y,
                length: -1 == y ? 0 : y - x + 1,
                itemWidth: E,
                intervalWidth: E * i.interval,
                rangeLength: u,
                useIndeces: i.useIndeces,
                padding: t,
                axisSize: w
            }
        },
        _getXAxis: function (a) {
            return void 0 == a || this.seriesGroups.length <= a ? this.categoryAxis || this.xAxis : this.seriesGroups[a].categoryAxis || this.seriesGroups[a].xAxis || this.categoryAxis || this.xAxis
        },
        _isGreyScale: function (a, b) {
            var c = this.seriesGroups[a]
              , d = c.series[b];
            return 1 == d.greyScale || 0 != d.greyScale && (1 == c.greyScale || 0 != c.greyScale && 1 == this.greyScale)
        },
        _getSeriesColors: function (b, c, d) {
            var e = this._getSeriesColorsInternal(b, c, d);
            if (this._isGreyScale(b, c))
                for (var f in e)
                    e[f] = a.jqx.toGreyScale(e[f]);
            return e
        },
        _getColorFromScheme: function (a, b, c) {
            var d = "#000000"
              , e = this.seriesGroups[a]
              , f = e.series[b];
            if (this._isPieGroup(a)) {
                var g = this._getDataLen(a);
                d = this._getItemColorFromScheme(f.colorScheme || e.colorScheme || this.colorScheme, b * g + c, a, b)
            } else {
                for (var h = 0, i = 0; i <= a; i++)
                    for (var j in this.seriesGroups[i].series) {
                        if (i == a && j == b)
                            break;
                        h++
                    }
                var k = this.colorScheme;
                if (e.colorScheme && (k = e.colorScheme,
                sidex = seriesIndex),
                void 0 != k && "" != k || (k = this.colorSchemes[0].name),
                !k)
                    return d;
                for (var i = 0; i < this.colorSchemes.length; i++) {
                    var l = this.colorSchemes[i];
                    if (l.name == k) {
                        for (; h > l.colors.length;)
                            h -= l.colors.length,
                            ++i >= this.colorSchemes.length && (i = 0),
                            l = this.colorSchemes[i];
                        d = l.colors[h % l.colors.length]
                    }
                }
            }
            return d
        },
        _createColorsCache: function () {
            this._colorsCache = {
                get: function (a) {
                    if (this._store[a])
                        return this._store[a]
                },
                set: function (a, b) {
                    this._size < 1e4 && (this._store[a] = b,
                    this._size++)
                },
                clear: function () {
                    this._store = {},
                    this._size = 0
                },
                _size: 0,
                _store: {}
            }
        },
        _getSeriesColorsInternal: function (b, c, d) {
            var e = this.seriesGroups[b]
              , f = e.series[c];
            a.isFunction(f.colorFunction) || "pie" == e.type || "donut" == e.type || (d = NaN);
            var g = b + "_" + c + "_" + (isNaN(d) ? "NaN" : d);
            if (this._colorsCache.get(g))
                return this._colorsCache.get(g);
            var h, i = {
                lineColor: "#222222",
                lineColorSelected: "#151515",
                lineColorSymbol: "#222222",
                lineColorSymbolSelected: "#151515",
                fillColor: "#222222",
                fillColorSelected: "#333333",
                fillColorSymbol: "#222222",
                fillColorSymbolSelected: "#333333",
                fillColorAlt: "#222222",
                fillColorAltSelected: "#333333"
            };
            if (a.isFunction(f.colorFunction)) {
                var j = isNaN(d) ? NaN : this._getDataValue(d, f.dataField, b);
                if (-1 != e.type.indexOf("range") && !isNaN(d)) {
                    j = {
                        from: this._getDataValue(d, f.dataFieldFrom, b),
                        to: this._getDataValue(d, f.dataFieldTo, b)
                    }
                }
                if ("object" == typeof (h = f.colorFunction(j, d, f, e)))
                    for (var k in h)
                        i[k] = h[k];
                else
                    i.fillColor = h
            } else {
                for (var k in i)
                    f[k] && (i[k] = f[k]);
                f.fillColor || f.color ? f.fillColor = f.fillColor || f.color : i.fillColor = this._getColorFromScheme(b, c, d)
            }
            var l = {
                fillColor: {
                    baseColor: "fillColor",
                    adjust: 1
                },
                fillColorSelected: {
                    baseColor: "fillColor",
                    adjust: 1.1
                },
                fillColorSymbol: {
                    baseColor: "fillColor",
                    adjust: 1
                },
                fillColorSymbolSelected: {
                    baseColor: "fillColorSymbol",
                    adjust: 2
                },
                fillColorAlt: {
                    baseColor: "fillColor",
                    adjust: 4
                },
                fillColorAltSelected: {
                    baseColor: "fillColor",
                    adjust: 3
                },
                lineColor: {
                    baseColor: "fillColor",
                    adjust: .95
                },
                lineColorSelected: {
                    baseColor: "lineColor",
                    adjust: .95
                },
                lineColorSymbol: {
                    baseColor: "lineColor",
                    adjust: 1
                },
                lineColorSymbolSelected: {
                    baseColor: "lineColorSelected",
                    adjust: 1
                }
            };
            for (var k in i)
                "object" == typeof h && h[k] || f[k] && (i[k] = f[k]);
            for (var k in i)
                "object" == typeof h && h[k] || f[k] || (i[k] = a.jqx.adjustColor(i[l[k].baseColor], l[k].adjust));
            return this._colorsCache.set(g, i),
            i
        },
        _getItemColorFromScheme: function (b, c, d, e) {
            void 0 != b && "" != b || (b = this.colorSchemes[0].name);
            for (var f = 0; f < this.colorSchemes.length && b != this.colorSchemes[f].name; f++)
                ;
            for (var g = 0; g <= c;) {
                f == this.colorSchemes.length && (f = 0);
                var h = this.colorSchemes[f].colors.length;
                if (!(g + h <= c)) {
                    var i = this.colorSchemes[f].colors[c - g];
                    return this._isGreyScale(d, e) && 0 == i.indexOf("#") && (i = a.jqx.toGreyScale(i)),
                    i
                }
                g += h,
                f++
            }
        },
        getColorScheme: function (a) {
            for (var b = 0; b < this.colorSchemes.length; b++)
                if (this.colorSchemes[b].name == a)
                    return this.colorSchemes[b].colors
        },
        addColorScheme: function (a, b) {
            for (var c = 0; c < this.colorSchemes.length; c++)
                if (this.colorSchemes[c].name == a)
                    return void (this.colorSchemes[c].colors = b);
            this.colorSchemes.push({
                name: a,
                colors: b
            })
        },
        removeColorScheme: function (a) {
            for (var b = 0; b < this.colorSchemes.length; b++)
                if (this.colorSchemes[b].name == a) {
                    this.colorSchemes.splice(b, 1);
                    break
                }
        },
        colorSchemes: [{
            name: "scheme01",
            colors: ["#307DD7", "#AA4643", "#89A54E", "#71588F", "#4198AF"]
        }, {
            name: "scheme02",
            colors: ["#7FD13B", "#EA157A", "#FEB80A", "#00ADDC", "#738AC8"]
        }, {
            name: "scheme03",
            colors: ["#E8601A", "#FF9639", "#F5BD6A", "#599994", "#115D6E"]
        }, {
            name: "scheme04",
            colors: ["#D02841", "#FF7C41", "#FFC051", "#5B5F4D", "#364651"]
        }, {
            name: "scheme05",
            colors: ["#25A0DA", "#309B46", "#8EBC00", "#FF7515", "#FFAE00"]
        }, {
            name: "scheme06",
            colors: ["#0A3A4A", "#196674", "#33A6B2", "#9AC836", "#D0E64B"]
        }, {
            name: "scheme07",
            colors: ["#CC6B32", "#FFAB48", "#FFE7AD", "#A7C9AE", "#888A63"]
        }, {
            name: "scheme08",
            colors: ["#3F3943", "#01A2A6", "#29D9C2", "#BDF271", "#FFFFA6"]
        }, {
            name: "scheme09",
            colors: ["#1B2B32", "#37646F", "#A3ABAF", "#E1E7E8", "#B22E2F"]
        }, {
            name: "scheme10",
            colors: ["#5A4B53", "#9C3C58", "#DE2B5B", "#D86A41", "#D2A825"]
        }, {
            name: "scheme11",
            colors: ["#993144", "#FFA257", "#CCA56A", "#ADA072", "#949681"]
        }, {
            name: "scheme12",
            colors: ["#105B63", "#EEEAC5", "#FFD34E", "#DB9E36", "#BD4932"]
        }, {
            name: "scheme13",
            colors: ["#BBEBBC", "#F0EE94", "#F5C465", "#FA7642", "#FF1E54"]
        }, {
            name: "scheme14",
            colors: ["#60573E", "#F2EEAC", "#BFA575", "#A63841", "#BFB8A3"]
        }, {
            name: "scheme15",
            colors: ["#444546", "#FFBB6E", "#F28D00", "#D94F00", "#7F203B"]
        }, {
            name: "scheme16",
            colors: ["#583C39", "#674E49", "#948658", "#F0E99A", "#564E49"]
        }, {
            name: "scheme17",
            colors: ["#142D58", "#447F6E", "#E1B65B", "#C8782A", "#9E3E17"]
        }, {
            name: "scheme18",
            colors: ["#4D2B1F", "#635D61", "#7992A2", "#97BFD5", "#BFDCF5"]
        }, {
            name: "scheme19",
            colors: ["#844341", "#D5CC92", "#BBA146", "#897B26", "#55591C"]
        }, {
            name: "scheme20",
            colors: ["#56626B", "#6C9380", "#C0CA55", "#F07C6C", "#AD5472"]
        }, {
            name: "scheme21",
            colors: ["#96003A", "#FF7347", "#FFBC7B", "#FF4154", "#642223"]
        }, {
            name: "scheme22",
            colors: ["#5D7359", "#E0D697", "#D6AA5C", "#8C5430", "#661C0E"]
        }, {
            name: "scheme23",
            colors: ["#16193B", "#35478C", "#4E7AC7", "#7FB2F0", "#ADD5F7"]
        }, {
            name: "scheme24",
            colors: ["#7B1A25", "#BF5322", "#9DA860", "#CEA457", "#B67818"]
        }, {
            name: "scheme25",
            colors: ["#0081DA", "#3AAFFF", "#99C900", "#FFEB3D", "#309B46"]
        }, {
            name: "scheme26",
            colors: ["#0069A5", "#0098EE", "#7BD2F6", "#FFB800", "#FF6800"]
        }, {
            name: "scheme27",
            colors: ["#FF6800", "#A0A700", "#FF8D00", "#678900", "#0069A5"]
        }, {
            name: "scheme28",
            colors: ["#0396FF", "#000", "#000", "#000", "#000"]
        }, {
            name: "schemesino",
            colors: ["#48c9b0", "#73c6b6", "#DAF7A6", "#FFC300", "#FF5733", "#C70039"]
        }],
        _formatValue: function (b, c, d, e, f, g) {
            if (void 0 == b)
                return "";
            if (this._isObject(b) && !this._isDate(b) && !d)
                return "";
            if (d) {
                if (!a.isFunction(d))
                    return b.toString();
                try {
                    return d(b, g, f, e)
                } catch (a) {
                    return a.message
                }
            }
            return this._isNumber(b) ? this._formatNumber(b, c) : this._isDate(b) ? this._formatDate(b, c) : c ? (c.prefix || "") + b.toString() + (c.sufix || "") : b.toString()
        },
        _getFormattedValue: function (b, c, d, e, f, g) {
            var h = this.seriesGroups[b]
              , i = h.series[c]
              , j = ""
              , k = e
              , l = f;
            l || (l = i.formatFunction || h.formatFunction),
            k || (k = i.formatSettings || h.formatSettings),
            !i.formatFunction && i.formatSettings && (l = void 0);
            var m = {}
              , n = 0;
            for (var o in i)
                0 == o.indexOf("dataField") && (m[o.substring(9).toLowerCase()] = this._getDataValue(d, i[o], b),
                n++);
            if (0 == n && (m = this._getDataValue(d, void 0, b)),
            -1 != h.type.indexOf("waterfall") && this._isSummary(b, d) && (m = this._renderData[b].offsets[c][d].value,
            n = 0),
            l && a.isFunction(l))
                try {
                    return l(1 == n ? m[""] : m, d, i, h)
                } catch (a) {
                    return a.message
                }
            if (1 == n && this._isPieGroup(b))
                return this._formatValue(m[""], k, l, b, c, d);
            if (n > 0) {
                var p = 0;
                for (var o in m) {
                    p > 0 && "" != j && (j += "<br>");
                    var q = "dataField" + (o.length > 0 ? o.substring(0, 1).toUpperCase() + o.substring(1) : "")
                      , r = "displayText" + (o.length > 0 ? o.substring(0, 1).toUpperCase() + o.substring(1) : "")
                      , s = i[r] || i[q]
                      , t = m[o];
                    void 0 != t && (t = this._formatValue(t, k, l, b, c, d),
                    j += !0 === g ? t : s + ": " + t,
                    p++)
                }
            } else
                void 0 != m && (j = this._formatValue(m, k, l, b, c, d));
            return j || ""
        },
        _isNumberAsString: function (b) {
            if ("string" != typeof b)
                return !1;
            b = a.trim(b);
            for (var c = 0; c < b.length; c++) {
                var d = b.charAt(c);
                if (!(d >= "0" && d <= "9" || "," == d || "." == d) && (("-" != d || 0 != c) && !("(" == d && 0 == c || ")" == d && c == b.length - 1)))
                    return !1
            }
            return !0
        },
        _castAsDate: function (b, c) {
            if (b instanceof Date && !isNaN(b))
                return b;
            if ("string" == typeof b) {
                var d;
                if (c && (d = a.jqx.dataFormat.parsedate(b, c),
                this._isDate(d)))
                    return d;
                if (this._autoDateFormats)
                    for (var e = 0; e < this._autoDateFormats.length; e++)
                        if (d = a.jqx.dataFormat.parsedate(b, this._autoDateFormats[e]),
                        this._isDate(d))
                            return d;
                var f = this._detectDateFormat(b);
                return f && (d = a.jqx.dataFormat.parsedate(b, f),
                this._isDate(d)) ? (this._autoDateFormats.push(f),
                d) : (d = new Date(b),
                this._isDate(d) && -1 == b.indexOf(":") && d.setHours(0, 0, 0, 0),
                d)
            }
        },
        _castAsNumber: function (a) {
            if (a instanceof Date && !isNaN(a))
                return a.valueOf();
            if ("string" == typeof a)
                if (this._isNumber(a))
                    a = parseFloat(a);
                else if (!/[a-zA-Z]/.test(a)) {
                    var b = new Date(a);
                    void 0 != b && (a = b.valueOf())
                }
            return a
        },
        _isNumber: function (a) {
            return "string" == typeof a && this._isNumberAsString(a) && (a = parseFloat(a)),
            "number" == typeof a && isFinite(a)
        },
        _isDate: function (a) {
            return a instanceof Date && !isNaN(a.getDate())
        },
        _isBoolean: function (a) {
            return "boolean" == typeof a
        },
        _isObject: function (b) {
            return b && ("object" == typeof b || a.isFunction(b)) || !1
        },
        _formatDate: function (b, c) {
            var d = b.toString();
            return c && (c.dateFormat && (d = a.jqx.dataFormat.formatDate(b, c.dateFormat)),
            d = (c.prefix || "") + d + (c.sufix || "")),
            d
        },
        _formatNumber: function (a, b) {
            if (!this._isNumber(a))
                return a;
            b = b || {};
            var c = "."
              , d = ""
              , e = this;
            e.localization && (c = e.localization.decimalSeparator || e.localization.decimalseparator || c,
            d = e.localization.thousandsSeparator || e.localization.thousandsseparator || d),
            b.decimalSeparator && (c = b.decimalSeparator),
            b.thousandsSeparator && (d = b.thousandsSeparator);
            var f = b.prefix || ""
              , g = b.sufix || ""
              , h = b.decimalPlaces;
            isNaN(h) && (h = this._getDecimalPlaces([a], void 0, 3));
            var i = b.negativeWithBrackets || !1
              , j = a < 0;
            j && i && (a *= -1);
            var k, l = a.toString(), m = Math.pow(10, h);
            if (l = (Math.round(a * m) / m).toString(),
            isNaN(l) && (l = ""),
            k = l.lastIndexOf("."),
            h > 0)
                for (k < 0 ? (l += c,
                k = l.length - 1) : "." !== c && (l = l.replace(".", c)) ; l.length - 1 - k < h;)
                    l += "0";
            k = l.lastIndexOf(c),
            k = k > -1 ? k : l.length;
            for (var n = l.substring(k), o = 0, p = k; p > 0; p--,
            o++)
                o % 3 == 0 && p !== k && (!j || p > 1 || j && i) && (n = d + n),
                n = l.charAt(p - 1) + n;
            return l = n,
            j && i && (l = "(" + l + ")"),
            f + l + g
        },
        _defaultNumberFormat: {
            prefix: "",
            sufix: "",
            decimalSeparator: ".",
            thousandsSeparator: ",",
            decimalPlaces: 2,
            negativeWithBrackets: !1
        },
        _calculateControlPoints: function (a, b) {
            var c = a[b]
              , d = a[b + 1]
              , e = a[b + 2]
              , f = a[b + 3]
              , g = a[b + 4]
              , h = a[b + 5]
              , i = Math.sqrt(Math.pow(e - c, 2) + Math.pow(f - d, 2))
              , j = Math.sqrt(Math.pow(g - e, 2) + Math.pow(h - f, 2))
              , k = i + j;
            0 == k && (k = 1);
            var l = .4 * i / k
              , m = .4 - l;
            return [e + l * (c - g), f + l * (d - h), e - m * (c - g), f - m * (d - h)]
        },
        _getBezierPoints: function (b) {
            for (var c = "", d = [], e = [], f = b.split(" "), g = 0; g < f.length; g++) {
                var h = f[g].split(",");
                d.push(parseFloat(h[0])),
                d.push(parseFloat(h[1])),
                !isNaN(d[d.length - 1]) && isNaN(d[d.length - 2])
            }
            var i = d.length;
            if (i <= 1)
                return "";
            if (2 == i)
                return c = "M" + a.jqx._ptrnd(d[0]) + "," + a.jqx._ptrnd(d[1]) + " L" + a.jqx._ptrnd(d[0] + 1) + "," + a.jqx._ptrnd(d[1] + 1) + " ";
            for (var g = 0; g < i - 4; g += 2)
                e = e.concat(this._calculateControlPoints(d, g));
            for (var g = 2; g < i - 5; g += 2)
                c += " C" + a.jqx._ptrnd(e[2 * g - 2]) + "," + a.jqx._ptrnd(e[2 * g - 1]) + " " + a.jqx._ptrnd(e[2 * g]) + "," + a.jqx._ptrnd(e[2 * g + 1]) + " " + a.jqx._ptrnd(d[g + 2]) + "," + a.jqx._ptrnd(d[g + 3]) + " ";
            return c = i <= 4 || Math.abs(d[0] - d[2]) < 3 || Math.abs(d[1] - d[3]) < 3 || this._isVML ? "M" + a.jqx._ptrnd(d[0]) + "," + a.jqx._ptrnd(d[1]) + " L" + a.jqx._ptrnd(d[2]) + "," + a.jqx._ptrnd(d[3]) + " " + c : "M" + a.jqx._ptrnd(d[0]) + "," + a.jqx._ptrnd(d[1]) + " Q" + a.jqx._ptrnd(e[0]) + "," + a.jqx._ptrnd(e[1]) + " " + a.jqx._ptrnd(d[2]) + "," + a.jqx._ptrnd(d[3]) + " " + c,
            i >= 4 && (Math.abs(d[i - 2] - d[i - 4]) < 3 || Math.abs(d[i - 1] - d[i - 3]) < 3 || this._isVML) ? c += " L" + a.jqx._ptrnd(d[i - 2]) + "," + a.jqx._ptrnd(d[i - 1]) + " " : i >= 5 && (c += " Q" + a.jqx._ptrnd(e[2 * i - 10]) + "," + a.jqx._ptrnd(e[2 * i - 9]) + " " + a.jqx._ptrnd(d[i - 2]) + "," + a.jqx._ptrnd(d[i - 1]) + " "),
            c
        },
        _animTickInt: 50,
        _createAnimationGroup: function (a) {
            this._animGroups || (this._animGroups = {}),
            this._animGroups[a] = {
                animations: [],
                startTick: NaN
            }
        },
        _startAnimation: function (a) {
            var b = new Date
              , c = b.getTime();
            this._animGroups[a].startTick = c,
            this._runAnimation(),
            this._enableAnimTimer()
        },
        _enqueueAnimation: function (a, b, c, d, e, f, g) {
            d < 0 && (d = 0),
            void 0 == g && (g = "easeInOutSine"),
            this._animGroups[a].animations.push({
                key: b,
                properties: c,
                duration: d,
                fn: e,
                context: f,
                easing: g
            })
        },
        _stopAnimations: function () {
            clearTimeout(this._animtimer),
            this._animtimer = void 0,
            this._animGroups = void 0
        },
        _enableAnimTimer: function () {
            if (!this._animtimer) {
                var a = this;
                this._animtimer = setTimeout(function () {
                    a._runAnimation()
                }, this._animTickInt)
            }
        },
        _runAnimation: function (b) {
            if (this._animGroups) {
                var c = new Date
                  , d = c.getTime()
                  , e = {};
                for (var f in this._animGroups) {
                    for (var g = this._animGroups[f].animations, h = this._animGroups[f].startTick, i = 0, j = 0; j < g.length; j++) {
                        var k = g[j]
                          , l = d - h;
                        k.duration > i && (i = k.duration);
                        var m = k.duration > 0 ? l / k.duration : 1
                          , n = m;
                        if (k.easing && 0 != k.duration && (n = a.easing[k.easing](m, l, 0, 1, k.duration)),
                        m > 1 && (m = 1,
                        n = 1),
                        k.fn)
                            k.fn(k.key, k.context, n);
                        else {
                            for (var o = {}, f = 0; f < k.properties.length; f++) {
                                var p = k.properties[f]
                                  , q = 0;
                                q = 1 == m ? p.to : easeParecent * (p.to - p.from) + p.from,
                                o[p.key] = q
                            }
                            this.renderer.attr(k.key, o)
                        }
                    }
                    h + i > d && (e[f] = {
                        startTick: h,
                        animations: g
                    })
                }
                this._animGroups = e,
                this.renderer instanceof a.jqx.HTML5Renderer && this.renderer.refresh()
            }
            this._animtimer = null;
            for (var f in this._animGroups) {
                this._enableAnimTimer();
                break
            }
        },
        _fixCoords: function (a, b) {
            if ("horizontal" != this.seriesGroups[b].orientation)
                return a;
            var c = a.x;
            a.x = a.y,
            a.y = c + this._plotRect.y - this._plotRect.x;
            var c = a.width;
            return a.width = a.height,
            a.height = c,
            a
        },
        getItemCoord: function (a, b, c) {
            var d = this;
            if (d._isPieGroup(a) && (!d._isSerieVisible(a, b, c) || !d._renderData || d._renderData.length <= a))
                return {
                    x: NaN,
                    y: NaN
                };
            if (!d._isSerieVisible(a, b) || !d._renderData || d._renderData.length <= a)
                return {
                    x: NaN,
                    y: NaN
                };
            var e = d.seriesGroups[a]
              , f = e.series[b]
              , g = d._getItemCoord(a, b, c);
            if (d._isPieGroup(a)) {
                if (isNaN(g.x) || isNaN(g.y) || isNaN(g.fromAngle) || isNaN(g.toAngle))
                    return {
                        x: NaN,
                        y: NaN
                    };
                var h = this._plotRect
                  , i = g.fromAngle * (Math.PI / 180)
                  , j = g.toAngle * (Math.PI / 180);
                x1 = h.x + g.center.x + Math.cos(i) * g.outerRadius,
                x2 = h.x + g.center.x + Math.cos(j) * g.outerRadius,
                y1 = h.y + g.center.y - Math.sin(i) * g.outerRadius,
                y2 = h.y + g.center.y - Math.sin(j) * g.outerRadius;
                var k = Math.min(x1, x2)
                  , l = Math.abs(x2 - x1)
                  , m = Math.min(y1, y2);
                return g = {
                    x: k,
                    y: m,
                    width: l,
                    height: Math.abs(y2 - y1),
                    center: g.center,
                    centerOffset: g.centerOffset,
                    innerRadius: g.innerRadius,
                    outerRadius: g.outerRadius,
                    selectedRadiusChange: g.selectedRadiusChange,
                    fromAngle: g.fromAngle,
                    toAngle: g.toAngle
                }
            }
            if (-1 != e.type.indexOf("column") || -1 != e.type.indexOf("waterfall")) {
                var n = this._getColumnSerieWidthAndOffset(a, b);
                g.height = Math.abs(g.y.to - g.y.from),
                g.y = Math.min(g.y.to, g.y.from),
                g.x += n.offset,
                g.width = n.width
            } else if (-1 != e.type.indexOf("ohlc") || -1 != e.type.indexOf("candlestick")) {
                var n = this._getColumnSerieWidthAndOffset(a, b)
                  , m = g.y
                  , o = Math.min(m.Open, m.Close, m.Low, m.High)
                  , p = Math.max(m.Open, m.Close, m.Low, m.High);
                g.height = Math.abs(p - o),
                g.y = o,
                g.x += n.offset,
                g.width = n.width
            } else if (-1 != e.type.indexOf("line") || -1 != e.type.indexOf("area"))
                g.width = g.height = 0,
                g.y = g.y.to;
            else if (-1 != e.type.indexOf("bubble") || -1 != e.type.indexOf("scatter")) {
                g.center = {
                    x: g.x,
                    y: g.y.to
                };
                var q = g.y.radius;
                "circle" != f.symbolType && void 0 != f.symbolType && (q /= 2),
                g.y = g.y.to,
                g.radius = q,
                g.width = 2 * q,
                g.height = 2 * q
            }
            if (g = this._fixCoords(g, a),
            e.polar || e.spider) {
                var r = this._toPolarCoord(this._renderData[a].polarCoords, this._plotRect, g.x, g.y);
                g.x = r.x,
                g.y = r.y,
                g.center && (g.center = this._toPolarCoord(this._renderData[a].polarCoords, this._plotRect, g.center.x, g.center.y))
            }
            return -1 == e.type.indexOf("bubble") && -1 == e.type.indexOf("scatter") || (g.x -= q,
            g.y -= q),
            g
        },
        _getItemCoord: function (a, b, c) {
            var d, e, f = this.seriesGroups[a];
            if (!f || !this._renderData)
                return {
                    x: NaN,
                    y: NaN
                };
            if (!f.series[b])
                return {
                    x: NaN,
                    y: NaN
                };
            var g = this._plotRect;
            if (this._isPieGroup(a)) {
                var h = this._renderData[a].offsets[b][c];
                if (!h)
                    return {
                        x: NaN,
                        y: NaN
                    };
                var i = (h.fromAngle + h.toAngle) / 2 * (Math.PI / 180);
                return d = g.x + h.x + Math.cos(i) * h.outerRadius,
                e = g.y + h.y - Math.sin(i) * h.outerRadius,
                {
                    x: d,
                    y: e,
                    center: {
                        x: h.x,
                        y: h.y
                    },
                    centerOffset: h.centerOffset,
                    innerRadius: h.innerRadius,
                    outerRadius: h.outerRadius,
                    selectedRadiusChange: h.selectedRadiusChange,
                    fromAngle: h.fromAngle,
                    toAngle: h.toAngle
                }
            }
            if (d = g.x + this._renderData[a].xoffsets.data[c],
            e = this._renderData[a].offsets[b][c],
            isNaN(d) || !e)
                return {
                    x: NaN,
                    y: NaN
                };
            var j = {};
            for (var k in e)
                j[k] = e[k];
            return {
                x: d,
                y: j
            }
        },
        getXAxisValue: function (b, c) {
            var d = this.seriesGroups[c];
            if (d) {
                var e = this._getXAxis(c)
                  , f = this._plotRect
                  , g = 0
                  , h = NaN
                  , i = this._renderData[0].xoffsets.axisStats
                  , j = 0
                  , k = 0;
                if (d.polar || d.spider) {
                    if (isNaN(b.x) || isNaN(b.y))
                        return NaN;
                    var l = this._getPolarAxisCoords(c, f);
                    if (a.jqx._ptdist(b.x, b.y, l.x, l.y) > l.r)
                        return NaN;
                    var m = Math.atan2(l.y - b.y, b.x - l.x);
                    m = Math.PI / 2 - m,
                    m < 0 && (m = 2 * Math.PI + m),
                    h = m * l.r;
                    var n = l.startAngle + Math.PI / 2
                      , o = l.endAngle + Math.PI / 2;
                    j = n * l.r,
                    k = o * l.r,
                    g = (o - n) * l.r;
                    var p = this._getPaddingSize(i, e, e.valuesOnTicks, g, !0, l.isClosedCircle, this._hasColumnSeries());
                    l.isClosedCircle ? (g -= p.left + p.right,
                    k -= p.left + p.right) : e.valuesOnTicks || (j += p.left,
                    k -= p.right)
                } else {
                    if ("horizontal" != d.orientation) {
                        if (b < f.x || b > f.x + f.width)
                            return NaN;
                        h = b - f.x,
                        g = f.width
                    } else {
                        if (b < f.y || b > f.y + f.height)
                            return NaN;
                        h = b - f.y,
                        g = f.height
                    }
                    if (this._renderData[c] && this._renderData[c].xoffsets) {
                        var p = this._renderData[c].xoffsets.padding;
                        g -= p.left + p.right,
                        h -= p.left
                    }
                    k = g
                }
                return this._jqxPlot.scale(h, {
                    min: j,
                    max: k
                }, {
                    min: i.min.valueOf(),
                    max: i.max.valueOf(),
                    type: i.logAxis.enabled ? "logarithmic" : "linear",
                    base: i.logAxis.base,
                    flip: e.flip
                })
            }
        },
        getValueAxisValue: function (b, c) {
            var d = this.seriesGroups[c];
            if (d) {
                var e = this._getValueAxis(c)
                  , f = this._plotRect
                  , g = 0
                  , h = NaN;
                if (d.polar || d.spider) {
                    if (isNaN(b.x) || isNaN(b.y))
                        return NaN;
                    var i = this._getPolarAxisCoords(c, f);
                    h = a.jqx._ptdist(b.x, b.y, i.x, i.y),
                    g = i.r,
                    h = g - h
                } else if ("horizontal" == d.orientation) {
                    if (b < f.x || b > f.x + f.width)
                        return NaN;
                    h = b - f.x,
                    g = f.width
                } else {
                    if (b < f.y || b > f.y + f.height)
                        return NaN;
                    h = b - f.y,
                    g = f.height
                }
                var j = this._stats.seriesGroups[c];
                return this._jqxPlot.scale(h, {
                    min: 0,
                    max: g
                }, {
                    min: j.min.valueOf(),
                    max: j.max.valueOf(),
                    type: j.logarithmic ? "logarithmic" : "linear",
                    base: j.logBase,
                    flip: !e.flip
                })
            }
        },
        _detectDateFormat: function (b, c) {
            var d = {
                en_US_d: "M/d/yyyy",
                en_US_D: "dddd, MMMM dd, yyyy",
                en_US_t: "h:mm tt",
                en_US_T: "h:mm:ss tt",
                en_US_f: "dddd, MMMM dd, yyyy h:mm tt",
                en_US_F: "dddd, MMMM dd, yyyy h:mm:ss tt",
                en_US_M: "MMMM dd",
                en_US_Y: "yyyy MMMM",
                en_US_S: "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
                en_CA_d: "dd/MM/yyyy",
                en_CA_D: "MMMM-dd-yy",
                en_CA_f: "MMMM-dd-yy h:mm tt",
                en_CA_F: "MMMM-dd-yy h:mm:ss tt",
                ISO: "yyyy-MM-dd hh:mm:ss",
                ISO2: "yyyy-MM-dd HH:mm:ss",
                d1: "dd.MM.yyyy",
                d2: "dd-MM-yyyy",
                zone1: "yyyy-MM-ddTHH:mm:ss-HH:mm",
                zone2: "yyyy-MM-ddTHH:mm:ss+HH:mm",
                custom: "yyyy-MM-ddTHH:mm:ss.fff",
                custom2: "yyyy-MM-dd HH:mm:ss.fff",
                de_DE_d: "dd.MM.yyyy",
                de_DE_D: "dddd, d. MMMM yyyy",
                de_DE_t: "HH:mm",
                de_DE_T: "HH:mm:ss",
                de_DE_f: "dddd, d. MMMM yyyy HH:mm",
                de_DE_F: "dddd, d. MMMM yyyy HH:mm:ss",
                de_DE_M: "dd MMMM",
                de_DE_Y: "MMMM yyyy",
                fr_FR_d: "dd/MM/yyyy",
                fr_FR_D: "dddd d MMMM yyyy",
                fr_FR_t: "HH:mm",
                fr_FR_T: "HH:mm:ss",
                fr_FR_f: "dddd d MMMM yyyy HH:mm",
                fr_FR_F: "dddd d MMMM yyyy HH:mm:ss",
                fr_FR_M: "d MMMM",
                fr_FR_Y: "MMMM yyyy",
                it_IT_d: "dd/MM/yyyy",
                it_IT_D: "dddd d MMMM yyyy",
                it_IT_t: "HH:mm",
                it_IT_T: "HH:mm:ss",
                it_IT_f: "dddd d MMMM yyyy HH:mm",
                it_IT_F: "dddd d MMMM yyyy HH:mm:ss",
                it_IT_M: "dd MMMM",
                it_IT_Y: "MMMM yyyy",
                ru_RU_d: "dd.MM.yyyy",
                ru_RU_D: "d MMMM yyyy '?.'",
                ru_RU_t: "H:mm",
                ru_RU_T: "H:mm:ss",
                ru_RU_f: "d MMMM yyyy '?.' H:mm",
                ru_RU_F: "d MMMM yyyy '?.' H:mm:ss",
                ru_RU_Y: "MMMM yyyy",
                cs_CZ_d: "d.M.yyyy",
                cs_CZ_D: "d. MMMM yyyy",
                cs_CZ_t: "H:mm",
                cs_CZ_T: "H:mm:ss",
                cs_CZ_f: "d. MMMM yyyy H:mm",
                cs_CZ_F: "d. MMMM yyyy H:mm:ss",
                cs_CZ_M: "dd MMMM",
                cs_CZ_Y: "MMMM yyyy",
                he_IL_d: "dd MMMM yyyy",
                he_IL_D: "dddd dd MMMM yyyy",
                he_IL_t: "HH:mm",
                he_IL_T: "HH:mm:ss",
                he_IL_f: "dddd dd MMMM yyyy HH:mm",
                he_IL_F: "dddd dd MMMM yyyy HH:mm:ss",
                he_IL_M: "dd MMMM",
                he_IL_Y: "MMMM yyyy",
                hr_HR_d: "d.M.yyyy.",
                hr_HR_D: "d. MMMM yyyy.",
                hr_HR_t: "H:mm",
                hr_HR_T: "H:mm:ss",
                hr_HR_f: "d. MMMM yyyy. H:mm",
                hr_HR_F: "d. MMMM yyyy. H:mm:ss",
                hr_HR_M: "d. MMMM",
                hu_HU_d: "yyyy.MM.dd.",
                hu_HU_D: "yyyy. MMMM d.",
                hu_HU_t: "H:mm",
                hu_HU_T: "H:mm:ss",
                hu_HU_f: "yyyy. MMMM d. H:mm",
                hu_HU_F: "yyyy. MMMM d. H:mm:ss",
                hu_HU_M: "MMMM d.",
                hu_HU_Y: "yyyy. MMMM",
                jp_JP_d: "gg y/M/d",
                jp_JP_D: "gg y'?'M'?'d'?'",
                jp_JP_t: "H:mm",
                jp_JP_T: "H:mm:ss",
                jp_JP_f: "gg y'?'M'?'d'?' H:mm",
                jp_JP_F: "gg y'?'M'?'d'?' H:mm:ss",
                jp_JP_M: "M'?'d'?'",
                jp_JP_Y: "gg y'?'M'?'",
                lt_LT_d: "yyyy.MM.dd",
                lt_LT_D: "yyyy 'm.' MMMM d 'd.'",
                lt_LT_t: "HH:mm",
                lt_LT_T: "HH:mm:ss",
                lt_LT_f: "yyyy 'm.' MMMM d 'd.' HH:mm",
                lt_LT_F: "yyyy 'm.' MMMM d 'd.' HH:mm:ss",
                lt_LT_M: "MMMM d 'd.'",
                lt_LT_Y: "yyyy 'm.' MMMM",
                sa_IN_d: "dd-MM-yyyy",
                sa_IN_D: "dd MMMM yyyy dddd",
                sa_IN_t: "HH:mm",
                sa_IN_T: "HH:mm:ss",
                sa_IN_f: "dd MMMM yyyy dddd HH:mm",
                sa_IN_F: "dd MMMM yyyy dddd HH:mm:ss",
                sa_IN_M: "dd MMMM",
                basic_y: "yyyy",
                basic_ym: "yyyy-MM",
                basic_d: "yyyy-MM-dd",
                basic_dhm: "yyyy-MM-dd hh:mm",
                basic_bhms: "yyyy-MM-dd hh:mm:ss",
                basic2_ym: "MM-yyyy",
                basic2_d: "MM-dd-yyyy",
                basic2_dhm: "MM-dd-yyyy hh:mm",
                basic2_dhms: "MM-dd-yyyy hh:mm:ss",
                basic3_ym: "yyyy/MM",
                basic3_d: "yyyy/MM/dd",
                basic3_dhm: "yyyy/MM/dd hh:mm",
                basic3_bhms: "yyyy/MM/dd hh:mm:ss",
                basic4_ym: "MM/yyyy",
                basic4_d: "MM/dd/yyyy",
                basic4_dhm: "MM/dd/yyyy hh:mm",
                basic4_dhms: "MM/dd/yyyy hh:mm:ss"
            };
            c && (d = a.extend({}, d, c));
            var e = [];
            a.isArray(b) ? e = b : e.push(b);
            for (var f in d)
                d[f] = {
                    format: d[f],
                    count: 0
                };
            for (var g = 0; g < e.length; g++)
                if (value = e[g],
                null != value && void 0 != value)
                    for (var f in d) {
                        var h = a.jqx.dataFormat.parsedate(value, d[f].format);
                        null != h && d[f].count++
                    }
            var i = {
                key: void 0,
                count: 0
            };
            for (var f in d)
                d[f].count > i.count && (i.key = f,
                i.count = d[f].count);
            return i.key ? d[i.key].format : ""
        },
        _testXAxisDateFormat: function (a) {
            var b = this
              , c = b._getXAxis(a)
              , d = b._getDataLen(a)
              , e = {};
            if (b.localization && b.localization.patterns)
                for (var f in b.localization.patterns)
                    e["local_" + f] = b.localization.patterns[f];
            for (var g = [], h = 0; h < d && h < 10; h++)
                value = b._getDataValue(h, c.dataField, a),
                null != value && void 0 != value && g.push(value);
            return b._detectDateFormat(g, e)
        }
    })
}(jqxBaseFramework);
