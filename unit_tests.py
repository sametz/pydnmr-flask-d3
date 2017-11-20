import unittest
from contextlib import contextmanager
from flask import make_response, render_template, template_rendered
from pydnmr_flask_d3 import app


@contextmanager
def captured_templates(app):
    recorded = []
    def record(sender, template, context, **extra):
        recorded.append((template, context))
    template_rendered.connect(record, app)
    try:
        yield recorded
    finally:
        template_rendered.disconnect(record, app)


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
        self.assertTrue('<h1>pydnmr</h1>' in response.get_data(
            as_text=True))

    def test_root_url_calls_index_once(self):
        with captured_templates(app) as templates:
            response = self.app.get('/', follow_redirects=True)
            self.assertEqual(len(templates), 1)
            template, context = templates[0]
            self.assertEqual(template.name, 'index.html')


if __name__ == '__main__':
    unittest.main()