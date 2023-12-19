if (typeof drawunit === 'undefined' || drawunit === null) {
    throw new TypeError('Could not load drawunit.js');
}

drawunit.yard = {
    /* Draw yard
     * @param wrapperId: Id of canvas wrapper
     * @param yard: Yard data which get from database
     */
    drawYard: (function() {

        /* Calculate big frame of the whole yard
         * @param points: points of blocks in yard
         */
        function calCanvasSize(points) {
            var maxx = 0;
            var maxy = 0;

            for (var i = 0; i < points.length; i++) {
                var point = points[i];

                if (point.x > maxx) {
                    maxx = point.x;
                }

                if (point.y > maxy) {
                    maxy = point.y;
                }
            }

            return {
                width: maxx,
                height: maxy
            };
        }

        return function(wrapperId, yard) {
            var canvasSize = calCanvasSize(yard.points),
                drawer = new DrawUnit(wrapperId, {
                    width: canvasSize.width,
                    height: canvasSize.height
                }),
                length = yard.blocks.length;

            // draw blocks
            for (var i = 0; i < length; i++) {
                var block = yard.blocks[i],
                    width = block.points[2].x,
                    height = block.points[2].y;

                drawer.createDrawObject({
                    points: block.points,
                    config: {
                        fill: {
                            color: block.color
                        },
                        line: {
                            color: "black"
                        },
                        text: {
                            value: block.name,
                            font: "21px Calibri",
                            x: (width - 15) / 2,
                            y: (height + 15) / 2
                        }
                    },
                    angle: block.degree,
                    events: {
                        click: function(item) {
                            var myMask = new Ext.LoadMask(App.viewport, { msg: "Loading..." });
                            myMask.show();
                            hidblockname.value = item.data.blockName;
                            window.CompanyX.ShowBlockDetail(
                            {
                                success: function() {
                                    myMask.hide();
                                }
                            });
                        }
                    },

                    data: {
                        blockName: block.name
                    }
                });
            }
        };

    })()
};