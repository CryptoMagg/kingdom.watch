const { Contract, providers, utils } = require('ethers')
const { JsonRpcProvider } = providers
export const { formatUnits, formatEther } = utils

export const RPCs = {
    sd: new JsonRpcProvider('https://harmony-0-rpc.gateway.pokt.network'),
    cv: new JsonRpcProvider('https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc')
}

export const contractJson = {
    jewel: require("../data/Jewel.json"),
    xJewel: require("../data/xJewel.json"),
    crystal: require("../data/crystal.json"),
    xCrystal: require("../data/xCrystal.json"),
    gardener: require("../data/MasterGardener.json"),
    gardenerV2: require("../data/MasterGardenerV2.json"),
    uni: require("../data/UniSwap.json"),
    erc20: require("../data/ERC20.json"),
    profile: require("../data/profile.json"),
    hero: require("../data/heroes.json"),
    auction: require("../data/auctions.json")
}

export const contractAddrs = {
    sd: {
        jewel: "0x72Cb10C6bfA5624dD07Ef608027E366bd690048F",
        xJewel: "0xa9ce83507d872c5e1273e745abcfda849daa654f",
        gardener: "0xdb30643c71ac9e2122ca0341ed77d09d5f99f924",
        profile: "0xabd4741948374b1f5dd5dd7599ac1f85a34cacdd",
        hero: "0x5f753dcdf9b1ad9aabc1346614d1f4746fd6ce5c",
        auction: "0x13a65B9F8039E2c032Bc022171Dc05B30c3f2892"
    },
    cv: {
        crystal: "0x04b9dA42306B023f3572e106B11D82aAd9D32EBb",
        xCrystal: "0x6e7185872bcdf3f7a6cbbe81356e50daffb002d2",
        gardener: "0x57Dec9cC7f492d6583c773e2E7ad66dcDc6940Fb",
        profile: "",
        heroes: " ",
        auctions: " "
    }
}

export const contracts = {
    sd: {
        token: new Contract(contractAddrs.sd.jewel, contractJson.jewel.abi, RPCs.sd),
        xToken: new Contract(contractAddrs.sd.xJewel,contractJson.xJewel.abi, RPCs.sd),
        gardener: new Contract(contractAddrs.sd.gardener, contractJson.gardener.abi, RPCs.sd),
        profile: new Contract(contractAddrs.sd.profile, contractJson.profile.abi, RPCs.sd),
        hero: new Contract(contractAddrs.sd.hero, contractJson.hero.abi, RPCs.sd),
        auction: new Contract(contractAddrs.sd.auction, contractJson.auction.abi, RPCs.sd)
    },
    cv: {
        token: new Contract(contractAddrs.cv.crystal,contractJson.crystal.abi, RPCs.cv),
        xToken: new Contract(contractAddrs.cv.xCrystal, contractJson.xCrystal.abi, RPCs.cv),
        gardener: new Contract(contractAddrs.cv.gardener, contractJson.gardenerV2.abi, RPCs.cv),
        profile: "",
        hero: "",
        auction: ""
    }
}

export const expansionSet = {
    sd: 0,
    cv: 0
}

export const expansionArraySet = {
    sd: [],
    cv: []
}

export const expansionObjSet = {
    sd: {},
    cv: {}
}