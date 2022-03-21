const tokens = require("@/data/tokens.json")
const goldPriceImport = require("@/data/ItemGoldPrice.json")

const items = new Map()
const itemAddresses = []
const goldPricesMapped = {}

export function getItem(address) {
    const _items = items.size > 0 ? items : mapItems()

    const item = {
        ..._items.has(address) ? _items.get(address) : {name:"Unknown item", address}
    }
    const goldPrices = mappedGoldPrices()

    item["goldPrice"] = item.address && goldPrices[item.address.toLowerCase()]
        ? goldPrices[item.address.toLowerCase()]["gold"]
        : 0
    if(item.name === "Unknown item") console.info(address)
    return item
}

export function getAllItemAddresses() {
    if (itemAddresses.length > 0) {
        return itemAddresses
    }

    const _items = items.size > 0 ? items : mapItems()

    for (const address of _items.keys()) {
        itemAddresses.push(address.toLowerCase())
    }

    return itemAddresses
}

function mapItems() {

    for (let token of tokens.tokens) {
        items.set(token.address.toLowerCase(), token)
    }

    return items
}

function mappedGoldPrices() {
    if(goldPricesMapped.size > 0)
        return goldPricesMapped

    for(const [addr, obj] of Object.entries(goldPriceImport))
        goldPricesMapped[addr.toLowerCase()] = obj

    return goldPricesMapped
}
