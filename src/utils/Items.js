import axios from "axios";

const goldPriceImport = require("@/data/ItemGoldPrice.json")

const TokenListURL = "https://raw.githubusercontent.com/tradescrow/token-lists/main/build/tokens/tradescrow-dfk.tokenlist.json"

let tokens = []
const items = new Map()
const itemAddresses = []
const goldPricesMapped = {}

export function GetTokenList() {
    if (tokens.length > 0) return

    axios.get(TokenListURL).then(r => {
        if (r.status === 200) {
            tokens = r.data.tokens.filter(token => token.chainId === 1666600000)
        } else {
            console.log(`Got status ${r.status} : ${r.statusText} while loading token list`)
        }
    })
}

export function getItem(address) {
    const _items = items.size > 0 ? items : mapItems()
    const item = {
        ..._items.has(address) ? _items.get(address) : {name:"Unknown item", address}
    }
    const goldPrices = mappedGoldPrices()

    item["goldPrice"] = item.address && goldPrices[item.address]
        ? goldPrices[item.address]["gold"]
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
        itemAddresses.push(address)
    }
    return itemAddresses
}

function mapItems() {
    for (let token of tokens) {
        items.set(token.address, token)
    }
    return items
}

function mappedGoldPrices() {
    if(goldPricesMapped.size > 0)
        return goldPricesMapped

    for(const [addr, obj] of Object.entries(goldPriceImport))
        goldPricesMapped[addr] = obj

    return goldPricesMapped
}
