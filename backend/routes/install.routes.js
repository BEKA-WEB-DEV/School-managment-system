import express from 'express';
import { installDatabase } from '../controllers/install.controller.js';

const router = express.Router();

// Unprotected installation endpoint
router.post('/install', installDatabase);

export default router;