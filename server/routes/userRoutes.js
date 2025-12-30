import express from "express";
import checkAuth, { checkNotRegularUser, checkIsAdminUser, checkRoleChangePermission, checkOwnerPermission } from "../middlewares/auth.js";
import { changePassword, changeUsersRoles, deleteUser, deleteUserParmanently, getAllUser, getCurrentUser, login, logout, logoutAll, logoutById, register, restoreUser, setPassword, updateName } from "../controllers/userController.js";
import { limiter } from "../utils/RateLimiter.js";
import mainThrottle from "../utils/throttler.js";


const router = express.Router();


//  ===================== AUTH ===================== 

// Register → IP-based (via userOrIpKey fallback)
router.post('/user/register', limiter.register, register)

// Login → IP-based
router.post('/user/login', limiter.login, login)

// Get current user → user-based
router.get('/user', checkAuth, limiter.getCurrentUser, mainThrottle.getCurrentUser, getCurrentUser)

// Logout → user-based
router.post('/user/logout', limiter.general, logout)
router.post('/user/logout-all', limiter.general, logoutAll)


//  ===================== USER ===================== 

// Admin / staff access
router.get('/users', checkAuth, limiter.getAllUsers, mainThrottle.getAllUsers, checkNotRegularUser, getAllUser)

// Logout a specific user
router.post('/users/:userId/logout', checkAuth, limiter.general, checkNotRegularUser, logoutById)

// Soft delete user
router.delete('/users/:userId', checkAuth, limiter.general, checkIsAdminUser, deleteUser)

// Permanent delete 
router.delete('/users/permanent/:userId', checkAuth, limiter.general, checkIsAdminUser, checkOwnerPermission, deleteUserParmanently)

// Restore user
router.post('/users/restore/:userId', checkAuth, limiter.general, checkIsAdminUser, restoreUser)

// Change user role 
router.post('/users/role/:userId', checkAuth, checkIsAdminUser, limiter.general, checkRoleChangePermission, changeUsersRoles)


// ===================== PROFILE =====================

// Update name
router.put('/user/update', checkAuth, limiter.updateName, updateName)

// Change password
router.put("/user/change-password", limiter.changePassword, checkAuth, changePassword);

// Set password (OAuth users)
router.post("/user/set-password", limiter.setPassword, checkAuth, setPassword);

export default router;
