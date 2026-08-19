import { View } from "react-native";
import { Slot } from "expo-router";
import MainFooter from "@/components/layout/MainFooter";

function UserLayout() {
    return (
        <View className="flex-1">
            <View className="flex-1">
                <Slot />
            </View>

            <MainFooter />
        </View>
    );
}

export default UserLayout;
