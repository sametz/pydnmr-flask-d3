/* global d3 */
(function (pydnmr) {
    function newModel () {
        var modelName = d3.select(this).property("value");
        // d3.json("/data?model=" + modelName, function (data) {
        //     pydnmr.update(data);
        // });
        socket.emit('message', {
            "model": modelName,
            "kwargs": {}
            // "va":$("#va").val(),
            // "vb":$("#vb").val(),
            // "k":$("#k").val(),
            // "wa":$("#wa").val(),
            // "wb":$("#wb").val(),
            // "percent_a":$("#percent_a").val()
        });
    }

    var socket = io.connect('http://' + document.domain + ':' + location.port);

    socket.on('connect', function() {
        // we emit a connected message to let knwo the client that we are connected.
        console.log('js emitting "client_connected"');
        socket.emit('client_connected', {data: 'New client!'});
    });

    socket.on('message', function(data) {
        console.log("JS received a message!");
        pydnmr.update(data);
    });
    var modelSelect = d3.selectAll("#model-selection input");
    modelSelect.on("change", newModel);

    /* initialize by "clicking on" the two-singlets model */
    d3.select("input[value=\"two-singlets\"]")
        .property("checked", true)
        .each(newModel);
}(window.pydnmr = window.pydnmr || {}));
