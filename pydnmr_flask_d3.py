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
    model = request.args.get('model')
    return jsonify(model_dict[model]['entry_dict'])


if __name__ == '__main__':
    app.run()
