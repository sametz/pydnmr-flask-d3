/* global d3 */
(function (pydnmr) {
    const WIDTH_DEFAULT = 600;
    const HEIGHT_DEFAULT = 400;
    const TRANS_DURATION = 100;  // speed of transitions
    const TWO_SINGLETS_PRESETS = {
        'va': {'value': 165},
        'vb': {'value': 135},
        'ka': {
            'value': 1.5,
            'min': 0.01},
        'wa': {
            'value': 0.5,
            'min': 0.01},
        'wb': {
            'value': 0.5,
            'min': 0.01},
        'pa': {
            'value': 50,
            'min': 0,
            'max': 100}
    };
    const AB_PRESETS = {
        'va': {'value': 165},
        'vb': {'value': 135},
        'J': {'value': 12},
        'k': {
            'value': 12,
            'min': 0.01},
        'w': {
            'value': 0.5,
            'min': 0.01}
    };

    pydnmr.modelVariables = {
        // Conversion to string and back to JSON = deep copy of object
        'two-singlets': JSON.parse(JSON.stringify(TWO_SINGLETS_PRESETS)),
        'AB': JSON.parse(JSON.stringify(AB_PRESETS))
    };

    let margin = {top: 20, right: 80, bottom: 30, left: 50},
        innerwidth = WIDTH_DEFAULT - margin.left - margin.right,
        innerheight = HEIGHT_DEFAULT - margin.top - margin.bottom;

    pydnmr.init = function() {
        pydnmr.svg = d3.select("#plot-area").append("svg")
            .attr("width", WIDTH_DEFAULT)
            .attr("height", HEIGHT_DEFAULT)
            // main g element makes room for axes
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        pydnmr.path = pydnmr.svg.append("path")
            .attr("id", "plot-path");
        pydnmr.xScale = d3.scale.linear()
            .range([innerwidth, 0]);  // this order flips x axis NMR-style
        pydnmr.yScale = d3.scale.linear()
            .range([innerheight, 0]);
        pydnmr.xAxis = d3.svg.axis()
            .orient("bottom");
        pydnmr.yAxis = d3.svg.axis()
            .orient("left");
        pydnmr.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + innerheight + ")");
        pydnmr.svg.append("g")
            .attr("class", "y axis");
    };

    pydnmr.update = function(data) {
        pydnmr.updateScale(data);
        pydnmr.plot(data);
    };

     pydnmr.updateScale = function(data) {
        pydnmr.xScale.domain([
            d3.min(data.x, function(d) {return d;}),
            d3.max(data.x, function (d) {return d;})]);

        pydnmr.yScale.domain([
            d3.min(data.y, function (d) {return d}),
            d3.max(data.y, function (d) {return d;})]);

        pydnmr.xAxis.scale(pydnmr.xScale);
        pydnmr.yAxis.scale(pydnmr.yScale);
        pydnmr.svg.select('.x.axis')
            .transition().duration(TRANS_DURATION)
            .call(pydnmr.xAxis);
        pydnmr.svg.select('.y.axis')
            .transition().duration(TRANS_DURATION)
            .call(pydnmr.yAxis);
    };

    pydnmr.plot = function(data) {
        let plot_data = d3.zip(data.x, data.y);
        let line = d3.svg.line()
            .interpolate("basis")
            .x(function (d) {return pydnmr.xScale(d[0]);})
            .y(function (d) {return pydnmr.yScale(d[1]);});

        pydnmr.path.attr("class", "line")
            .datum(plot_data)
            .attr("d", function(d) {return line(d);});
    };

    pydnmr.init();
}(window.pydnmr = window.pydnmr || {}));
