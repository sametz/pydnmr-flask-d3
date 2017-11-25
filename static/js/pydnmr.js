/* global d3 */
console.log('pydnmr.js start');
window.onload = init;

function init() {
    console.log('init entered');
    modelSelect = d3.selectAll("#model-selection input");
    modelSelect.on("change", function() {
        var modelName = d3.select(this).property("value");
        console.log('model name ' + modelName + ' selected');
        // alert('hashout');
        d3.json("/data?model=" + modelName, function(data) {
            console.log(JSON.stringify(data));
            d3.select("#plot-area p").text(JSON.stringify(data));
        })
    });
}