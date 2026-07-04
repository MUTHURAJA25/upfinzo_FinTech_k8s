const PaymentLink = require(process.env.VERSION_PATH + 'models/payInModel');
const crypto = require('crypto');
const { sendEmail } = require(process.env.VERSION_PATH + '/utils/mailer');
const ejs = require('ejs');
const path = require('path');
const viewsPath = (fileName) => {
  return path.resolve(__dirname, process.env.VERSION_PATH, "views", "emails", fileName);
};

exports.createPaymentLink = async (req, res) => {
    try {
        const {
            created_by,
            merchant_id,
            amount,
            customer_name,
            customer_email,
            customer_phone,
            description,
            expiry_date
        } = req.body;

        // Generate token (random 32 characters)
        const token = crypto.randomBytes(16).toString('hex');

        // Save in MongoDB
        const paymentLink = new PaymentLink({
            created_by,
            merchant_id,
            amount,
            customer_name,
            customer_email,
            customer_phone,
            description,
            expiry_date: expiry_date ? new Date(expiry_date) : null,
            token,
            status: "created"
        });

        await paymentLink.save();
        const payment_url = `${process.env.FRONTEND_URL}/${token}`;

             const emailContent = await ejs.renderFile(
                viewsPath('payInLink.ejs'),
                { url: payment_url }
              );

              // Send email
               await sendEmail(
                customer_email,
                "Payment Links",
                emailContent
              );

        return res.status(201).json({
            message: "Payment link generated successfully",
            payment_url
        });

    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};

// POST → /get-payment-link 
exports.getPaymentLink = async (req, res) => {
  try {
    const { id, merchant_id } = req.body;
    let filter = {};

    // Priority 1 → search by ID
    if (id && id.trim() !== "") {
      filter._id = id;
    }
    // Priority 2 → filter by merchant_id
    else if (merchant_id && merchant_id.trim() !== "") {
      filter.merchant_id = merchant_id;
    }
    // Else → no filter, fetch all

    const results = await PaymentLink.find(filter).sort({ createdAt: -1 });

    if (!results || results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No records found"
      });
    }

    res.json({
      success: true,
      count: results.length,
      data: results
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
