import React, {Component} from 'react';
import {generateMnemonic} from 'bip39'
import {randomBytes} from 'randombytes'
import axios from 'axios';
import { Button, Intent, FormGroup, InputGroup} from "@blueprintjs/core";
import "../node_modules/@blueprintjs/core/lib/css/blueprint.css";
import "../node_modules/@blueprintjs/icons/lib/css/blueprint-icons.css";
import "../node_modules/normalize.css/normalize.css";

// const WALLET_API_URL = 'http://localhost:8010/proxy';
const MNEMONIC_STRENGTH = 160;

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mnemonic: ["kitchen", "curve", "symptom", "love", "giggle", "give", "plate", "nature", "speak", "grace", "fantasy", "october", "pitch", "want", "example"],
            passphrase: 'z4B8CBTLNjJWZFMQvJ',
            name: 'Tickets Wallet',
            walletId: '10ebdd59bad44d1a01fdb1555153c1d2ebea6ba1',
            walletInfo: "",
            walletAddresses: undefined,
            WALLET_API_URL: 'http://localhost:8070/proxy'
        };

    }

    getNetworkSyncState = () => {

        axios({
            method: 'get',
            url: '/network/information',
            baseURL: this.state.WALLET_API_URL

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


    deleteWalletId = async (walletId) => {
        try {
            const response = await axios({
                method: 'delete',
                url: `/wallets/${walletId}`,
                baseURL: this.state.WALLET_API_URL,
                headers: {'Content-Type': 'application/json'},

            })

            if (response.status === 204) {
                console.log(`walletId deleted: ${walletId}`)
                return true

            } else {
                console.log(response)
                return false
            }

        } catch(err) {
            console.log(err)
            return false
        }
    }

    createWallet = async (mnemonicArr) => {

        let retriesLeft  = 5;

        const mnemonicArray = mnemonicArr || (generateMnemonic(MNEMONIC_STRENGTH, randomBytes)).split(' ')
        this.setState({mnemonic: mnemonicArray})

        let payload = {}

        payload.name = this.state.name;
        payload.mnemonic_sentence = mnemonicArray;
        payload.passphrase = this.state.passphrase;
        payload.address_pool_gap = 20;

        console.log(payload)
        const req = JSON.stringify(payload);

        try {
            const response = await axios({
                method: 'post',
                url: '/wallets',
                baseURL: this.state.WALLET_API_URL,
                data: req,
                headers: {'Content-Type': 'application/json'},

            })

            if (response.status === 201) {
                console.log(`wallet has been created with id: ${response.data.id}`)
                this.setState({walletId: response.data.id})

            } else {
                console.log(response)
            }

        } catch(err) {


            /**
             * Catch the errors where the wallet already exists
             * then delete the wallet and creat it again by calling
             * the createWallet recursively
             */
            if (err.response.status === 409) {
                const message = err.response.data.message;
                let walletId = message.replace("This operation would yield a wallet with the following id:", "")
                walletId = walletId.replace("However, I already know of a wallet with this id.", "")
                walletId = walletId.trim();

                console.log(`walletId already exists: ${walletId}`)
                console.log(`it will be deleted and a new one created`)

                const delStatus = await this.deleteWalletId(walletId);
                if (delStatus && retriesLeft > 0) {
                    retriesLeft = retriesLeft - 1;
                    await this.createWallet(mnemonicArr)
                }


            } else {
                console.log(err);
            }

        }


    }

    getWalletSnapshot = (walletId) => {

        axios({
            method: 'get',
            url: `/wallets/${walletId}`,
            baseURL: this.state.WALLET_API_URL

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
            baseURL: this.state.WALLET_API_URL

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
            baseURL: this.state.WALLET_API_URL

        }).then((response) => {

            console.log(response)

        }).catch(function (err) {
            console.log(err);
        })

    }

    getWalletInfo = (walletId) => {

        axios({
            method: 'get',
            url: `/wallets/${walletId}`,
            baseURL: this.state.WALLET_API_URL

        }).then((response) => {

            console.log(response)
            this.setState({walletInfo: response.data})

        }).catch(function (err) {
            console.log(err);
        })

    }

    getWalletAddresses = (walletId) => {

        axios({
            method: 'get',
            url: `/wallets/${walletId}/addresses`,
            baseURL: this.state.WALLET_API_URL

        }).then((response) => {

            // console.log(response)
            this.setState({walletAddresses: response.data})

        }).catch(function (err) {
            console.log(err);
        })

    }


    getAccountPublicKey = (walletId) => {

        axios({
            method: 'get',
            url: `/wallets/${walletId}/keys`,
            baseURL: this.state.WALLET_API_URL

        }).then((response) => {

            console.log(response)

        }).catch(function (err) {
            console.log(err);
        })

    }

    componentDidMount() {

        // this.getAccountPublicKey(this.state.walletId)
        this.getWalletsList()

        this.runInterval  = setInterval(() => {
            this.getWalletInfo(this.state.walletId);
            this.getWalletAddresses(this.state.walletId);
        }, 10000);

    }

    componentWillUnmount() {
        clearInterval(this.runInterval);
    }

    render() {
        return (


            <div style={{margin: "20px"}}>


                <FormGroup
                    helperText={<div className="ud-text-gray-300">url running the cardano-wallet service</div>}
                    label="Cardano-Wallet URL"
                >
                    <InputGroup
                        onChange={(str) => {
                            this.setState({WALLET_API_URL: str.target.value})
                        }}
                        value={this.state.WALLET_API_URL}
                    />
                </FormGroup>

                <FormGroup
                    label="Passphrase"
                >
                    <InputGroup
                        onChange={(str) => {
                            this.setState({passphrase: str.target.value})
                        }}
                        value={this.state.passphrase}
                    />
                </FormGroup>

                <div className="m-16">
                    <Button intent={Intent.PRIMARY}
                            disabled={false}
                            onClick={() => {
                                this.createWallet();
                            }}
                            style={{ marginTop: "20px" }}>
                        Create Wallet
                    </Button>
                </div>

                <div style={{marginTop: "20px"}}>
                    <p>mnemonic: {this.state.mnemonic.toString()}</p>
                    <p>walletId: {this.state.walletId}</p>
                </div>

                <div style={{marginTop: "20px"}}>
                    <p>status: {this.state.walletInfo?.state?.status}</p>
                    <p>progress: {this.state.walletInfo?.state?.progress?.quantity}%</p>
                </div>

                <div style={{marginTop: "20px"}}>
                    <p style={{fontWeight: "bold"}}>Wallet Address</p>
                    <pre>
                        {JSON.stringify(this.state.walletAddresses, undefined, 2)}
                    </pre>
                </div>

                <div style={{marginTop: "20px"}}>
                    <p style={{fontWeight: "bold"}}>Wallet Info</p>
                    <pre>
                        {JSON.stringify(this.state.walletInfo, undefined, 2)}
                    </pre>
                </div>

            </div>



        )
    }

}

export default App;
