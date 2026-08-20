import { PortfolioItem } from "@/types/portfolioItem";
import { Ionicons } from "@expo/vector-icons";

export interface Portfolio {
    id: number;
    title: string;
    totalAmount: number;
    returnRate: number;
    tags: string;
    icon: keyof typeof Ionicons.glyphMap;
    items: PortfolioItem[];
}
