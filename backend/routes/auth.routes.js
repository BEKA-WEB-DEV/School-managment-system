import express from 'express';
import { login, logout } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validator.js';
import { loginValidation } from '../middleware/validator.js';

const router = express.Router();

router.post('/login', validate(loginValidation), login);
router.post('/logout', logout);

export default router;

// import express from 'express';
// import { login, logout, getCurrentUser } from '../controllers/auth.controller.js';
// import { validate } from '../middleware/validator.js';
// import { validateLogin } from '../middleware/validator.js';

// const router = express.Router();

// router.post('/login', validate(validateLogin), login);
// router.post('/logout', logout);
// router.get('/me', getCurrentUser);

// export default router;