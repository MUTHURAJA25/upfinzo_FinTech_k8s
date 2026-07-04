"use strict";
/**
 * @Fileoverview : Generate Inputs Automation
 * @Author : Dilip
 * @For : Upfinzo Fintech Pvt Ltd
 * @Date : Nov 25,2025
 */

import React, {useState} from "react";

/**
 * @param title
 * @returns {string}
 */
const generateTitle = (title) => {
    if (title) {
        // Camel Case to Snack Case
        title = title.replace(/([a-z])([A-Z])/g, "$1 $2");

        // Replace underscores with spaces
        title = title.replace(/_/g, " ");

        return title
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }
};

/**
 * Generate All Inputs
 *
 * Supported attributes : minLength, maxLength, isPassword, required, compare, customCondition, regex (email, only_number (minValue, maxValue), only_alpha, alpha_with_space, only_alpha_numeric, strongPassword, ifsc, upi, custom)
 * Supported custom messages : notEmptyMessage, minLengthMessage, maxLengthMessage, regexMessage, compareMessage, minValueMessage, maxValueMessage
 * Supported types : text, password, dropdown, checkbox, radio, file, date
 * Supported dropdown attributes : dropdownOptions, dropdownDefault, e.g dropdownOptions : {'' : select Gender, male : 'male'}
 * Supported textarea attributes : maxLength, minLength, textareaOptions, e.g textareaOptions : { rows: 5, cols: 10, }
 * Supported checkbox/radio attributes : checkOptions, checkDefault, e.g checkOptions : { active: { value : 'Active', required: true, }, inactive: { value : 'InActive', required: true, }, }
 *
 * @param field
 * @returns {Element}
 * @constructor
 */
const GenerateInputs = (field) => {
    let props = field.mapField;

    return (
        <>
            {generateAllInputs(props)}
            {props.error ? (
                <div className="error invalid-feedback" style={{display: "block"}}>
                    {props.error}
                </div>
            ) : null}
        </>
    );
};

/**
 * Input Routes
 *
 * @param props
 * @returns {React.JSX.Element|Element|*[]|string}
 */
const generateAllInputs = (props) => {
    let inputs = '';

    switch (props.type) {
        case "text":
        case "password":
        case "number":
        case "date":
            inputs = generateTextInputs(props);
            break;
        case "dropdown":
            inputs = generateDropdown(props);
            break;
        case "checkbox":
        case "radio":
            inputs = generateCheckbox(props);
            break;
        case "file":
            inputs = generateFileUpload(props);
            break;
        case "textarea":
            inputs = generateTextarea(props);
            break;
        default:
            inputs = '';
    }
    return inputs;
}

/**
 * Generate Textbox
 *
 * @param props
 * @returns {JSX.Element}
 */
const generateTextInputs = (props) => {
    const [showPassword, setShowPassword] = useState(false);
    const passwordToggle = (
        <span
            className="input-group-text cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
        >
      <i
          className={`icon-base ri ${
              showPassword ? "ri-eye-line" : "ri-eye-off-line"
          } icon-20px`}
      ></i>
    </span>
    );

    return (
        <>
            <div className={`input-group input-group-merge ${props.parentClass && ''}`}>
                <div className={`form-floating form-floating-outline ${props.childrenClass && ''}`}>
                    <input
                        id={props.name}
                        name={props.name}
                        type={showPassword ? 'text' : props.type}
                        required={props.required ?? false}
                        className={`form-control ${props.error ? " is-invalid" : ""} ${props.class && ''}`}
                        placeholder={props.placeholder ? generateTitle(props.placeholder) : generateTitle(props.name)}
                        value={props.value}
                        onChange={props.onChange}
                        {...generateOptionalAttributes(props)}
                        {...generateCustomAttributes(props)}
                    />
                    <label htmlFor={props.name} className="form-check-label">
                        {generateTitle(props.label ?? props.name)} <span
                        className="text-danger"> {props.required ? ('*') : ''}</span>
                    </label>
                </div>

                {props.isPassword ? passwordToggle : ""}
            </div>
        </>);
}

/**
 * Generate Textbox
 *
 * @param props
 * @returns {*[]}
 */
