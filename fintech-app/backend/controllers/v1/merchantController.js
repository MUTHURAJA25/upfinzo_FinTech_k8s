const merchantOnboardingModel = require(process.env.VERSION_PATH + '/models/merchantOnboardingModel');
const merchantPayoutSettingsModel = require(process.env.VERSION_PATH + '/models/merchantPayoutSettings');

// get all Merchant Onboarding
const getAllMerchantOnboarding = async (req, res) => {
  try {

    const { id } = req.params;
    let merchantOnboardingDetails;
    if (id) {
      merchantOnboardingDetails = await merchantOnboardingModel.findById(id);
    } else {
      merchantOnboardingDetails = await merchantOnboardingModel.find({});
    }

    if (!merchantOnboardingDetails) {
      return res.status(404).json({ message: 'Merchant Onboarding Records not found' });
    }

    res.status(200).json({
      message: 'Merchant Onboarding fetched successfully',
      data: merchantOnboardingDetails,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// save Merchant Onboarding
const saveMerchantOnboarding = async (req, res) => {
 try {
    const merchant = await merchantOnboardingModel.create(req.body);
    res.status(201).json({
      message: "Merchant created successfully",
      data: merchant,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// update Merchant Onboarding
const updateMerchantOnboarding = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMerchant = await merchantOnboardingModel.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedMerchant) {
      return res.status(404).json({
        message: "Merchant not found",
      });
    }
    res.status(200).json({
      message: "Merchant Onboarding details updated successfully",
      data: updatedMerchant,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Merchant Onboarding
const deleteMerchantOnboarding = async (req, res) => {
  try {
    const merchant = await merchantOnboardingModel.findByIdAndDelete(req.params.id);
    if (!merchant) {
      return res.status(404).json({
        message: "Merchant not found",
      });
    }
    res.status(200).json({
      message: "Merchant onboarding details removed successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMerchantPayoutDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const merchantPayoutDetails = await merchantPayoutSettingsModel.findOne({ user_id: id });

    if (!merchantPayoutDetails) {
      return res.status(404).json({ message: 'Merchant Payout Details not found' });
    }

    res.status(200).json({
      message: 'Merchant Payout Details fetched successfully',
      data: merchantPayoutDetails,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 
const saveMerchantPayoutDetails = async (req, res) => {
  try {
    const { user_id } = req.body;

    let merchantPayoutDetails = await merchantPayoutSettingsModel.findOne({ user_id });

    if (merchantPayoutDetails) {
      Object.assign(merchantPayoutDetails, req.body);
      const merchantPayoutResponse = await merchantPayoutDetails.save();

      return res.status(200).json({
        message: "Merchant payout details updated successfully",
        data: merchantPayoutResponse ,
      });
    }
    
    const merchantPayoutResponse = await merchantPayoutSettingsModel.create(req.body);

    return res.status(201).json({
      message: "Merchant payout details created successfully",
      data: merchantPayoutResponse ,
    });

  } catch (error) {
    console.error("saveMerchantPayoutDetails Error:", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllMerchantOnboarding,
  saveMerchantOnboarding,
  updateMerchantOnboarding,
  deleteMerchantOnboarding,
  getMerchantPayoutDetails,
  saveMerchantPayoutDetails
};