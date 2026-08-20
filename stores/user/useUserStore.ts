import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { User } from "@/types/user";
import userApi from "@/api/user/userApi";

type UserState = {
    isLoggedIn: boolean;
    token: string | null;
    user: User | null;

    login: (user: User, token: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUserInfo: (userInfo: Partial<User>) => void;
    restoreLogin: () => Promise<void>;
};

const TOKEN_KEY = "accessToken";

const customWebStorage: StateStorage = {
    getItem: name => {
        if (typeof window === "undefined") {
            return null;
        }

        return localStorage.getItem(name);
    },

    setItem: (name, value) => {
        if (typeof window !== "undefined") {
            localStorage.setItem(name, value);
        }
    },

    removeItem: name => {
        if (typeof window !== "undefined") {
            localStorage.removeItem(name);
        }
    },
};

const storage =
    Platform.OS === "web"
        ? createJSONStorage(() => customWebStorage)
        : createJSONStorage(() => AsyncStorage);

const saveAccessToken = async (token: string) => {
    if (Platform.OS === "web") {
        localStorage.setItem(TOKEN_KEY, token);
        return;
    }

    await SecureStore.setItemAsync(TOKEN_KEY, token);
};

const getAccessToken = async () => {
    if (Platform.OS === "web") {
        return localStorage.getItem(TOKEN_KEY);
    }

    return await SecureStore.getItemAsync(TOKEN_KEY);
};

const removeAccessToken = async () => {
    if (Platform.OS === "web") {
        localStorage.removeItem(TOKEN_KEY);
        return;
    }

    await SecureStore.deleteItemAsync(TOKEN_KEY);
};

export const useUserStore = create<UserState>()(
    persist(
        set => ({
            isLoggedIn: false,
            token: null,
            user: null,

            login: async (user, token) => {
                await saveAccessToken(token);

                set({
                    isLoggedIn: true,
                    token,
                    user,
                });
            },

            logout: async () => {
                await removeAccessToken();

                set({
                    isLoggedIn: false,
                    token: null,
                    user: null,
                });
            },

            updateUserInfo: userInfo =>
                set(state => {
                    if (!state.user) {
                        return state;
                    }

                    return {
                        user: {
                            ...state.user,
                            ...userInfo,
                        },
                    };
                }),

            restoreLogin: async () => {
                const token = await getAccessToken();

                if (!token) {
                    set({
                        isLoggedIn: false,
                        token: null,
                        user: null,
                    });

                    return;
                }

                set({
                    token,
                });

                try {
                    const user = await userApi.getMe();

                    set({
                        isLoggedIn: true,
                        token,
                        user,
                    });
                } catch (error) {
                    console.error("로그인 복원 실패:", error);

                    await removeAccessToken();

                    set({
                        isLoggedIn: false,
                        token: null,
                        user: null,
                    });
                }
            },
        }),
        {
            name: "user-storage",

            storage,
            partialize: state => ({
                user: state.user,
            }),
        },
    ),
);