const generateCheckbox = (props) => {
    {/*{...props.checkDefault ? {checked: optionKey === props.checkDefault} : {}}*/
    } // TODO need to apply auto checked

    return Object.entries(props.checkOptions).map(([optionKey, optionValue]) => (
        <div className={`form-check ${props.parentClass && ''}`} key={optionKey}>
            <input
                id={optionKey}
                name={props.name}
                type={props.type}
                required={optionValue.required ?? false}
                className={`${props.error ? " is-invalid" : ""} ${props.class && ''} form-check-input`}
                value={optionValue.value}
                onChange={props.onChange}
                {...generateCustomAttributes(props)}
            />
            <label htmlFor={optionKey} className="form-check-label">
                {generateTitle(optionValue.value)} 
                <span className="text-danger"> {props.required ? ('*') : ''}</span>
            </label>
        </div>
    ));
}

/**
 *
 * @param props
 * @returns {Element}
 */
const generateDropdown = (props) => {
    return (
        <>
            <select
                id={props.name}
                name={props.name}
                required={props.required ?? false}
                className={`form-control${props.error ? " is-invalid" : ""} select2 form-select`}
                value={props.value}
                onChange={props.onChange}
                {...generateCustomAttributes(props)}
            >
                {Object.entries(props.dropdownOptions).map(([optionKey, optionValue]) => (
                    <option key={optionKey} value={optionKey}>{optionValue}</option>
                ))}
            </select>
        </>);
}

/**
 *
 * @param props
 * @returns {JSX.Element}
 */
const generateFileUpload = (props) => {
    return (
        <>
            <input
                id={props.name}
                name={props.name}
                type={props.type}
                required={props.required ?? false}
                className={`${props.error ? " is-invalid" : ""} form-control`}
                onChange={props.onChange}
                {...generateCustomAttributes(props)}
            />
        </>);
}

/**
 *
 * @param props
 * @returns {JSX.Element}
 */
const generateTextarea = (props) => {
    return (
        <div className="maxLength-wrapper">
            <textarea
                id={props.name}
                name={props.name}
                required={props.required ?? false}
                className={`${props.error ? " is-invalid" : ""} form-control`}
                placeholder={props.placeholder ? generateTitle(props.placeholder) : generateTitle(props.name)}
                onChange={props.onChange}
                rows={(props.textareaOptions && props.textareaOptions.rows) ?? 5}
                cols={(props.textareaOptions && props.textareaOptions.cols) ?? 20}
                {...props.maxLength && {'maxLength': props.maxLength}}
                {...props.minLength && {'minLength': props.minLength}}
                {...generateCustomAttributes(props)}
            />
        </div>);
}

/**
 * Generate Optional attributes that are not frequently called
 *
 * @param props
 * @returns {{minValue?: *, maxValue?: *, minLength?: *, disabled?: *, maxLength?: *}}
 */
const generateOptionalAttributes = (props) => {
    return {
        ...props.minLength ? {'minLength': props.minLength} : {},
        ...props.maxLength ? {'maxLength': props.maxLength} : {},
        ...props.disabled ? {'disabled': props.disabled} : {},
        ...props.numberOptions && props.numberOptions.minValue ? {'data-min-value': props.numberOptions.minValue} : {},
        ...props.numberOptions && props.numberOptions.maxValue ? {'data-max-value': props.numberOptions.maxValue} : {},
        ...props.numberOptions && props.numberOptions.minValueMessage ? {'data-custom-message-minvalue': props.numberOptions.minValueMessage} : {},
        ...props.numberOptions && props.numberOptions.maxValueMessage ? {'data-custom-message-maxvalue': props.numberOptions.maxValueMessage} : {},
    }
}

/**
 * Generate a custom and regular expressions attributes
 *
 * @param props
 * @returns {{}}
 */
const generateCustomAttributes = (props) => {    
    const customAttributesMap = {
        regex: "data-regex",
        compare: "data-compare",
        regexMessage: "data-custom-message-regex",
        regexCustomCondition: "data-regex-custom-condition",
        compareMessage: "data-custom-message-compare",
        minLengthMessage: "data-custom-message-minlength",
        maxLengthMessage: "data-custom-message-maxlength",
        notEmptyMessage: "data-not-empty-message"
    };

    // Process the Map object and assign to props attribute
    return Object.entries(customAttributesMap).reduce((callback, [inputKey, value]) => {
        if (props.hasOwnProperty(inputKey)) {
            callback[value] = props[inputKey];
        }
        return callback;
    }, {});
}

export default GenerateInputs;