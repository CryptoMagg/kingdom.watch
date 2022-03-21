function timeSpanStringSeconds(seconds, stringIfZero) {
    if(seconds === 0 && stringIfZero.length > 0)
        return stringIfZero

    if (seconds < 0)
        return "past time"
    else if (seconds < 60)
        return "imminent"
    else if (seconds < 600)
        return "less than 10 minutes"
    else if (seconds < 3600)
        return "about " + (seconds / 60).toFixed(1) + " minutes"
    else if (seconds < 86400)
        return "about " + (seconds / 3600).toFixed(1) + " hours"
    else if(seconds < 7 * 86400)
        return "about " + (seconds / 86400).toFixed(1) + " days"
    else if(seconds < 30 * 86400)
        return "about " + (seconds / (7 *86400)).toFixed(1) + " weeks"
    else if(seconds < 60 * 86400)
        return "about " + (seconds / (30 *86400)).toFixed(1) + " months"
    else
        return "about " + (seconds / (30 *86400)).toFixed(1) + " months"
}

function timeSpanStringBlocks(blocks, stringIfZero, blockTime) {
    return timeSpanStringSeconds( blocks * blockTime, stringIfZero)
}

export default {
    timeSpanStringSeconds: timeSpanStringSeconds,
    timeSpanStringBlocks: timeSpanStringBlocks
}