"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/enable-2fa', auth_middleware_1.protect, authController.enable2FA);
router.post('/logout', auth_middleware_1.protect, authController.logout);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map