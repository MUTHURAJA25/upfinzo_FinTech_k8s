const mongoose = require("mongoose");

const merchantOnboardingSchema = new mongoose.Schema(
  {
    business_name: {
      type: String,
      required: true,
      trim: true,
    },
    business_type: {
      type: String,
      required: true,
      enum: [
        "Sole Proprietorship",
        "Partnership",
        "Private Limited Company",
        "Public Limited Company",
        "LLP",
        "Others",
      ],
    },
    tax_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    business_address: {
      type: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        zipcode: { type: String, required: true },
      },
      required: true
    },
    bank_details: {
      bank_name : {
        type: String,
        required: true,
      },
      account_number: {
        type: String,
        required: true,
      },
      ifsc: {
        type: String,
        required: true,
        match: /^[A-Z]{4}0[A-Z0-9]{6}$/
      },
      account_holder_name: {
        type: String,
        required: true,
      },
    },
    contact_person: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/
      },
      email: {
        type: String,
        required: true,
        lowercase: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      }
    },
    documents: {
      business_proof: {
        type: String,
        required: true,
      },
      pan: {
        type: String,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MerchantOnboarding", merchantOnboardingSchema);