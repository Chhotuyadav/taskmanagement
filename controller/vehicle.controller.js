const {validateInput} = require("../utils/vailidator.js");
const jwt = require("jsonwebtoken");
const crypto = require("crypto-js");
const vehicleModel = require("../model/vehicle.model.js");

// add vehicle
const add_vehicle = async (req, res) => {
 
  try {
   
    const rules = {
        title: { required: true, trim: true, display:"Car title"},
        brand: { required: true, trim: true,  display:"Brand"},
        model: { required: true, trim: true,  display:"Model"},
        type: { required: true, trim: true,  display:"Type"},
        year: { required: true, trim: true,  display:"Year"},
        seating_capacity: { required: true, trim: true,  display:"Seating capacity"},
    };

    const error = await validateInput(req.body, rules, '');
    if (error.length > 0) {
      return res.status(400).json({ message: 'Validation failed', error ,"status":"400"});
    }

    const result = await vehicleModel.addVehicle(req);
    if (!result) {
      return res
        .status(400)
        .send({
          message: "Add vehicle failed",
          error:["Add vehicle failed"],
          data: [],
          status: "400",
        })
        .end();
    }

    res
      .status(200)
      .send({
        message: "Vehicle added successfully",
        data: [],
        status: "200",
      })
      .end();
  } catch (error) {

    res
      .status(500)
      .send({
        message:"Error in adding vehicle",
        error: error || "Internal server error",
        data: [],
        status: "500",
      })
      .end();
  }
};

// get vehicle
const get_vehicle = async (req, res) => {
 
  try {
  
    const result = await vehicleModel.getVehicle(req);
    console.log(result);
    if (!result) {
      return res
        .status(400)
        .send({
          message: "No vehicle",
          error:["No vehicle"],
          data: [],
          status: "400",
        })
        .end();
    }

    res
      .status(200)
      .send({
        message: "vehicle get successfully",
        data: result,
        status: "200",
      })
      .end();
  } catch (error) {

    res
      .status(500)
      .send({
        message:"Error in getting vehicle",
        error: error || "Internal server error",
        data: [],
        status: "500",
      })
      .end();
  }
};

//Vehicle brand list
const list_vehicle_brand = async (req, res) => {
 
  try {
  
    const result = await vehicleModel.brandList(req);
    console.log(result);
    if (!result) {
      return res
        .status(400)
        .send({
          message: "No vehicle brand found",
          error:["No vehicle brand found"],
          data: [],
          status: "400",
        })
        .end();
    }

    res
      .status(200)
      .send({
        message: "vehicle brand list get successfully",
        data: result,
        status: "200",
      })
      .end();
  } catch (error) {

    res
      .status(500)
      .send({
        message:"Error in getting vehicle brand",
        error: error || "Internal server error",
        data: [],
        status: "500",
      })
      .end();
  }
};

//vehicle model list
const list_vehicle_model = async (req, res) => {
 
  try {

    const rules = {
      vehicle_id: { required: true, trim: true},
  };

  const error = await validateInput(req.body, rules, '');
  if (error.length > 0) {
    return res.status(400).json({ message: 'Validation failed', error ,"status":"400"});
  }
  
    const result = await vehicleModel.modelList(req);
    console.log(result);
    if (!result) {
      return res
        .status(400)
        .send({
          message: "No vehicle model found",
          error:["No vehicle model found"],
          data: [],
          status: "400",
        })
        .end();
    }

    res
      .status(200)
      .send({
        message: "Vehicle model list get successfully",
        data: result,
        status: "200",
      })
      .end();
  } catch (error) {

    res
      .status(500)
      .send({
        message:"Error in getting vehicle model",
        error: error || "Internal server error",
        data: [],
        status: "500",
      })
      .end();
  }
};

//vehicle year list
const list_vehicle_year = async (req, res) => {
  
    const result = [];
    let sum = 2000;
    for(let i = 0;i<= 20 ;i++){
      result.push(sum+i);
    }

    
    if (!result) {
      return res
        .status(400)
        .send({
          message: "No vehicle model found",
          error:["No vehicle model found"],
          data: [],
          status: "400",
        })
        .end();
    }

    res
      .status(200)
      .send({
        message: "vehicle model list get successfully",
        data: result,
        status: "200",
      })
      .end();

};

const list_vehicle_type = async (req, res) => {
  
  const result = [
    "Sedan",
    "Coupe",
    "Hatchback",
    "Convertible",
    "SUV (Sport Utility Vehicle)",
    "Crossover",
    "Minivan",
    "Pickup Truck",
    "Station Wagon",
    "Sports Car",
    "Luxury Car",
    "Microcar",
    "Electric Vehicle (EV)",
    "Hybrid Vehicle",
    "Diesel Vehicle",
    "Off-Road Vehicle",
    "Supercar",
    "Roadster",
    "Van",
    "Compact Car"
];


  
  if (!result) {
    return res
      .status(400)
      .send({
        message: "No vehicle model found",
        error:["No vehicle model found"],
        data: [],
        status: "400",
      })
      .end();
  }

  res
    .status(200)
    .send({
      message: "vehicle model list get successfully",
      data: result,
      status: "200",
    })
    .end(); 

};

//updateVehicle
const update_vehicle = async (req, res) => {
 
  try {
   
    const rules = {
        title: { required: true, trim: true},
        brand: { required: true, trim: true},
        model: { required: true, trim: true},
        type: { required: true, trim: true},
        year: { required: true, trim: true},
        seating_capacity: { required: true, trim: true},
        id:{ required: true, trim: true},
    };

    const error = await validateInput(req.body, rules, '');
    if (error.length > 0) {
      return res.status(400).json({ message: 'Validation failed', error ,"status":"400"});
    }

    const result = await vehicleModel.updateVehicle(req);
    if (!result) {
      return res
        .status(400)
        .send({
          message: "Update vehicle failed",
          error:["Update vehicle failed"],
          data: [],
          status: "400",
        })
        .end();
    }

    res
      .status(200)
      .send({
        message: "Vehicle Updated successfully",
        data: [],
        status: "200",
      })
      .end();
  } catch (error) {

    res
      .status(500)
      .send({
        message:"Error in Updating vehicle",
        error: error || "Internal server error",
        data: [],
        status: "500",
      })
      .end();
  }
};

module.exports = {
    add_vehicle,
    get_vehicle,
    list_vehicle_brand,
    list_vehicle_model,
    list_vehicle_year,
    list_vehicle_type,
    update_vehicle
    
};
