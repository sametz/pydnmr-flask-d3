import numpy as np
from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
from flask_socketio import SocketIO, send, emit
from model_definitions import dnmr_two_singlets_kwargs, dnmr_AB_kwargs

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)
CORS(app)

model_dict = {'two-singlets': dnmr_two_singlets_kwargs,
              'AB': dnmr_AB_kwargs}


@app.route('/')
def hello_world():
    return render_template('index.html')


@app.route('/data', methods=['GET', 'POST'])
def serve_data():
    model_arg = request.args.get('model')
    model = model_dict[model_arg]
    variable_list = model['entry_names']
    args = [model['entry_dict'][variable]['value']
              for variable in variable_list]
    # print(args)
    plot_data = model['model'](*args)
    # print(plot_data)
    # print(type(plot_data))
    # print(type(plot_data[0]))
    plot_data_list = [t for t in plot_data]
    export_data = [[x for x in t] for t in plot_data_list]
    export_dict = {'x': export_data[0],
                   'y': export_data[1]}
    # print(type(export_data))
    # print(type(export_data[0]))
    # print(export_dict['x'])
    # print(export_dict['y'])

    return jsonify(export_dict)


@socketio.on('client_connected')
def handle_client_connect_event(json):
    print('python receives "client_connected"')
    print('received json: {0}'.format(str(json)))


@socketio.on('message')
def handle_message(message):
    model = model_dict[message['model']]
    print('model received: ', model)
    send('python is sending this data')


if __name__ == '__main__':
    # when using socketio, need to run the app differently.
    # note: get message about installing eventlet or gevent/gevent-websocket
    # app.run()
    socketio.run(app, debug=True)
