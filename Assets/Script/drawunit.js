/* ECMA Script 5.1 compability */

var drawunit = drawunit || {};

drawunit.isNull = function (object) {
    return (typeof object === 'undefined') || (object == null);
};

drawunit.require = function (name) {
    if (typeof name !== "string") {
        throw new TypeError("name must be string");
    }

    var module = eval(name);

    if (drawunit.isNull(module)) {
        throw new TypeError("module " + name + " is not found");
    }
    else {
        return module;
    }
};

drawunit.createElement = function (name, config) {
    var config = config || {},
        attributes = config.attributes || {},
        style = config.style || {},
        parentEl = config.parentEl || null,
        element = document.createElement(name);

    // set attributes
    if (!drawunit.isNull(attributes)) {
        for (var key in attributes) {
            if (drawunit.isNull(attributes[key])) continue;
            element[key] = attributes[key];
        }
    }

    // set CSS styles
    if (!drawunit.isNull(style)) {
        for (var key in style) {
            if (drawunit.isNull(style[key])) continue;
            element.style[key] = style[key];
        }
    }

    // set parent element
    if (!drawunit.isNull(parentEl)) {
        parentEl.appendChild(element);
    }

    return element;
};

/* ECMA Script 5.1 compability */

var drawunit = drawunit || {};

// #define drawunit.class
drawunit.class = (function () {

    var createObject = function (name, initValue) {
        var d, o,
            n = name.split('.');
        var o = window[n[0]] = window[n[0]] || {},
            l = n.length;

        for (var i = 1; i < l - 1; i++) {
            o = o[n[i]] = o[n[i]] || {};
        }

        if (initValue) {
            o[n[l - 1]] = initValue;
        }
        else {
            o[n[l - 1]] = o[n[l - 1]] || {};
        }

        return o[n[l - 1]];
    }

    var create = function (className, data) {
        var Class, constructor = function () {};

        if (data.hasOwnProperty("constructor")) {
            constructor = data.constructor;
            delete data.constructor;
        }

        Class = function object () {
            constructor.apply(this, arguments);
        }

        if (data.hasOwnProperty("statics")) {
            var statics = data.statics || {};

            for (var key in statics) {
                Class[key] = statics[key];
            }
            Class.statics = statics;
            delete data.statics;
        }

        Class.$className = className;
        Class.prototype = {};

        if (data.hasOwnProperty("methods")) {
            var methods = data.methods || {};

            for (var key in methods) {
                var method = methods[key]
                if (typeof method === "function") {
                    Class.prototype[key] = method;
                }
            }

            delete data.methods;
        }

        return Class;
    };

    var extend = function (Class, baseClass) {
        var prototype = Class.prototype,
            parentPrototype = baseClass.prototype;

        Class.prototype = Object.create(parentPrototype);

        for (var key in prototype) {
            Class.prototype[key] = prototype[key];
        }

        Class.prototype.superclass = function () {
            baseClass.apply(this, arguments);
        }

        Object.defineProperty(Class.prototype, 'constructor', {
            enumerable: false,
            value: Class
        });

        return Class;
    };

    return {
        define: function (className, data) {
            var Class = create(className, data);

            if (data.hasOwnProperty("extend")) {
                var baseClass = data.extend;
                if (!baseClass && typeof baseClass !== "Object") {
                    throw new TypeError("Base class must be Object");
                }

                Class = extend(Class, baseClass);
            }

            if (className) {
                Class = createObject(className, Class);
            }

            return Class;
        },

        isClass: function (classObject) {
            if (drawunit.isNull(classObject)) {
                throw new TypeError("Variable must be string");
            }

            var Class = classObject;
            if (typeof classObject === 'string') {
                Class = eval(classObject);
            }

            if (drawunit.isNull(Class)) {
                throw new TypeError("Class is not existed");
            }

            return drawunit.isNull(Class.$className);
        }
    };
})();

// class Point extends Type {{{
var Point = drawunit.class.define("drawunit.Point", {
    constructor: function (x, y) {
        this.type = "point";
        this.x = x;
        this.y = y;
    },

    methods: {
        getX: function () {
            return this.x;
        },

        getY: function () {
            return this.y;
        }
    }
});
// }}}

drawunit.require("drawunit.Point");

// class Vector extends Point {{{
var Vector = drawunit.class.define("drawunit.Vector", {

    extend: drawunit.Point,

    constructor: function (x, y) {
        this.type = "vector";
        this.superclass(x, y);
    }
});
// }}}

drawunit.require("drawunit.Point");

