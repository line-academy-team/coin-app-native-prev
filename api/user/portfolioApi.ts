import axiosInstance from "@/api/axiosInstance";
import { Portfolio } from "@/types/portfolio";

// 포트폴리오 목록 조회
const getMyPortfolios = async (): Promise<Portfolio[]> => {
    const response = await axiosInstance.get("/portfolios");
    return response.data.data;
};

export default {
    getMyPortfolios,
};
