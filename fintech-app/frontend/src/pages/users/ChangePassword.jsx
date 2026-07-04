import React, {useRef, useState, useEffect} from "react";
import Wrapper from "../layouts/Wrapper";
import GenerateInputs from "@/components/generateInputs.jsx";
import {FormValidation, FormHandleChange} from "@/components/formValidator.jsx";

function ChangePassword() {
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const isFormDirty = useRef(false);
    const button = document.querySelector('.save_button');
    const formFields = {currentPassword: "", confirmPassword: "", newPassword: ""}

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
            type: 'password',
            id: fieldKey,
            onChange: handleChange,
            required: true,
            isPassword: true,
            error: (errors.formFields && errors.formFields[fieldKey]) ?? '',
            value: formData.formFields[fieldKey]
        };

        // Add more customize conditions
        const conditions = {
            currentPassword: {
                regex: 'strongPassword',
            },
            newPassword: {
                regex: 'strongPassword',
            },
            confirmPassword: {
                compare: 'newPassword', // Comparing other field,
                compareMessage: "Passwords don't match",
            }
        }[fieldKey] || {};

        callback[fieldKey] = {...config, ...conditions}
        return callback;
    }, {});


    return (
        <Wrapper page="Change Password">
            <div className="content-wrapper">
                <div className="card mb-6">
                    <h5 className="card-header">Change Password</h5>
                    <div className="card-body pt-1">
                        <form id="formAccountSettings" method="GET" onsubmit="return false">
                            <div className="row">
                                <div className="mb-5 col-md-6 form-password-toggle form-control-validation">
                                    <div className="form-floating form-floating-outline">
                                        <GenerateInputs mapField={compileFields.currentPassword}/>
                                    </div>
                                </div>
                            </div>
                            <div className="row g-5 mb-6">
                                <div className="col-md-6 form-password-toggle form-control-validation">
                                    <div className="form-floating form-floating-outline">
                                        <GenerateInputs mapField={compileFields.newPassword}/>
                                    </div>
                                </div>
                                <div className="col-md-6 form-password-toggle form-control-validation">
                                    <div className="form-floating form-floating-outline">
                                        <GenerateInputs mapField={compileFields.confirmPassword}/>
                                    </div>
                                </div>
                            </div>
                            <h6 className="text-body">Password Requirements:</h6>
                            <ul className="ps-4 mb-0">
                                <li className="mb-4">
                                    Minimum 8 characters long - the more, the better
                                </li>
                                <li className="mb-4">At least one lowercase character</li>
                                <li>At least one number, symbol, or whitespace character</li>
                            </ul>
                            <div className="mt-6">
                                <button type="submit" className="btn btn-primary save_button me-3">
                                    Save changes
                                </button>
                                <button type="reset" className="btn btn-outline-secondary">
                                    Reset
                                </button>
                            </div>
                        </form>
                    </div>
                </div>;
            </div>
        </Wrapper>
    );
}

export default ChangePassword;
