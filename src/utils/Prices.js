import axios from 'axios'

const HarmonyTokens = [
    {"id": "binance-usd", "symbol": "bscBUSD", "contract": "0x0aB43550A6915F9f67d0c454C2E90385E6497EaA"},
    {"id": "usd-coin", "symbol": "1USDC", "contract": "0x985458E523dB3d53125813eD68c274899e9DfAb4"},
    {"id": "tether", "symbol": "1USDT", "contract": "0x3C2B8Be99c50593081EAA2A724F0B8285F5aba8f"},
    {"id": "harmony", "symbol": "WONE", "contract": "0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a"},
    {"id": "sushi", "symbol": "SUSHI", "contract": "0xBEC775Cb42AbFa4288dE81F387a9b1A3c4Bc552A"},
    {"id": "dai", "symbol": "1DAI", "contract": "0xEf977d2f931C1978Db5F6747666fa1eACB0d0339"},
    {"id": "rendoge", "symbol": "1renDOGE", "contract": "0x6C7bA6c44871655968e2aE85116Becb79c6AC352"},
    {"id": "wrapped-bitcoin", "symbol": "bscBTCB", "contract": "0x34224dCF981dA7488FdD01c7fdd64E74Cd55DcF7"},
    {"id": "binance-eth", "symbol": "bscETH", "contract": "0x783ee3e955832a3d52ca4050c4c251731c156020"},
    {"id": "terra-luna", "symbol": "LUNA", "contract": "0x95ce547d730519a90def30d647f37d9e5359b6ae"},
    {"id": "terra-usd", "symbol": "UST", "contract": "0x224e64ec1bdce3870a6a6c777edd450454068fec"},
    {"id": "curve-dao-token", "symbol": "CRV", "contract": "0x352cd428EFd6F31B5cae636928b7B84149cF369F"}
];


async function getHarmonyPrices() {
    const idPrices = await lookUpPrices(HarmonyTokens.map(x => x.id));
    const prices = {}
    for (const bt of HarmonyTokens)
        if (idPrices[bt.id])
            prices[bt.contract.toLowerCase()] = idPrices[bt.id];
    return prices;
}

const lookUpPrices = async function (id_array) {
    const prices = {}
    for (const id_chunk of chunk(id_array, 50)) {
        let ids = id_chunk.join('%2C')
        let res = (await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`)).data
        for (const [key, v] of Object.entries(res)) {
            if (v.usd) prices[key] = v;
        }
    }
    return prices
}

const chunk = (arr, n) => arr.length ? [arr.slice(0, n), ...chunk(arr.slice(n), n)] : []
// function getParameterCaseInsensitive(object, key) {
//     return object[Object.keys(object)
//         .find(k => k.toLowerCase() === key.toLowerCase())
//         ];
// }

function getUniPrices(token0, token1, prices, pool) {

    const t0 = token0;
    let p0 = prices[token0]?.usd;
    const t1 = token1;
    let p1 = prices[token1]?.usd;

    if (p0 == null && p1 == null) {
        console.log(`Missing prices for tokens ${pool.token0} and ${pool.token1}.`);
        return undefined;
    }
    if (t0?.decimals == null) {
        console.log(`Missing information for token ${pool.token0}.`);
        return undefined;
    }
    if (t1?.decimals == null) {
        console.log(`Missing information for token ${pool.token1}.`);
        return undefined;
    }
    var q0 = pool.q0 / 10 ** t0.decimals;
    var q1 = pool.q1 / 10 ** t1.decimals;
    if (p0 == null) {
        p0 = q1 * p1 / q0;
        prices[pool.token0] = {usd: p0};
    }
    if (p1 == null) {
        p1 = q0 * p0 / q1;
        prices[pool.token1] = {usd: p1};
    }
    var tvl = q0 * p0 + q1 * p1;
    var price = tvl / pool.totalSupply;
    prices[pool.address] = {usd: price};
    var staked_tvl = pool.staked * price;
    return {
        t0: t0,
        p0: p0,
        q0: q0,
        t1: t1,
        p1: p1,
        q1: q1,
        price: price,
        tvl: tvl,
        staked_tvl: staked_tvl,
    }
}

export default {
    getHarmonyPrices: getHarmonyPrices,
    poolPrices: getUniPrices
}