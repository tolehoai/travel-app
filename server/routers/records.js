const express = require("express");
const router = express.Router();
const controller = require("../controller/records_ctrl");

router.get("/destinations", controller.getDestinations);
router.get("/city/destinations", controller.findCityToGetDestinations);
router.get("/hotels/byCity/:cityName", controller.getHotelByCity);
router.get("/hotels/byIdOnCity/:id", controller.getHotelsByIdOnCity);
router.post("/select/geo", controller.getGeoBySelect);
router.post("/addCity", controller.addCity);
router.post("/getHotelOfCity", controller.getHotelOfCity);
router.post("/getHotelInfomation", controller.getHotelInfomation);

module.exports = router;
