import React, { useState, useRef, useEffect } from "react";
import Wrapper from "@/pages/layouts/Wrapper";
import generateInputs from "@/components/generateInputs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormHandleChange, FormValidation } from "@/components/formValidator.jsx";

export default function RefundRequests() {
  const submitButtonRef = useRef(null);
  const isDirtyRef = useRef(false);

  const fieldTemplate = {
    transactionId: "",
    amount: "",
    reason: "",
    description: "",
  };

  const [formState, setFormState] = useState({
    formFields: { ...fieldTemplate },
    formValidation: {},
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [refundList, setRefundList] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const REASONS = {
    "": "-- Select Reason --",
    duplicate: "Duplicate transaction",
    fraud: "Fraudulent transaction",
    customer_request: "Customer requested refund",
    service_not_received: "Service not received",
    other: "Other",
  };

  /* ---------------------------------
        ON INPUT CHANGE
  ---------------------------------- */
  const handleFieldChange = (e) => {
    setFormState(FormHandleChange(e, formState));
    isDirtyRef.current = true;
  };

  /* ---------------------------------
        FIELD CONFIGURATION
  ---------------------------------- */
  const inputConfigs = Object.keys(fieldTemplate).reduce((acc, key) => {
    const base = {
      key,
      name: key,
      id: key,
      value: formState.formFields[key],
      onChange: handleFieldChange,
      required: true,
      error: validationErrors.formFields?.[key],
      type: "text",
    };

    const rules = {
      transactionId: {
        minLength: 3,
        maxLength: 50,
        notEmptyMessage: "Please enter transaction ID",
        minLengthMessage: "Transaction ID must be at least 3 characters",
        maxLengthMessage: "Max 50 characters allowed",
      },

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

      reason: {
        type: "dropdown",
        dropdownOptions: REASONS,
        notEmptyMessage: "Select a reason",
      },

      description: {
        type: "textarea",
        required: false,
        minLength: 5,
        maxLength: 200,
        textareaOptions: { rows: 4 },
        minLengthMessage: "Description must be at least 5 characters",
        maxLengthMessage: "Description can be max 200 characters",
      },
    }[key] || {};

    acc[key] = { ...base, ...rules };
    return acc;
  }, {});

  /* ---------------------------------
        VALIDATION
  ---------------------------------- */
  useEffect(() => {
    if (!isDirtyRef.current) return;

    const validationResult = FormValidation(formState, fieldTemplate);

    if (validationResult === true) {
      setValidationErrors({});
      setIsFormValid(true);
      if (submitButtonRef.current) submitButtonRef.current.disabled = false;
    } else {
      setValidationErrors(validationResult);
      setIsFormValid(false);
      if (submitButtonRef.current) submitButtonRef.current.disabled = true;
    }
  }, [formState]);

  /* ---------------------------------
        SUBMIT REQUEST
  ---------------------------------- */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error("Please fix the errors before submitting", { autoClose: 1200 });
      return;
    }

    if (submitButtonRef.current) submitButtonRef.current.disabled = true;

    const newEntry = {
      id: refundList.length + 1,
      ...formState.formFields,
      reasonLabel: REASONS[formState.formFields.reason] || "",
      status: "Pending",
      createdAt: new Date().toLocaleString(),
    };

    setRefundList((prev) => [newEntry, ...prev]);

    // reset form
    setFormState({
      formFields: { ...fieldTemplate },
      formValidation: {},
    });

    setShowModal(false);

    toast.success("Refund request submitted!", { autoClose: 1200 });

    if (submitButtonRef.current) submitButtonRef.current.disabled = false;
  };

  /* ---------------------------------
        CANCEL REQUEST
  ---------------------------------- */
  const handleCancelRequest = (id) => {
    setRefundList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Cancelled" } : item
      )
    );

    toast.success("Refund request cancelled", { autoClose: 1200 });
  };

  /* ---------------------------------
        RENDER UI
  ---------------------------------- */
  return (
    <Wrapper page="Refund Requests">
      <div className="card shadow-lg border-0 mx-auto" style={{ borderRadius: 16 }}>
        <div className="card-body p-4">

          <div className="d-flex justify-content-end mb-4">
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              New Refund Request
            </button>
          </div>

          {/* Table */}
          <table className="table table-bordered w-100">
            <thead>
              <tr>
                <th>ID</th>
                <th>Transaction ID</th>
                <th>Amount</th>
                <th>Reason</th>
                <th>Description</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {refundList.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-3">
                    No refund requests found.
                  </td>
                </tr>
              ) : (
                refundList.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.id}</td>
                    <td>{entry.transactionId}</td>
                    <td>₹{entry.amount}</td>
                    <td>{entry.reasonLabel}</td>
                    <td style={{ whiteSpace: "pre-wrap" }}>
                      {entry.description || "-"}
                    </td>
                    <td>{entry.status}</td>
                    <td>{entry.createdAt}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        disabled={entry.status !== "Pending"}
                        onClick={() => handleCancelRequest(entry.id)}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ background: "rgba(0,0,0,0.5)" }}
          >
            <div className="bg-white p-4 shadow-lg" style={{ width: 420, borderRadius: 12 }}>
              <h4>New Refund Request</h4>

              <form className="mt-3" onSubmit={handleSubmit}>
                {Object.values(inputConfigs).map((field) => (
                  <div className="mb-4" key={field.name}>
                    <generateInputs mapField={field} />
                  </div>
                ))}

                <div className="d-flex justify-content-end gap-2 mt-2">
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>

                  <button
                    className="btn btn-primary"
                    ref={submitButtonRef}
                    type="submit"
                    disabled
                  >
                    Submit
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
