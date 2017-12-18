/* global d3 */
(function (pydnmr) {
    function newModel () {
        var modelName = d3.select(this).property("value");
        switchVariables(modelName);
        console.log('JS requesting a new model');
        socket.emit('message', {
            "model": modelName,
            "kwargs": {}  // to be populated when variable inputs implemented
            // "va":$("#va").val(),
            // "vb":$("#vb").val(),
            // "k":$("#k").val(),
            // "wa":$("#wa").val(),
            // "wb":$("#wb").val(),
            // "percent_a":$("#percent_a").val()
        });
    }

    function switchVariables(modelName) {
        d3.select('#variable-entry').html(modelName)
    }

    var socket = io.connect('http://' + document.domain + ':' + location.port);

    socket.on('connect', function() {
        // we emit a connected message to let knwo the client that we are connected.
        console.log('js emitting "client_connected"');
        socket.emit('client_connected', {data: 'New client!'});
    });

    socket.on('message', function(data) {
        console.log("JS received a message");
        if (data) {
            console.log("JS received data");
        }
        pydnmr.update(data);
    });

    var modelSelect = d3.selectAll("#model-selection input");
    modelSelect.on("change", newModel);

    /* initialize by "clicking on" the two-singlets model */
    d3.select("input[value=\"two-singlets\"]")
        .property("checked", true)
        .each(newModel);
}(window.pydnmr = window.pydnmr || {}));
