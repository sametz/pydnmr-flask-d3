/* global d3 */
(function (pydnmr) {
    console.log('pydnmr_init.js start');
    var WIDTH_DEFAULT = 600;
    var HEIGHT_DEFAULT = 400;
    var PADDING = 40;
    var margin = {top: 20, right: 80, bottom: 30, left: 50},
                innerwidth = WIDTH_DEFAULT - margin.left - margin.right,
                innerheight = HEIGHT_DEFAULT - margin.top - margin.bottom;
    var dummy_data = {
        x: [0, 1, 2, 3, 4],
        y: [0, 1, 4, 9, 16]
    };

    pydnmr.init = function(data) {
        console.log("creating SVG");
        pydnmr.svg = d3.select("#plot-area").append("svg")
            .attr("width", WIDTH_DEFAULT)
            .attr("height", HEIGHT_DEFAULT)
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                console.log("svg created");
        pydnmr.path = pydnmr.svg.append("path")
            .attr("id", "plot-path")
    };


    pydnmr.update = function(data) {
        console.log("entering update");
        pydnmr.updateScale(data);
        // pydnmr.updateAxes(data);
        // pydnmr.updatePlot(data);
        pydnmr.plot(data);
    };

     pydnmr.updateScale = function(data) {
        console.log("update the scale!");
        // var margin = {top: 20, right: 80, bottom: 30, left: 50},
        //         innerwidth = WIDTH_DEFAULT - margin.left - margin.right,
        //         innerheight = HEIGHT_DEFAULT - margin.top - margin.bottom;
        console.log("testing max functions...");
        var xmax = d3.max(data.x, function(d) {return d;});
        var ymax = d3.max(data.y, function(d) {return d;});
        console.log(xmax, ymax);
        pydnmr.xScale = d3.scale.linear()
            .domain([0, //fix once rest works
                d3.max(data.x, function (d) {
                    // return d3.max(d.x);
                    return d;
                })])
            .range([innerwidth, 0]);

        pydnmr.yScale = d3.scale.linear()
            .domain([0, //fix once rest works
                d3.max(data.y, function (d) {
                // return d3.max(d.y);
                return d;
            })])
            .range([innerheight, 0]);

        console.log("scales should be made");

        console.log("update the axes!");
        pydnmr.xAxis = d3.svg.axis()
            .scale(pydnmr.xScale)
            .orient("bottom");
        pydnmr.yAxis = d3.svg.axis()
            .scale(pydnmr.yScale)
            .orient("left");
        pydnmr.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + innerheight + ")")
            .call(pydnmr.xAxis);
        pydnmr.svg.append("g")
            .attr("class", "y axis")
            .call(pydnmr.yAxis);
        console.log("axes should be made");
    };

    //  pydnmr.updateAxes = function(data) {
    //     console.log("update the axes!");
    //     pydnmr.xAxis = d3.svg.axis()
    //         .scale(pydnmr.xScale)
    //         .orient("bottom");
    //     pydnmr.yAxis = d3.svg.axis()
    //         .scale(pydnmr.yScale)
    //         .orient("left");
    //     pydnmr.svg.append("g")
    //         .attr("class", "x-axis")
    //         .call(pydnmr.xAxis);
    //     pydnmr.svg.append("g")
    //         .attr("class", "y-axis")
    //         .call(pydnmr.yAxis);
    //     console.log("axes should be made");
    // };

    // pydnmr.updatePlot = function(data) {
    //     pydnmr.path.datum(data)
    //         .call(pydnmr.plot);
    //     // console.log("data should be bound")
    // };

    pydnmr.plot = function(data) {
        console.log("entered plot");
        console.log("Can data be logged?");
        console.log(data);
        console.log("minimum and maximum y:");
        var minimum = d3.min(data.y, function(d) {return d;});
        var maximum = d3.max(data.y, function(d) {return d;});
        console.log(minimum + ", " + maximum);
        var plot_data = d3.zip(data.x, data.y);
        var line = d3.svg.line()
            .interpolate("basis")
            .x(function (d) {
                console.log("entering line x")
                console.log("parsing" + d + "--> " + d[0]);
                console.log("scaled" + pydnmr.xScale(d[0]));
                return pydnmr.xScale(d[0]);
            })
            .y(function (d) {
                console.log("entering line y")
                console.log("parsing" + d + "--> " + d[1]);
                console.log("scaled" + pydnmr.yScale(d[1]));
                return pydnmr.yScale(d[1]);
            });

        pydnmr.path.attr("class", "line")
            .datum(plot_data)
            .attr("d", function(d) {
                console.log("about to call line");
                console.log(d);
                // console.log(line(d));
                return line(d);})
        ;
        // pydnmr.svg.append("path")
        //     .attr("id", "secondpath")
        //     .datum(plot_data)
        //     .attr("d", function(d){return line(d);});

        console.log("did datasets get logged?");


    };

    pydnmr.init(dummy_data);
    pydnmr.update(dummy_data);
}(window.pydnmr = window.pydnmr || {}));

