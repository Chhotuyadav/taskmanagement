const validator = require('validator');

/**
 * Common validation function for input fields
 * @param {Object} data - The object containing input data to be validated.
 * @param {Object} rules - The rules to validate against.
 * @param {Function} uniqueCheck - Optional callback function to check for uniqueness in the database (async).
 * @returns {Array} - Returns an array of error messages if any validation fails, otherwise an empty array.
 */
// async function validateInput(data, rules, uniqueCheck = null) {
//   const errors = [];

//   for (const field in rules) {
//     const value = data[field];
//     const rule = rules[field];
//     const displayName = rule.display || field;
//     // Check if the field is required
//     if (rule.required && (value === undefined || value === null || value === '')) {
//       errors.push(`${displayName} is required.`);
//       continue;
//     }

//     // Trim the field if requested
//     if (rule.trim && typeof value === 'string') {
//       data[field] = value.trim();
//     }

//     // Check if the field has a minimum length requirement
//     if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
//       errors.push(`${field} should be at least ${rule.minLength} characters long.`);
//     }

//     // Check if the field is a valid email
//     if (rule.isEmail && value && !validator.isEmail(value)) {
//       errors.push(`${field} must be a valid email address.`);
//     }

//     // Check if the field is a valid mobile phone number
//     if (rule.isMobilePhone && value && !validator.isMobilePhone(value, 'any')) {
//       errors.push(`${field} must be a valid mobile phone number.`);
//     }

//     // Check for unique values (e.g., email, username)
//     if (rule.unique && uniqueCheck) {
//       const isUnique = await uniqueCheck(field, value);
//       if (!isUnique) {
//         errors.push(`${field} must be unique.`);
//       }
//     }
//   }
 
//   return errors;
// }


async function validateInput(data, rules, uniqueCheck = null) {
  const errors = [];

  for (const field in rules) {
    const value = data[field];
    const rule = rules[field];
    const displayName = rule.display || field; // Use display name if available

    // Check if the field is required
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push(`${displayName} is required.`);
      continue;
    }

    // Trim the field if requested
    if (rule.trim && typeof value === 'string') {
      data[field] = value.trim();
    }

    // Check if the field has a minimum length requirement
    if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
      errors.push(`${displayName} should be at least ${rule.minLength} characters long.`);
      continue;
    }

    // Check if the field is a valid email
    if (rule.isEmail && value && !validator.isEmail(value)) {
      errors.push(`${displayName} must be a valid email address.`);
      continue;
    }

    // Check if the field is a valid mobile phone number
    if (rule.isMobilePhone && value && !validator.isMobilePhone(value, 'any')) {
      errors.push(`${displayName} must be a valid mobile phone number.`);
      continue;
    }

    // Check for unique values (e.g., email, username)
    if (rule.unique && uniqueCheck) {
      const isUnique = await uniqueCheck(field, value);
      if (!isUnique) {
        errors.push(`${displayName} must be unique.`);
      }
    }
  }

  return errors;
}


module.exports = { validateInput };
