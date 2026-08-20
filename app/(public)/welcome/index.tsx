import { Text, View, Image } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/components/common/button/Button";

function WelcomePage() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-[#1A73E8]">
            <View className="flex-1 bg-white m-4 my-8 rounded-3xl items-center justify-center px-6 py-8">
                <Text className="text-4xl font-pretendard-bold text-[#1A73E8] mb-4">CoinFolio</Text>
                <Text className="text-lg font-pretendard-bold text-gray-800 mb-6">
                    가상의 투자로, 더 나은 내일을
                </Text>

                <Text className="text-center text-gray-500 font-pretendard text-sm mb-10 leading-6">
                    실제 투자 없이{"\n"}
                    쉽게 시작하는{"\n"}
                    나만의 암호화폐 포트폴리오
                </Text>

                <Image
                    source={require("@/assets/images/welcome/a7b6abd48871456077a8818d2955ed94772f99ec.png")}
                    style={{ width: 200, height: 200, marginBottom: 48 }}
                    resizeMode="contain"
                />

                <View className="w-full gap-y-3 mt-auto">
                    {/* 시작하기 (회원가입 이동) 버튼 */}
                    <Button
                        variant="solid"
                        onPress={() => router.push("/auth/register")}
                        className="h-[56px] rounded-xl"
                        textClassName="text-[16px]">
                        시작하기
                    </Button>

                    <Button
                        variant="outline"
                        onPress={() => router.push("/auth/login")}
                        className="h-[56px] rounded-xl"
                        textClassName="text-[16px]">
                        로그인
                    </Button>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default WelcomePage;