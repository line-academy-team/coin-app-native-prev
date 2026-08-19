import React from "react";
import { GestureResponderEvent, Pressable, Text } from "react-native";
import { twMerge } from "tailwind-merge";

interface ButtonProps {
    disabled?: boolean;
    isLoading?: boolean;
    onPress?: (event: GestureResponderEvent) => void;
    children: string;
    className?: string;
    textClassName?: string;
    variant?: "solid" | "outline";
}

function Button({
    disabled = false,
    isLoading = false,
    onPress,
    children,
    className,
    textClassName,
    variant = "solid",
}: ButtonProps) {
    const isDisabled = disabled || isLoading;

    const buttonStyle =
        variant === "solid"
            ? isDisabled
                ? "bg-background-deep border border-divider cursor-not-allowed"
                : "bg-primary-main border border-primary-main hover:bg-primary-hover hover:border-primary-hover active:bg-primary-active active:border-primary-active cursor-pointer"
            : isDisabled
              ? "bg-transparent border border-divider cursor-not-allowed"
              : "bg-transparent border border-primary-main hover:border-primary-hover active:border-primary-active cursor-pointer";

    const textStyle =
        variant === "solid"
            ? isDisabled
                ? "text-text-disabled"
                : "text-primary-contrast"
            : isDisabled
              ? "text-text-disabled"
              : "text-primary-main hover:text-primary-hover active:text-primary-active";

    return (
        <Pressable
            disabled={isDisabled}
            onPress={onPress}
            className={twMerge(
                "w-full rounded-lg items-center justify-center transition-colors duration-200",
                buttonStyle,
                className,
            )}>
            <Text className={twMerge("font-pretendard-bold", textStyle, textClassName)}>
                {isLoading ? "처리 중..." : children}
            </Text>
        </Pressable>
    );
}

export default Button;
