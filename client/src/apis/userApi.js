import { axiosWithCreds, axiosWithoutCreds } from "./axiosInstances";


export const fetchUser = async () => {
    const { data } = await axiosWithCreds.get("/user");
    return data;
};


export const fetchAllUsers = async () => {
    const { data } = await axiosWithCreds.get("/users");
    return data;
};

export const logoutUser = async () => {
    const { data } = await axiosWithCreds.post("/user/logout");
    return data;
};


export const logoutAllSessions = async () => {
    const { data } = await axiosWithCreds.post("/user/logout-all");
    return data;
};

export const logoutUserById = async (id) => {
    const { data } = await axiosWithCreds.post(`/users/${id}/logout`);
    return data;
};

export const loginUser = async (formData) => {
    const { data } = await axiosWithCreds.post("/user/login", formData);
    return data;
};

export const registerUser = async (formData) => {
    const { data } = await axiosWithoutCreds.post("/user/register", formData);
    return data;
};

export const deleteUserById = async (id) => {
    const { data } = await axiosWithCreds.delete(`/users/${id}`);
    return data;
};


export const updateUser = async (updatedName) => {
    const { data } = await axiosWithCreds.put("/user/update", {
        newName: updatedName,
    });
    return data;
};

export const setUserPassword = async (newPassword) => {
    const { data } = await axiosWithCreds.post("/user/set-password", {
        newPassword,
    });
    return data;
};

export const changeUserPassword = async (currentPassword, newPassword) => {
    const { data } = await axiosWithCreds.put("/user/change-password", {
        currentPassword,
        newPassword,
    });
    return data;
};


export const deleteUserPermanentlyById = async (id) => {
    const { data } = await axiosWithCreds.delete(`/users/permanent/${id}`);
    return data;

};

export const updateUserRole = async (userId, newRole) => {
    const { data } = await axiosWithCreds.post(`/users/role/${userId}`, {
        role: newRole,
        userId,
    });
    return data;
};

export const restoreUserById = async (id) => {
    const { data } = await axiosWithCreds.post(`/users/restore/${id}`);
    return data;

};