// window.onload = init;
//
// function createSVG() {
//     console.log("entering createSVG");
//     d3.select("#plot-area")
//         .append("svg")
//         .attr("width", WIDTH_DEFAULT)
//         .attr("height", HEIGHT_DEFAULT);
//     console.log("exiting createSVG");
// }
//
// function init() {
//     console.log('init entered');
//     createSVG();
//     console.log('past createSVG')
//     modelSelect = d3.selectAll("#model-selection input");
//     modelSelect.on("change", function() {
//         var modelName = d3.select(this).property("value");
//         console.log('model name ' + modelName + ' selected');
//         d3.json("/data?model=" + modelName, function(data) {
//             updateGraph(data);
//         });
//     });
// }
//
//
//
// function updateGraph(data) {
//     d3.select("#plot-area p").text(JSON.stringify(dummy_data));
//
//     var svg = d3.select("svg")
//     svg.datum(dummy_data)
//         .call(nmr_spectrum)
// }
//
// var nmr_spectrum = d3_nmr_spectrum()
//     .width(WIDTH_DEFAULT)
//     .height(HEIGHT_DEFAULT)
//     // .xlabel("frequency (Hz)")
//     // .ylabel("intensity");
//
// function d3_nmr_spectrum() {
//     var width = WIDTH_DEFAULT,
//         height = HEIGHT_DEFAULT,
//         xlabel = "X Axis Label",
//         ylabel = "Y Axis Label";
//
//     function spectrum(selection) {
//         selection.each(function (datasets) {
//             var margin = {top: 20, right: 80, bottom: 30, left: 50},
//                 innerwidth = width - margin.left - margin.right,
//                 innerheight = height - margin.top - margin.bottom;
//
//             var xScale = d3.scale.linear()
//                 .domain([0, //fix once rest works
//                     d3.max(datasets, function (d) {
//                         return d3.max(d.x);
//                     })])
//                 .range([innerwidth, 0]);
//
//             var yScale = d3.scale.linear()
//                 .domain([0, //fix once rest works
//                     d3.max(datasets, function (d) {
//                     return d3.max(d.y);
//                 })])
//                 .range([innerheight, 0]);
//
//             var color_scale = d3.scale.category10()
//                 .domain(d3.range(datasets.length));
//
//             var line = d3.svg.line()
//                 .interpolate("basis")
//                 .x(function (d) {
//                     // console.log("entering line x")
//                     // console.log("parsing" + d);
//                     // console.log("scaled" + xScale(d));
//                     return xScale(d[0]);
//                 })
//                 .y(function (d) {
//                     return yScale(d[1]);
//                 });
//
//             var svg = d3.select(this)
//                 .attr("width", width)
//                 .attr("height", height)
//                 .append("g")
//                 .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
//             var data_lines = svg.selectAll(".d3_xy_chart_line")
//                 .data(datasets.map(function (d) {
//                     return d3.zip(d.x, d.y);
//                 }))
//                 .enter().append("g")
//                 .attr("class", "d3_xy_chart_line");
//
//             data_lines.append("path")
//                 .attr("class", "line")
//                 .attr("d", function (d) {
//                     return line(d);
//                 })
//                 .attr("stroke", function (_, i) {
//                     return color_scale(i);
//                 });
//
//         });
//     }
//
//     spectrum.width = function (value) {
//         if (!arguments.length) return width;
//         width = value;
//         return spectrum;
//     };
//
//     spectrum.height = function (value) {
//         if (!arguments.length) return height;
//         height = value;
//         return spectrum;
//     };
//
//     return spectrum;
// }




//     var xData = data[0];
//     var yData = data[1];
//     console.log('x start: ' + xData[0] + typeof(xData[0]))
//     console.log('y start: ' + yData[0] + typeof(yData[0]))
//
//     var svg = d3.select("svg");
//     var xScale = d3.scale.linear()
//                .domain([0, d3.max(xData, function(d) { return d; })])
//                .range([WIDTH_DEFAULT, 0]);
//     var yScale = d3.scale.linear()
//                    .domain([0, d3.max(yData, function(d) { return d; })])
//                    .range([HEIGHT_DEFAULT, 0]);
//
//     var line = d3.svg.line()
//         .x(xData, function(d) {
//             console.log("entering line x")
//             // console.log("parsing" + d);
//             console.log("scaled" + xScale(d));
//             return xScale(d); })
//         .y(yData, function(d) { return yScale(d); });
//
//     var xAxis = d3.svg.axis()
//         .scale(xScale)
//         .orient("bottom")
//         .ticks(10)
//         .tickFormat(function(d) {
//             return d;
//         });
//
//     var yAxis = d3.svg.axis()
//         .scale(yScale)
//         .orient("left")
//         .ticks(10)
//         .tickFormat(function(d) {
//             return d;
//         });
//
//     svg.append("g")
//         .attr("class", "axis")
//         .attr("transform", "translate(0," + (HEIGHT_DEFAULT - PADDING) + ")")
//         .call(xAxis);
//
//     svg.append("g")
//         .attr("class", "axis")
//         .attr("transform", "translate(" + PADDING + ",0)")
//         .call(yAxis);
//
//     svg.append("path")
//         .datum(data)
//         .attr("class", "line")
//         .attr("d", line);
//     d3.select("#plot-area p").text(JSON.stringify(data));
// }
//
