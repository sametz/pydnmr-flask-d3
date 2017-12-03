/* global d3 */
(function (pydnmr) {
    function newModel () {
        var modelName = d3.select(this).property("value");
        d3.json("/data?model=" + modelName, function (data) {
            pydnmr.update(data);
        });
    }

    var modelSelect = d3.selectAll("#model-selection input");
    modelSelect.on("change", newModel);

    /* initialize by "clicking on" the two-singlets model */
    d3.select("input[value=\"two-singlets\"]")
        .property("checked", true)
        .each(newModel);
}(window.pydnmr = window.pydnmr || {}));