// class Layer extends Type {{{
var Layer = drawunit.class.define("drawunit.Layer", {

    constructor: function (htmlEl, drawunitObject, customConfig) {
        this.type = "layer";

        var canvas = drawunit.Layer.createCanvas(htmlEl, customConfig);
        canvas.layer = this;

        this.canvas = canvas;
        this.context = canvas.getContext("2d");

        this.width = customConfig.width || 0;
        this.height = customConfig.height || 0;

        this.setStyleSpec(customConfig);

        this.handler = {};
        this.drawunit = drawunitObject;
    },

    statics: {
        DEFAULT_FONT: "42px Calibri",

        DEFAULT_FONTCOLOR: "#000000",

        DefaultHandler: {
            "mousedown": function (mouseObject) {},
            "mouseup"  : function (mouseObject) {},
            //"mousemove": function (mouseObject) {},
            // "mouseout" : function (mouseObject) {}
        },

        toRad: function (degree) {
            if (degree) {
                return Math.PI * degree / 180;
            }
            return 0;
        },

        createCanvas: function (wrapperObject, attributes) {
            if (drawunit.isNull(wrapperObject)) return null;

            var canvas = drawunit.createElement("canvas", {
                parentEl: wrapperObject,

                attributes: {
                    width: (attributes.width) ? attributes.width : null,
                    height: (attributes.height) ? attributes.height : null
                },

                style: {
                    position: "absolute",
                    top: 0,
                    left: 0,
                }
            });

            return canvas;
        },

        checkHandler: function (event) {
            if (typeof this.handler === 'undefined') {
                this.handler = {};
            }

            return typeof this.handler[event] !== 'undefined';
        },

        mouseDownHandler: function (mouseObject) {
            var canvas = this;
            var mouseListener = canvas.layer.getEventListener("mousedown");
            mouseListener.call(canvas.layer, mouseObject);
            // this.addEventListener('mousemove', drawunit.Layer.mouseMoveHandler);
        },

        mouseUpHandler: function (mouseObject) {
            var canvas = this;
            var mouseListener = canvas.layer.getEventListener("mouseup");
            mouseListener.call(canvas.layer, mouseObject);
            // canvas.removeEventListener('mousemove', drawunit.Layer.mouseMoveHandler);
        },

        // mouseMoveHandler: function (mouseObject) {
        //     var canvas = this;
        //     var mouseListener = canvas.layer.getEventListener("mousemove");
        //     mouseListener.call(canvas.layer, mouseObject);
        // },

        // mouseOutHandler: function (mouseObject) {
        //     var canvas = this;
        //     var mouseListener = canvas.layer.getEventListener("mouseout");
        //     mouseListener.call(canvas.layer, mouseObject);
        //     canvas.removeEventListener('mousemove', drawunit.Layer.mouseMoveHandler);
        // }
    },

    methods: {
        addEventListener: function (event, handler) {
            if (typeof this.handler === 'undefined') {
                this.handler = {};
            }

            this.handler[event] = handler;
        },

        getEventListener: function (event) {
            if (drawunit.Layer.checkHandler.call(this, event)) {
                return this.handler[event];
            }

            return drawunit.Layer.DefaultHandler[event];
        },

        drawAt: (function () {
            var convertPoints = function (points, fi) {
                var base_point = { x: points[0].x, y: points[0].y },
                    calNewCoord = function (raw_point) {
                        var point = {
                            x: raw_point.x * Math.cos(fi) - raw_point.y * Math.sin(fi),
                            y: raw_point.x * Math.sin(fi) + raw_point.y * Math.cos(fi)
                        };

                        return new drawunit.Point(
                            base_point.x + point.x,
                            base_point.y + point.y
                        );
                    }, length = points.length, res = [];

                res.push(new drawunit.Point(base_point.x, base_point.y));

                for (var i = 1; i < length; i++) {
                    var point = points[i];
                    res.push(calNewCoord(point));
                }

                return res;
            };

            var draw = function (points, config) {
                var ctx = this.context,
                    length = points.length;

                if (config.hasOwnProperty("fill") && typeof config.fill === 'object') {
                    var cfg       = config.fill,
                        fillColor = cfg.color || "black";

                    ctx.fillStyle = fillColor;
                    ctx.beginPath();

                    ctx.moveTo(0, 0);
                    for (var i = 1; i < length; i++) {
                        var point = points[i];
                        this.context.lineTo(point.x, point.y);
                    }

                    ctx.closePath();
                    ctx.fill();
                }

                if (config.hasOwnProperty("line") && typeof config.line === 'object') {
                    var cfg     = config.line,
                        lnColor = cfg.color || "black";

                    ctx.fillStyle = lnColor;
                    ctx.moveTo(0, 0);
                    this.drawLine(new Point(0, 0), points[1]);

                    for (var i = 1; i < length - 1; i++) {
                        var p1 = points[i],
                            p2 = points[i + 1];
                        this.drawLine(p1, p2);
                    }
                    this.drawLine(points[length - 1], new Point(0, 0));
                }

                if (config.hasOwnProperty("text") && typeof config.text === 'object') {
                    var text = config.text.value || "",
                        angle = config.text.angle || 0;
                    if (text !== "") {
                        var point = new drawunit.Point(config.text.x || 0, config.text.y || 0);
                        this.drawText(text, point, angle, config.text);
                    }
                }
            };

            return function (points, angle, config) {
                var root = points[0],
                    length = points.length,
                    config = config || {};

                this.context.translate(root.x, root.y);

                if (angle) {
                    var rad = drawunit.Layer.toRad(angle);
                    this.context.rotate(rad);
                }

                draw.call(this, points, config);

                if (angle) {
                    this.context.rotate(-1 * rad);
                }

                this.context.translate(-1 * root.x, -1 * root.y);

                return convertPoints(points, rad ? rad : 0);
            };
        })(),

        drawLine: function (p1, p2) {
            var x0 = p1.x, y0 = p1.y,
                x1 = p2.x, y1 = p2.y;

            var dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
            var dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
            var err = (dx > dy ? dx : -dy) / 2;
            while (true) {
                this.context.fillRect(x0, y0, 1, 1);
                if (x0 === x1 && y0 === y1) break;
                var e2 = err;
                if (e2 > -dx) { err -= dy; x0 += sx; }
                if (e2 < dy) { err += dx; y0 += sy; }
            }
        },

        drawText: function (text, point, angle, config) {
            if (typeof text === 'undefined' || typeof text === null) {
                return;
            }

            var point = point || new drawunit.Point(0, 0),
                font = drawunit.Layer.DEFAULT_FONT,
                color = drawunit.Layer.DEFAULT_FONTCOLOR;

            if (config) {
                if (config.font) font = config.font;
                if (config.color) color = config.color;
            }

            this.context.translate(point.x, point.y);

            if (angle) {
                var rad = drawunit.Layer.toRad(angle || 0);
                this.context.rotate(rad);
            }

            this.context.font = font;
            this.context.fillStyle = color;
            this.context.fillText(text, 0, 0);

            if (angle) {
                this.context.rotate(-rad);
            }

            this.context.translate(-1 * point.x, -1 * point.y);
        },

        getStyleSpec: function () {
            return this.canvas.style;
        },

        setStyleSpec: (function () {
            var format = function (property, value) {
                if (typeof value !== 'undefined' && value !== null) {
                    return value;
                }
                return property;
            }

            return function (attributes) {
                if (attributes) {
                    var canvas = this.canvas;

                    canvas.style.margin = format(canvas.style.margin, attributes.margin);
                    canvas.style.zIndex = format(canvas.style.zIndex, attributes.zIndex);
                }
            }
        })(),

        setActive: function (value) {
            var canvas = this.canvas;

            if (value) {
                canvas.addEventListener('mousedown', drawunit.Layer.mouseDownHandler);
                canvas.addEventListener('mouseup', drawunit.Layer.mouseUpHandler);
                // canvas.addEventListener('mouseout', drawunit.Layer.mouseOutHandler);
            }
            else {
                canvas.removeEventListener('mousedown', drawunit.Layer.mouseDownHandler);
                canvas.removeEventListener('mouseup', drawunit.Layer.mouseUpHandler);
                // canvas.removeEventListener('mouseout', drawunit.Layer.mouseOutHandler);
            }
        }
    }
});
// }}}

