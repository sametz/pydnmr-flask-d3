"""
The python backend for the web app version of pydnmr.

Accepts requests to update the frontend's plot via websockets. Provides an
interface between the frontend view and backend model-- the frontend requires
plot data to be in the form of {'x': [float...], 'y': [float] but the model
returns (numpy.linspace, numpy.linspace).
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
    """ Parse a JSON calculation request from the front end, call the
    corresponding model with appropriate arguments, and return plot data.

    :param message: {"model": str,
                     "kwargs": {"str": float...}}
    Sends: {'x': [float...], 'y': [float...]}
    """
    model_name = message['model']
    kwargs = message['kwargs']
    args = kwargs_to_args(model_name, kwargs)
    model = model_dict[model_name]['model']
    plot_data = model(*args)
    converted_plot_data = convert_plot_data(plot_data)

    send(converted_plot_data)


def kwargs_to_args(model_name, kwargs):
    """ Convert kwargs for model calculation to args.

    Currently, DNMR models accept args, not kwargs, so this function provides
    an interface.
    :param model_name: the name of the requested model.
    :param kwargs: {'variable': value}
    :return: [int or float...]
    """
    # get list of args in correct order
    arg_list = model_dict[model_name]['entry_names']
    print(arg_list)
    args = [float(kwargs[arg]) for arg in arg_list]
    print(args)
    return args


def convert_plot_data(model_data):
    """Convert the plot data returned by the model to the format required by
    the frontend.

    DNMR model output is a tuple of x, y numpy linspaces. This needs to be
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
