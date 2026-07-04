/**
 * @swagger
 * components:
 *   schemas:
 *     Permission:
 *       type: object
 *       properties:
 *         view:
 *           type: boolean
 *         add:
 *           type: boolean
 *         edit:
 *           type: boolean
 *         delete:
 *           type: boolean
 *
 *     Menu:
 *       type: object
 *       required:
 *         - key
 *         - order
 *       properties:
 *         key:
 *           type: string
 *         order:
 *           type: number
 *         permissions:
 *           $ref: '#/components/schemas/Permission'
 *         children:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Menu'
 *
 *     RolePermission:
 *       type: object
 *       required:
 *         - role
 *         - merchant_id
 *         - user_id
 *         - menus
 *       properties:
 *         role:
 *           type: string
 *           enum: [superadmin, admin, merchant, user]
 *         merchant_id:
 *           type: string
 *           format: objectId
 *           description: References Merchant document *
 *         user_id:
 *           type: string
 *           format: objectId
 *           description: References User document
 *         menus:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Menu'
 */

/**
 * @swagger
 * /admin/role-permission:
 *   post:
 *     summary: Create Role with Menu & Permissions
 *     tags: [RolePermission]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RolePermission'
 *     responses:
 *       201:
 *         description: Role created successfully
 */

/**
 * @swagger
 * /admin/role-permission:
 *   get:
 *     summary: Get all role permissions
 *     tags: [RolePermission]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of roles
 */

/**
 * @swagger
 * /admin/role-permission/{id}:
 *   get:
 *     summary: Get role permission by ID
 *     tags: [RolePermission]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Role fetched
 */

/**
 * @swagger
 * /admin/role-permission/{id}:
 *   put:
 *     summary: Update role permission by ID
 *     tags: [RolePermission]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RolePermission'
 *     responses:
 *       200:
 *         description: Updated successfully
 */

/**
 * @swagger
 * /admin/role-permission/{id}:
 *   delete:
 *     summary: Delete role permission by ID
 *     tags: [RolePermission]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted successfully
 */

const express = require("express");
const router = express.Router();

const authenticateToken = require(process.env.VERSION_PATH +'middleware/authMiddleware');

const { validateRolePermission } = require(
  process.env.VERSION_PATH + "validators/rolePermissionValidator.js"
);

const {createRolePermission, updateRolePermission, deleteRolePermission} = require(
  process.env.VERSION_PATH + 'controllers/' + process.env.CURRENT_VERSION + '/rolePermissionController'
);

router.post("/", authenticateToken, validateRolePermission, createRolePermission);
router.put("/:id", authenticateToken, validateRolePermission, updateRolePermission);
router.delete("/:id", authenticateToken, deleteRolePermission);

module.exports = router;