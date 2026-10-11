import express from "express";

import dashboardController from "../controller/dashboardController.js";

const dashboardRouter = express.Router();
// console.log("hello");
dashboardRouter.get(
"/dashboard",
dashboardController.getDashboardStats
);

export default dashboardRouter;
