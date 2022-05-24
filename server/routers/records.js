const express = require("express");
const router = express.Router();
const controller = require("../controller/records_ctrl");

router.post("/addCity", controller.addCity);
router.post("/getHotelOfCity", controller.getHotelOfCity);
router.post("/getHotelInfomation", controller.getHotelInfomation);

module.exports = router;
