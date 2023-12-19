if (typeof drawunit === 'undefined' || drawunit === null) {
    throw new TypeError('Could not load drawunit.js');
}

drawunit.block = {
    /* Draw block
     * @param wrapperId: Id of canvas wrapper
     * @param block: Block data which get from database
     */
    drawBlock: (function () {

        var _width = 0,
            _height = 0;

        var _cols = 0,
            _row = 0;

        var _cellData = [];

        function getCellData (x, y)
        {
            if (typeof _cellData === 'undefined' || _cellData === null) {
                return null;
            }

            return _cellData[y * _cols + x];
        }

        /* Config CSS style of current active layer
         */
        function setStyleLayer() {
            var dw = 100, dh = 100;

            this.setStyleActiveLayer({
                margin: Ext.String.format("{0}px {1}px {0}px {1}px", dh / 2, dw / 2)
            });
        }

        /* Draw Block base
         * @param block: Block data which get from database
         */
        function drawBlockBase(block) {
            setStyleLayer.call(this);

            var base_point = { x: 0, y: 0 },
                points = [];

            for (var r = 0; r < block.rows; r++) {
                for (var c = 0; c < block.collumns; c++) {
                    points = [
                        { x: base_point.x, y: base_point.y },
                        { x: _width, y: 0 },
                        { x: _width, y: _height },
                        { x: 0, y: _height }
                    ];

                    this.drawAt(points, 0, {
                        fill: {
                                color:"white"
                            },
                            line: {
                                color: "black"
                            }
                });

                    _cellData.push(base_point);

                    base_point = {
                        x: base_point.x + _width,
                        y: base_point.y
                    }
                }

                base_point = {
                    x: 0,
                    y: base_point.y + _height
                }
            }
        }

        /* Draw Container
         * @param block: Block data which get from database
         */
        function drawContainer(block) {
            setStyleLayer.call(this);

            var cells = block.cells,
                ln = cells.length;

            for (var i = 0; i < ln; i++) {
                var cell = cells[i];

                var container = cell.container,
                    positions = cell.cells;

                var firstPos = getCellData(positions[0].X, positions[0].Y);

                this.createDrawObject({
                    points: [
                        { x: firstPos.x,                y: firstPos.y },
                        { x: _width * positions.length, y: 0 },
                        { x: _width * positions.length, y: _height },
                        { x: 0,                         y: _height }
                    ],
                    config: {
                        fill: {
                            color: container.COLOR || "green"
                        },
                        line: {
                            color:"black"
                        },

                    },
                    events: {
                        click: function (item) {
                            top.BlockContainer_Click(item);
                        }
                    },

                    data: {
                        container: container,
                        posname: cell.posname,
                        rows: block.rows,
                        blockname: block.name
                    }
                });
            }
        }

        /* Draw Container
         * @param block: Block data which get from database
         * @param cell:  Size of one cell in block
         * @param bsize: Layer size
         * @param chars: Characters of block
         */
        function drawText(block, cell, bsize, chars) {
            var scale = block.scale;

            var dw = 25 * scale, dh = 25 * scale;

            //setStyleLayer.call(this);

            this.createLayer({
                width: bsize.width + dw,
                height: bsize.height + dh
            });

            if (typeof chars === 'undefined' || chars == null) {
                chars = {};
                chars.vertical = ["A", "B", "C", "D", "E", "F", "G", "H"];
                chars.horizal = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"];
            }

            var fontSize = 5 * scale;

            var chrs = chars.vertical,
                length = chrs.length;

            for (var i = 0; i < length; i++) {
                var chr = chrs[i],
                    point = new Point(dw / scale, i * cell.height + dh / 2 + dh / scale - scale);

                this.writeText(chr, point, 0, {
                    font: fontSize + "px Calibri"
                });
            }

            chrs = chars.horizal;
            length = chrs.length;

            for (var i = 0; i < length; i++) {
                var chr = chrs[i],
                    point = new Point(dw / 2 + (i + 1) * (cell.width / 2) - 5, dw / 2 - 10);

                //if (i % 2 === 0) {
                //    point = new Point(i * cell.width + dw / 2 + cell.width / 2 - 10, dw / 2 - 10);
                //} else {
                //    point = new Point((i - 1) * cell.width + dw / 2 + cell.width, dw / 2 - 10);
                //}

                this.writeText(chr, point, 0, {
                    font: fontSize + "px Calibri"
                });
            }
        }

        return function (wrapperId, block) {
            var scale = block.scale,
                points = [],
                length = block.points.length,
                chars = block.chars;

            for (var i = 0; i < length; i++) {
                var point = block.points[i];
                points.push({
                    x: point.x * scale,
                    y: point.y * scale
                });
            }
            block.points = points;

            _cols = block.collumns;
            _row = block.rows;

            // draw cell
            var width = Math.round(points[2].x / block.collumns),
                height = Math.round(points[2].y / block.rows);

            _width = width;
            _height = height;

            var drawer = new DrawUnit(wrapperId, {
                width: width * block.collumns + 1,
                height: height * block.rows + 1 + 200
            });

            // register select event
            drawer.on('select', function (items) {
                top.BlockContainer_Select(items);
            });

            drawBlockBase.call(drawer, block);

            var layerContainer = drawer.createLayer({
                width: width * block.collumns + 1,
                height: height * block.rows + 1 + 200
            });
            drawContainer.call(drawer, block);

            drawText.call(drawer, block, {
                width: width,
                height: height
            }, {
                width: width * block.collumns + 1,
                height: height * block.rows + 1 + 200
            }, chars);

            drawer.setActiveLayer(layerContainer);
            drawer.setStyleActiveLayer({
                zIndex: drawunit.DrawUnit.nextZIndex()
            });
        };
    })()
};