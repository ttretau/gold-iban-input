# \<gold-iban-input\>

[![Build status](https://travis-ci.org/ttretau/gold-iban-input.svg?branch=master)](https://travis-ci.org/ttretau/gold-iban-input)

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/ttretau/gold-iban-input)

Material Design <a href="https://en.wikipedia.org/wiki/International_Bank_Account_Number">IBAN</a> Input Element:
Single-line text field with Material Design styling
for entering a IBAN. As the user types, the number will be formatted by adding a space every 4 digits and remaining digits.

```html
<gold-iban-input label="IBAN"></gold-iban-input>
```

## Validation
The input is validated via country based length and checksum.

The input can be automatically validated as the user is typing by using
the `auto-validate` and `required` attributes. For manual validation, the
element also has a `validate()` method, which returns the validity of the
input as well sets any appropriate error messages and styles.

See `Polymer.PaperInputBehavior` for more API docs.

### Styling

See `Polymer.PaperInputContainer` for a list of custom properties used to
style this element.
