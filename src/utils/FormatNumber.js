function formatNumber(num, prefix, suffix, decimals) {

    {
        if (isNaN(num)) {
            return null
        }
    }

    let prefixString = ""

    if (prefix)
        prefixString = prefix

    let suffixString = ""
    if (suffix)
        suffixString = suffix

    let defaultDecimals = 2

    if (!isNaN(decimals))
        defaultDecimals = decimals

    let numString

    const absNum = Math.abs(num)
    if (absNum === 0)
        numString = "0.00"
    else if (absNum < 0.001)
        numString = absNum.toFixed(6)
    else if (absNum < 0.01)
        numString = absNum.toFixed(4)
    else if (absNum < 0)
        numString = absNum.toFixed(3)
    else if (absNum > 1000)
        numString = absNum.toFixed(0).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    else if (!isNaN(absNum) && !!absNum)
        numString = absNum.toFixed(defaultDecimals).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    else {
        return null

    }
    let minus = ""
    if (num < 0) {
        minus = '-'

    }
    return prefixString + minus + numString + suffixString
}

module.exports = formatNumber
