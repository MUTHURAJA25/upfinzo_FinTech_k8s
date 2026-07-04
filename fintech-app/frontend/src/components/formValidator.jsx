"use strict";
/**
 * @Fileoverview : Form Validation Automation
 * @Author : Dilip
 * @For : Upfinzo Fintech Pvt Ltd
 * @Date : Nov 25,2025
 */

/**
 * Push fields, values and related attributes to Form Data
 *
 * @type {function(*, *): *&{formFields: *, formValidation: *}}
 */
export const FormHandleChange = ((e, prevData) => (
    {
        ...prevData,
        formValidation: {
            ...prevData.formValidation,
            [e.target.name]: {
                required: { condition: e.target.required, notEmptyMessage: e.target.dataset.notEmptyMessage },
                type: e.target.type,
                customValidation: {
                    minLength: { condition: e.target.minLength, customMessage: e.target.dataset.customMessageMinlength },
                    maxLength: { condition: e.target.maxLength, customMessage: e.target.dataset.customMessageMaxlength },
                    regex: {
                        condition: e.target.dataset.regex,
                        customCondition: e.target.dataset.regexCustomCondition,
                        customMessage: e.target.dataset.customMessageRegex ?? '',
                        minValue: e.target.dataset.minValue ?? '',
                        maxValue: e.target.dataset.maxValue ?? '',
                        minValueMessage: e.target.dataset.customMessageMinvalue ?? '',
                        maxValueMessage: e.target.dataset.customMessageMaxvalue ?? '',
                    },
                    compare: {
                        condition: e.target.dataset.compare,
                        customMessage: e.target.dataset.customMessageCompare ?? ''
                    },
                },
            },
        },
        formFields: {
            ...prevData.formFields,
            [e.target.name]: e.target.value,
        }
    }
));

/**
 * Update the field value from the custom object
 *
 * @param formData
 * @param customData
 * @returns {{formFields: {}, formValidation: {}}}
 * @constructor
 */
export const FormFieldUpdate = (formData, customData) => {
    const formValidation = {};
    const formFields = {};

    Object.entries(customData).map(([input, value]) => {
        const element = document.getElementById(input);
        if (element) {
            formValidation[input] = {
                required: true
            };
            formFields[input] = value;
        }
    });

    return {
        formValidation,
        formFields
    }
}

/**
 * Generate validations dynamically
 *
 * @param formData
 * @param formFields
 * @returns {*|boolean}
 * @constructor
 */
export const FormValidation = (formData, formFields) => {
    const formErrors = { 'formFields': formFields };

    Object.entries(formData).forEach(([key, value]) => {

        // Process form validation
        if (key === "formValidation") {
            Object.entries(value).forEach(([fieldKey, rules]) => {
                const inputValue = formData.formFields[fieldKey];

                // Process custom validations
                const errorMessage = validateField(inputValue, rules, formData);
                formErrors['formFields'][fieldKey] = errorMessage || false;
            });
        }
    });

    // Verify all fields are validated
    if (Object.values(formErrors.formFields).every(value => value === false)) {
        return true;
    }

    return formErrors;
}

/**
 * Validate Fields
 *
 * @param inputValue
 * @param rules
 * @param formData
 * @returns {string|*|string}
 */