// class DrawObject extends Type {{{
var DrawObject = drawunit.class.define("drawunit.DrawObject", {

    constructor: function (object) {
        this.type = "drawobject";

        if (drawunit.isNull(object)) {
            this.id = drawunit.DrawObject.nextId();
        }

        if (object) {
            this.id = object.id || drawunit.DrawObject.nextId();
            this.points = object.points;
            this.drawpoints = object.drawpoints;

            this.originalColor = object.color;
            this.color = object.color;

            this.angle = object.angle;
            this.events = object.events || {};

            this.drawunit = object.drawunit || null;
            this.layer = object.layer || null;

            this.drawConfig = object.config;
            this.data = object.data;
        }
    },

    statics: {
        DEFAULTSELECTCOLOR: "#A5D5F7",

        ID: 0,

        nextId: function () {
            return "auto-" + (++ drawunit.DrawObject.ID).toString();
        }
    },

    methods: {
        getOriginalColor: function () {
            return this.originalColor;
        },

        changeColor: function (hexColor) {
            var drawConfig = Object.create(this.drawConfig);
            drawConfig.fill = true;
            drawConfig.color = hexColor;

            this.layer.drawAt(this.drawpoints, this.angle, drawConfig);
            this.layer.drawAt(this.drawpoints, this.angle);

            this.color = hexColor;
        }
    }
});
//}}}

