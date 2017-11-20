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

        # The user sees an h1 banner with "pydnmr" in the title
        header_text = self.browser.find_element_by_tag_name('h1').text
        self.assertIn('pydnmr', header_text)

        # The user sees a radiobutton menu to select the type of calcuation
        model_selection = self.browser.find_element_by_id('model-selection')

        # The user sees buttons for "two uncoupled spins" and "two coupled
        # spins"
        model_labels = model_selection.find_elements_by_css_selector(
            'label')
        model_labels_text = [label.text for label in model_labels]
        self.assertIn("two uncoupled spins", model_labels_text)
        self.assertIn("two coupled spins", model_labels_text)

        # The user selects the 'two uncoupled spins' model
        two_spin_button = model_selection.find_element_by_id('two-singlets')
        two_spin_button.click

        # The user sees data for the selected model displayed in the body of the page

        self.fail('finish writing tests')

if __name__ == '__main__':
    unittest.main(warnings='ignore')