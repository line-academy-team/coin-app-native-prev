import { useEffect, useRef } from "react";
import { ActivityIndicator, View } from "react-native";
import { router, useRootNavigationState } from "expo-router";

import { useUserStore } from "@/stores/user/useUserStore";

export default function IndexPage() {
    const navigationState = useRootNavigationState();

    const hasInitialized = useRef(false);

    useEffect(() => {
        /*
         * Expo Router가 준비되기 전에는 실행하지 않음
         */
        if (!navigationState?.key) {
            return;
        }

        /*
         * 초기화 중복 실행 방지
         */
        if (hasInitialized.current) {
            return;
        }

        hasInitialized.current = true;

        let isMounted = true;

        const initializeAuth = async () => {
            try {
                /*
                 * Zustand persist 복원 기다리기
                 */
                if (!useUserStore.persist.hasHydrated()) {
                    await new Promise<void>(resolve => {
                        const unsubscribe = useUserStore.persist.onFinishHydration(() => {
                            unsubscribe();
                            resolve();
                        });
                    });
                }

                if (!isMounted) {
                    return;
                }

                /*
                 * 저장된 AccessToken으로 로그인 복원
                 */
                await useUserStore.getState().restoreLogin();

                if (!isMounted) {
                    return;
                }

                /*
                 * 현재 로그인 상태 가져오기
                 */
                const { isLoggedIn, token, user, logout } = useUserStore.getState();

                /*
                 * 로그인하지 않은 경우
                 */
                if (!isLoggedIn || !token || !user) {
                    router.replace("/welcome");
                    return;
                }

                /*
                 * 기본 회원 정보 검증
                 */
                if (!user.id || !user.email || !user.nickname) {
                    await logout();

                    if (isMounted) {
                        router.replace("/auth/login");
                    }

                    return;
                }

                /*
                 * 로그인 정상
                 */
                router.replace("/user");
            } catch (error) {
                console.error("초기 로그인 검증 실패:", error);

                await useUserStore.getState().logout();

                if (isMounted) {
                    router.replace("/auth/login");
                }
            }
        };

        void initializeAuth();

        return () => {
            isMounted = false;
        };
    }, [navigationState?.key]);

    /*
     * 로그인 상태 확인 중 화면
     */
    return (
        <View className="flex-1 items-center justify-center bg-white">
            <ActivityIndicator size="large" color="#2288ED" />
        </View>
    );
}
