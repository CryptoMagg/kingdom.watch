const firstBlock = 8943
const blocksPerEpoch = 302400

const blockSpeedSeconds = 2.0

const unlockStart = 5
const unlockWeeklyIncrease = 2

const multiplierSchedule = {
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

const getCurrentEpoch = (currentBlock) => {
    console.log(currentBlock)
    const epoch = currentEpoch(currentBlock)

    return epochData(epoch)
}

function currentEpoch(currentBlock) {
    const diff = currentBlock - firstBlock

    if(diff < 0)
        throw `Invalid current block ${currentBlock} is less than first block ${firstBlock}`

    return Math.floor(diff/blocksPerEpoch) + 1
}

function epochStartBlock(epoch) {
    return firstBlock + (blocksPerEpoch * (epoch - 1))
}

function secondsLeftUntilEpoch(currentBlock, epoch) {
    return (epochStartBlock(epoch) - currentBlock) * blockSpeedSeconds
}

function epochData(epoch) {
    const data = {}
    data["epoch"] = epoch
    data["epochStart"] = epochStartBlock(epoch)

    data["unlock"] = Math.min(
        100,
        (epoch * unlockWeeklyIncrease) + unlockStart - 2
    )

    if(epoch < 20)
        data["multiplier"] = multiplierSchedule[epoch]
    else if(epoch < 36)
        data["multiplier"] = multiplierSchedule[20]
    else
        data["multiplier"] = multiplierSchedule[36]

    return data
}

function timeLeftUntilEpochString(currentBlock, epoch) {

    const nextEpochSeconds = secondsLeftUntilEpoch(currentBlock, epoch)

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
    else if(nextEpochSeconds < 60 * 86400)
        return "about " + (nextEpochSeconds / (30 *86400)).toFixed(1) + " months"
    else
        return "about " + (nextEpochSeconds / (30 *86400)).toFixed(1) + " months"
}


export default {
    getCurrentEpoch: getCurrentEpoch,
    epochData: epochData,
    secondsLeftUntilEpoch: secondsLeftUntilEpoch,
    timeLeftUntilEpochString: timeLeftUntilEpochString
}
