const express = require("express");
const router = express.Router();
const service = require("../controller/service.controller");

router.post("/add", service.createService);       
router.get("/list", service.getServices);         
router.put("/update/:id", service.updateService); 
router.delete("/remove/:id", service.deleteService); 
router.get("/details/:id", service.getServiceById);


module.exports = router;
