import express from 'express'
import { callbackGithub, loginWithGithub, loginWithGoogle, sendotp, verifyotp } from '../controllers/authController.js';


const router = express.Router();

router.post('/send-otp', sendotp)

router.post('/verify-otp', verifyotp)

router.post('/google', loginWithGoogle)

// Step 1: Redirect user to GitHub login
router.get("/github", loginWithGithub);

// Step 2: Handle callback from GitHub
router.get("/github/callback", callbackGithub);

export default router;