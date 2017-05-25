var IBANValidator = (function () {
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

        check_syntax = function(iban) {
            var code = iban.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/); // match and capture (1) the country code, (2) the check digits, and (3) the rest

            if (!code || iban.length !== code_lengths[code[1]]) {
                return undefined;
            }
            return code;
        };

        check_checksum = function(code) {
            // rearrange country code and check digits, and convert chars to ints
            var digits = (code[3] + code[1] + code[2]).replace(/[A-Z]/g, function (letter) {
                return letter.charCodeAt(0) - 55;
            });
            // final check
            return mod97(digits) === 1;
        };

        mod97 = function(string) {
            var checksum = string.slice(0, 2), fragment;
            for (var offset = 2; offset < string.length; offset += 7) {
                fragment = String(checksum) + string.substring(offset, offset + 7);
                checksum = parseInt(fragment, 10) % 97;
            }
            return checksum;
        };

        normalize = function(inputString) {
            var input = inputString.replace(/[ -]/g, '');
            var result = String(input).toUpperCase().replace(/[^A-Z0-9]/g, '');
            return result;
        };

        validate_number = (function (_this) {
            return function (iban) {
                var checksum_valid = false,
                    syntax_valid = false;
                var code = check_syntax(iban);
                if(code) {
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
            return function() {
                return validate_number(normalize(inputString));
            };
        })(this);

        return validate(inputString);
    };

    return {
        validate: validateIBAN
    };
})(this);
