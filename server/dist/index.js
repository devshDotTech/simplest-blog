"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const blogs_1 = __importDefault(require("./routes/blogs"));
const admin_1 = __importDefault(require("./routes/admin"));
//dotenv.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api', blogs_1.default);
app.use('/api', admin_1.default);
app.listen(port, () => {
    console.log(`[server]: listening at port: ${port}`);
});
