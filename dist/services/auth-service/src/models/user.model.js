"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    twoFactorSecret: { type: String },
    twoFactorEnabled: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcryptjs_1.default.hash(this.password, 12);
    }
    next();
});
exports.User = mongoose_1.default.model('User', userSchema);
//# sourceMappingURL=user.model.js.map