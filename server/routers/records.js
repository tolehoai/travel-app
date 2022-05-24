const express = require("express");
const router = express.Router();
const controller = require("../controller/records_ctrl");

router.post("/addCity", controller.addCity);
router.post("/getHotelOfCity", controller.getHotelOfCity);
router.post("/getHotelInformation", controller.getHotelInformation);
router.post("/getHomeStay", controller.getHotelOfCity)

module.exports = router;
