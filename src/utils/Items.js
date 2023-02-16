// import axios from "axios";
import {ethers} from "ethers";

const goldPriceImport = require("@/data/ItemGoldPrice.json")
const TokenListData_Harmony = require("@/data/dfk.tokenlist.harmony.json");
const TokenListData_DFKChain = require("@/data/dfk.tokenlist.dfkchain.json");
const TokenListData_Klaytn = require("@/data/dfk.tokenlist.klaytn.json");

let tokens = []
const items = new Map()
const itemAddresses = []
const itemDetails = []
const goldPricesMapped = {}

export function GetTokenList() {
  if (tokens.length > 0) return
  // tokens = TokenListData_DFKChain.tokens;
  tokens = TokenListData_Harmony.tokens.concat(TokenListData_DFKChain.tokens).concat(TokenListData_Klaytn.tokens);
}

export function getItem(address) {
    address = ethers.utils.getAddress(address);
    const _items = items.size > 0 ? items : mapItems()
    const item = {
        ..._items.has(address) ? _items.get(address) : {name:"Unknown item", address}
    }
    const goldPrices = mappedGoldPrices()

    item["goldPrice"] = item.address && goldPrices[item.symbol]
        ? goldPrices[item.symbol]["gold"]
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

export function getAllItemDetails(){
  if (itemDetails.length > 0) {
      return itemDetails;
  }

  const _items = items.size > 0 ? items : mapItems();

  for (let item of _items.values()) {
      itemDetails.push(item);
  }
  return itemDetails;
}

function mapItems() {
    for (let token of tokens) {
        items.set(token.address + token.chainId, token)
    }
    return items
}

export function mappedGoldPrices() {
    if(goldPricesMapped.size > 0)
        return goldPricesMapped

    for(const [addr, obj] of Object.entries(goldPriceImport))
        goldPricesMapped[addr] = obj

    return goldPricesMapped
}
