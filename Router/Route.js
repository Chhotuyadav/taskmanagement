const verifyJWT = require("../middileware/auth.middileware.js");
const express = require("express");

const userController = require("../controller/users.controller.js");
const notification = require("../controller/firebase.controller.js");
const forgotPassword = require("../controller/forgot_password.controller.js");
const borrowLendController = require("../controller/borrow_lend.controller.js")
const contactController = require("../controller/contact.controller.js")
// const driverBooking = require("../controller/driver_booking.controller.js");
// const vehicle = require("../controller/vehicle.controller.js");
// const booking = require("../controller/booking.controller.js");
// const admin = require("../controller/admin.controller.js");
// const subscription = require("../controller/subscription.controller.js");
// const googlePlace = require("../controller/google_place.controller.js");
// const bussinessProfile = require("../controller/bussiness_profile.controller.js");
const { uploadImage } = require("../utils/upload.js");

const createRouter = (io) => {
  const userRouter = express.Router();

  //User routes
  userRouter.route("/auth/register").post(userController.register_user);
  userRouter.route("/auth/login").post(userController.loginUser);
  userRouter
    .route("/auth/update_password")
    .post(verifyJWT, userController.update_password);
  userRouter
    .route("/user/get_user_profile")
    .post(verifyJWT, userController.get_user_profile);
  userRouter
    .route("/user/update_profile")
    .post(verifyJWT, uploadImage, userController.update_profile);
  userRouter
    .route("/user/get_user_by_id")
    .post(verifyJWT, userController.get_user_by_id);
  userRouter
    .route("/user/verify_email_using_link")
    .get(userController.verify_email_using_link);
  userRouter
    .route("/user/update_profile_image")
    .post(verifyJWT, userController.update_profile_image);


  //all borrow route 

  userRouter.route("/borrow/add_record").post(verifyJWT, borrowLendController.add_record)
  userRouter.route("/borrow/update_record").post(verifyJWT, borrowLendController.update_record)
  userRouter.route("/borrow/get_record").post(verifyJWT, borrowLendController.get_record)
  userRouter.route("/borrow/get_record_by_id").post(verifyJWT, borrowLendController.get_record_by_id)
  userRouter.route("/borrow/get_record_by_contact_id").post(verifyJWT, borrowLendController.get_record_by_contact_id)
  userRouter.route("/borrow/get_record_by_borrow_type").post(verifyJWT, borrowLendController.get_record_by_borrow_type)
  userRouter.route("/borrow/get_total_borrow_lend_record").get(verifyJWT, borrowLendController.get_total_borrow_lend_record)


  //all contact route
  userRouter.route("/borrow/add_contact").post(verifyJWT, uploadImage, contactController.add_contact)
  userRouter.route("/borrow/update_contact").post(verifyJWT, uploadImage, contactController.update_contact)
  userRouter.route("/borrow/get_contact_by_creater_id").post(verifyJWT, contactController.get_contact_by_creater_id)
  userRouter.route("/borrow/get_contact_by_id").post(verifyJWT, contactController.get_contact_by_id)
  userRouter.route("/borrow/get_total_borrow_lend_by_contact_id").get(verifyJWT, contactController.get_total_borrow_lend_by_contact_id)

  userRouter.route("/borrow/search_contact").post(verifyJWT, contactController.search_contact)





  //Vehicle routes
  // userRouter.route("/vehicle/add_vehicle").post(verifyJWT, vehicle.add_vehicle);
  // userRouter.route("/vehicle/get_vehicle").post(verifyJWT, vehicle.get_vehicle);
  // userRouter
  //   .route("/vehicle/list_vehicle_brand")
  //   .post(verifyJWT, vehicle.list_vehicle_brand);
  // userRouter
  //   .route("/vehicle/list_vehicle_model")
  //   .post(verifyJWT, vehicle.list_vehicle_model);
  // userRouter
  //   .route("/vehicle/list_vehicle_year")
  //   .post(verifyJWT, vehicle.list_vehicle_year);
  // userRouter
  //   .route("/vehicle/list_vehicle_type")
  //   .post(verifyJWT, vehicle.list_vehicle_type);
  // userRouter
  //   .route("/vehicle/update_vehicle")
  //   .post(verifyJWT, vehicle.update_vehicle);

  //Vendor booking routes
  // userRouter.route("/booking/add_booking").post(verifyJWT, (req, res) => {
  //   booking.add_booking(req, res, io);
  // });
  // userRouter
  //   .route("/booking/get_my_bookings")
  //   .post(verifyJWT, booking.get_my_bookings);
  // userRouter
  //   .route("/booking/get_my_driver_details")
  //   .post(verifyJWT, booking.get_my_driver_details);
  // userRouter
  //   .route("/booking/change_booking_status")
  //   .post(verifyJWT, (req, res) => {
  //     booking.change_booking_status(req, res, io);
  //   });
  // userRouter
  //   .route("/booking/get_default_address")
  //   .post(verifyJWT, booking.get_default_address);
  // userRouter
  //   .route("/booking/add_default_address")
  //   .post(verifyJWT, booking.add_default_address);

  // // vendor subscription
  // userRouter
  //   .route("/vendor/get_subscription_plans")
  //   .post(verifyJWT, subscription.get_subscription_plans);

  // userRouter
  //   .route("/vendor/get_subscription_plans_byid")
  //   .post(verifyJWT, subscription.get_subscription_plans_byid);

  // userRouter
  //   .route("/vendor/save_payment_details")
  //   .post(verifyJWT, subscription.save_payment_details);

  // userRouter.route("/vendor/subscribe").post(verifyJWT, subscription.subscribe);

  // //Push Notification route
  // userRouter
  //   .route("/notification/push_notification_token_add")
  //   .post(verifyJWT, notification.push_notification_token_add);
  // userRouter
  //   .route("/notification/push_notification_send")
  //   .post(verifyJWT, notification.push_notification_send);

  // //driver booking routes
  // userRouter
  //   .route("/driver_booking/booking_notification_list")
  //   .post(verifyJWT, driverBooking.booking_notification_list);
  // userRouter
  //   .route("/driver_booking/accept_booking")
  //   .post(verifyJWT, (req, res) => {
  //     driverBooking.accept_booking(req, res, io);
  //   });

  // userRouter
  //   .route("/driver_booking/driver_all_bookings")
  //   .post(verifyJWT, driverBooking.driver_all_bookings);
  // userRouter
  //   .route("/driver_booking/change_booking_status_by_driver")
  //   .post(verifyJWT, (req, res) => {
  //     driverBooking.change_booking_status_by_driver(req, res, io);
  //   });
  // userRouter
  //   .route("/driver_booking/get_booked_user_details")
  //   .post(verifyJWT, driverBooking.get_booked_user_details);



  // userRouter
  //   .route("/driver_booking/booking_notification_count")
  //   .post(verifyJWT, driverBooking.booking_notification_count);

  // userRouter
  //   .route("/driver_booking/booking_notification_list")
  //   .post(verifyJWT, driverBooking.booking_notification_list);

  // userRouter
  //   .route("/driver_booking/booking_status_count")
  //   .post(verifyJWT, driverBooking.booking_status_count);

  // //admin apis
  // userRouter
  //   .route("/admin/get_user_by_group")
  //   .post(verifyJWT, admin.get_user_by_group);
  // userRouter.route("/admin/suspend_user").post(verifyJWT, admin.suspend_user);
  // userRouter.route("/admin/get_counts").post(verifyJWT, admin.get_counts);
  // userRouter
  //   .route("/admin/get_vendor_booking_by_id")
  //   .post(verifyJWT, admin.get_vendor_booking_by_id);
  // userRouter
  //   .route("/admin/get_driver_booking_by_id")
  //   .post(verifyJWT, admin.get_driver_booking_by_id);
  // userRouter
  //   .route("/admin/get_driver_vehicle_by_id")
  //   .post(verifyJWT, admin.get_driver_vehicle_by_id);
  // userRouter
  //   .route("/admin/add_user_by_admin")
  //   .post(verifyJWT, admin.add_user_by_admin);
  // userRouter
  //   .route("/admin/update_user_by_admin")
  //   .post(verifyJWT, admin.update_user_by_admin);
  // userRouter
  //   .route("/admin/get_all_booking_by_admin")
  //   .post(verifyJWT, admin.get_all_booking_by_admin);
  // userRouter
  //   .route("/admin/add_booking_by_admin")
  //   .post(verifyJWT, (req, res) => {
  //     admin.add_booking_by_admin(req, res, io);
  //   });

  // userRouter
  //   .route("/admin/get_all_notificatoin")
  //   .post(verifyJWT, admin.get_all_notificatoin);

  // userRouter
  //   .route("/admin/update_notification_status")
  //   .post(verifyJWT, admin.update_notification_status);

  //forgot password
  userRouter
    .route("/auth/forgot_password")
    .post(forgotPassword.check_email_exist);

  userRouter
    .route("/auth/verify_forgot_otp")
    .post(forgotPassword.verify_forgot_otp);
  userRouter
    .route("/auth/change_password_forgot")
    .post(forgotPassword.change_password_forgot);

  //place suggest google apis
  // userRouter
  //   .route("/place/place_suggest")
  //   .post(verifyJWT, googlePlace.place_suggest);

  // //bussiness profile
  // userRouter
  //   .route("/bussiness/add_bussiness_profile")
  //   .post(verifyJWT, uploadImage, bussinessProfile.add_bussiness_profile);

  // userRouter
  //   .route("/bussiness/get_bussiness_profile")
  //   .post(verifyJWT, bussinessProfile.get_bussiness_profile);

  // userRouter
  //   .route("/bussiness/get_bussiness_profile_by_id")
  //   .post(verifyJWT, bussinessProfile.get_bussiness_profile_by_id);

  return userRouter;
};

module.exports = createRouter;
