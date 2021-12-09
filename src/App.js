import React, {Component} from 'react';
import {generateMnemonic} from 'bip39'
import {randomBytes} from 'randombytes'
import axios from 'axios';

// const WALLET_API_URL = 'https://cnode.dynamicstrategies.io:8050/v2';
const WALLET_API_URL = 'http://localhost:8010/proxy';
const MNEMONIC_STRENGTH = 160;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mnemonic: [],
      passphrase: 'z4B8CBTLNjJWZFMQvJ',
      name: 'Beam Wallet',
      walletId: 'f1ea9199479041337bd9db20edcc481cd2fdea68',
    };

  }

  getNetworkSyncState = () => {

    axios({
      method: 'get',
      url: '/network/information',
      baseURL: WALLET_API_URL

    }).then((response) => {

      if (response.status === 200) {
        console.log(`sync status: ${response.data.sync_progress.status}`)
      } else {
        console.log(response)
      }

    }).catch(function (err) {
      console.log(err);
    })

  }

  createWallet = () => {

    const mnemonicStr = generateMnemonic(MNEMONIC_STRENGTH, randomBytes);
    const mnemonicArray = mnemonicStr.split(' ')
    this.setState({mnemonic: mnemonicArray})

    let payload = {}

    payload.name = this.state.name;
    payload.mnemonic_sentence = mnemonicArray;
    payload.passphrase = this.state.passphrase;
    payload.address_pool_gap = 20;

    console.log(payload)

    const req = JSON.stringify(payload);

    console.log(req)

    axios({
      method: 'post',
      url: '/wallets',
      baseURL: WALLET_API_URL,
      data: req,
      headers: {'Content-Type': 'application/json'},

    }).then((response) => {

      if (response.status === 201) {
        console.log(`wallet has been created with id: ${response.data.id}`)
        this.setState({walletId: response.data.id})
      } else {
        console.log(response)
      }

    }).catch(function (err) {
      console.log(err);
    })

  }

  getWalletSnapshot = (walletId) => {

    axios({
      method: 'get',
      url: `/wallets/${walletId}`,
      baseURL: WALLET_API_URL

    }).then((response) => {

      console.log(response)

    }).catch(function (err) {
      console.log(err);
    })

  }

  getWalletsList = () => {

    axios({
      method: 'get',
      url: `/wallets`,
      baseURL: WALLET_API_URL

    }).then((response) => {

      console.log(response)

    }).catch(function (err) {
      console.log(err);
    })

  }



  getWalletAssets = (walletId) => {

    axios({
      method: 'get',
      url: `/wallets/${walletId}/assets`,
      baseURL: WALLET_API_URL

    }).then((response) => {

      console.log(response)

    }).catch(function (err) {
      console.log(err);
    })

  }

  getAccountPublicKey = (walletId) => {

    axios({
      method: 'get',
      url: `/wallets/${walletId}/keys`,
      baseURL: WALLET_API_URL

    }).then((response) => {

      console.log(response)

    }).catch(function (err) {
      console.log(err);
    })

  }

  componentDidMount() {

    // this.getAccountPublicKey(this.state.walletId)
    this.getWalletsList()

  }

  componentWillUnmount() {

  }

  render() {
    return (

        <div>



        </div>


    )
  }

}

export default App;
