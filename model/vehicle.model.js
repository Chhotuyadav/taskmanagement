const { queryResult } = require("../utils/queryResult.js");
const crypto = require("crypto-js");

//Add vehicle
const addVehicle = async (data) => {
  try {
    const sql =
      "INSERT INTO vehicle (title, brand, model, year, type, seating_capacity, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const values = [
      data.body.title,
      data.body.brand,
      data.body.model,
      data.body.year,
      data.body.type,
      data.body.seating_capacity,
      data.id,
    ];
    const result = await queryResult(sql, values);
    if (!result) {
      throw new Error("error in adding vehicle");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

//Get vehicle
const getVehicle = async (data) => {
  try {
    const id = data.id;
    console.log(id);
    const sql = "SELECT * from vehicle WHERE user_id = ?";
    const values = [id];
    const result = await queryResult(sql, values);
    console.log(result);
    if (!result) {
      throw new Error("error in adding vehicle");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

//Brand list
const brandList = async (data) => {
  try {
    const sql = "SELECT * from vehicle_brand";
    const result = await queryResult(sql, "");
    console.log(result);
    if (!result) {
      throw new Error("error in adding vehicle");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

//Model list
const modelList = async (data) => {
  try {
    const sql =
      "SELECT vehicle_id,model from vehicle_model WHERE vehicle_id = ?";
    const values = [data.body.vehicle_id];
    const result = await queryResult(sql, values);
    console.log(result);
    if (!result) {
      throw new Error("error in adding vehicle");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

//update vehicle
const updateVehicle = async (data) => {
  try {
    const sql =
      "UPDATE vehicle SET title = ?, brand = ?, model = ?, year = ?, type = ?, seating_capacity = ? WHERE id = ?";
    const values = [
      data.body.title,
      data.body.brand,
      data.body.model,
      data.body.year,
      data.body.type,
      data.body.seating_capacity,
      data.body.id,
    ];
    const result = await queryResult(sql, values);
    if (!result) {
      throw new Error("error in adding vehicle");
    }
    return result;
  } catch (error) {
    throw error;
  }
};
module.exports = {
  addVehicle, 
  getVehicle,
  brandList,
  modelList,
  updateVehicle,
};
