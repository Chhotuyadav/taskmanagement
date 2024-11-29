const { queryResult } = require("../utils/queryResult.js");

// Get plans
const subscriptionPlansList = async (data) => {
  try {
    const sql = `SELECT  * FROM subscription_plans`;
    const result = await queryResult(sql);

    if (!result) {
      throw new Error("error in booking");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

//getSubscriptionPlansById

const getSubscriptionPlansById = async (data) => {
  try {
    const sql = `SELECT  * FROM subscription_plans WHERE id =?`;
    const values = [data];
    const result = await queryResult(sql, values);

    if (!result) {
      throw new Error("error in booking");
    }

    return result[0];
  } catch (error) {
    throw error;
  }
};

//savePaymentDetails
const savePaymentDetails = async (data) => {
  try {
    const sql = `INSERT INTO payment_transactions (vendor_id, subscription_plan_id, amount_paid, payment_status, payment_method,transaction_id,payment_reference,payment_notes) VALUES (?,?,?,?,?,?,?,?)`;
    const values = [
      data.id,
      data.body.subscription_plan_id,
      data.body.amount_paid,
      data.body.payment_status,
      data.body.payment_method,
      data.body.transaction_id,
      data.body.payment_reference,
      data.body.payment_notes,
    ];
    const result = await queryResult(sql, values);
    if (!result) {
      throw new Error("error in payment ");
    }
    return result;
  } catch (err) {
    throw err;
  }
};

//Subscribe

const Subscribe = async (data) => {
  try {
    const sql = `INSERT INTO vendor_subscriptions (vendor_id, subscription_plan_id, subscription_start, subscription_end, status, payment_status, amount,payment_method,renewal_date) VALUES (?,?,?,?,?,?,?,?,?)`;
    const values = [
      data.id,
      data.body.subscription_plan_id,
      data.body.subscription_start,
      data.body.subscription_end,
      data.body.status,
      data.body.payment_status,
      data.body.amount,
      data.body.payment_method,
      data.body.renewal_date,
    ];
    const result = await queryResult(sql, values);
    if (!result) {
      throw new Error("error in booking ");
    }
    return result;
  } catch {
    throw err;
  }
};

module.exports = {
  subscriptionPlansList,
  getSubscriptionPlansById,
  savePaymentDetails,
  Subscribe,
};
