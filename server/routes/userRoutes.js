import express from "express";
import checkAuth, { checkNotRegularUser, checkIsAdminUser, checkRoleChangePermission, checkOwnerPermission } from "../middlewares/auth.js";
import { changePassword, changeUsersRoles, deleteUser, deleteUserParmanently, getAllUser, getCurrentUser, login, logout, logoutAll, logoutById, register, restoreUser, setPassword, updateName } from "../controllers/userController.js";


const router = express.Router();

router.post('/user/register', register)


router.post('/user/login', login)

router.get('/user', checkAuth, getCurrentUser)
router.post('/user/logout', logout)
router.post('/user/logout-all', logoutAll)

router.get('/users', checkAuth, checkNotRegularUser, getAllUser)
router.post('/users/:userId/logout', checkAuth, checkNotRegularUser, logoutById)
router.delete('/users/:userId', checkAuth, checkIsAdminUser, deleteUser)
router.delete('/users/permanent/:userId', checkAuth, checkIsAdminUser, checkOwnerPermission, deleteUserParmanently)
router.post('/users/restore/:userId', checkAuth, checkIsAdminUser, restoreUser)
router.post('/users/role/:userId', checkAuth, checkIsAdminUser, checkRoleChangePermission, changeUsersRoles)
router.put('/user/update',checkAuth,updateName)

router.put("/user/change-password",checkAuth,changePassword);
router.post("/user/set-password",checkAuth,setPassword);

export default router;
