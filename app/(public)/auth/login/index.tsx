import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import { useRouter } from "expo-router";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginInputType, loginSchema } from "@/schemas/user/loginUserSchema";
import { isAxiosError } from "axios";
import { Ionicons } from "@expo/vector-icons";
import InputGroup from "@/components/common/input/InputGroup";
import ErrorMessage from "@/components/common/form/ErrorMessage";
import userApi from "@/api/user/userApi";
import { useUserStore } from "@/stores/user/useUserStore";
import Button from "@/components/common/button/Button";

function AuthLoginPage() {
    const router = useRouter();

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<LoginInputType>({
        resolver: zodResolver(loginSchema),
        mode: "onTouched",
        defaultValues: {
            email: "",
            password: "",
            autoLogin: false,
        },
    });

    const { email, password } = useWatch({ control });
    const isFilled = Boolean(email?.trim() && password?.trim());

    const onSubmit = async (data: LoginInputType) => {
        try {
            const { autoLogin, ...submitData } = data;

            const response = await userApi.loginUser(submitData);
            await useUserStore.getState().login(response.user, response.token);

            router.replace("/");
        } catch (error) {
            let errorMessage = "로그인 중 오류가 발생했습니다.";

            if (isAxiosError(error)) {
                errorMessage = error.response?.data?.message || errorMessage;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            setError("root", { message: errorMessage });
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-white">
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 40 }}>
                <View className="h-[80px] justify-center">
                    <View className="flex-row items-center px-5 py-3 gap-2">
                        <Pressable onPress={() => router.back()}>
                            <Ionicons name="chevron-back-outline" size={24} color="black" />
                        </Pressable>
                        <Text className="text-black font-pretendard-bold text-2xl">로그인</Text>
                    </View>
                </View>

                <Text className="text-[#3B82F6] font-pretendard-bold text-center text-[16px] mt-2 mb-8">
                    다시만나서 반가워요!
                </Text>

                <View className="px-5">
                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <InputGroup
                                label="이메일"
                                placeholder="이메일을 입력해주세요"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.email?.message}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <InputGroup
                                label="비밀번호"
                                placeholder="비밀번호를 입력해주세요"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.password?.message}
                                isPassword={true}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="autoLogin"
                        render={({ field: { onChange, value } }) => (
                            <Pressable
                                className="flex-row items-center mt-4 gap-2"
                                onPress={() => onChange(!value)}>
                                <Ionicons
                                    name={value ? "checkbox" : "square-outline"}
                                    size={20}
                                    color={value ? "#3B82F6" : "#94A3B8"}
                                />
                                <Text className="text-sm font-pretendard text-gray-500">
                                    자동 로그인
                                </Text>
                            </Pressable>
                        )}
                    />

                    {errors.root?.message && (
                        <ErrorMessage className="mt-4 self-center">
                            {errors.root.message}
                        </ErrorMessage>
                    )}

                    <Button
                        disabled={!isFilled}
                        isLoading={isSubmitting}
                        onPress={handleSubmit(onSubmit)}
                        className={`h-[60px] mt-10 rounded-xl ${isFilled ? "bg-[#E2E8F0]" : "bg-gray-100"}`}
                        textClassName="text-[#1E293B] text-[16px] font-pretendard-bold">
                        로그인
                    </Button>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default AuthLoginPage;