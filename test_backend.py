import unittest
import numpy as np

from pydnmr_flask_d3 import (model_dict, get_arg_list, initial_kwargs,
                             kwargs_to_args, convert_plot_data)


class BackendTest(unittest.TestCase):
    def setUp(self):
        pass

    def tearDown(self):
        pass

    def test_get_arg_list(self):
        model_name = "two-singlets"
        expected_arg_list = ['va', 'vb', 'ka', 'wa', 'wb', 'pa']
        returned_arg_list = get_arg_list(model_name)
        self.assertEqual(returned_arg_list, expected_arg_list)

    def test_initial_kwargs(self):
        model_name = "two-singlets"
        model_presets = model_dict[model_name]
        expected_kwargs = {'va': 165,
                           'vb': 135,
                           'ka': 1.5,
                           'wa': 0.5,
                           'wb': 0.5,
                           'pa': 50}
        returned_kwargs = initial_kwargs(model_presets)
        self.assertEqual(expected_kwargs, returned_kwargs)


    def test_kwargs_to_args(self):
        model_name = "two-singlets"
        model_presets = model_dict[model_name]
        kwargs = {'va': 165,
                  'vb': 135,
                  'ka': 1.5,
                  'wa': 0.5,
                  'wb': 0.5,
                  'pa': 50}
        expected_args = [165, 135, 1.5, 0.5, 0.5, 50]
        returned_args = kwargs_to_args(model_presets, kwargs)
        self.assertEqual(expected_args, returned_args)

    def test_convert_plot_data(self):
        x = np.linspace(1, 5, 5)
        y = x * 2
        expected_data = {'x': [1, 2, 3, 4, 5],
                         'y': [2, 4, 6, 8, 10]}
        returned_data = convert_plot_data((x, y))
        self.assertEqual(expected_data, returned_data)




if __name__ == '__main__':
    unittest.main()
