const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const onboardingRoutes = require("./routes/onboarding.routes");
const nationalities = require("./routes/nationality.routes");
const admin=require('./routes/admin.routes')
const service=require('./routes/service.route');
const limitRoutes = require('./routes/limit.routes');


// Load .env or .env.production based on NODE_ENV
const envFile =
process.env.NODE_ENV === "production" ? ".env.production" : ".env";
dotenv.config({ path: path.resolve(__dirname, envFile) });



const app = express();

app.use(express.json());
app.use(cors());


app.use("/api", onboardingRoutes);
app.use("/admin", admin);
app.use("/service", service);
app.use("/limit", limitRoutes); // Use the limit routes
// Add other routes as needed

app.use("/nationalities", nationalities);



mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


  
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
