const express = require('express');
const authJwt = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/token', authJwt.loginAPI);

module.exports = router;