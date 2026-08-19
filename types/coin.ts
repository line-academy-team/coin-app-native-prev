export interface UpbitMarket {
    market: string;
    korean_name: string;
    english_name: string;
}

export type UpbitChange = "RISE" | "EVEN" | "FALL";

export interface UpbitTicker {
    market: string;

    opening_price: number;
    high_price: number;
    low_price: number;

    trade_price: number;
    prev_closing_price: number;

    change: UpbitChange;

    change_price: number;
    change_rate: number;

    signed_change_price: number;
    signed_change_rate: number;

    acc_trade_price: number;
    acc_trade_price_24h: number;

    acc_trade_volume: number;
    acc_trade_volume_24h: number;

    timestamp: number;
}

/**
 * 코인 목록 페이지에서 사용하는 데이터
 */
export interface Coin {
    market: string;

    symbol: string;

    koreanName: string;
    englishName: string;

    price: number;
    changeRate: number;
}

/**
 * 코인 상세 페이지
 */
export interface CoinDetail extends Coin {
    changePrice: number;

    openingPrice: number;

    highPrice: number;
    lowPrice: number;

    tradePrice24h: number;
    tradeVolume24h: number;

    timestamp: number;
}

/**
 * 1초마다 수집하는 실시간 가격
 */
export interface RealtimePricePoint {
    timestamp: number;

    time: string;

    price: number;
}
