import React, { useState, useEffect, useRef } from "react";
import "@/assets/styles/fonts/icons.css";
import "@/assets/styles/auth.css";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "@/services/authService.js";
import GenerateInputs from "@/components/generateInputs.jsx";
import { notify } from "@/components/notifications";
import ApiValidator from "@/components/apiValidator.jsx";
import { FormValidation, FormHandleChange } from "@/components/formValidator.jsx";

/**
 * Signup
 *
 * @returns {Element}
 * @constructor
 */
function Signup() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const isFormDirty = useRef(false);
    const button = document.querySelector('.save_button');
    const formFields = { name: "", email: "", password: "", confirmPassword: "" }

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
            name: {
                minLength: 3,
                maxLength: 25
            },
            email: {
                regex: 'email'
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
            }
        }[fieldKey] || {};

        callback[fieldKey] = { ...config, ...conditions }
        return callback;
    }, {});

    const handleSubmit = async (e) => {
        e.preventDefault();
        button.disabled = false;
        setErrors({});

        // Sanity Check
        if (!isFormValid) {
            notify.error('Please fill all the required fields');
            return false;
        }

        try {
            const res = await signup(formData.formFields);
            const message = res?.data?.message || "Signup successful";
            notify.success(message);

            setTimeout(() => {
                navigate("/login");
            }, 500);
            button.disabled = true;
        } catch (err) {

            const errObj = err.response?.data?.errors;
            const fallbackMsg = err?.response?.data?.message || "Signup failed";

            setTimeout(() => {
                button.disabled = false;
            }, 1000);

            if (typeof errObj == "undefined") {
                notify.error(fallbackMsg);
            }

            button.disabled = true;
            setErrors(ApiValidator(formData.formFields, err));
        }
    };

    return (
        <>
            <div className="position-relative">
                <div className="authentication-wrapper authentication-basic container-p-y p-4 p-sm-0">
                    <div className="authentication-inner py-6">
                        <div className="card p-md-7 p-1">
                            <div className="app-brand justify-content-center mt-5">
                                <Link to="/" className="app-brand-link gap-2">
                                    <span className="app-brand-text demo text-heading fw-semibold text-center">
                                        <img className="img-fluid w-50" src={new URL('@/assets/images/logo/logo.png', import.meta.url).href} alt="Logo" />
                                    </span>
                                </Link>
                            </div>

                            <div className="card-body mt-1">
                                <p className="mb-5">Please sign-up to your account</p>

                                <form
                                    id="formAuthentication"
                                    className="mb-5"
                                    onSubmit={handleSubmit}
                                >
                                    <div className="form-floating form-floating-outline mb-5 form-control-validation">
                                        <GenerateInputs mapField={compileFields.name} />
                                    </div>

                                    <div className="form-floating form-floating-outline mb-5 form-control-validation">
                                        <GenerateInputs mapField={compileFields.email} />
                                    </div>

                                    <div className="mb-5">
                                        <div className="form-password-toggle form-control-validation">
                                            <GenerateInputs mapField={compileFields.password} />
                                        </div>
                                    </div>

                                    <div className="mb-5">
                                        <div className="form-password-toggle form-control-validation">
                                            <GenerateInputs mapField={compileFields.confirmPassword} />
                                        </div>
                                    </div>

                                    <div className="mb-5">
                                        <button
                                            className="btn btn-primary save_button d-grid w-100"
                                            disabled={true}
                                            type="submit"
                                        >
                                            Signup
                                        </button>
                                    </div>
                                </form>

                                <p className="text-center mb-5">
                                    <span>Already have an account?</span>
                                    <Link to="/login">
                                        <span className="ms-2">Sign in instead</span>
                                    </Link>
                                </p>
                            </div>
                        </div>

                        {/* Authentication Image */}
                        <img
                            alt="mask"
                            className="authentication-image d-none d-lg-block"
                            src={
                                new URL(
                                    "@/assets/images/illustration/auth-basic-login-mask-light.png",
                                    import.meta.url
                                ).href
                            }
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Signup;
