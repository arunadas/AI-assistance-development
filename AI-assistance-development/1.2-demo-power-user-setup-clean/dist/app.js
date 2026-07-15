"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const features = [
    { id: 1, name: 'User Authentication', enabled: true },
    { id: 2, name: 'Dark Mode', enabled: true },
    { id: 3, name: 'Real-time Notifications', enabled: false },
];
function getHealth(req, res) {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
}
app.get('/health', getHealth);
function getFeatures(req, res) {
    res.status(200).json(features);
}
app.get('/features', getFeatures);
function createTask(req, res) {
    const { title, description } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }
    const task = {
        id: Date.now(),
        title,
        description: description || '',
        completed: false,
        createdAt: new Date().toISOString(),
    };
    res.status(201).json(task);
}
app.post('/tasks', createTask);
function getTaskById(req, res) {
    const taskId = parseInt(req.params.id, 10);
    if (isNaN(taskId)) {
        return res.status(400).json({ error: 'Invalid task ID' });
    }
    const task = {
        id: taskId,
        title: 'Sample Task',
        description: 'This is a sample task',
        completed: false,
        createdAt: new Date().toISOString(),
    };
    res.status(200).json(task);
}
app.get('/tasks/:id', getTaskById);
exports.default = app;
//# sourceMappingURL=app.js.map