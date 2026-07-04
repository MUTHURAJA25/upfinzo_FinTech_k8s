/**
 * API Validation
 *
 * @param formData
 * @param err
 * @returns {{}}
 * @constructor
 */
const ApiValidator = (formData, err) => {
    const errObj = err.response?.data?.errors;
    const formErrors = {};
    if (!errObj) return formErrors;
    Object.keys(formData)?.forEach((field) => {
        
        if (errObj[`${field}`]) {
            Object.assign(formErrors, {
                    [field]: Array.isArray(errObj[`${field}`]) ? errObj[`${field}`][0] : errObj[`${field}`]
                }
            );
        }
    });

    return formErrors;
}

export default ApiValidator;