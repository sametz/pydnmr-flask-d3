import unittest
from flask import make_response, render_template
from pydnmr_flask_d3 import app

class HomePageTest(unittest.TestCase):
    def setUp(self):
        app.testing = True
        self.app = app.test_client()


    def tearDown(self):
        pass

    def test_main_page_response_ok(self):
        response = self.app.get('/', follow_redirects=True)
        self.assertEqual(response.status_code, 200)

    def test_root_url_resolves_to_index(self):
        response = self.app.get('/', follow_redirects=True)
        self.assertTrue('<title>pydnmr</title>' in response.get_data(
            as_text=True))

if __name__ == '__main__':
    unittest.main()