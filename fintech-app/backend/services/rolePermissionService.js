const user = require(process.env.ROOT_PATH + 'models/userModel');
const RolePermission = require(process.env.ROOT_PATH + 'models/rolePermissionModel');

/**
 * Check if merchant and user exist
 */
async function checkUserExist(merchant_id, user_id) {

    const merchantExists = await user.findById(merchant_id);
    if (!merchantExists) {
        throw new Error("Invalid merchant_id: user not found");
    }

    const userExists = await user.findById(user_id);
    if (!userExists) {
        throw new Error("Invalid user_id: user not found");
    }

    return true;
}

/**
 * Save RolePermission
 */
async function saveRolePermission(data) {
    const doc = new RolePermission(data);
    return await doc.save();
}

/**
 *  ADD ROLE PERMISSION
 */
async function createRolePermission(data) {
    // Step 1: Validate user + merchant
    await checkUserExist(data.merchant_id, data.user_id);
    data.menus = reorderMenus(data.menus);

    // Step 2: Save the record
    return await saveRolePermission(data);
}

// Rearrange menu order
function reorderMenus(menus) {
    return menus
        .sort((a, b) => a.order - b.order)
        .map(menu => ({
            ...menu,
            children: reorderMenus(menu.children || [])
        }));
}

/**
 * 
UPDATE ROLE PERMISSION
*/
async function updateRolePermission(id, data) {
    await checkUserExist(data.merchant_id, data.user_id);

    // reorder menus again on update
    data.menus = reorderMenus(data.menus);

    // find existing document
    const existing = await RolePermission.findById(id);
    if (!existing) throw new Error("RolePermission not found");

    // update fields
    existing.role = data.role;
    existing.merchant_id = data.merchant_id;
    existing.user_id = data.user_id;
    existing.menus = data.menus; // this overwrites → deleted items removed automatically

    return await existing.save();
}

module.exports = {
    createRolePermission,
    updateRolePermission
};