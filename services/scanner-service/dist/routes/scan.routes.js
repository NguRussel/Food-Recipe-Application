"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const scan_controller_1 = __importDefault(require("../controllers/scan.controller"));
const upload_1 = __importDefault(require("../middleware/upload"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Route for scanning image uploaded as a file
router.post('/image/upload', auth_1.authenticate, upload_1.default.single('image'), scan_controller_1.default.scanImageFile);
// Route for scanning image provided as base64 data
router.post('/image/base64', auth_1.authenticate, scan_controller_1.default.scanImageBase64);
// Route for getting scan history
router.get('/history', auth_1.authenticate, scan_controller_1.default.getScanHistory);
exports.default = router;
//# sourceMappingURL=scan.routes.js.map