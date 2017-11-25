import numpy as np
from flask import Flask, jsonify, render_template, request
from model_definitions import dnmr_two_singlets_kwargs, dnmr_AB_kwargs

app = Flask(__name__)
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
    print(args)
    plot_data = model['model'](*args)
    print(plot_data)
    print(type(plot_data))
    print(type(plot_data[0]))
    plot_data_list = [t for t in plot_data]
    export_data = [[x for x in t] for t in plot_data_list]
    print(type(export_data))
    print(type(export_data[0]))
    print(export_data)
    return jsonify(export_data)


if __name__ == '__main__':
    app.run()
