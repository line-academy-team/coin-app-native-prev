import { Text, View, Image, Pressable, ScrollView } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/components/common/button/Button";
import { Portfolio } from "@/types/portfolio";
import portfolioApi from "@/api/user/portfolioApi";

function Dashboard() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);

    useFocusEffect(
        useCallback(() => {
            let isMounted = true;

            const fetchPortfolios = async () => {
                try {
                    setIsLoading(true);
                    const data = await portfolioApi.getMyPortfolios();

                    if (isMounted) {
                        setPortfolios(data);
                    }
                } catch (error) {
                    console.error("포트폴리오 목록 조회 실패:", error);
                } finally {
                    if (isMounted) {
                        setIsLoading(false);
                    }
                }
            };

            fetchPortfolios().then(() => {});

            return () => {
                isMounted = false;
            };
        }, []),
    );

    // --- 1. 포트폴리오가 없을 때의 화면 ---
    const renderEmptyState = () => (
        <View className="mt-6 flex-1">
            <Image
                source={require("@/assets/images/dashboard/b00f218fd7b59d7b842ad39f6354dde5b704a606.png")}
                style={{ width: "100%", height: 180, marginBottom: 32 }}
                resizeMode="contain"
            />

            <View className="gap-y-3">
                <View className="flex-row items-center border border-[#06B6D4] bg-white rounded-xl p-3">
                    <View className="w-10 h-10 bg-[#06B6D4] rounded-lg items-center justify-center mr-3">
                        <Ionicons name="laptop-outline" size={20} color="white" />
                    </View>
                    <Text className="font-pretendard-semibold text-gray-800 text-[15px]">
                        실제 투자 없이 시뮬레이션
                    </Text>
                </View>

                <View className="flex-row items-center border border-[#3B82F6] bg-white rounded-xl p-3">
                    <View className="w-10 h-10 bg-[#3B82F6] rounded-lg items-center justify-center mr-3">
                        <Ionicons name="logo-bitcoin" size={20} color="white" />
                    </View>
                    <Text className="font-pretendard-semibold text-gray-800 text-[15px]">
                        다양한 코인으로 포트폴리오 구성
                    </Text>
                </View>

                <View className="flex-row items-center border border-[#F59E0B] bg-white rounded-xl p-3">
                    <View className="w-10 h-10 bg-[#F59E0B] rounded-lg items-center justify-center mr-3">
                        <Ionicons name="bar-chart-outline" size={20} color="white" />
                    </View>
                    <Text className="font-pretendard-semibold text-gray-800 text-[15px]">
                        과거 데이터를 통한 수익률 확인
                    </Text>
                </View>
            </View>
        </View>
    );

    // --- 2. 포트폴리오가 있을 때의 화면 ---
    const renderPopulatedState = () => (
        <View className="mt-4 flex-1">
            <View className="bg-[#1A73E8] rounded-2xl p-5 relative overflow-hidden">
                <Text className="text-blue-100 font-pretendard text-sm mb-1">총 자산</Text>
                <Text className="text-white font-pretendard-bold text-3xl mb-4">₩32,430,250</Text>

                <View className="flex-row items-center mb-1">
                    <Text className="text-blue-100 font-pretendard text-xs w-[60px]">평가손익</Text>
                    <Text className="text-white font-pretendard-bold text-sm">+₩2,430,250</Text>
                </View>
                <View className="flex-row items-center">
                    <Text className="text-blue-100 font-pretendard text-xs w-[60px]">수익률</Text>
                    <View className="bg-blue-400/50 rounded-full px-2 py-0.5">
                        <Text className="text-white font-pretendard-bold text-xs">+8.10%</Text>
                    </View>
                </View>

                <Image
                    source={require("@/assets/images/welcome/a7b6abd48871456077a8818d2955ed94772f99ec.png")}
                    className="absolute -right-4 -bottom-4 w-[120px] h-[120px]"
                    resizeMode="contain"
                />
            </View>

            <View className="flex-row justify-between mt-4">
                <View className="flex-1 bg-white border border-[#06B6D4] rounded-xl p-3 flex-row items-center justify-center mr-2">
                    <Ionicons name="briefcase" size={20} color="#06B6D4" className="mr-2" />
                    <View>
                        <Text className="text-gray-500 text-[10px] font-pretendard">
                            포트폴리오
                        </Text>
                        <Text className="text-gray-800 text-xs font-pretendard-bold">
                            {portfolios.length}개
                        </Text>
                    </View>
                </View>
                <View className="flex-1 bg-white border border-[#F59E0B] rounded-xl p-3 flex-row items-center justify-center mr-2">
                    <Ionicons name="star" size={20} color="#F59E0B" className="mr-2" />
                    <View>
                        <Text className="text-gray-500 text-[10px] font-pretendard">관심코인</Text>
                        <Text className="text-gray-800 text-xs font-pretendard-bold">5개</Text>
                    </View>
                </View>
                <View className="flex-1 bg-white border border-[#8B5CF6] rounded-xl p-3 flex-row items-center justify-center">
                    <Ionicons name="trending-up" size={20} color="#3B82F6" className="mr-2" />
                    <View>
                        <Text className="text-gray-500 text-[10px] font-pretendard">오늘 변동</Text>
                        <Text className="text-gray-800 text-xs font-pretendard-bold">+1.2%</Text>
                    </View>
                </View>
            </View>

            <View className="mt-8">
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-gray-800 font-pretendard-bold text-lg">
                        내 포트폴리오
                    </Text>
                    <Pressable>
                        <Text className="text-[#1A73E8] font-pretendard text-sm">
                            전체보기 {">"}
                        </Text>
                    </Pressable>
                </View>

                {portfolios.map(portfolio => (
                    <View
                        key={portfolio.id}
                        className="bg-white rounded-2xl p-4 mb-3 flex-row items-center shadow-sm">
                        <View className="w-12 h-12 bg-blue-50 rounded-full items-center justify-center mr-4">
                            <Ionicons name={portfolio.icon} size={24} color="#1A73E8" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-500 font-pretendard text-xs mb-1">
                                {portfolio.title}
                            </Text>
                            <Text className="text-gray-800 font-pretendard-bold text-[16px]">
                                {portfolio.totalAmount.toLocaleString()}원
                            </Text>
                            <Text className="text-gray-400 font-pretendard text-[10px] mt-1">
                                {portfolio.tags}
                            </Text>
                        </View>
                        <View className="items-end">
                            <Text className="text-[#10B981] font-pretendard-bold text-sm mb-1">
                                +{portfolio.returnRate}% {">"}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-[#F8FAFC]">
            <ScrollView
                className="flex-1 px-5"
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}>
                <View className="pt-8 pb-2">
                    <Text className="text-3xl font-pretendard-bold text-gray-900 mb-2">
                        안녕하세요
                    </Text>
                    <Text className="text-gray-500 font-pretendard text-sm">
                        {portfolios.length === 0
                            ? "지금이 바로 시작할 시간이에요.\n나만의 가상 포트폴리오를 만들어보세요."
                            : "오늘의 포트폴리오 현황을 확인해보세요"}
                    </Text>
                </View>

                {portfolios.length === 0 ? renderEmptyState() : renderPopulatedState()}

                <View className="absolute bottom-0 left-0 right-0 bg-[#F8FAFC]">
                    <Button
                        variant="solid"
                        onPress={() => router.push("/user/portfolio/create")}
                        className="h-[56px] rounded-xl"
                        textClassName="text-[16px]">
                        + 포트폴리오 만들기
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default Dashboard;
