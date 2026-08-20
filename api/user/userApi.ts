import axiosInstance from "@/api/axiosInstance";
import { AuthUser, GetMeResponse, LoginResponse, User } from "../../types/user";
import { RegisterUserInputType } from "@/schemas/user/registerUserSchema";

const registerUser = async (data: RegisterUserInputType): Promise<User> => {
    const { confirmPassword, ...submitData } = data;
    const response = await axiosInstance.post("/user/create", submitData);
    return response.data.data;
};

export default {
    registerUser,
};
