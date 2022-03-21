const feeSchedule = [
    {
        blocks: 302400 * 4,
        fee: 0.01
    },
    {
        blocks: 302400 * 2,
        fee: 0.25
    },
    {
        blocks: 86400 / 2 * 5,
        fee: 0.5
    },
    {
        blocks: 86400 / 2 * 3,
        fee: 1.0
    },
    {
        blocks: 86400 / 2,
        fee: 2.0
    },
    {
        blocks: 3600 / 2,
        fee: 4.0
    },
    {
        blocks: 1,
        fee: 8.0
    },
    {
        blocks: 0,
        fee: 25.0
    },
]

const reversedFeeSchedule = [...feeSchedule].reverse()

function getFee(blocks) {
    if(blocks < 0)
        return 0

    for(let info of feeSchedule) {
        if(blocks >= info.blocks)
            return info.fee
    }

    return 25.0
}

function blocksBeforeNextLevel(blocksNow) {
    if(blocksNow < 0)
        return 1e18

    for(let info of reversedFeeSchedule) {
        if(blocksNow < info.blocks)
            return info.blocks - blocksNow
    }

    return 0
}

function nextBetterFee(currentFee) {
    if(currentFee <= 0.01)
        return 0.01

    for(let info of reversedFeeSchedule) {
        if(info.fee < currentFee)
            return info.fee
    }

    return 25.0
}

export default {
    feeSchedule: feeSchedule,
    getFee: getFee,
    blocksBeforeNextLevel: blocksBeforeNextLevel,
    nextBetterFee: nextBetterFee
}