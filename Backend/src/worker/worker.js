import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import mongoose from "mongoose";
import axios from "axios";

import monitor from "../models/monitor.model.js";
import checkResult from "../models/checkResult.model.js";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Worker connected to MongoDB");
  } catch (error) {
    console.error("Worker DB connection failed", error);
    process.exit(1);    
  }
};

const performHttpCheck = async (url) => {
  const start = Date.now();

  try {
    const response = await axios.get(url, {
      timeout: 10000
    });

    const responseTime = Date.now() - start;

    return {
      status: "UP",
      statusCode: response.status,
      responseTime
    };
  } catch (error) {
    const responseTime = Date.now() - start;

    if (error.response) {
      return {
        status: "DOWN",
        statusCode: error.response.status,
        responseTime,
        error: "HTTP_ERROR"
      };
    }

    if (error.code === "ECONNABORTED") {
      return {
        status: "DOWN",
        responseTime,
        error: "TIMEOUT"
      };
    }

    return {
      status: "DOWN",
      responseTime,
      error: "NETWORK_ERROR"
    };
  }
};


const processMonitors = async () => {
  const now = new Date();

  const monitors = await monitor.find({
    isActive: true,
    nextCheckAt: { $lte: now }
  }).limit(10);

  for (const monitor of monitors) {
    console.log(`Checking ${monitor.url}`); 

    const result = await performHttpCheck(monitor.url);

    await checkResult.create({
      monitorId: monitor._id,
      status: result.status,
      responseTime: result.responseTime,
      statusCode: result.statusCode,
      error: result.error
    });

    monitor.status = result.status;
    monitor.lastCheckedAt = now;
    monitor.checkedAt = now;
    monitor.nextCheckAt = new Date(  
      Date.now() + monitor.interval * 1000
    );

    await monitor.save();
  }
};

const startWorker = async () => {
  await connectDB();

  console.log("Worker started");

  setInterval(async () => {
    try {
      await processMonitors();
    } catch (error) {
      console.error("Worker error", error);
    }
  }, 5000);
};

startWorker();