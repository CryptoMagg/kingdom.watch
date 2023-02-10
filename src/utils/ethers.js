const { Contract, providers, utils } = require('ethers')
const { JsonRpcProvider } = providers
export const { formatUnits, formatEther } = utils

export const RPCs = {
    sd: new JsonRpcProvider('https://harmony-0-rpc.gateway.pokt.network'),
    cv: new JsonRpcProvider('https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc'),
    sd2: new JsonRpcProvider('https://klaytn.rpc.defikingdoms.com/')
}


//https://public-node-api.klaytnapi.com/v1/cypress
export const contractJson = {
    jewel: require("../data/Jewel.json"),
    xJewel: require("../data/xJewel.json"),
    crystal: require("../data/crystal.json"),
    xCrystal: require("../data/xCrystal.json"),
    gardener: require("../data/MasterGardener.json"),
    gardenerV2: require("../data/MasterGardenerV2.json"),
    gardenerV3: require("../data/MasterGardenerV3.json"),
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
        wjewel: "0xCCb93dABD71c8Dad03Fc4CE5559dC3D89F67a260",
        xCrystal: "0x6e7185872bcdf3f7a6cbbe81356e50daffb002d2",
        gardener: "0x57Dec9cC7f492d6583c773e2E7ad66dcDc6940Fb",
        profile: "0xC4cD8C09D1A90b21Be417be91A81603B03993E81",
        hero: "0xEb9B61B145D6489Be575D3603F4a704810e143dF",
        auction: "0xc390fAA4C7f66E4D62E59C231D5beD32Ff77BEf0",
    },
    sd2: {
			jade: "0xB3F5867E277798b50ba7A71C0b24FDcA03045eDF",
			jewel: "0x30C103f8f5A3A732DFe2dCE1Cc9446f545527b43",
			sjewel: "0xaA8548665bCC12C202d5d0C700093123F2463EA6",
			gardener: "0xad2ea7b7e49be15918E4917736E86ff7feA57a6A",
			profile: "0xe1b8C354BE50357c2ab90A962254526d08aF0D2D",
			hero: "0x268CC8248FFB72Cd5F3e73A9a20Fa2FF40EfbA61",
			auction: "0x7F2B66DB2D02f642a9eb8d13Bc998d441DDe17A8"
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
        hero: new Contract(contractAddrs.cv.hero, contractJson.hero.abi, RPCs.cv),
        profile: new Contract(contractAddrs.cv.profile, contractJson.profile.abi, RPCs.cv),
        auction: new Contract(contractAddrs.cv.auction, contractJson.auction.abi, RPCs.cv)
    },
    sd2: {
        token: new Contract(contractAddrs.sd2.jade,contractJson.crystal.abi, RPCs.sd2),
        jewel: new Contract(contractAddrs.sd2.jewel,contractJson.uni.abi, RPCs.sd2),
        gardener: new Contract(contractAddrs.sd2.gardener, contractJson.gardenerV3.abi, RPCs.sd2),
        hero: new Contract(contractAddrs.sd2.hero, contractJson.hero.abi, RPCs.sd2),
        profile: new Contract(contractAddrs.sd2.profile, contractJson.profile.abi, RPCs.sd2),
        auction: new Contract(contractAddrs.sd2.auction, contractJson.auction.abi, RPCs.sd2)
    }
}

export const expansionSet = {
    sd: 0,
    cv: 0,
	sd2: 0
}

export const expansionArraySet = {
    sd: [],
    cv: [],
	sd2: []
}

export const expansionObjSet = {
    sd: {},
    cv: {},
	sd2: {}
}
