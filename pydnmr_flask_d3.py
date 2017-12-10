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
    print(export_dict['x'])
    print(export_dict['y'])

    return jsonify(export_dict)


@socketio.on('client_connected')
def handle_client_connect_event(json):
    print('python receives "client_connected"')
    print('received json: {0}'.format(str(json)))


@socketio.on('message')
def handle_message(message):
    """
    Format of message is:

    :param message: {"model": str,
                     "kwargs": {"str": float...}}
    :return:
    """
    model_name = message['model']

    # when all is ready, below should work
    # kwargs = message['kwargs']
    # until then, use this:
    kwargs = initial_kwargs(model_dict[model_name])

    data = create_plot_data(model_name, kwargs)
    send(data)


def create_plot_data(model_name, kwargs):
    print('model requested: ', model_name)
    model_presets = model_dict[model_name]
    args = kwargs_to_args(model_presets, kwargs)
    plot_data = model_presets['model'](*args)
    converted_data = convert_plot_data(plot_data)
    plot_data_list = [t for t in plot_data]
    export_data = [[x for x in t] for t in plot_data_list]
    export_dict = {'x': export_data[0],
                   'y': export_data[1]}
    # data = {}
    return converted_data


def get_arg_list(model):
    return model_dict[model]['entry_names']


def initial_kwargs(model_presets):
    """
    Convert the entry_dict field in a model's definition to kwargs suitable
    for conversion to args.
    :param model_presets: {dict} with fields for 'entry_names' (a list of the
    variables the model requires) and 'entry_dict' (a dict of dicts with
    model presets).
    :return: {'key': value} kwargs for the model
    """
    arg_list = model_presets['entry_names']
    entry_dict = model_presets['entry_dict']
    return {keyword: entry_dict[keyword]['value'] for keyword in arg_list}


def kwargs_to_args(model_presets, kwargs):
    """
    Converts kwargs for model calculation to args. Currently, DNMR models
    accept args, not kwargs, so this function provides an interface.
    :param model_presets: the dictionary of presets for the requested model.
    Contains the list of variables 'entry_names' in the correct order for args.
    :param kwargs: {'variable': value}
    :return: [int or float...]
    """
    print(model_presets)
    arg_list = model_presets['entry_names']
    args = [kwargs[arg] for arg in arg_list]
    return args


def convert_plot_data(model_data):
    """
    DNMR model output is a tuple of x, y linspaces. This needs to be
    converted to a dictionary of x and y coordinates for JSON export to
    javascript front-end.
    :param model_data: (numpy.linspace, numpy.linspace)
    :return: {'x': [float...], 'y': [float...]}
    """
    list_of_linspaces = [t for t in model_data]
    list_of_lists = [[x for x in t] for t in list_of_linspaces]
    export_dict = {'x': list_of_lists[0],
                   'y': list_of_lists[1]}
    return export_dict


if __name__ == '__main__':
    # when using socketio, need to run the app differently.
    # note: get message about installing eventlet or gevent/gevent-websocket
    # app.run()
    socketio.run(app, debug=True)
