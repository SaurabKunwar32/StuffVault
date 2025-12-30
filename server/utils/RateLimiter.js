import { ipKeyGenerator, rateLimit } from "express-rate-limit";

export const RateLimiter = ({
  windowTimeInMs = 10000,
  maxLimit = 10,
  message = "Too many requests",
  keyGenerator
} = {}) => {
  return rateLimit({
    windowMs: windowTimeInMs,
    limit: maxLimit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message,
    keyGenerator,
  });
};


export const userOrIpKey = (req) => {
  if (req.user?._id) {
    // console.log(req.user?._id.toString());
    return `user:${req.user._id.toString()}`;
  }
  // console.log("new one", ipKeyGenerator(req.ip, 56));
  return `ip:${ipKeyGenerator(req.ip, 56)}`;
};


export const limiter = Object.freeze({
  // Makes object immutable (top-level) used to Prevent accidental changes

  // ===================== GENERAL ===================== 
  general: RateLimiter({ windowTimeInMs: 10 * 1000, maxLimit: 20, keyGenerator: userOrIpKey }),



  //  ===================== AUTH ===================== 
  register: RateLimiter({
    windowTimeInMs: 15 * 60 * 1000, maxLimit: 30, message: "Too many registration attempts.", keyGenerator: userOrIpKey,
  }),

  login: RateLimiter({
    windowTimeInMs: 15 * 60 * 1000, maxLimit: 5, message: "Too many login attempts. Try again later.", keyGenerator: userOrIpKey,
  }),

  loginWithGoogle: RateLimiter({
    windowTimeInMs: 15 * 60 * 1000, maxLimit: 50, message: "Too many Google login attempts.", keyGenerator: userOrIpKey,
  }),

  loginWithGithub: RateLimiter({
    windowTimeInMs: 15 * 60 * 1000, maxLimit: 50, message: "Too many GitHub login attempts.", keyGenerator: userOrIpKey,
  }),

  sendOtp: RateLimiter({
    windowTimeInMs: 10 * 60 * 1000, maxLimit: 20, message: "Too many OTP requests.", keyGenerator: userOrIpKey,
  }),



  // ===================== USER ===================== 
  getCurrentUser: RateLimiter({
    windowTimeInMs: 60 * 1000, maxLimit: 30, keyGenerator: userOrIpKey,
  }),

  getAllUsers: RateLimiter({
    windowTimeInMs: 60 * 1000, maxLimit: 20, keyGenerator: userOrIpKey,
  }),

  updateName: RateLimiter({
    windowTimeInMs: 15 * 60 * 1000, maxLimit: 3, keyGenerator: userOrIpKey,
  }),

  changePassword: RateLimiter({
    windowTimeInMs: 15 * 60 * 1000, maxLimit: 3, message: "Too many password change attempts.", keyGenerator: userOrIpKey,
  }),

  setPassword: RateLimiter({
    windowTimeInMs: 15 * 60 * 1000, maxLimit: 3, keyGenerator: userOrIpKey,
  }),


  //  ===================== FILES ===================== 
  getFiles: RateLimiter({
    windowTimeInMs: 60 * 1000, maxLimit: 50, keyGenerator: userOrIpKey,
  }),

  uploadFiles: RateLimiter({
    windowTimeInMs: 60 * 1000, maxLimit: 10, message: "Too many uploads. Please wait.", keyGenerator: userOrIpKey,
  }),

  // 60*1000 = 1min
  renameFiles: RateLimiter({
    windowTimeInMs: 60 * 1000, maxLimit: 15, keyGenerator: userOrIpKey,
  }),


  //  ===================== DIRECTORY ===================== 
  getDirectory: RateLimiter({
    windowTimeInMs: 60 * 1000, maxLimit: 50, keyGenerator: userOrIpKey,
  }),

  renameDirectory: RateLimiter({
    windowTimeInMs: 60 * 1000, maxLimit: 10, keyGenerator: userOrIpKey,
  }),
});