drawunit.require("drawunit.Vector");
drawunit.require("drawunit.Layer");
drawunit.require("drawunit.DrawObject");

// class DrawUnit extends Type {{{
var DrawUnit = drawunit.class.define("drawunit.DrawUnit", {

    constructor: function (containerId, attributes, events) {
        this.type = "drawunit";

        var container;

        if (typeof containerId === 'undefined') {
            container = $('body');
        } else {
            container = document.getElementById(containerId);
        }

        if (typeof events === 'undefined') {
            events = {};
        }

        this.width = attributes.width || 0;
        this.height = attributes.height || 0;

        this.events = events;
        this.layers = [];
        this.container = container;

        this.createLayer(attributes);
    },

    statics: {
        DEFAULTSELECTCOLOR: "#A5D5F7",

        DX: 10,

        DY: 10,

        ZINDEX: 0,

        nextZIndex: function () {
            var cur = drawunit.DrawUnit.ZINDEX + 1;

            // next value generator
            drawunit.DrawUnit.ZINDEX = cur;

            return cur.toString();
        },

        onMouseDown: function (mouseObject) {
            var x = mouseObject.offsetX,
                y = mouseObject.offsetY;

            this.drawunit.mouseValue = {
                offsetX: x,
                offsetY: y
            };

            this.drawunit.cleanObject();
        },

        // onMouseMove: function (mouseObject) {
        //     var x0 = this.drawunit.mouseValue.offsetX,
        //         y0 = this.drawunit.mouseValue.offsetY,
        //         x = mouseObject.offsetX,
        //         y = mouseObject.offsetY,
        //         dx = (x - x0) / Math.abs(x - x0),
        //         dy = (y - y0) / Math.abs(y - y0);
        //
        //     var drawunit = this.drawunit;
        //     drawunit.selectedItems = drawunit.selectedItems || [];
        //
        //     drawunit.cleanObject();
        //     var selectedItems = drawunit.selectedItems;
        //
        //     if (this.drawunit.items) {
        //         for (var i = x0; i < x; i += dx) {
        //             for (var j = y0; j < y; j += dy) {
        //                 var o = this.drawunit.findObject(i, j);
        //
        //                 if (o) {
        //                     var p = selectedItems.filter(function (item) {
        //                         return item.id === o.id;
        //                     });
        //
        //                     if (p.length === 0) {
        //                         selectedItems.push(o);
        //                     }
        //                 }
        //             }
        //         }
        //
        //         selectedItems.forEach(function (item, index) {
        //             drawunit.doSelect(item);
        //         });
        //     }
        // },

        onMouseUp: function (mouseObject) {
            if (drawunit.isNull(this.drawunit.mouseValue)) return;

            var drunit = this.drawunit,
                x0, y0, x, y;

            if (drunit.mouseValue.offsetX < mouseObject.offsetX) {
                x0 = drunit.mouseValue.offsetX;
                x  = mouseObject.offsetX;
            } else {
                x0 = mouseObject.offsetX;
                x  = drunit.mouseValue.offsetX;
            }

            if (drunit.mouseValue.offsetY < mouseObject.offsetY) {
                y0 = drunit.mouseValue.offsetY;
                y  = mouseObject.offsetY;
            } else {
                y0 = mouseObject.offsetY;
                y  = drunit.mouseValue.offsetY;
            }

            var dx = (x - x0) / Math.abs(x - x0) * drawunit.DrawUnit.DX,
                dy = (y - y0) / Math.abs(y - y0) * drawunit.DrawUnit.DY;

            for (var i = x0; i <= x; i += dx) {
                for (var j = y0; j <= y; j += dy) {
                    var drawObject = drunit.findObject(i, j);

                    if (drawObject && drunit.selectedItems.indexOf(drawObject) === -1) {
                        drunit.doSelect(drawObject);
                    }
                }
            }

            var selectedItems = Object.create(drunit.selectedItems),
                selectedItemsCount = selectedItems.length;

            if (selectedItemsCount > 0) {
                if (selectedItemsCount === 1) {
                    var item = selectedItems[0],
                        clickEvent = item.events.click || function (item) { };
                    clickEvent(item);
                }

                else if (selectedItemsCount > 1) {
                    var items = selectedItems,
                        selectEvent = drunit.events.select || function (items) {};
                    selectEvent(items);
                }
            }

            drunit.mouseValue = null;
        },

        // onMouseOut: function (mouseObject) {
        //     this.drawunit.cleanObject();
        // }
    },

    methods: {
        on: function (e, f) {
            this.events = this.events || {};
            this.events[e] = f;
        },

        findObject: (function () {
            var angle2D = function (v1, v2) {
                var PI = Math.PI,
                    TWOPI = 2 * PI,
                    theta1 = Math.atan2(v1.y, v1.x),
                    theta2 = Math.atan2(v2.y, v2.x),
                    dtheta = theta2 - theta1;
                while (dtheta > PI) {
                    dtheta -= TWOPI;
                }
                while (dtheta < -PI) {
                    dtheta += TWOPI;
                }

                return dtheta;
            };

            var isPointInPolygon = function (point, polygon) {
                var angle = 0,
                    n = polygon.length;
                for (var i = 0; i < n; i++) {
                    var p = polygon[i],
                        v1 = new drawunit.Vector(
                            polygon[i].x - point.x,
                            polygon[i].y - point.y
                        ),
                        v2 = new drawunit.Vector(
                            polygon[(i + 1) % n].x - point.x,
                            polygon[(i + 1) % n].y - point.y
                        );
                    angle += angle2D(v1, v2);
                }

                return Math.abs(angle) >= Math.PI;
            };

            return function (x, y) {
                if (this.items) {
                    var length = this.items.length;
                    for (var i = 0; i < length; i++) {
                        var item = this.items[i];
                        if (isPointInPolygon(new drawunit.Point(x, y), item.points)) {
                            return item;
                        }
                    }
                }
            }
        })(),

        doSelect: function (drawObject) {
            this.selectedItems.push(drawObject);
            drawObject.changeColor(drawunit.DrawUnit.DEFAULTSELECTCOLOR);
        },

        cleanObject: function () {
            if (this.selectedItems) {
                var length = this.selectedItems.length;
                for (var i = 0; i < length; i++) {
                    var o = this.selectedItems[i];
                    o.changeColor(o.originalColor);
                }
            }

            this.selectedItems = [];
        },

        createDrawObject: function (object) {
            // draw object to canvas and get converted coordinate of points
            var object = object || {}

            object.drawunit = this;
            object.layer = this.activeLayer;
            object.drawpoints = object.points;
            object.color = object.color || '#FFFFFF';

            object.config = object.config || {};
            object.points = this.activeLayer.drawAt(object.points, object.angle, object.config);
            object.angle = object.angle || 0;

            var o = new drawunit.DrawObject(object);

            this.items = this.items || [];
            this.items.push(o);

            return o;
        },

        setStyleActiveLayer: function (attributes) {
            this.activeLayer.setStyleSpec(attributes);
        },

        activeLayer: function (layer) {
            if (layer) {
                layer.setActive(true);
            }
        },

        setActiveLayer: function (layer) {
            var length = this.layers.length;

            for (var i = 0; i < length; i++) {
                this.layers[i].setActive(false);
            }

            layer.setActive(true);
            this.activeLayer = layer;
        },

        createLayer: function (attributes) {
            attributes.width = attributes.width || this.width;
            attributes.height = attributes.height || this.height;
            attributes.zIndex = drawunit.DrawUnit.nextZIndex();

            var layer = new drawunit.Layer(this.container, this, attributes);

            // Apply events
            layer.addEventListener('mousedown', DrawUnit.onMouseDown);
            // layer.addEventListener('mousemove', DrawUnit.onMouseMove);
            layer.addEventListener('mouseup', DrawUnit.onMouseUp);
            // layer.addEventListener('mouseout', DrawUnit.onMouseOut);

            this.layers.push(layer);
            this.setActiveLayer(layer);

            return layer;
        },

        writeText: function (text, point, angle, config) {
            this.activeLayer.drawText(text, point, angle, config);
        },

        drawAt: function (points, angle, config) {
            this.activeLayer.drawAt(points, angle, config);
        }
    }
});
//}}}
