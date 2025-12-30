import express from 'express'
import { callbackGithub, loginWithGithub, loginWithGoogle, sendotp, verifyotp } from '../controllers/authController.js';
import { limiter } from '../utils/RateLimiter.js';


const router = express.Router();

router.post('/send-otp',limiter.sendOtp, sendotp)

router.post('/verify-otp', verifyotp)

router.post('/google', limiter.loginWithGoogle, loginWithGoogle)

// Step 1: Redirect user to GitHub login
router.get("/github", limiter.loginWithGithub, loginWithGithub);

// Step 2: Handle callback from GitHub
router.get("/github/callback", callbackGithub);

export default router;