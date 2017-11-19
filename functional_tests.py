from selenium import webdriver
import unittest

class AppTest(unittest.TestCase):
    def setUp(self):
        self.browser = webdriver.Firefox()

    def tearDown(self):
        self.browser.quit()

    def test_app(self):

        # The user navigates to the home page for the app
        self.browser.get('http://localhost:5000')

        # The user sees that the app name contains "pydnmr"
        self.assertIn('pydnmr', self.browser.title)

        # The user sees a radiobutton menu to select the type of calcuation
        self.fail('finish writing tests')
        # The user sees data for the selected model displayed in the body of the page


if __name__ == '__main__':
    unittest.main(warnings='ignore')