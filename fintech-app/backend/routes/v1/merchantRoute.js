const express = require('express');
const router = express.Router();
const authenticateToken = require(process.env.VERSION_PATH +'middleware/authMiddleware');

const {getAllMerchantOnboarding, saveMerchantOnboarding , updateMerchantOnboarding , deleteMerchantOnboarding , getMerchantPayoutDetails , saveMerchantPayoutDetails } = require(process.env.VERSION_PATH+'controllers/v1/merchantController');

// Routes
router.get('/merchant-onboarding', authenticateToken ,getAllMerchantOnboarding);
router.get('/merchant-onboarding/:id', authenticateToken, getAllMerchantOnboarding);
router.post('/merchant-onboarding',authenticateToken, saveMerchantOnboarding );
router.put('/merchant-onboarding/:id', authenticateToken , updateMerchantOnboarding );
router.delete('/merchant-onboarding/:id', authenticateToken , deleteMerchantOnboarding );

router.get('/merchant-payout/:id',authenticateToken, getMerchantPayoutDetails);
router.post('/merchant-payout',authenticateToken, saveMerchantPayoutDetails);

module.exports = router;