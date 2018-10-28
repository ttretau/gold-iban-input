import '@polymer/polymer/polymer-legacy.js';
import '@polymer/paper-input/paper-input-container.js';
import '@polymer/paper-input/paper-input-error.js';
import '@polymer/iron-input/iron-input.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';

import {IronFormElementBehavior} from '@polymer/iron-form-element-behavior/iron-form-element-behavior.js';
import {PaperInputBehavior} from '@polymer/paper-input/paper-input-behavior.js';
import {Polymer} from '@polymer/polymer/lib/legacy/polymer-fn.js';
import {html} from '@polymer/polymer/lib/utils/html-tag.js';

const IBANValidator = (function () {
  'use strict';

  function validateIBAN(inputString) {
    var check_syntax, check_checksum, mod97, normalize, validate_number, validate, code_lengths;
    code_lengths = {
      AD: 24, AE: 23, AT: 20, AZ: 28, BA: 20, BE: 16, BG: 22, BH: 22, BR: 29,
      CH: 21, CR: 21, CY: 28, CZ: 24, DE: 22, DK: 18, DO: 28, EE: 20, ES: 24,
      FI: 18, FO: 18, FR: 27, GB: 22, GI: 23, GL: 18, GR: 27, GT: 28, HR: 21,
      HU: 28, IE: 22, IL: 23, IS: 26, IT: 27, JO: 30, KW: 30, KZ: 20, LB: 28,
      LI: 21, LT: 20, LU: 20, LV: 21, MC: 27, MD: 24, ME: 22, MK: 19, MR: 27,
      MT: 31, MU: 30, NL: 18, NO: 15, PK: 24, PL: 28, PS: 29, PT: 25, QA: 29,
      RO: 24, RS: 22, SA: 24, SE: 24, SI: 19, SK: 24, SM: 27, TN: 24, TR: 26
    };

    check_syntax = function (iban) {
      var code = iban.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/); // match and capture (1) the country code, (2) the check digits, and (3) the rest

      if (!code || iban.length !== code_lengths[code[1]]) {
        return undefined;
      }
      return code;
    };

    check_checksum = function (code) {
      // rearrange country code and check digits, and convert chars to ints
      var digits = (code[3] + code[1] + code[2]).replace(/[A-Z]/g, function (letter) {
        return letter.charCodeAt(0) - 55;
      });
      // final check
      return mod97(digits) === 1;
    };

    mod97 = function (string) {
      var checksum = string.slice(0, 2), fragment;
      for (var offset = 2; offset < string.length; offset += 7) {
        fragment = String(checksum) + string.substring(offset, offset + 7);
        checksum = parseInt(fragment, 10) % 97;
      }
      return checksum;
    };

    normalize = function (inputString) {
      var input = inputString ? inputString.replace(/[ -]/g, '') : '';
      return String(input).toUpperCase().replace(/[^A-Z0-9]/g, '');
    };

    validate_number = (function (_this) {
      return function (iban) {
        var checksum_valid = false,
          syntax_valid = false;
        var code = check_syntax(iban);
        if (code) {
          syntax_valid = true;
          checksum_valid = check_checksum(code);
        }

        return {
          valid: checksum_valid && syntax_valid,
          syntax_valid: syntax_valid,
          checksum_valid: checksum_valid
        };
      };
    })(this);

    validate = (function (_this) {
      return function () {
        return validate_number(normalize(inputString));
      };
    })(this);

    return validate(inputString);
  }

  return {
    validate: validateIBAN
  };
})(window);

Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
    
      .container {
        @apply --layout-horizontal;
      }
    
      input {
        @apply --layout-flex;
      }
    
      input {
        position: relative; /* to make a stacking context */
        outline: none;
        box-shadow: none;
        padding: 0;
        width: 100%;
        max-width: 100%;
        background: transparent;
        border: none;
        color: var(--paper-input-container-input-color, var(--primary-text-color));
        -webkit-appearance: none;
        text-align: inherit;
        vertical-align: bottom;
        /* Firefox sets a min-width on the input, which can cause layout issues */
        min-width: 0;
        @apply --paper-font-subhead;
        @apply --paper-input-container-input;
      }
      input::-webkit-input-placeholder {
        color: var(--paper-input-container-color, var(--secondary-text-color));
      }
      input:-moz-placeholder {
        color: var(--paper-input-container-color, var(--secondary-text-color));
      }
      input::-moz-placeholder {
        color: var(--paper-input-container-color, var(--secondary-text-color));
      }
      input:-ms-input-placeholder {
        color: var(--paper-input-container-color, var(--secondary-text-color));
      }
    </style>
    <paper-input-container id="container" disabled\$="[[disabled]]" no-label-float="[[noLabelFloat]]" always-float-label="[[_computeAlwaysFloatLabel(alwaysFloatLabel,placeholder)]]" invalid="[[invalid]]">
    
      <label slot="label" hidden\$="[[!label]]">[[label]]</label>

      <iron-input id="input" slot="input" bind-value="{{value}}" allowed-pattern="[a-zA-Z0-9 ]" invalid="{{invalid}}">
        <input id="nativeInput"
               aria-labelledby\$="[[_ariaLabelledBy]]"
               aria-describedby\$="[[_ariaDescribedBy]]"
               required\$="[[required]]"
               type="text" autocomplete="iban-number"
               name\$="[[name]]"
               disabled\$="[[disabled]]"
               autofocus\$="[[autofocus]]"
               inputmode\$="[[inputmode]]"
               placeholder\$="[[placeholder]]"
               readonly\$="[[readonly]]"
               maxlength\$="[[_requiredLength]]"
               size\$="[[size]]">
      </iron-input>
        
      <template is="dom-if" if="[[errorMessage]]">
        <paper-input-error slot="add-on" id="error">
          [[errorMessage]]
        </paper-input-error>
      </template>
    
    </paper-input-container>        
    `,

  is: 'gold-iban-input',

  importMeta: import.meta,

  behaviors: [
    PaperInputBehavior,
    IronFormElementBehavior
  ],

  properties: {
    /**
     * The label for this input.
     */
    label: {
      type: String,
      value: "IBAN"
    },

    value: {
      type: String,
      observer: '_onValueChanged',
    },
  },

  observers: [
    '_onFocusedChanged(focused)'
  ],

  ready: function () {
    // If there's an initial input, validate it.
    if (this.value) {
      this._handleAutoValidate();
    }
  },

  /**
   * Returns a reference to the focusable element. Overridden from PaperInputBehavior
   * to correctly focus the native input.
   */
  get _focusableElement() {
    return this.inputElement._inputElement;
  },

  /**
   * A handler that is called on input
   */
  _onValueChanged: function (value, oldValue) {
    if (oldValue == undefined && value === '')
      return;

    var start = this.$.input.selectionStart;
    var previousCharASpace = value ? this.value.charAt(start - 1) == ' ' : false;

    value = value.replace(/\s+/g, '');
    var formattedValue = '';
    for (var i = 0; i < value.length; i++) {
      // Add a space after every 4 characters.
      if ((i != 0) && (i % 4 == 0)) {
        formattedValue += ' ';
      }
      formattedValue += value[i];
    }
    this.updateValueAndPreserveCaret(formattedValue.trim());

    // If the character right before the selection is a newly inserted
    // space, we need to advance the selection to maintain the caret position.
    if (!previousCharASpace && this.value.charAt(start - 1) == ' ') {
      this.$.input.selectionStart = start + 1;
      this.$.input.selectionEnd = start + 1;
    }

    this._handleAutoValidate();
  },

  /**
   * Returns true if the element has a valid value, and sets the visual
   * error state.
   *
   * @return {boolean} Whether the input is currently valid or not.
   */
  validate: function () {
    // Empty, non-required input is valid.
    if (!this.required && this.value == '') {
      return true;
    }

    var result = IBANValidator.validate(this.value);
    var valid = result.valid && result.syntax_valid;

    // Update the container and its addons (i.e. the custom error-message).
    this.$.container.invalid = !valid;
    this.$.container.updateAddons(
      {inputElement: this.$.input, value: this.value, invalid: !valid});


    return valid;
  },

  /**
   * Overidden from Polymer.IronControlState.
   */
  _onFocusedChanged: function (focused) {
    if (!this._focusableElement) {
      return;
    }
    if (!focused) {
      this._handleAutoValidate();
    }
  },
})
