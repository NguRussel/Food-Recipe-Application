"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const SearchIndexSchema = new mongoose_1.Schema({
    recipeId: { type: String, required: true, unique: true },
    title: { type: String, required: true, index: true },
    description: { type: String, required: true, index: true },
    ingredients: [{ type: String, index: true }],
    culture: { type: String, required: true, index: true },
    category: [{ type: String, required: true, index: true }],
    difficulty: { type: String, required: true },
    preparationTime: { type: Number, required: true },
    cookingTime: { type: Number, required: true },
    tags: [{ type: String, index: true }],
    searchScore: { type: Number, default: 0 }
}, { timestamps: true });
// Text index for full-text search
SearchIndexSchema.index({ title: 'text', description: 'text', ingredients: 'text', tags: 'text' }, { weights: { title: 10, description: 5, ingredients: 3, tags: 2 } });
exports.default = mongoose_1.default.model('SearchIndex', SearchIndexSchema);
//# sourceMappingURL=search.model.js.map