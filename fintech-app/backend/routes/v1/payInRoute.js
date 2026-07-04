/**
 * @swagger
 * components:
 *   schemas:
 *     PayIn:
 *       type: object
 *       required:
 *         - merchant_id
 *         - created_by
 *         - amount
 *       properties:
 *         merchant_id:
 *           type: string
 *           format: objectId
 *           description: References Merchant document
 *         created_by:
 *           type: string
 *           format: objectId
 *           description: References User document (staff/admin)
 *         amount:
 *           type: number
 *           description: Payment amount
 *         customer_name:
 *           type: string
 *           description: Customer name
 *         customer_email:
 *           type: string
 *           description: Customer email address
 *         customer_phone:
 *           type: string
 *           description: Customer phone number
 *         description:
 *           type: string
 *           description: Payment description
 *         expiry_date:
 *           type: string
 *           format: date-time
 *           description: Expiry date for payment link
 */

/**
 * @swagger
 * /payin/generateLink:
 *   post:
 *     summary: Generate a payment link
 *     tags: [PayIn]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PayIn'
 *     responses:
 *       201:
 *         description: Payment link generated successfully
 */

/**
 * @swagger
 * /payin/:
 *   post:
 *     summary: Get payment links by ID or Merchant ID (priority based filtering)
 *     tags: [PayIn]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       - If **id** is provided → returns record by ID  
 *       - Else if **merchant_id** is provided → returns records by merchant  
 *       - Else → returns all payment links  
 *       
 *       Filtering priority: **id > merchant_id > all records**
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: Optional PaymentLink ID
 *               merchant_id:
 *                 type: string
 *                 description: Optional Merchant ID
 *             example:
 *               id: ""
 *               merchant_id: "67ab12cd34ef56ab7890cd12"
 *     responses:
 *       200:
 *         description: Records fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PayIn'
 *       404:
 *         description: No records found
 *       500:
 *         description: Server error
 */
const express = require("express");
const router = express.Router();

const authenticateToken = require(process.env.VERSION_PATH +'middleware/authMiddleware');

const { payInValidator } = require(
  process.env.VERSION_PATH + "validators/payInValidator.js"
);

const { createPaymentLink, getPaymentLink } = require(
  process.env.VERSION_PATH + 'controllers/' + process.env.CURRENT_VERSION + '/payInController'
);

router.post("/generateLink", payInValidator, authenticateToken, createPaymentLink);
router.post("/", authenticateToken, getPaymentLink);

module.exports = router;