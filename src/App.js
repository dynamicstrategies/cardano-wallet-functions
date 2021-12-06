import React, {Component} from 'react';
import {generateMnemonic} from 'bip39'
import {randomBytes} from 'randombytes'
import axios from 'axios';

const WALLET_API_URL = 'https://cnode.dynamicstrategies.io:8050/v2';
const MNEMONIC_STRENGTH = 160;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mnemonic: [],
      passphrase: 'z4B8CBTLNjJWZFMQvJ',
      name: 'Beam Wallet',
      walletId: undefined,
    };

  }

  createMnemonic = () => {
    const mnemonicStr = generateMnemonic(MNEMONIC_STRENGTH, randomBytes);
    const mnemonicArray = mnemonicStr.split(' ')
    this.setState({mnemonic: mnemonicArray}, () => {
      this.createWallet()
    })
  }

  createWallet = async () => {

    let payload = {}

    payload.name = this.state.name;
    payload.mnemonic_sentence = this.state.mnemonic;
    payload.passphrase = this.state.passphrase;
    payload.address_pool_gap = 20;

    console.log(payload)


    // try{
    //   const raw = await fetch(WALLET_API_URL + '/wallets', {
    //     method: 'POST', // *GET, POST, PUT, DELETE, etc.
    //     mode: 'cors', // no-cors, *cors, same-origin
    //     cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    //     credentials: 'same-origin', // include, *same-origin, omit
    //     headers: {
    //       'Content-Type': 'application/json'
    //       // 'Content-Type': 'application/x-www-form-urlencoded',
    //     },
    //     redirect: 'follow', // manual, *follow, error
    //     referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    //     body: JSON.stringify(payload) // body data type must match "Content-Type" header
    //   });
    //
    //   // const response = JSON.parse(raw)
    //   console.log(raw)
    //
    // } catch(err) {
    //   console.log(err)
    // }


  }


  componentDidMount() {

    this.createMnemonic()

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
