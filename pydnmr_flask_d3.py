"""
The python backend for the web app version of pydnmr.

Accepts requests to update the frontend's plot via websockets. Provides an
interface between the frontend view and backend model-- the frontend requires
plot data to be in the form of {'x': [float...], 'y': [float] but the model
returns (numpy.linspace, numpy.linspace). Anticipates that the frontend will
eventually submit requests with an object/dictionary of variable names and
values. Currently, the data is substituted with the preset values from
model_definitions.py.
"""

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


@socketio.on('client_connected')
def handle_client_connect_event(json):
    print('python receives "client_connected"')
    print('received json: {0}'.format(str(json)))


@socketio.on('message')
def handle_message(message):
    """ Send plot data requested by frontend.

    :param message: {"model": str,
                     "kwargs": {"str": float...}}
    Sends: {'x': [float...], 'y': [float...]}
    """
    model_name = message['model']

    # when all is ready, below should work
    # kwargs = message['kwargs']
    # until then, use this for "mocked" kwargs:
    kwargs = initial_kwargs(model_dict[model_name])

    data = create_plot_data(model_name, kwargs)
    send(data)


def create_plot_data(model_name, kwargs):
    """Convert kwargs to model args; call the model with args; and convert
    the model response to correct format for frontend.

    :param model_name: (str) The front-end's name for the requested model.
    Currently 'two-singlets' or 'AB'
    :param kwargs: (dict) {'variable name': number...}
    :return: {'x': [float...], 'y': [float...]
    """
    print('model requested: ', model_name)
    model_presets = model_dict[model_name]
    args = kwargs_to_args(model_presets, kwargs)
    plot_data = model_presets['model'](*args)
    converted_data = convert_plot_data(plot_data)

    return converted_data


def initial_kwargs(model_presets):
    """Convert the entry_dict field in a model's definition to kwargs suitable
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
    """ Convert kwargs for model calculation to args.

    Currently, DNMR models accept args, not kwargs, so this function provides
    an interface.
    :param model_presets: the dictionary of presets for the requested model.
    Contains the list of variables 'entry_names' in the correct order for args.
    :param kwargs: {'variable': value}
    :return: [int or float...]
    """
    arg_list = model_presets['entry_names']
    args = [kwargs[arg] for arg in arg_list]
    return args


def convert_plot_data(model_data):
    """Convert the plot data output by the model to the format required by
    the frontend.

    DNMR model output is a tuple of x, y linspaces. This needs to be
    converted to a dictionary of x and y coordinates.
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
