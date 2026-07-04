import React, { useState, useEffect, useRef } from "react";
import Wrapper from '../layouts/Wrapper'
import { FormValidation, FormHandleChange } from "@/components/formValidator.jsx";
import generateInputs from "@/components/generateInputs.jsx";

function generateInputsExamples() {


    const isFormDirty = useRef(false);
    const [errors, setErrors] = useState({});
    const button = document.querySelector('.save_button');
    const formFields = {
        onlyNumber: "", onlyAlpha: "", onlyAlphaNumeric: "", ifsc: "", upi: "", custom: "",
        name: "", email: "", password: "", confirmPassword: "",
        summary: "", country: "", gender: "", agree: false, dob: "", fileUpload: null
    };
    const [formData, setFormData] = useState({
        formValidation: {},
        formFields
    });

    // Form Validation
    useEffect(() => {
        // Prevent Initial Render
        if (!isFormDirty.current) {
            return;
        }

        button.disabled = true;
        const isFormValidated = FormValidation(formData, formFields);

        if (isFormValidated === true) {
            setErrors({});
            setIsFormValid(true);
            button.disabled = false;
        } else {
            setErrors(isFormValidated);
        }
    }, [formData]);

    /**
     * Initiate the validation
     *
     * @param inputs
     */
    const handleChange = (inputs) => {
        setFormData(FormHandleChange(inputs, formData));
        // For useEffect to start the validation when component renders
        isFormDirty.current = true;
    };

    const compileFields = Object.keys(formFields).reduce((callback, fieldKey) => {
        const config = {
            key: fieldKey,
            name: fieldKey,
            type: 'text',
            id: fieldKey,
            onChange: handleChange,
            required: true,
            error: (errors.formFields && errors.formFields[fieldKey]) ?? '',
            value: formData.formFields[fieldKey]
        };

        // Add more customize conditions
        const conditions = {
            onlyNumber: {
                numberOptions: {
                    minValue: 2,
                    maxValue: 5
                },
                regex: 'only_number',
                regexMessage: 'Only numbers are allowed',
                minLength: 1,
                maxLength: 25,
                parentClass: '',
                childrenClass: '',
                class: '',
                notEmptyMessage: 'This is not empty message',
                minLengthMessage: 'Minimum length is 3 characters',
                maxLengthMessage: 'Maximum length is 25 characters'

            },
            onlyAlpha: {
                numberOptions: {
                    minValue: 1,
                    maxValue: 5
                },
                regex: 'only_alpha',
                regexMessage: 'Only alphabets are allowed',
            },
            onlyAlphaNumeric: {
                regex: 'only_alpha_numeric',
                regexMessage: 'Only alphabets and numbers are allowed',
            },
            upi: {
                regex: 'upi',
                regexMessage: 'Only upi id is allowed',
            },
            ifsc: {
                regex: 'ifsc',
                regexMessage: 'Only ifsc code is allowed',
            },
            custom: {
                regex: 'custom',
                regexMessage: 'Only alphabets are allowed',
                regexCustomCondition: '[a-zA-Z]+',
            },
            name: {
                minLength: 1,
                maxLength: 25,
                parentClass: '',
                childrenClass: '',
                class: '',
                notEmptyMessage: 'This is not empty message',
                minLengthMessage: 'Minimum length is 3 characters',
                maxLengthMessage: 'Maximum length is 25 characters'
            },
            email: {
                regex: 'email',
                regexMessage: 'Please enter a valid email address',
            },
            password: {
                type: 'password',
                regex: 'strongPassword',
                isPassword: true
            },
            confirmPassword: {
                type: 'password',
                compare: 'password', // Comparing other field,
                compareMessage: "Passwords don't match",
                isPassword: true
            },
            summary: {
                type: 'textarea',
                textareaOptions: { rows: 5, cols: 10, },
                maxLength: 100,
                minLength: 10,
                maxLengthMessage: 'Maximum length is 100 characters'
            },
            fileUpload: {
                type: 'file',
            },
            country: {
                type: 'dropdown',
                dropdownOptions: { '': 'Select Country', country1: 'India', country2: 'Ireland', other: 'USA' }
            },
            gender: {
                type: 'radio',
                parentClass: 'mt-0',
                class: 'form-check-input',
                checkOptions: {
                    Male: { value: 'male', required: true, },
                    Female: { value: 'female', required: true, },
                    Other: { value: 'other', required: true, }
                }
            },
            agree: {
                type: 'checkbox',
                checkOptions: { active: { value: 'Agree to our terms and conditions', required: true, } }
            },
            dob: {
                type: 'date',
            },
        }[fieldKey] || {};

        callback[fieldKey] = { ...config, ...conditions }
        return callback;
    }, {});

    const handleSubmit = async (e) => {
        e.preventDefault();
        button.disabled = false;
    }

    const onlyNumber = `
    <span class="text-danger">const</span> conditions = {
        onlyNumber: {
            <span class="text-danger">numberOptions </span>: {
                minValue: 2,
                maxValue: 5
            },
            <span class="text-danger">minLength</span>: 3,
            <span class="text-danger">maxLength</span>: 25,
            regex: 'only_number',
            regexMessage: 'Only numbers are allowed',
            minLength: 1,
            maxLength: 25,
            parentClass: '',
            childrenClass: '',
            class: '',
            notEmptyMessage: 'This is not empty message',
            minLengthMessage: 'Minimum length is 3 characters',
            maxLengthMessage: 'Maximum length is 25 characters'
        },
    };
`;

    const customeField = `
    <span class="text-danger">const</span> conditions = {
        custom: {
            <span class="text-danger">regex</span>: 'custom',
            <span class="text-danger">regexMessage</span>: 'Only alphabets are allowed',
            <span class="text-danger">regexCustomCondition</span>: '[a-zA-Z]+',
        },
    };
`;

    const upiidField = `
    <span class="text-danger">const</span> conditions = {
        upi: {
            <span class="text-danger">regex</span>: 'upi',
            <span class="text-danger">regexMessage</span>: 'Only upi id is allowed',
        },
    };
`;

    const ifscField = `
    <span class="text-danger">const</span> conditions = {
        ifsc: {
            <span class="text-danger">regex</span>: 'ifsc',
            <span class="text-danger">regexMessage</span>: 'Only ifsc code is allowed',
        },
    };
`;
    const emailField = `
    <span class="text-danger">const</span> conditions = {
        email: {
            <span class="text-danger">regex</span>: 'email',
            <span class="text-danger">regexMessage</span>: 'Please enter a valid email address',
        },
    };
`;
    const fileTypeField = `
    <span class="text-danger">const</span> conditions = {
        fileUpload: {
            <span class="text-danger">type</span>: 'file',
        },
    };
`;
    const passwordField = `
    <span class="text-danger">const</span> conditions = {
        password: {
          <span class="text-danger">  type </span>: 'password',
            regex: 'strongPassword',
            isPassword: true
        },
    };
`;
    const confirmPasswordField = `
    <span class="text-danger">const</span> conditions = {
        confirmPassword: {
          <span class="text-danger">  type </span>: 'password',
            compare: 'password',
            compareMessage: "Passwords don't match",
            isPassword: true
        },
    };
`;

    const onlyAlphaField = `
    <span class="text-danger">const</span> conditions = {
        onlyAlpha: {
            <span class="text-danger">regex</span>: 'only_alpha',
            dropdownOptions: { '': 'Select Country', country1: 'India', country2: 'Ireland', other: 'USA' }
        },
    };
`;

    const countryField = `
    <span class="text-danger">const</span> conditions = {
        country: {
            <span class="text-danger">type</span>: 'dropdown',
            <span class="text-danger">regexMessage</span>: 'Only alphabets are allowed',
        },
    };
`;

    const onlyAlphaNumericField = `
    <span class="text-danger">const</span> conditions = {
        onlyAlphaNumeric: {
            <span class="text-danger">regex</span>: 'only_alpha_numeric',
            <span class="text-danger">regexMessage</span>: 'Only alphabets and numbers are allowed',
        },
    };
`;

    const summeryField = `
    <span class="text-danger">const</span> conditions = {
             summary : {
                type: 'textarea',
                <span className="text-danger"> textareaOptions:</span> { rows: 5, cols: 10, },
                maxLength: 100,
                minLength: 10,
                maxLengthMessage: 'Maximum length is 100 characters'
            },
},
`;

    const genderField = `
    <span class="text-danger">const</span> conditions = {
             gender : {
                type: 'radio',
                parentClass: 'mt-0',
                class: 'form-check-input',
                 <span class="text-danger">checkOptions:</span> {
                    Male: { value: 'male', required: true, },
                    Female: { value: 'female', required: true, },
                    Other: { value: 'other', required: true, }
                }
            },
},
`;
    return (
        <Wrapper page="Example Forms">
            <div className="card">
                <h5 className="card-header">Generate Inputs - Examples</h5>
                <div className="card-body">
                    <form id="formAuthentication" className="mb-5" onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 col-sm-12">
                                <div className="form-floating form-floating-outline mb-5 form-control-validation">
                                    <div className="alert  alert-primary mb-3">
                                        <h6 className="alert-heading d-flex align-items-center m-0">
                                            Input Field
                                        </h6>
                                        <p className="mb-0">
                                            <pre className="bg-dark card p-1 border-3 text-white m-0">
                                                <code dangerouslySetInnerHTML={{ __html: onlyNumber }} />
                                            </pre>
                                        </p>
                                    </div>
                                    <generateInputs mapField={compileFields.onlyNumber} />
                                </div>
                                <div className="form-floating form-floating-outline mb-5 form-control-validation">
                                    <div className="alert  alert-primary mb-3">
                                        <h6 className="alert-heading d-flex align-items-center m-0">
                                            Email Field
                                        </h6>
                                        <p className="mb-0">
                                            <pre className="bg-dark card p-1 border-3 text-white m-0">
                                                <code dangerouslySetInnerHTML={{ __html: emailField }} />
                                            </pre>
                                        </p>
                                    </div>

                                    <generateInputs mapField={compileFields.email} />

                                </div>
                                <div className="form-floating form-floating-outline mb-5 form-control-validation">
                                    <generateInputs mapField={compileFields.name} />
                                </div>
                                <div className="form-floating form-floating-outline mb-5 form-control-validation">
                                    <div className="alert  alert-primary mb-3">
                                        <h6 className="alert-heading d-flex align-items-center m-0">
                                            Password Field
                                        </h6>
                                        <p className="mb-0">
                                            <pre className="bg-dark card p-1 border-3 text-white m-0">
                                                <code dangerouslySetInnerHTML={{ __html: passwordField }} />
                                            </pre>
                                        </p>
                                    </div>
                                    <generateInputs mapField={compileFields.password} />
                                </div>
                                <div className="form-floating form-floating-outline mb-5 form-control-validation">
                                    <div className="alert  alert-primary mb-3">
                                        <h6 className="alert-heading d-flex align-items-center m-0">
                                            Confirm Password Field
                                        </h6>
                                        <p className="mb-0">
                                            <pre className="bg-dark card p-1 border-3 text-white m-0">
                                                <code dangerouslySetInnerHTML={{ __html: confirmPasswordField }} />
                                            </pre>
                                        </p>
                                    </div>
                                    <generateInputs mapField={compileFields.confirmPassword} />
                                </div>
                                <div className="form-floating form-floating-outline mb-5 form-control-validation">
                                    <div className="alert  alert-primary mb-3">
                                        <h6 className="alert-heading d-flex align-items-center m-0">
                                            FileType Field
                                        </h6>
                                        <p className="mb-0">
                                            <pre className="bg-dark card p-1 border-3 text-white m-0">
                                                <code dangerouslySetInnerHTML={{ __html: fileTypeField }} />
                                            </pre>
                                        </p>
                                    </div>
                                    <generateInputs mapField={compileFields.fileUpload} />
                                </div>
                                <div className="form-password-toggle form-control-validation mb-5">
                                    <div className="alert alert-primary mb-3">
                                        <h6 className="alert-heading d-flex align-items-center m-0">
                                            Radio Button Field
                                        </h6>
                                        <p className="mb-0">
                                            <pre className="bg-dark card p-1 border-3 text-white m-0">
                                                <code dangerouslySetInnerHTML={{ __html: genderField }} />
                                            </pre>
                                        </p>
                                    </div>
                                    <div className=" d-flex gap-3 pt-3">
                                        <generateInputs mapField={compileFields.gender} />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6 col-sm-12">
                                <div className="form-floating form-floating-outline mb-5 form-control-validation">
                                    <div className="alert  alert-primary mb-3">
                                        <h6 className="alert-heading d-flex align-items-center m-0">
                                            Custom Field
                                        </h6>
                                        <p className="mb-0">
                                            <pre className="bg-dark card p-1 border-3 text-white m-0">
                                                <code dangerouslySetInnerHTML={{ __html: customeField }} />
                                            </pre>
                                        </p>
                                    </div>
                                    <generateInputs mapField={compileFields.custom} />
                                </div>
                                <div className="form-floating form-floating-outline mb-5 form-control-validation">
                                    <div className="alert  alert-primary mb-3">
                                        <h6 className="alert-heading d-flex align-items-center m-0">
                                            UPI ID Field
                                        </h6>
                                        <p className="mb-0">
                                            <pre className="bg-dark card p-1 border-3 text-white m-0">
                                                <code dangerouslySetInnerHTML={{ __html: upiidField }} />
                                            </pre>
                                        </p>
                                    </div>
                                    <generateInputs mapField={compileFields.upi} />
                                </div>
                                <div className="form-floating form-floating-outline mb-5 form-control-validation">
                                    <div className="alert  alert-primary mb-3">
                                        <h6 className="alert-heading d-flex align-items-center m-0">
                                            IFSC Field
                                        </h6>
                                        <p className="mb-0">
                                            <pre className="bg-dark card p-1 border-3 text-white m-0">
                                                <code dangerouslySetInnerHTML={{ __html: ifscField }} />
                                            </pre>
                                        </p>
                                    </div>
                                    <generateInputs mapField={compileFields.ifsc} />
                                </div>
                                <div className="form-floating form-floating-outline mb-5 form-control-validation">
                                    <div className="alert  alert-primary mb-3">
                                        <h6 className="alert-heading d-flex align-items-center m-0">
                                            Only Alpha Numeric Field
                                        </h6>
                                        <p className="mb-0">
                                            <pre className="bg-dark card p-1 border-3 text-white m-0">
                                                <code dangerouslySetInnerHTML={{ __html: onlyAlphaNumericField }} />
                                            </pre>
                                        </p>
                                    </div>
                                    <generateInputs mapField={compileFields.onlyAlphaNumeric} />
                                </div>
                                <div className="form-floating form-floating-outline mb-5 form-control-validation">
                                    <div className="alert  alert-primary mb-3">
                                        <h6 className="alert-heading d-flex align-items-center m-0">
                                            Only Alpha Field
                                        </h6>
                                        <p className="mb-0">
                                            <pre className="bg-dark card p-1 border-3 text-white m-0">
                                                <code dangerouslySetInnerHTML={{ __html: onlyAlphaField }} />
                                            </pre>
                                        </p>
                                    </div>
                                    <generateInputs mapField={compileFields.onlyAlpha} />
                                </div>
                                <div className="form-floating form-floating-outline mb-5 form-control-validation">
                                    <generateInputs mapField={compileFields.dob} />
                                </div>
                                <div className="form-floating form-floating-outline mb-5 form-control-validation">
                                    <div className="alert  alert-primary mb-3">
                                        <h6 className="alert-heading d-flex align-items-center m-0">
                                            Textarea Field
                                        </h6>
                                        <p className="mb-0">
                                            <pre className="bg-dark card p-1 border-3 text-white m-0">
                                                <code dangerouslySetInnerHTML={{ __html: summeryField }} />
                                            </pre>
                                        </p>
                                    </div>
                                    <generateInputs mapField={compileFields.summary} />
                                </div>
                                <div className="form-floating form-floating-outline mb-5 form-control-validation">
                                    <div className="alert  alert-primary mb-3">
                                        <h6 className="alert-heading d-flex align-items-center m-0">
                                            Dropdown Field
                                        </h6>
                                        <p className="mb-0">
                                            <pre className="bg-dark card p-1 border-3 text-white m-0">
                                                <code dangerouslySetInnerHTML={{ __html: countryField }} />
                                            </pre>
                                        </p>
                                    </div>
                                    <generateInputs mapField={compileFields.country} />
                                </div>
                            </div>
                        </div>

                        <div className="mb-5">
                            <div className="form-password-toggle form-control-validation">
                                <generateInputs mapField={compileFields.agree} />
                            </div>
                        </div>
                        <div className="mb-5">
                            <button className="btn btn-primary save_button d-grid w-100"
                                disabled={true} type="submit">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div >
        </Wrapper >
    )
}

export default generateInputsExamples
