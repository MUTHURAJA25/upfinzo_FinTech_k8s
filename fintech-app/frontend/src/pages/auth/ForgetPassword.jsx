import GenerateInputs from "@/components/generateInputs.jsx";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "@/services/authService";
import { FormValidation, FormHandleChange } from "@/components/formValidator.jsx";
import { notify } from "@/components/notifications";
const ForgotPassword = () => {
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const isFormDirty = useRef(false);
    const button = document.querySelector('.save_button');
    const formFields = { email: "" }
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

            // Set errors to empty
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
            email: {
                regex: 'email'
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
            const res = await forgotPassword(formData.formFields);
            const message = res?.data?.message || "Send successful";
            button.textContent = "Done ✓";
            notify.success(message)
            setTimeout(() => {
                navigate("/login");
            }, 500);
            button.disabled = true;
        } catch (err) {
            const fallbackMsg = err?.response?.data?.message || "Send failed";
            setTimeout(() => {
                button.disabled = false;
            }, 1000);
            notify.error(fallbackMsg)
            button.disabled = true;
            setErrors(ApiValidator(formData.formFields, err));
        }
    };

    return (
        <div className="position-relative">
            <div className="authentication-wrapper authentication-basic container-p-y p-4 p-sm-0">
                <div className="authentication-inner py-6">
                    <div className="card p-md-7 p-1">

                        {/* Logo */}
                        <div className="app-brand justify-content-center mt-5">
                            <Link to="/" className="app-brand-link gap-2">
                                <span className="app-brand-text demo text-heading fw-semibold text-center">
                                    <img className="img-fluid w-50" src={new URL('@/assets/images/logo/logo.png', import.meta.url).href} alt="Logo" />
                                </span>
                            </Link>
                        </div>
                        {/* /Logo */}

                        <div className="card-body mt-1">
                            <h4 className="mb-1">Forgot Password? 🔒</h4>

                            <p className="mb-5">
                                Enter your email and we'll send you instructions to reset your
                                password
                            </p>

                            <form id="formAuthentication" className="mb-5" onSubmit={handleSubmit}>
                                <div className="form-floating form-floating-outline mb-5 form-control-validation">
                                    <GenerateInputs mapField={compileFields.email} />
                                </div>
                                <button
                                    disabled={true}
                                    className="btn btn-primary d-grid save_button w-100 mb-5"
                                    type="submit">
                                    Send Reset Link
                                </button>
                            </form>

                            <div className="text-center">
                                <Link
                                    to="/login"
                                    className="d-flex align-items-center justify-content-center"
                                >
                                    <i className="icon-base ri ri-arrow-left-s-line scaleX-n1-rtl icon-20px me-1_5"></i>
                                    Back to login
                                </Link>
                            </div>
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
    );
};

export default ForgotPassword;
