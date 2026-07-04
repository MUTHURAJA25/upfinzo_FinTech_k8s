import React, { useState, useEffect, useRef } from "react";
import Wrapper from "@/pages/layouts/Wrapper";
import GenerateInputs from "@/components/generateInputs"; 
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormHandleChange, FormValidation } from "@/components/formValidator.jsx";

/**
 * PaymentLink Component
 */
function PaymentLink() {
  const submitButtonRef = useRef(null);
  const isDirtyRef = useRef(false);

  const fieldTemplate = {
    amount: "",
    customerName: "",
    email: "",
    description: "",
  };

  const [formState, setFormState] = useState({
    formFields: { ...fieldTemplate },
    formValidation: {},
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [formIsValid, setFormIsValid] = useState(false);
  const [paymentLinks, setPaymentLinks] = useState([]);
  const [showModal, setShowModal] = useState(false);

  /* ------------------------------
      HANDLE INPUT CHANGE
  ------------------------------- */
  const handleFieldChange = (e) => {
    setFormState(FormHandleChange(e, formState));
    isDirtyRef.current = true;
  };

  /* ------------------------------
      INPUT FIELD CONFIG
  ------------------------------- */
  const inputConfigs = Object.keys(fieldTemplate).reduce((acc, key) => {
    const baseConfig = {
      key,
      name: key,
      id: key,
      type: key === "amount" ? "number" : "text",
      required: true,
      value: formState.formFields[key],
      error: validationErrors.formFields?.[key],
      onChange: handleFieldChange,
    };

    const rules = {
      amount: {
        regex: "only_number",
        numberOptions: { minValue: 10, maxValue: 99999 },
        notEmptyMessage: "Please enter amount",
        minValueMessage: "Min amount: 10",
        maxValueMessage: "Max amount: 99999",
        minLength: 2,
        maxLength: 5,
        minLengthMessage: "Min amount: 10",
        maxLengthMessage: "Max amount: 99999",
      },
      customerName: {
        regex: "alpha_with_space",
        regexMessage: "Invalid customer name",
        notEmptyMessage: "Please enter customer name",
        minLength: 3,
        maxLength: 25,
        minLengthMessage: "Min 3 characters",
        maxLengthMessage: "Max 25 characters",
      },
      email: {
        regex: "email",
        notEmptyMessage: "Please enter email",
        regexMessage: "Enter a valid email",
      },
      description: {
        type: "textarea",
        required: false,
        minLength: 5,
        maxLength: 200,
        textareaOptions: { rows: 4 },
        minLengthMessage: "Min 5 characters",
        maxLengthMessage: "Max 200 characters",
      },
    }[key] || {};

    acc[key] = { ...baseConfig, ...rules };
    return acc;
  }, {});

  /* ------------------------------
      VALIDATION ON FORM CHANGE
  ------------------------------- */
  useEffect(() => {
    if (!isDirtyRef.current) return;

    if (submitButtonRef.current) submitButtonRef.current.disabled = true;

    const result = FormValidation(formState, fieldTemplate);

    if (result === true) {
      setValidationErrors({});
      setFormIsValid(true);
      if (submitButtonRef.current) submitButtonRef.current.disabled = false;
    } else {
      setValidationErrors(result);
      setFormIsValid(false);
    }
  }, [formState]);

  /* ------------------------------
      SUBMIT ACTION
  ------------------------------- */
  const handleGenerateLink = async (e) => {
    e.preventDefault();

    if (!formIsValid) {
      toast.error("Please fill all required fields", { autoClose: 1200 });
      return;
    }

    if (submitButtonRef.current) submitButtonRef.current.disabled = true;

    const loadingToast = toast.loading("Generating payment link...");

    try {
      const generatedLink = `https://pay.example.com/${Date.now()}`;

      const newLinkEntry = {
        id: paymentLinks.length + 1,
        ...formState.formFields,
        link: generatedLink,
        status: "Pending",
        method: "LINK",
        createdAt: new Date().toLocaleString(),
      };

      setPaymentLinks((prev) => [...prev, newLinkEntry]);

      // Reset form
      setFormState({
        formFields: { ...fieldTemplate },
        formValidation: {},
      });

      setShowModal(false);

      toast.update(loadingToast, {
        render: "Payment link generated!",
        type: "success",
        isLoading: false,
        autoClose: 1200,
      });
    } catch {
      toast.update(loadingToast, {
        render: "Failed to generate payment link",
        type: "error",
        isLoading: false,
        autoClose: 1200,
      });
    } finally {
      if (submitButtonRef.current) submitButtonRef.current.disabled = false;
    }
  };

  /* ------------------------------
      RENDER
  ------------------------------- */
  return (
    <Wrapper page="Payment Link">
      <div className="card shadow-lg border-0 mx-auto" style={{ borderRadius: 16 }}>
        <div className="card-body p-4">
          <div className="d-flex justify-content-end mb-4">
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              Generate Payment Link
            </button>
          </div>

          {/* ---------------- Table ---------------- */}
          <table className="table table-bordered w-100">
            <thead>
              <tr>
                <th>ID</th>
                <th>Amount</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Description</th>
                <th>Status</th>
                <th>Method</th>
                <th>Link</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {paymentLinks.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-3">
                    No payment links found.
                  </td>
                </tr>
              ) : (
                paymentLinks.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.id}</td>
                    <td>₹{entry.amount}</td>
                    <td>{entry.customerName}</td>
                    <td>{entry.email}</td>
                    <td>{entry.description}</td>
                    <td>{entry.status}</td>
                    <td>{entry.method}</td>
                    <td>
                      <a href={entry.link} target="_blank" rel="noreferrer">Open</a>
                      <span
                        className="ms-3 text-primary"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigator.clipboard.writeText(entry.link)}
                      >
                        Copy
                      </span>
                    </td>
                    <td>{entry.createdAt}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ---------------- Modal ---------------- */}
        {showModal && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ background: "rgba(0,0,0,0.5)" }}
          >
            <div className="bg-white p-4 shadow-lg" style={{ width: 420, borderRadius: 12 }}>
              <h4>Create Payment Link</h4>

              <form className="mt-3" onSubmit={handleGenerateLink}>
                {Object.values(inputConfigs).map((field) => (
                  <div className="mb-4" key={field.name}>
                    <GenerateInputs mapField={field} />
                  </div>
                ))}

                <div className="d-flex justify-content-end gap-2 mt-2">
                  <button className="btn btn-secondary" type="button" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>

                  <button className="btn btn-primary" ref={submitButtonRef} type="submit" disabled>
                    Generate
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
}

export default PaymentLink;
