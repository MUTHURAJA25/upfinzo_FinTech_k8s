import React, { useEffect, useRef, useState } from "react";
import Wrapper from "@/pages/layouts/Wrapper";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import generateInputs from "@/components/generateInputs";
import {
  getMerchantPayoutConfig,
  saveMerchantPayoutConfig,
} from "@/services/merchantService";
import { FormHandleChange, FormValidation } from "@/components/formValidator";

const PayoutConfiguration = () => {
  const isFormDirty = useRef(false);

  const formTemplate = {
    payoutMethod: "",
    payoutFrequency: "",
    bankAccountNo: "",
    ifscCode: "",
    holderName: "",
    bankName: "",
    upiId: "",
  };

  const [formData, setFormData] = useState({
    formFields: { ...formTemplate },
    formValidation: {},
  });

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    loadPayoutConfig();
  }, []);

  const loadPayoutConfig = async () => {
    try {
      const merchantId = localStorage.getItem("merchantId");
      const res = await getMerchantPayoutConfig(merchantId);
      const data = res.data.data;

      setFormData((prev) => ({
        ...prev,
        formFields: {
          ...prev.formFields,

          payoutMethod:
            prev.formFields.payoutMethod ||
            (data.payout_method === "NEFT" ? "BANK" : "UPI"),

          payoutFrequency:
            prev.formFields.payoutFrequency ||
            data.payout_frequency.charAt(0).toUpperCase() +
              data.payout_frequency.slice(1),

          bankAccountNo:
            prev.formFields.bankAccountNo ||
            data?.default_bank_account?.account_number ||
            "",

          ifscCode:
            prev.formFields.ifscCode ||
            data?.default_bank_account?.ifsc ||
            "",

          holderName:
            prev.formFields.holderName ||
            data?.default_bank_account?.holder_name ||
            "",

          bankName:
            prev.formFields.bankName ||
            data?.default_bank_account?.bank_name ||
            "",

          upiId: prev.formFields.upiId || data?.upi_id || "",
        },
      }));
    } catch {
      toast.error("Failed to load payout configuration");
    }
  };

  const handleInputChange = (e) => {
    setFormData(FormHandleChange(e, formData));
    isFormDirty.current = true;
  };

  const payoutFieldGroups = {
    BANK: ["bankAccountNo", "ifscCode", "holderName", "bankName"],
    UPI: ["upiId"],
  };

  const compiledFields = Object.keys(formTemplate).reduce((result, key) => {
    const baseConfig = {
      key,
      name: key,
      label:
        key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
      type: key === "bankAccountNo" ? "number" : "text",
      required: true,
      value: formData.formFields[key],
      onChange: handleInputChange,
      error: errors.formFields ? errors.formFields[key] : "",
    };

    const ruleSet = {
      bankAccountNo: {
        regex: "only_number",
        minLength: 9,
        maxLength: 18,
        notEmptyMessage: "Please enter account number",
        regexMessage: "Account number must be 9–18 digits",
        minLengthMessage: "Minimum 9 digits",
        maxLengthMessage: "Maximum 18 digits",
      },
      ifscCode: {
        regex: "ifsc",
        notEmptyMessage: "Please enter IFSC code",
        regexMessage: "Invalid IFSC code",
      },
      bankName: {
        minLength: 3,
        maxLength: 50,
        regex: "alpha_with_space",
        regexMessage: "Invalid string",
        notEmptyMessage: "Please enter bank name",
        minLengthMessage: "Minimum 3 characters",
        maxLengthMessage: "Maximum 50 characters",
      },
      holderName: {
        minLength: 3,
        maxLength: 50,
        regex: "alpha_with_space",
        regexMessage: "Invalid string",
        notEmptyMessage: "Please enter account holder name",
        minLengthMessage: "Minimum 3 characters",
        maxLengthMessage: "Maximum 50 characters",
      },
      upiId: {
        regex: "upi",
        notEmptyMessage: "Please enter UPI ID",
        regexMessage: "Invalid UPI ID",
      },
    }[key];

    result[key] = ruleSet ? { ...baseConfig, ...ruleSet } : baseConfig;
    return result;
  }, {});

  useEffect(() => {
    if (!isFormDirty.current) return;

    const method = formData.formFields.payoutMethod;

    const activeFields = [
      "payoutMethod",
      "payoutFrequency",
      ...payoutFieldGroups[method],
    ];

    const filteredTemplate = Object.fromEntries(
      Object.entries(formTemplate).filter(([key]) =>
        activeFields.includes(key)
      )
    );

    const validationResult = FormValidation(formData, filteredTemplate);

    if (validationResult === true) {
      setErrors({});
      setIsFormValid(true);
    } else {
      setErrors(validationResult);
      setIsFormValid(false);
    }
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirm = await new Promise((resolve) => {
      const toastId = toast(
        <div>
          <strong>Save Changes?</strong>
          <div className="mt-2">Are you sure you want to update payout config?</div>

          <div className="d-flex justify-content-end gap-2 mt-3">
            <button
              className="btn btn-light btn-sm"
              onClick={() => {
                toast.dismiss(toastId);
                resolve(false);
              }}
            >
              Cancel
            </button>

            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                toast.dismiss(toastId);
                resolve(true);
              }}
            >
              Confirm
            </button>
          </div>
        </div>,
        { autoClose: false, closeOnClick: false }
      );
    });

    if (!confirm) return;

    const loading = toast.loading("Saving...");

    try {
      const merchantId = localStorage.getItem("merchantId");
      const f = formData.formFields;

      const payload = {
        user_id: merchantId,
        payout_frequency: f.payoutFrequency.toLowerCase(),
        payout_method: f.payoutMethod === "BANK" ? "NEFT" : "UPI",
        upi_id: f.payoutMethod === "UPI" ? f.upiId : null,
        default_bank_account:
          f.payoutMethod === "BANK"
            ? {
                account_number: f.bankAccountNo,
                ifsc: f.ifscCode,
                holder_name: f.holderName,
                bank_name: f.bankName,
              }
            : null,
        is_default: true,
      };

      await saveMerchantPayoutConfig(payload);

      toast.update(loading, {
        render: "Saved Successfully!",
        type: "success",
        isLoading: false,
        autoClose: 1500,
      });
    } catch {
      toast.update(loading, {
        render: "Save Failed!",
        type: "error",
        isLoading: false,
        autoClose: 1500,
      });
    }
  };

  return (
    <Wrapper page="Payout Configuration">
      <div className="card shadow-lg border-0 mx-auto" style={{ borderRadius: 16 }}>
        <form onSubmit={handleSubmit} className="card-body p-4">
          <div className="row">
            {/* PAYOUT METHOD */}
            <div className="col-md-4 mb-4">
              <generateInputs
                mapField={{
                  type: "dropdown",
                  name: "payoutMethod",
                  label: "Payout Method",
                  required: true,
                  value: formData.formFields.payoutMethod,
                  onChange: handleInputChange,
                  dropdownOptions: { BANK: "BANK", UPI: "UPI" },
                  error: errors.payoutMethod,
                }}
              />
            </div>

            {/* BANK / UPI FIELDS */}
            {payoutFieldGroups[formData.formFields.payoutMethod]?.map((field) => (
              <div className="col-md-4 mb-4" key={field}>
                <generateInputs mapField={compiledFields[field]} />
              </div>
            ))}

            {/* PAYOUT FREQUENCY */}
            <div className="col-md-4 mb-4">
              <generateInputs
                mapField={{
                  type: "dropdown",
                  name: "payoutFrequency",
                  label: "Payout Frequency",
                  required: true,
                  value: formData.formFields.payoutFrequency,
                  onChange: handleInputChange,
                  dropdownOptions: { Daily: "Daily", Weekly: "Weekly" },
                  error: errors.payoutFrequency,
                }}
              />
            </div>
          </div>

          {/* BUTTON ALWAYS ENABLED */}
          <button type="submit" className="btn btn-primary px-4 py-2">
            <i className="ri-save-line me-1"></i> Save Changes
          </button>
        </form>
      </div>
    </Wrapper>
  );
};

export default PayoutConfiguration;
