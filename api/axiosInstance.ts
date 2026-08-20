import * as axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useUserStore } from "@/stores/user/useUserStore";
import { Platform } from "react-native";

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "";

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    withCredentials: true,
});

api.interceptors.request.use(async config => {
    let token = useUserStore.getState().token;

    if (!token) {
        if (Platform.OS === "web") {
            token = localStorage.getItem("accessToken");
        } else {
            token = await SecureStore.getItemAsync("accessToken");
        }

        if (token) {
            useUserStore.setState({ token });
        }
    }

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;
