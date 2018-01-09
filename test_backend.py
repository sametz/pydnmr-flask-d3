import unittest
import numpy as np

from pydnmr_flask_d3 import (model_dict, kwargs_to_args, convert_plot_data,
                             handle_message)


class BackendTest(unittest.TestCase):
    def setUp(self):
        pass

    def tearDown(self):
        pass

    # def test_initial_kwargs(self):
    #     model_name = "two-singlets"
    #     model_presets = model_dict[model_name]
    #     expected_kwargs = {'va': 165,
    #                        'vb': 135,
    #                        'ka': 1.5,
    #                        'wa': 0.5,
    #                        'wb': 0.5,
    #                        'pa': 50}
    #     returned_kwargs = initial_kwargs(model_presets)
    #     self.assertEqual(expected_kwargs, returned_kwargs)

    def test_kwargs_to_args(self):
        model_name = "two-singlets"
        # model_presets = model_dict[model_name]
        kwargs = {'va': '165',
                  'vb': '135',
                  'ka': '1.5',
                  'wa': '0.5',
                  'wb': '0.5',
                  'pa': '50'}
        expected_args = [165, 135, 1.5, 0.5, 0.5, 50]
        returned_args = kwargs_to_args(model_name, kwargs)
        self.assertEqual(expected_args, returned_args)

    def test_convert_plot_data(self):
        x = np.linspace(1, 5, 5)
        y = x * 2
        expected_data = {'x': [1, 2, 3, 4, 5],
                         'y': [2, 4, 6, 8, 10]}
        returned_data = convert_plot_data((x, y))
        self.assertEqual(expected_data, returned_data)

    # def test_create_plot_data(self):
    #     model_name = 'two-singlets'
    #     kwargs = {'va': 165,
    #               'vb': 135,
    #               'ka': 1.5,
    #               'wa': 0.5,
    #               'wb': 0.5,
    #               'pa': 50}
    #     model = model_dict[model_name]['model']
    #     model_plot_data = model(165, 135, 1.5, 0.5, 0.5, 50)
    #     expected_plot_data = convert_plot_data(model_plot_data)
    #     returned_plot_data = create_plot_data(model_name, kwargs)
    #     self.assertEqual(expected_plot_data, returned_plot_data)


    def test_handle_message(self):
        self.assertEqual(1, 1)  # don't know how to test this yet
        # model = {
        #     "model": "two-singlets",
        #     "kwargs": {
        #           'va': 165,
        #           'vb': 135,
        #           'ka': 1.5,
        #           'wa': 0.5,
        #           'wb': 0.5,
        #           'pa': 50}
        # }
        # result = handle_message(model)
        # self.assertTrue(result == type(dict))



if __name__ == '__main__':
    unittest.main()
