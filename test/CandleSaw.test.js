require("mocha");
const { assert } = require("chai");
const { CandleSaw } = require("../lib/CandleSaw");
const fs = require("fs");

describe("CandleSaw", () => {
    it("execute fee: 0.001", function () {
        const candles = JSON.parse(fs.readFileSync("./test/data/data.json"));
        const trades = CandleSaw.execute({
            candles,
            fee: 0.001,
        });

        // console.log(trades);
        console.log(trades.length);

        assert.isArray(trades);
        assert.isAtLeast(trades.length, 1, "длина больше 1");
    });

    it("execute fee: 0.003", function () {
        const candles = JSON.parse(fs.readFileSync("./test/data/data.json"));
        const trades = CandleSaw.execute({
            candles,
            fee: 0.003,
        });

        console.log(trades);
        console.log(trades.length);

        assert.isArray(trades);
        assert.isAtLeast(trades.length, 1, "длина больше 1");
    });
});
