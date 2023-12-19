
drawunit.planview = {
    drawCell: function(drawUnit, config) {
        config = config || {};

        // position configs
        var X = config.X,
            Y = config.Y,
            W = config.W,
            H = config.H,
            DX = config.DX,
            DY = config.DY;

        // object configs
        var color = config.color,
            text = config.text;

        var drawConfig = {
            points: [
                new drawunit.Point(X * W, Y * H),
                new drawunit.Point(W * DX, 0),
                new drawunit.Point(W * DX, H * DY),
                new drawunit.Point(0, H * DY)
            ],
            config: {
                fill: {
                    color: color
                },
                line: {
                    color: "black"
                }
            },
            data: config.data,
            events: {
                click: this.clickHandler
            }
        };

        if (text) {
            var angle = 0,
                textW = W,
                textH = H,
                textDX = DX,
                textDY = DY,
                maxTextDX = 2;

            var needRotate = W * DX < H * DY;

            if (needRotate) {
                textW = H;
                textH = W;
                textDX = DY;
                textDY = DX;
                maxTextDX = 4;
                angle = -90;
            }

            var overWidth = textDX > maxTextDX;

            var em = 16, // 1em = 16px
                vw = (0.02833333333 * textW) * em, // define vw (view point width) of 16px, it measures the pixels of width by 1 character will fix 1 cell width
                value = text.value,
                scale = text.scale;

            var fontSize = (1 * vw) / value.length * (overWidth ? maxTextDX : textDX) * scale,
                vh = 0.7 * fontSize,  // define vh (view point height) of font size, it measures the pixels of height by 1 character will fix top 1 cell height
                x = 0,
                y = 0;

            if (needRotate) {
                x = 1 * vh + (0.5 * textH * textDY - 0.5 * vh);
                y = overWidth ? 0.5 * (textW * textDX - textW * maxTextDX) + (H * DY) / 2 : textW * textDX;
            } else {
                x = overWidth ? 0.5 * (textW * textDX - textW * maxTextDX) : 0;
                y = 1 * vh + (0.5 * textH * textDY - 0.5 * vh);
            }

            drawConfig.config.text = {
                value: value,
                font: (fontSize || 12).toString() + "px monospace",
                x: x,
                y: y,
                angle: angle
            }
        }

        drawUnit.createDrawObject(drawConfig);
    },

    drawPlanCell: function(containerId, data) {
        // init data
        data = data || {};

        var block = data.block,
            scale = data.scale || 1,
            points = data.points,
            cell = {
                width: Math.round(points[2].x / block.columns) * scale,
                height: Math.round(points[2].y / block.rows) * scale
            };

        var planData = data.planData || [],
            planDataLength = planData.length;

        var blockSize = {
            width: cell.width * block.columns + 1,
            height: cell.height * block.rows + 1
        };

        var drawer = new DrawUnit(containerId, blockSize);
        drawer.on("select", this.selectHandler);

        for (var i = 0; i < planDataLength; i++) {
            var planCell = planData[i];
            var config = {
                X: planCell.PX0,
                Y: planCell.PY0,

                W: cell.width,
                H: cell.height,

                DX: planCell.PX1 - planCell.PX0 + 1,
                DY: planCell.PY1 - planCell.PY0 + 1,

                data: {
                    type: planCell.Type,

                    x0: planCell.PX0,
                    x1: planCell.PX1,
                    y0: planCell.PY0,
                    y1: planCell.PY1,

                    range: planCell.Range,
                    units: planCell.Units,
                    available: planCell.Available
                }
            };

            switch (planCell.Type) {
                case "CELL":
                    config.color = "white";
                    break;
                case "CONTAINER":
                    config.color = "#DDDDDD";
                    break;
                default:
                    config.color = planCell.Color || "#DFDFDF";
                    config.text = {
                        value: planCell.Range ? planCell.Range.RangeName || "" : "",
                        scale: scale
                    };
                    break;
            }

            this.drawCell(drawer, config);
        }

        data.scale = scale;
        
        return {
            drawUnit: drawer,
            data: data,
            blockSize: blockSize,
            cellSize: cell
        };
    },

    drawBlockText: function(drawer, scale, blockSize, cellSize, textData) {
        if (typeof textData === 'undefined' || textData == null) {
            throw new TypeError("textData");
        }

        scale = scale || 1.0;
        blockSize = blockSize || {};
        cellSize = cellSize || {};

        var dw = 25 * scale, dh = 25 * scale;

        drawer.createLayer({
            width: blockSize.width + dw,
            height: blockSize.height + dh
        });

        var fontSize = 5 * scale,
            chrs = textData.vertical,
            length = chrs.length;

        for (var i = 0; i < length; i++) {
            var chr = chrs[i],
                point = new Point(dw / scale, i * cellSize.height + dh / 2 + dh / scale - scale);

            drawer.writeText(chr, point, 0, {
                font: fontSize + "px Calibri"
            });
        }

        chrs = textData.horizal;
        length = chrs.length;

        for (var i = 0; i < length; i++) {
            var chr = chrs[i],
                point = new Point(dw / 2 + (i + 1) * (cellSize.width / 2) - 5, dw / 2 - 10);

            drawer.writeText(chr, point, 0, {
                font: fontSize + "px Calibri"
            });
        }

        return {
            dw: dw,
            dh: dh
        };
    },

    clickHandler: function (item) {
        top.planViewClickHandler(item);
    },

    selectHandler: function (items) {
        top.planViewSelectHandler(items);
    }
};



