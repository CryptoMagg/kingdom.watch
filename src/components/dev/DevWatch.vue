<template>

  <div class="container m-3">


    <div class="container p-2">
      <p class="text-start">
        The purpose of this page is to provide transparency to the Defi Kingdoms community.
      </p>
      <p class="text-start">
        Below you will find some of the main wallets the developers behind Defi Kingdoms use internally. <br/>
        Every trade on the DEX sends part of the trade fee to these wallets.
      </p>
      <p class="text-start">
        The buttons show outgoing funds in the last 100 transactions per wallet.
      </p>
      <p class="text-start">
        The main dev wallet (0xa4b9...dbfb) is a multisig wallet and contains both the Dev Fund and the Quest Rewards.
        It can also be viewed at the multisig site
        <a href='https://multisig.harmony.one/#/safes/0xa4b9A93013A5590dB92062CF58D4b0ab4F35dBfB/transactions'
           target='_blank'>here</a>.
      </p>
      <p class="text-start">
        There is also a weekly <em>Whale Watch and Key Analytics Report</em> written by <strong>Samichpunch!</strong>&nbsp;
        <a @click="trackClick('Samichpunch')"  href="https://medium.com/@Samichpunch" target="_blank">https://medium.com/@Samichpunch</a>
      </p>

    </div>

    <div class="container">
      <table class="table table-striped">
        <thead>
        <tr>
          <th class="text-start">Wallet name</th>
          <th class="text-end">JEWEL</th>
          <!--        <th class="text-end">Transactions</th>-->
          <th class="text-start">Wallet description</th>
          <th>Explorer link</th>
        </tr>
        </thead>
        <tbody>
        <Entity
            desc="Quest Rewards (multisig)"
            address="0x5ca5bcd91929c7152ca577e8c001c9b5a185f568"/>
        <TransactionHistory address="0x5ca5bcd91929c7152ca577e8c001c9b5a185f568"/>

        <Entity
            desc="Weekly payouts + Quest Rewards (temporary) (multisig)"
            address="0xa4b9A93013A5590dB92062CF58D4b0ab4F35dBfB"/>
        <TransactionHistory address="0xa4b9A93013A5590dB92062CF58D4b0ab4F35dBfB"/>

        <Entity
            desc="Marketing/airdrops/prizes/promotions"
            address="0x3875e5398766a29c1B28cC2068A0396cba36eF99"/>
        <TransactionHistory address="0x3875e5398766a29c1B28cC2068A0396cba36eF99"/>

        <Entity
            desc="Short term bonuses for successful launch of Phase 2"
            address="0x79F0d0670D17a89f509Ad1c16BB6021187964A29"/>

        <TransactionHistory address="0x79F0d0670D17a89f509Ad1c16BB6021187964A29"/>

        <Entity
            desc="Team Payment Portal"
            address="0x2b12d9a2480d6dd9f71dabaa366c87134195b679"/>

        <TransactionHistory address="0x2b12d9a2480d6dd9f71dabaa366c87134195b679"/>

        <Entity
            desc="Fund for setting up cross-chain liquidity"
            address="0xa3f87fbcc69d2f97f528266c35b713e4bb12f962"/>
        <TransactionHistory address="0xa3f87fbcc69d2f97f528266c35b713e4bb12f962"/>

        <Entity
            desc="This is the JEWEL in the bank, backing the xJEWEL value"
            address="0xA9cE83507D872C5e1273E745aBcfDa849DAA654F"/>
        <TransactionHistory address="0xA9cE83507D872C5e1273E745aBcfDa849DAA654F"/>

        <Entity
            desc="Airdrops"
            address="0xa678d193fecc677e137a00fefb43a9ccffa53210"/>
        <TransactionHistory address="0xa678d193fecc677e137a00fefb43a9ccffa53210"/>

        <Entity
            desc="This is the old dev wallet for reference"
            address="0x1e3b6b278ba3b340d4be7321e9be6dfed0121eac"/>
        <TransactionHistory address="0x1e3b6b278ba3b340d4be7321e9be6dfed0121eac"/>

        </tbody>
      </table>
    </div>
    <WalletList/>
  </div>
  <div>
    <router-link to="/bank">Bank Watch moved here</router-link>
  </div>
</template>

<script>
import Entity from "@/components/dev/Entity";
import TransactionHistory from "@/components/dev/TransactionHistory";
import WalletList from "@/components/dev/WalletList";

export default {
  name: 'DevWatch',
  components: {
    Entity,
    TransactionHistory,
    WalletList
  },
  methods: {
    trackClick(dest) {
      this.$gtag.event(`FollowLink_${dest}`)
    },
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
