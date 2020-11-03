import { ICandle } from "./ICandle";
import { ITrade } from "./ITrade";

export class CandleSaw {
    public static execute(options: {
        candles: ICandle[];
        fee: number; // своего рода фильтр
    }): ITrade[] {
        const { candles, fee } = options;
        let min = candles[0];
        let max: ICandle | null = null;

        const trades: ITrade[] = [];
        // max по времени всегда позднее open
        // max появляется только если current первысил порог fee
        // если current упал ниже max больше чем на fee, то пара фиксируется и начинается заново
        // порог = min * fee + max * fee + min

        const lastIndex = candles.length - 1;
        candles.forEach((curr, i) => {
            if (
                curr.close > (min.close * (1 + fee)) / (1 - fee) &&
                (!max || curr.close > max.close)
            ) {
                // если рост и преодолен порог, то фиксируется новый пик
                max = curr;
            }

            if (
                max &&
                (max.close > (curr.close * (1 + fee)) / (1 - fee) ||
                    i === lastIndex)
            ) {
                // если падение ниже порога и после пика, то фиксируется пара
                trades.push({
                    begin: min.time,
                    end: max.time,
                    open: min.close,
                    close: max.close,
                    fee: (min.close + max.close) * fee,
                    grossProfit: max.close - min.close,
                    profit:
                        max.close - min.close - (min.close + max.close) * fee,
                });

                min = curr; // считается новой впадиной
                max = null; // пик сбрасывается
            }
            if (!max && curr.close < min.close) {
                // если пика нет, и понижение, то фиксируется новая отметка впадина
                min = curr;
            }
        });

        return trades;
    }
}
