/* global d3 */
console.log('pydnmr.js start');
var WIDTH_DEFAULT = 600;
var HEIGHT_DEFAULT = 400;
var PADDING = 40;
window.onload = init;

function init() {
    console.log('init entered');
    createSVG();
    modelSelect = d3.selectAll("#model-selection input");
    modelSelect.on("change", function() {
        var modelName = d3.select(this).property("value");
        console.log('model name ' + modelName + ' selected');
        d3.json("/data?model=" + modelName, function(data) {
            updateGraph(data);
        });
    });
}

function createSVG() {
    d3.select("body")
        .append("svg")
        .attr("width", WIDTH_DEFAULT)
        .attr("height", HEIGHT_DEFAULT);
}

function updateGraph(data) {
    var xData = data[0];
    var yData = data[1];
    console.log('x start: ' + xData[0] + typeof(xData[0]))
    console.log('y start: ' + yData[0] + typeof(yData[0]))

    var svg = d3.select("svg");
    var xScale = d3.scale.linear()
               .domain([0, d3.max(xData, function(d) { return d; })])
               .range([WIDTH_DEFAULT, 0]);
    var yScale = d3.scale.linear()
                   .domain([0, d3.max(yData, function(d) { return d; })])
                   .range([HEIGHT_DEFAULT, 0]);

    var line = d3.svg.line()
        .x(xData, function(d) {
            console.log("entering line x")
            // console.log("parsing" + d);
            console.log("scaled" + xScale(d));
            return xScale(d); })
        .y(yData, function(d) { return yScale(d); });

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(10)
        .tickFormat(function(d) {
            return d;
        });

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(10)
        .tickFormat(function(d) {
            return d;
        });

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (HEIGHT_DEFAULT - PADDING) + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + PADDING + ",0)")
        .call(yAxis);

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);
    d3.select("#plot-area p").text(JSON.stringify(data));
}