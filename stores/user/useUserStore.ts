import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

import { User } from "@/types/user";

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

/*
 * Web Storage
 */
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

/*
 * Zustand Persist Storage
 *
 * Web
 * → localStorage
 *
 * App
 * → AsyncStorage
 */
const storage =
    Platform.OS === "web"
        ? createJSONStorage(() => customWebStorage)
        : createJSONStorage(() => AsyncStorage);

/*
 * AccessToken 저장
 */
const saveAccessToken = async (token: string) => {
    if (Platform.OS === "web") {
        localStorage.setItem(TOKEN_KEY, token);
        return;
    }

    await SecureStore.setItemAsync(TOKEN_KEY, token);
};

/*
 * AccessToken 가져오기
 */
const getAccessToken = async () => {
    if (Platform.OS === "web") {
        return localStorage.getItem(TOKEN_KEY);
    }

    return await SecureStore.getItemAsync(TOKEN_KEY);
};

/*
 * AccessToken 삭제
 */
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
            /*
             * 초기 상태
             */
            isLoggedIn: false,

            token: null,

            user: null,

            /*
             * 로그인
             */
            login: async (user, token) => {
                await saveAccessToken(token);

                set({
                    isLoggedIn: true,
                    token,
                    user,
                });
            },

            /*
             * 로그아웃
             */
            logout: async () => {
                await removeAccessToken();

                set({
                    isLoggedIn: false,
                    token: null,
                    user: null,
                });
            },

            /*
             * 유저 정보 수정
             */
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

            /*
             * 로그인 복원
             */
            restoreLogin: async () => {
                const token = await getAccessToken();

                /*
                 * 저장된 토큰이 없는 경우
                 */
                if (!token) {
                    set({
                        isLoggedIn: false,
                        token: null,
                        user: null,
                    });

                    return;
                }

                /*
                 * API 요청 전에 token 먼저 등록
                 */
                set({
                    token,
                });

                try {
                    /*
                     * 순환 참조 방지를 위해 require 사용
                     */
                    const userApi = require("@/api/user/userApi").default;

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

            /*
             * user 정보만 persist
             *
             * accessToken은
             * Web → localStorage
             * App → SecureStore
             * 에 별도로 저장
             */
            partialize: state => ({
                user: state.user,
            }),
        },
    ),
);