const validateField = (inputValue, rules, formData) => {
    const regexOptions = {};
    // Required
    if (rules.required.condition) {
        if (inputValue === '') {

            if (rules.required.notEmptyMessage) return rules.required.notEmptyMessage;
            if (rules.type === 'dropdown' || rules.type === 'date' || rules.type === 'select-one') {
                return "Please choose a required field";
            }
            if (rules.type === 'checkbox' || rules.type === 'radio') {
                return "Please check a required field";
            }
            return "Please enter a required field";
        }
    }

    // Custom Validations
    if (rules.customValidation) {
        const { minLength, maxLength, regex, compare } = rules.customValidation;

        // Min length
        if (minLength && minLength.condition !== -1) {
            if (inputValue.length < minLength.condition) {
                if (minLength.customMessage) return minLength.customMessage;
                return `Minimum ${minLength.condition} characters are required`;
            }
        }

        // Max length
        if (maxLength && maxLength.condition !== -1) {
            if (inputValue.length > maxLength.condition) {
                if (maxLength.customMessage) return maxLength.customMessage;
                return `Maximum ${maxLength.condition} characters are allowed`;
            }
        }

        // Compare Fields
        if (compare && compare.condition !== -1 && formData.formFields[compare.condition]) {
            if (inputValue !== formData.formFields[compare.condition]) {
                return compare.customMessage;
            }
        }

        // Regex
        if (regex && regex.condition !== -1) {
            if (minLength.condition !== -1) {
                regexOptions.minLength = minLength.condition;
            }
            if (maxLength.condition !== -1) {
                regexOptions.maxLength = maxLength.condition;
            }
            if (regex.minValue) {
                regexOptions.minValue = regex.minValue;
                regexOptions.minValueMessage = regex.minValueMessage;
            }
            if (regex.maxValue) {
                regexOptions.maxValue = regex.maxValue;
                regexOptions.maxValueMessage = regex.maxValueMessage;
            }
            if (regex.customCondition) {
                regexOptions.customCondition = regex.customCondition;
            }
            return processRegex(
                regex.condition,
                inputValue,
                regex.customMessage ?? '',
                (maxLength.condition !== -1) ? maxLength.condition : '',
                regexOptions,
            );
        }
    }

    return '';
}

/**
 * Validate Regex
 *
 * @param condition
 * @param input
 * @param customMessage
 * @param maxLength
 * @param options
 * @returns {*|string}
 */
const processRegex = (condition, input, customMessage, maxLength, options = null) => {
    let rule = '';
    let message = '';

    switch (condition) {
        case 'email':
            rule = new RegExp(/^([a-zA-Z0-9_.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/);
            if (customMessage) message = customMessage; else message = 'Invalid email address'
            break;
        case 'strongPassword':
            rule = new RegExp(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/);
            if (customMessage) message = customMessage; else message = 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
            break;

        case 'only_number':
            if (Object.keys(options).length > 0) {
                if (!options.minLength) return 'Error : Please add minLength attribute for number value!'; else rule = new RegExp(`^\\d.{${options.minLength}}$`);
                if (!options.maxLength) return 'Error : Please add maxLength attribute for number value!'; else rule = new RegExp(`^\\d{${options.maxLength}}$`);
            }
            if (isNaN(input)) {
                return 'Input value is not a number';
            }
            if (options.minValue && parseInt(input) < parseInt(options.minValue)) {
                if (options.minValueMessage) message = options.minValueMessage; else message = `Input value should not lesser than ${options.minValue}`;
                return message;
            }
            if (options.maxValue && parseInt(input) > parseInt(options.maxValue)) {
                if (options.maxValueMessage) message = options.maxValueMessage; else message = `Input value should not greater than ${options.maxValue}`;
                return message;
            }
            break;

        case 'only_alpha':
            rule = new RegExp(`^[a-zA-Z]+$`);
            if (customMessage) message = customMessage; else message = 'Invalid strings'
            break;

        case 'alpha_with_space':
            rule = new RegExp(`^[a-zA-Z ]+$`);
            message = customMessage || 'Only alphabets & spaces allowed';
            break;

        case 'only_alpha_numeric':
            if (Object.keys(options).length > 0 && !options.maxLength) {
                return 'Error : Please add maxLength attribute for alpha numeric values!'
            }
            rule = new RegExp(`^[a-zA-Z0-9]+$`);
            if (customMessage) message = customMessage; else message = 'Invalid string and numbers'
            break;

        case 'ifsc':
            rule = new RegExp(`^[A-Z]{4}0[A-Z0-9]{6}$`);
            if (customMessage) message = customMessage; else message = 'Invalid Ifsc code'
            break;

        case 'upi':
            rule = new RegExp(`^[a-zA-Z0-9.\\-_]{2,256}@[a-zA-Z]{2,64}$`);
            if (customMessage) message = customMessage; else message = 'Invalid UPI ID'
            break;

        case 'custom':
            if (!options.customCondition) {
                return 'Error : Please add regexCustomCondition attribute for custom regex!';
            }
            rule = new RegExp(`^${options.customCondition}$`);
            if (customMessage) message = customMessage; else message = 'Invalid input value';
            break;
        default:
            break;
    }

    if (rule && !rule.test(input)) {
        return message;
    }

    return '';
}

export default { FormValidation, FormHandleChange };