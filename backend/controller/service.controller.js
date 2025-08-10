const Service = require("../models/service");

// Create Service
exports.createService = async (req, res) => {
  try {
    const { name, active } = req.body;

    const service = new Service({ name, active });
    await service.save();

    res.status(201).json({ message: "Service created successfully", service });
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Services
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Service
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const service = await Service.findByIdAndUpdate(id, updatedData, { new: true });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({ message: "Service updated successfully", service });
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// Get Service by ID
exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json(service);
  } catch (error) {
    console.error("Error fetching service by ID:", error);

    // Handle invalid ObjectId errors
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid service ID format" });
    }

    res.status(500).json({ message: "Server error" });
  }
};


// Delete Service
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({ message: "Server error" });
  }
};