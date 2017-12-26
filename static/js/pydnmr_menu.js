/* global d3 */
(function (pydnmr) {
    function newModel () {
        pydnmr.modelName = d3.select(this).property("value");
        addToolbar(pydnmr.modelName);
        console.log('JS requesting a new model');
        updateData();
        // socket.emit('message', {
        //     "model": pydnmr.modelName,
        //     "kwargs": {}  // to be populated when variable inputs implemented
            // "va":$("#va").val(),
            // "vb":$("#vb").val(),
            // "k":$("#k").val(),
            // "wa":$("#wa").val(),
            // "wb":$("#wb").val(),
            // "percent_a":$("#percent_a").val()
        // });
    }

    function callModel(model, kwargs) {
        console.log('updating data');
        socket.emit('message', {
            "model": pydnmr.modelName,
            "kwargs": kwargs
        });
    }

    function updateData() {
        console.log("I should update my data now.");
        let toolbar_settings = pydnmr.modelVariables[pydnmr.modelName];
        let kwargs = {};
        console.log(JSON.stringify(toolbar_settings));
        let inputs = $("#variable-entry").find(":input");
        for (let i = 0; i < inputs.length; i++) {
            let k = inputs[i].name
            let v = inputs[i].value
            console.log('handling ' + k);
            console.log('value : ' + v);
            toolbar_settings[inputs[i].name].value = inputs[i].value;
            kwargs[k] = v;
        }
        console.log('kwargs: ' + JSON.stringify(kwargs));
        callModel(pydnmr.modelName, kwargs);
    }

    function addToolbar(modelName) {
        let toolbar_settings = pydnmr.modelVariables[modelName];
        $('#variable-entry').html(createToolbar(toolbar_settings));
        $("input").on("change", () => {
        updateData();
        });
    }

    function createWidget(label, value, minimum=0, maximum=10000) {
      let label_span = `<span id=${label}-span>${label}: </span>`;
      let input = `<input type="number" 
                          id="${label}-input" 
                          name="${label}"
                          value="${value}" 
                          min="${minimum}" 
                          max="${maximum}">`;
      // let widget = `<div id='vb-widget' class='widget'>${label_span}${input}</div>`;
      return `<div id='vb-widget' class='widget'>${label_span}${input}</div>`;
    }

    function createToolbar(modelJSON) {
      let widget_list = [];
      console.log('entered parseModelJSON');
      console.log(JSON.stringify(modelJSON));
      for (let widget in modelJSON) {
        let label = widget;
        let value = modelJSON[widget].value;
        let minimum = modelJSON[widget].min;
        let maximum = modelJSON[widget].max;
        console.log('parsing ' + widget);
        console.log(label + value + minimum + maximum);
        widgetHTML = createWidget(label, value, minimum, maximum);
        console.log(widgetHTML);
        widget_list.push(widgetHTML);
        // for (var argument in modelJSON[widget]) {
        //     console.log(argument + ': ' + modelJSON[widget][argument]);
        // }
      }
      return widget_list;
    }

    let socket = io.connect('http://' + document.domain + ':' + location.port);

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

    let modelSelect = d3.selectAll("#model-selection input");
    modelSelect.on("change", newModel);

    /* initialize by "clicking on" the two-singlets model */
    d3.select("input[value=\"two-singlets\"]")
        .property("checked", true)
        .each(newModel);



}(window.pydnmr = window.pydnmr || {}));
