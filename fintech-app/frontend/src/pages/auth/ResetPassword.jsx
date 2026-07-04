import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { resetPassword } from "@/services/authService";
import GenerateInputs from "@/components/generateInputs.jsx";
import { notify } from "@/components/notifications";
import { FormValidation, FormHandleChange } from "@/components/formValidator.jsx";
import ApiValidator from "@/components/apiValidator";

/**
 * Rest Password
 *
 * @returns {Element}
 * @constructor
 */

function ResetPassword() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const isFormDirty = useRef(false);
  const button = document.querySelector('.send-btn');
  const params = new URLSearchParams(window.location.search);
  const formFields = { password: "", confirmPassword: '' };

  const [formData, setFormData] = useState({
    formValidation: {},
    formFields
  });

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

    if (!isFormValid) {
      notify.error('Please fill all the required fields')
      return false;
    }


    formData.formFields.token = params.get('token');
    formData.formFields.email = params.get('email');
    delete formData.formFields.confirmPassword;

    try {
      const res = await resetPassword(formData.formFields);
      const message = res?.data?.message || "Send successful";
      notify.success(message)

      setTimeout(() => {
        navigate("/login");
      }, 500);
      button.disabled = false;
    } catch (err) {
      const fallbackMsg = err?.response?.data?.message || "Send failed";

      setTimeout(() => {
        button.disabled = false;
      }, 1000);

      notify.error(fallbackMsg)

      button.disabled = true;
      // setErrors(FormValidation(formData, errors));
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
              <h4 className="mb-1">Reset Password? 🔒</h4>

              <p className="mb-5">Update your new password</p>

              <form
                id="formAuthentication"
                className="mb-5"
                onSubmit={handleSubmit}
              >
                <div className="form-floating form-floating-outline mb-5 form-control-validation">
                   <GenerateInputs mapField={compileFields.password} />
                </div>
                <div className="form-floating form-floating-outline mb-5 form-control-validation">
                 <GenerateInputs mapField={compileFields.confirmPassword} />
                </div>
                <button
                  className="btn btn-primary send-btn d-grid w-100 mb-5"
                  type="submit"
                  disabled={true}
                >
                  Save Password
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
          <img alt="mask" className="authentication-image d-none d-lg-block" src={new URL('@/assets/images/illustration/auth-basic-login-mask-light.png', import.meta.url).href} />
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
