const firstBlock = {
    sd: 16350367,
    cv: 8943
}
const blocksPerEpoch = {
    sd: 302400,
    cv: 302400
}

const blockSpeedSeconds = {
    sd: 2.0,
    cv: 2.0
}

const unlockStart = {
    sd: 5,
    cv: 5
}
const unlockWeeklyIncrease = {
    sd: 2,
    cv: 2
}

const multiplierSchedule = {
    sd: {
        1: 256,
        2: 128,
        3: 96,
        4: 64,
        5: 56,
        6: 48,
        7: 40,
        8: 32,
        9: 28,
        10: 24,
        11: 20,
        12: 16,
        13: 15,
        14: 14,
        15: 13,
        16: 12,
        17: 11,
        18: 10,
        19: 9,
        20: 8,
        36: 4
    },
    cv: {
        1: 32,
        2: 24,
        3: 20,
        4: 16,
        5: 14,
        6: 12,
        7: 10,
        8: 10,
        9: 8,
        10: 8,
        11: 6,
        12: 6,
        13: 4,
        14: 4,
        15: 4,
        16: 4,
        17: 3,
        18: 3,
        19: 3,
        20: 3,
        21: 2,
        101: 1
    }
}

const getCurrentEpoch = (currentBlock, expansion) => {
    const epoch = currentEpoch(currentBlock, expansion)

    return epochData(epoch, expansion)
}

function currentEpoch(currentBlock, expansion) {
    const diff = currentBlock - firstBlock[expansion]

    if(diff < 0)
        throw `Invalid current block ${currentBlock} is less than first block ${firstBlock[expansion]}`

    return Math.floor(diff/blocksPerEpoch[expansion]) + 1
}

function epochStartBlock(epoch, expansion) {
    return firstBlock[expansion] + (blocksPerEpoch[expansion] * (epoch - 1))
}

function secondsLeftUntilEpoch(currentBlock, epoch, expansion) {
    return (epochStartBlock(epoch, expansion) - currentBlock) * blockSpeedSeconds[expansion]
}

function epochData(epoch, expansion) {
    return {
        epoch: epoch,
        epochStart: epochStartBlock(epoch, expansion),
        unlock: Math.min(
            100,
            (epoch * unlockWeeklyIncrease[expansion]) + unlockStart[expansion] - 2
        ),
        multiplier: multiplierSchedule[expansion][epoch<20?epoch:epoch<36?20:36]
    }
}

function timeLeftUntilEpochString(currentBlock, epoch, expansion) {

    const nextEpochSeconds = secondsLeftUntilEpoch(currentBlock, epoch, expansion)

    if (nextEpochSeconds < 0)
        return "past time"
    else if (nextEpochSeconds < 60)
        return "imminent"
    else if (nextEpochSeconds < 600)
        return "less than 10 minutes"
    else if (nextEpochSeconds < 3600)
        return "about " + (nextEpochSeconds / 60).toFixed(1) + " minutes"
    else if (nextEpochSeconds < 86400)
        return "about " + (nextEpochSeconds / 3600).toFixed(1) + " hours"
    else if(nextEpochSeconds < 7 * 86400)
        return "about " + (nextEpochSeconds / 86400).toFixed(1) + " days"
    else if(nextEpochSeconds < 30 * 86400)
        return "about " + (nextEpochSeconds / (7 *86400)).toFixed(1) + " weeks"
    else
        return "about " + (nextEpochSeconds / (30 *86400)).toFixed(1) + " months"
}


export default {
    getCurrentEpoch: getCurrentEpoch,
    epochData: epochData,
    secondsLeftUntilEpoch: secondsLeftUntilEpoch,
    timeLeftUntilEpochString: timeLeftUntilEpochString
}
