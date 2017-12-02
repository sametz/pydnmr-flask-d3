/* global d3 */
(function (pydnmr) {
    modelSelect = d3.selectAll("#model-selection input");
    modelSelect.on("change", function() {
        var modelName = d3.select(this).property("value");
        console.log('model name ' + modelName + ' selected');
        d3.json("/data?model=" + modelName, function(data) {
            pydnmr.update(data);
        });
    });
}(window.pydnmr = window.pydnmr || {}));

// console.log('pydnmr.js start');
// var WIDTH_DEFAULT = 600;
// var HEIGHT_DEFAULT = 400;
// var PADDING = 40;
// var dummy_data = [ { label: "Data Set 1",
//                x: [0, 1, 2, 3, 4],
//                y: [0, 1, 2, 3, 4] },
//              { label: "Data Set 2",
//                x: [0, 1, 2, 3, 4],
//                y: [0, 1, 4, 9, 16] } ] ;
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
