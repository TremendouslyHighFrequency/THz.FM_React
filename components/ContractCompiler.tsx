import React, { useState, useEffect } from 'react';
import { compile } from '@fleet-sdk/compiler';
import { ErgoAddress, OutputBuilder, Network, TransactionBuilder } from "@fleet-sdk/core";
import { SByte, SColl, SLong, SPair } from '@fleet-sdk/serializer'; 
import { sha256, utf8 } from '@fleet-sdk/crypto'; 
import { BOOTSTRAP_TEMPLATE } from '../contracts/BootstrapTemplate';


const ContractCompiler: React.FC = () => {
    const [bootstrapScript, setBootstrapScript] = useState<string>(BOOTSTRAP_TEMPLATE);
    const [compiledBootstrap, setCompiledBootstrap] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [timestamp, setTimestamp] = useState<number>(Date.now());
    const [txId, setTxId] = useState<string | null>(null);
    const [secondTxId, setSecondTxId] = useState<string | null>(null);
    const [buyTxId, setBuyTxId] = useState<string | null>(null);
    const [saleTxId, setSaleTxId] = useState<string | null>(null);
    let bootstrapInputBox = null;
    const [compiledSale, setCompiledSale] = useState<string | null>(null); 
    const [compiledIndicationToWithdraw, setCompiledIndicationToWithdraw] = useState<string | null>(null);  
    const [compiledWithdrawToken, setCompiledWithdrawToken] = useState<string | null>(null);
    
    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimestamp(Date.now());
        }, 1000);
        
        return () => clearInterval(intervalId);
    }, []);

    async function compileToP2S(script: string): Promise<string> {
        const compiledAddress = compile(script, { version: 0, includeSize: false });
        const p2sAddress = compiledAddress.toAddress(Network.Mainnet).toString(Network.Mainnet);
        console.log("P2S Address:", p2sAddress);
        return p2sAddress;
    }

    const handleCompile = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const p2sBootstrap = await compileToP2S(bootstrapScript);
            console.log("Bootstrap P2S:", p2sBootstrap);
            setCompiledBootstrap(p2sBootstrap.toString());
        } catch (err) {
            console.error("Compilation Error:", err);
            setError(`Compilation Error: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCompileSale = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const p2sSale = await compileToP2S(saleScript);
            console.log("Sale P2S:", p2sSale);
            setCompiledSale(p2sSale.toString());
        } catch (err) {
            console.error("Compilation Error:", err);
            setError(`Compilation Error: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCompileIndicationToWithdraw = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const p2sIndicationToWithdraw = await compileToP2S(indicationToWithdrawScript);
            console.log("Indication to Withdraw P2S:", p2sIndicationToWithdraw);
            setCompiledIndicationToWithdraw(p2sIndicationToWithdraw.toString());
        } catch (err) {
            console.error("Compilation Error:", err);
            setError(`Compilation Error: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCompileWithdrawToken = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const p2sWithdrawToken = await compileToP2S(withdrawTokenScript);
            console.log("Withdraw Token P2S:", p2sWithdrawToken);
            setCompiledWithdrawToken(p2sWithdrawToken.toString());
        } catch (err) {
            console.error("Compilation Error:", err);
            setError(`Compilation Error: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };





    
    //////////////////////////





    
    async function initiateBootstrap(setLoading) {
        try {
            setLoading(true);
            console.log('Initiating bootstrap...');  
    
            if (await ergoConnector.nautilus.connect()) {
                console.log('Nautilus connected...');  
                const height = await ergo.get_current_height();
                console.log(`Current height: ${height}`);  
    
                const recipient = "2SApbDZd8MwJT2odz5kU93Rsgi6ukLtbS3GfbvYRsz6yKEnpxZBrFKb1an9tCPDpeENjPnX1wjCLQckSSfgrCebw42fBQfAuCcVA11ChFXGgbKQ4b4pGr1B13H234vSj6d5s9RH795ZXmuqnACjiF2c7M21KPspT7jaLgi7CVMbYfPAqdexDfoEyC3HzJD1DFUrNENh5i1mmAdPjQx1JXEvZL8rp7tEYUQf2ADW8zhaEu3ZLqpkVjkvjSVBbY5gcSWovsSg3wLCrUWZkJXg3x3z3XN2MariRNDxfdzvzYAe8HH2Wt5qQWdo7abFSSQxuCZvbHqBzqBTDQavymm7XFrMPsRQkGWV9MXtpVjF23pxyxhBShFfxDTmwyyRANbNXQq2Rsm98MdeicpyRhsjVJf9Ydz9QdQFXVKDvUtGRnFULqQTKqCrUT82Dc4kv6qT8HUMFUX8SCmnCYoPePdCGy9JPHZ8ELbJxhLk1H3GaDP3Ue9giM32d2xFEk4c44kd63j99GCNQJFR63GfjtqP9wdvXgZzoQQYcLJDCyWehM62xpMNkWWWyRskE4g9NM8fhNg65vJT2VBJpu6ztjwoyX7yd95qsxDyf3QaxtfN3Pu55MyAx3zca5vv1vFhr4MEvPD24zpz28rShaveEDx8iL93CKSdR3bKiyZnJPX6ppjR7xve9x9UfDevoMQQ2sQyeptgm17QP66HBd3HWKzJb8AC9Sk4XAU7yMfCbNij2h7seDS6nzhtnWNCmiMuSTZ3QdQf6fh3px5x1V2H9xedbZXU8ukV5";
                console.log(`Recipient set to: ${recipient}`);  
                
                let artistErgoAddress = await ergo.get_change_address();
                console.log(`Artist Ergo Address: ${artistErgoAddress}`);
                let artistErgoTreeHex: string = ErgoAddress.fromBase58(artistErgoAddress).ergoTree;
                
                let value = "1000000";

                const tokenId = "0fdb7ff8b37479b6eb7aab38d45af2cfeefabbefdc7eebc0348d25dd65bc2c91";
                const token2 = "8c7ff0e5f1970be69aa3b9ad0428b398e9a9446b505f457f0d4ac6c9acfbeb93";

                let r4 = SColl(SPair(SLong, SColl(SByte)), [[value, artistErgoTreeHex]]).toHex();
                console.log("R4:", r4);
                let r5 = SColl(SColl(SByte), [tokenId]).toHex();
                console.log("R5:", r5);
                let r6 = SLong("1").toHex();
                console.log("R6:", r6);

                console.log('Creating transaction builder...');  
                const unsignedTx = new TransactionBuilder(height)
                .from(await ergo.get_utxos())
                .to(
                    new OutputBuilder('1000000', recipient)
                        .setAdditionalRegisters({
                            R4: r4,
                            R5: r5,
                            R6: r6
                        })
                        .addTokens({ 
                            tokenId: tokenId,  // Using the tokenId variable from earlier
                            amount: "1"  // Setting the amount to 1
                        })
                )
                .sendChangeTo(await ergo.get_change_address())
                .payMinFee()
                .build()
                .toEIP12Object();
                console.log('Transaction builder created...', unsignedTx);
                console.log('Transaction built, signing...');  
                const signedTx = await ergo.sign_tx(unsignedTx);
    
                console.log('Transaction signed, submitting...');  
                const txId = await ergo.submit_tx(signedTx);
    
                console.log("Your tx ID is:" + txId);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error initiating bootstrap:", error);
            console.error(error.stack);  
            setLoading(false);
        }
    };
    


      const handleInitiateTransaction = async () => {
        try {
            await initiateBootstrap(setIsLoading);
            setTxId("Transaction has been initiated. Check the console for the transaction ID.");
        } catch (err) {
            console.error("Transaction Error:", err);
            setError(`Transaction Error: ${err.message}`);
        }
    };

    async function withdrawFromContract(setLoading) {
        try {
            setLoading(true);
            console.log('Withdrawing from contract...');
            if (await ergoConnector.nautilus.connect()) {
                console.log('Nautilus connected...');  
                const height = await ergo.get_current_height();
                console.log(`Current height: ${height}`);  
                const thzNode = "9hKFHa886348VhfM1BRfLPKi8wwXMnyVqqmri9p5zPFE8qgMMui";
                const recipient = "2SApbDZd8MwJT2odz5kU93Rsgi6ukLtbS3GfbvYRsz6yKEnpxZBrFKb1an9tCPDpeENjPnX1wjCLQckSSfgrCebw42fBQfAuCcVA11ChFXGgbKQ4b4pGr1B13H234vSj6d5s9RH795ZXmuqnACjiF2c7M21KPspT7jaLgi7CVMbYfPAqdexDfoEyC3HzJD1DFUrNENh5i1mmAdPjQx1JXEvZL8rp7tEYUQf2ADW8zhaEu3ZLqpkVjkvjSVBbY5gcSWovsSg3wLCrUWZkJXg3x3z3XN2MariRNDxfdzvzYAe8HH2Wt5qQWdo7abFSSQxuCZvbHqBzqBTDQavymm7XFrMPsRQkGWV9MXtpVjF23pxyxhBShFfxDTmwyyRANbNXQq2Rsm98MdeicpyRhsjVJf9Ydz9QdQFXVKDvUtGRnFULqQTKqCrUT82Dc4kv6qT8HUMFUX8SCmnCYoPePdCGy9JPHZ8ELbJxhLk1H3GaDP3Ue9giM32d2xFEk4c44kd63j99GCNQJFR63GfjtqP9wdvXgZzoQQYcLJDCyWehM62xpMNkWWWyRskE4g9NM8fhNg65vJT2VBJpu6ztjwoyX7yd95qsxDyf3QaxtfN3Pu55MyAx3zca5vv1vFhr4MEvPD24zpz28rShaveEDx8iL93CKSdR3bKiyZnJPX6ppjR7xve9x9UfDevoMQQ2sQyeptgm17QP66HBd3HWKzJb8AC9Sk4XAU7yMfCbNij2h7seDS6nzhtnWNCmiMuSTZ3QdQf6fh3px5x1V2H9xedbZXU8ukV5";
                console.log(`Recipient set to: ${recipient}`);  
                
                let artistErgoAddress = await ergo.get_change_address();
                console.log(`Artist Ergo Address: ${artistErgoAddress}`);
                let artistErgoTreeHex: string = ErgoAddress.fromBase58(artistErgoAddress).ergoTree;
                
                let value = "1000000";

                const tokenId = "0fdb7ff8b37479b6eb7aab38d45af2cfeefabbefdc7eebc0348d25dd65bc2c91";
                const token2 = "8c7ff0e5f1970be69aa3b9ad0428b398e9a9446b505f457f0d4ac6c9acfbeb93";

                let r4 = SColl(SPair(SLong, SColl(SByte)), [[value, artistErgoTreeHex]]).toHex();
                console.log("R4:", r4);
                let r5 = SColl(SColl(SByte), [tokenId]).toHex();
                console.log("R5:", r5);
                let r6 = SLong("1").toHex();
                console.log("R6:", r6);

                const assetArray = "0400";
                console.log("Asset Array:", assetArray);

                const inputBox: InputBox =  {
                    "boxId": "c00efdbc4dbb0d568f9fdbbfaaaf7b17a42612cc0c69cbea314d0e2e27e349db",
                    "transactionId": "bfa53fe3af8233e5d6023ca719d47c3197857ed31fd28be3e5dfc8a30fcba9e0",
                    "blockId": "1f872a1d0ba37fd9ed0b435a2a5ce5baebf4563b3dd829452d6b7b942dd5af26",
                    "value": 1000000,
                    "index": 0,
                    "globalIndex": 32940536,
                    "creationHeight": 1097773,
                    "settlementHeight": 1097775,
                    "ergoTree": "101904000500040004000e0301b97b040208cd03704333b53273fd0cbec619124f04ba6019241756745273b3eff792e4d8ffc7c9040404020400040204020400010004000400040204fe01040604040580dac4090406040404000100d813d601b2a5730000d602c27201d603937202c2a7d6049299c17201c1a77301d605db6308a7d606b17205d607b4720573027206d608db63087201d609b4720873037206d60ae4c6a7040c410ed60be4c6a7051ad60ce4c6a70605d60de4c672010605d60eeded93720ae4c67201040c410e93720be4c67201051a93720c720dd60f7304d610b1a5d611b2a5730500d612c27211d613d07306d1ececededed720372049372077209720eededed93cb7202720faf720bd901140eae7208d901164d0eed938c7216017214928c721602720d720e95eded917210730791b1db6308b2a57308007309e6c6b2a5730a00070c410ed803d614b2a5730b00d615b2db63087214730c00d616e4c67214070c410eededed93cbc27214720fed938c721501c5a7938c7215027eb1721605937216720a93e4c67201074d0e7215730dededededed95937eb27212730e0004730f9372127213d801d614b1721293b472137310b17213b4721295917214731173127313721492c172117314959172107315d804d614b2a5731600d615e4c672140404d616b2db63087214731700d617b2720b721500eded93c272148cb2720a72150002ed938c7216017217928c721602720c93b57207d901184d0e948c7218017217b57209d901184d0e948c72180172177318720e72037204",
                    "address": "2SApbDZd8MwJT2odz5kU93Rsgi6ukLtbS3GfbvYRsz6yKEnpxZBrFKb1an9tCPDpeENjPnX1wjCLQckSSfgrCebw42fBQfAuCcVA11ChFXGgbKQ4b4pGr1B13H234vSj6d5s9RH795ZXmuqnACjiF2c7M21KPspT7jaLgi7CVMbYfPAqdexDfoEyC3HzJD1DFUrNENh5i1mmAdPjQx1JXEvZL8rp7tEYUQf2ADW8zhaEu3ZLqpkVjkvjSVBbY5gcSWovsSg3wLCrUWZkJXg3x3z3XN2MariRNDxfdzvzYAe8HH2Wt5qQWdo7abFSSQxuCZvbHqBzqBTDQavymm7XFrMPsRQkGWV9MXtpVjF23pxyxhBShFfxDTmwyyRANbNXQq2Rsm98MdeicpyRhsjVJf9Ydz9QdQFXVKDvUtGRnFULqQTKqCrUT82Dc4kv6qT8HUMFUX8SCmnCYoPePdCGy9JPHZ8ELbJxhLk1H3GaDP3Ue9giM32d2xFEk4c44kd63j99GCNQJFR63GfjtqP9wdvXgZzoQQYcLJDCyWehM62xpMNkWWWyRskE4g9NM8fhNg65vJT2VBJpu6ztjwoyX7yd95qsxDyf3QaxtfN3Pu55MyAx3zca5vv1vFhr4MEvPD24zpz28rShaveEDx8iL93CKSdR3bKiyZnJPX6ppjR7xve9x9UfDevoMQQ2sQyeptgm17QP66HBd3HWKzJb8AC9Sk4XAU7yMfCbNij2h7seDS6nzhtnWNCmiMuSTZ3QdQf6fh3px5x1V2H9xedbZXU8ukV5",
                    "assets": [
                        {
                            "tokenId": "0fdb7ff8b37479b6eb7aab38d45af2cfeefabbefdc7eebc0348d25dd65bc2c91",
                            "index": 0,
                            "amount": 1,
                            "name": "$Lambo",
                            "decimals": 0,
                            "type": "EIP-004"
                        }
                    ],
                    "additionalRegisters": {
                        "R4": "0c410e0180897a240008cd03f68e2d2a05f62d2dcb3db017c62fcdd92c554ff6f31cc5acccb2157c63b45238",
            "R5": "1a01200fdb7ff8b37479b6eb7aab38d45af2cfeefabbefdc7eebc0348d25dd65bc2c91",
            "R6": "0502"
                    },
                    "mainChain": true
                };
               

                console.log('Creating transaction builder...');  
                const unsignedTx = new TransactionBuilder(height)
                .from([inputBox, ...await ergo.get_utxos()])
                .to(
                    new OutputBuilder('1000000', recipient)
                    .setAdditionalRegisters({
                        R4: r4,
                        R5: r5,
                        R6: r6
                    })
                )
                .to(
                    new OutputBuilder('10000000', thzNode)
                )
                .to(
                    new OutputBuilder('1000000', artistErgoAddress)
                        .setAdditionalRegisters({
                            R4: assetArray,
                        })
                        .addTokens({ 
                            tokenId: tokenId,  // Using the tokenId variable from earlier
                            amount: "1"  // Setting the amount to 1
                        })
                )
                .sendChangeTo(await ergo.get_change_address())
                .payMinFee()
                .build()
                .toEIP12Object();
                console.log('Transaction builder created...', unsignedTx);
                console.log('Transaction built, signing...');  
                const signedTx = await ergo.sign_tx(unsignedTx);
    
                console.log('Transaction signed, submitting...');  
                const txId = await ergo.submit_tx(signedTx);
    
                console.log("Your tx ID is:" + txId);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error initiating bootstrap:", error);
            console.error(error.stack);  
            setLoading(false);
        }
    };


    async function sendFilesToContract(setLoading) {
        try {
            setLoading(true);
            console.log('Sending files to contract...');  
    
            if (await ergoConnector.nautilus.connect()) {
               
                const inputBox: InputBox = {
                    "boxId": "ccdb24754634fefbd5a5ed587fa997a80fdeec9db73bc13880d582229ad29c9a",
                    "transactionId": "34f127bba2272e063485a473700cbfa31fa4e3ee95f7de19fb84ea625ca7e0b2",
                    "blockId": "bc5756eac3f57e32904c91ed10fc716e21d5128c5af85751d9ffdefa1ed6a00b",
                    "value": 1000000,
                    "index": 0,
                    "globalIndex": 32939266,
                    "creationHeight": 1097714,
                    "settlementHeight": 1097716,
                    "ergoTree": "1014040005000400040004020e40646439346138643938323535656336353932383062343838316362313365373934613265363230623137616636306664356164663566323335343532336230620404040204000402040204000e4063373539316262616133343963643961636266356364613863613663626631646265363032393564646339316566653263343365303437633234653664336232010008cd03e0cec0822ad82f91a141a1333551fc448e7c9921ca2989569d5e2aaf0e5c420a0580dac4090406040404000100d810d601b2a5730000d602c27201d603937202c2a7d6049299c17201c1a77301d605db6308a7d606b17205d607b4720573027206d608db63087201d609b4720873037206d60ae4c6a7040c410ed60be4c6a7051ad60ce4c6a70605d60de4c672010605d60eeded93720ae4c67201040c410e93720be4c67201051a93720c720dd60fb1a5d610b2a5730400d1ececededed720372049372077209720eededed93cb72027305af720bd901110eae7208d901134d0eed938c7213017211928c721302720d720e95eded91720f730691b1db6308b2a57307007308e6c6b2a5730900070c410ed803d611b2a5730a00d612b2db63087211730b00d613e4c67211070c410eededed93cbc27211730ced938c721201c5a7938c7212027eb1721305937213720a93e4c67201074d0e7212730dededededed93c27210d0730e92c17210730f9591720f7310d804d611b2a5731100d612e4c672110404d613b2db63087211731200d614b2720b721200eded93c272118cb2720a72120002ed938c7213017214928c721302720c93b57207d901154d0e948c7215017214b57209d901154d0e948c72150172147313720e72037204",
                    "address": "Fjp7ogHP6fdk2Xy782guv7jnMXQHH3Htjq7m7ZViEFR2JrWw8KxURU5SgET7FaXULXonQkcPdueZP54yDYojwaT5328tGnppvWBSRjcnMRUBAUmvKW7zXs3dyRuHHJMRUQ7b8Ybgp6H5xX4PkWzqnJNyjfBb5ocMjRPMuqazfLgC4K8uSsVotsUYM7qLaUNWF97gwEfzLRummjKB5Q2d1fu6LbCY8MtpaYCVxcSPYBeKdQZJuA9jVDK92roDT2UwUxjciTZ3MQB5ptCTzjipweRNM3tGU4RfrXKhSj56Z2mPL4GTZEptf9m3PhZv6XdYtwC6euV5KMyfFa4otmKcNT3yEL2D24aq16DnB6RvefHRcyRLCJgxah5sReEff4ZZfMKUS8QhrobkZ62xSha4zyRxhPXcdvz7U8EuTM7raHQm4hKZEc7YVRTMAgtSDKNXiQvrKrSas8ZgaANdB1XnhMS5bv18bWfuxseSsQZ2Fb3p96wJNhve3GGamRAqdrnCg7sFrWioXemYAo5SAAX7QXS95LwVYssrNVtxm9dAEubSeh4wReUpVMxaWWFJ8FediFR7Nfs3Tqk9UdduJhgMDcBXQe1TFD2rpE5FzsuXbgsuP58aQCbkyTshwwut38YgjJR9WtWXpSfJpoPegSoKkKQF7ZbP9E3DQgy6iX67zGj3iTxc7jdu6uyzPQ3JRpbL3e44gM87t7MT6qvWR2RUEKsKnk2KXUashPX5p3Ac4PXS6nhi2e3YTFJAoLaeKFoQS1cc4qLBy76Wjb2pnFUyM2HLy498QjbKFCJFk1zZCM7tGgSrsASKCxNbSLuAycqRHbQhQxzFXxLimWu1aitsTPDGE1ShCnYfHS2NeFNFmiDM",
                    "assets": [
                        {
                            "tokenId": "0fdb7ff8b37479b6eb7aab38d45af2cfeefabbefdc7eebc0348d25dd65bc2c91",
                            "index": 0,
                            "amount": 2,
                            "name": "$Lambo",
                            "decimals": 0,
                            "type": "EIP-004"
                        },
                        {
                            "tokenId": "8c7ff0e5f1970be69aa3b9ad0428b398e9a9446b505f457f0d4ac6c9acfbeb93",
                            "index": 1,
                            "amount": 2,
                            "name": "Liquid Phase",
                            "decimals": 0,
                            "type": "EIP-004"
                        }
                    ],
                    "additionalRegisters": {
                        "R4": "0c410e0180897a240008cd03f68e2d2a05f62d2dcb3db017c62fcdd92c554ff6f31cc5acccb2157c63b45238",
            "R5": "1a02200fdb7ff8b37479b6eb7aab38d45af2cfeefabbefdc7eebc0348d25dd65bc2c91208c7ff0e5f1970be69aa3b9ad0428b398e9a9446b505f457f0d4ac6c9acfbeb93",
            "R6": "0504"
                    },
                    "mainChain": true
                };
                const height = await ergo.get_current_height();
                console.log(`Current height: ${height}`);  
                const newRecipient = "JnV5d3BsYC2GyshNWVGVjniCzPyJEnTbwvKdyQ8EbbbwXSPDtNMm1ahZhsyTaMoFDu7g4zx9fmrBcxuayz65Yk4tpgbhSpPX8VAPCzPhzeDzZN73bFDSBiU3aFUqvGvNw2rQ8aupHgT5kVht4YaodDxPnFmJiWEHy49YgTaeUGtWm7aDqZtFraW4ga9cnRRsHeF1w3doSWM2ripjsxw3GxcpEWFPmuU8146thNGLXf5Wb8TkkhA6RuZUHu2BVx9ydUEcXgezq1cxKUMLhBSF6Z6u822hhJ6YMFC15Phv1qBPHPkoUMCxjzatDUmgJBs2k2UHvqDGw5epa2G5wahuhXAGPwZWvEykzzm2vbwtKRpWynV74bp2BJmS1QpmRadM9At3MMDp9hYSaWSY2ViyQtERqXFkZZo6ajbTk5t5G6gHSdF1q35ZWsnTbM3zyDsgB27WYxwhJ5a1a81komfGUTjuPjmMJBAB13qJEhxi8wzgrYEkcchAo183fKTBshjVSj57ejQdCCToAhh6xFp7mtzyJUMMJvMXbn38CyamU1LdwRCA1xt4GbgX9wdgT8d2N4PMcdTkhYc2EtDACX8zT46i38U1YNx9CnYH4FvqwEisJoko84B2vjAE1vXHRqUSKTXXaD6qhX6WCvb56TVrAMK5ZFCnnNRE7Y92CDCiv8t1zT4crotoqqjc1XfwYwLZiLf77bzJjbitY3JYUbB";  // Update this with the actual recipient address
                console.log(`Recipient set to: ${newRecipient}`);  
                
                let artistErgoAddress = await ergo.get_change_address();
                console.log(`Artist Ergo Address: ${artistErgoAddress}`);
                let artistErgoTreeHex: string = ErgoAddress.fromBase58(artistErgoAddress).ergoTree;
                
                let value = "1000000";
                const withdrawContract = "ChSE2E1gh9wX8ffWYwgxofQnaPk311gyC4KE9nhYdXrWaeNsiiP3A8CdMVbmJ4YKDRVPzVMJey9CUrKPf9u6YVYGg8mRnNopeiAfJVzi1v1Hr36Htx9CrVDnc5aautRjFPyzGCFPsM1tfiJutBpSJyNRamEL2BvTTUq8ZZiG2k8eKTtiE5WLk8fHHaeAzh8a5ehDFuRR93ZtZGh4QP5ykQZwkDk98H8vLe1JLKDYrzVjyhTFZAFSMMagQe41Yq3EbW8f9Qgj3T96DZdbYHi3iNnS6sAWXtHx7oVY9KhwZb5nV1WAdXoDTB9zkAMoLRctkM2fe8LTHEoJXVawDikQRGFRNKkLwzuWqtfKLGKEpRoSMLZAB96thVsBmba1TguW5rXGQRKYaeoZvxcBPaFC7vW9vVcm8h9wHvBrLvcPjDWFYtSvGzEjVQVdzUR6eshyoCupmE3nztsJQjY1uc54zAe3ZdA93ncdm4ejrqCGG5MD6XVSjcejqj951XTXtqEATn3WjNYAqvP6dGN4yxeMEgrsiZFLewucYYtvQFZgq3ZGSKwioS44m4B5mKrdPcDqYqX7oA6VX2JpdSDJ";

const tokenId = "0fdb7ff8b37479b6eb7aab38d45af2cfeefabbefdc7eebc0348d25dd65bc2c91";
const token2 = "8c7ff0e5f1970be69aa3b9ad0428b398e9a9446b505f457f0d4ac6c9acfbeb93";
       
let r4 = SColl(SPair(SLong, SColl(SByte)), [[value, artistErgoTreeHex]]).toHex();
console.log("R4:", r4);
let r5 = SColl(SColl(SByte), [tokenId, token2]).toHex();
console.log("R5:", r5);
let r6 = SLong("2").toHex();
console.log("R6:", r6);
    
                let r7 = SColl(SByte, utf8.decode('3fa5a56c3460497d4fa80dde55f349dacd6da4b8c3716bfb6e41145574be32e0')).toHex();
                console.log("R7:", r7);  // Log the new R7 value
    
                console.log('Creating transaction builder...');  
                const unsignedTx = new TransactionBuilder(height)
                .from([inputBox, ...await ergo.get_utxos()])
                .to(
                    new OutputBuilder('1000000', newRecipient)  // Using the new recipient address here
                        .setAdditionalRegisters({
                            R4: r4,
                            R5: r5,
                            R6: r6,
                            R7: r7  
                        })
                        .addTokens({ 
                            tokenId: tokenId,  
                            amount: "2"  
                        })
                        .addTokens({ 
                            tokenId: token2,  // Using the tokenId variable from earlier
                            amount: "2"  // Setting the amount to 1
                        })
                )
                .to(
                    new OutputBuilder('1000000', withdrawContract)  // Using the new recipient address here
                    .mintToken({ amount: 1 })
                        .setAdditionalRegisters({
                            R4: SColl(SByte, utf8.decode('THz Contract Withdrawal Indicator')).toHex(),
                            R5: SColl(SByte, utf8.decode('Send this indicator to the Assignment Provision contract to get your contract nullification tokens.')).toHex(),
                            R6: SColl(SByte, utf8.decode("0".toString())).toHex(),
                            R7: r4
                        })
                )
                .sendChangeTo(await ergo.get_change_address())
                .payMinFee()
                .build()
                .toEIP12Object();
                console.log('Transaction builder created...', unsignedTx);
    
                console.log('Transaction built, signing...');  
                const signedTx = await ergo.sign_tx(unsignedTx);
    
                console.log('Transaction signed, submitting...');  
                const txId = await ergo.submit_tx(signedTx);
                setSaleTxId(txId);
    
                console.log("Your tx ID is:" + txId);
                setSecondTxId("Your second transaction has been initiated. Check the console for the transaction ID.");
                setLoading(false);
            }
        } catch (error) {
            console.error("Error sending files to contract:", error);
            console.error(error.stack);  
            setLoading(false);
        }
    };

    async function buyFilesFromContract(setLoading) {
        try {
            setLoading(true);
            console.log('Buying files from contract...');  
    
            if (await ergoConnector.nautilus.connect()) {
                console.log('Nautilus connected...');  
    
                const height = await ergo.get_current_height();
                console.log(`Current height: ${height}`);  
    
                let artistErgoAddress = await ergo.get_change_address();
                console.log(`Artist Ergo Address: ${artistErgoAddress}`);
    
                let artistErgoTreeHex: string = ErgoAddress.fromBase58(artistErgoAddress).ergoTree;
    
                const tokenId = "0fdb7ff8b37479b6eb7aab38d45af2cfeefabbefdc7eebc0348d25dd65bc2c91";  // Adjust this as necessary
                const buyerAddress = await ergo.get_change_address(); 
                const saleBoxId = "88a47a56676f961c0f9e91a7a5be5d2b70bded2c5bd6de0f8f72b8da1b8822ba";
                const revenue = "1000000000";  // 1 erg in nano ergs
                const saleRecipient = "JnV5d3BsYC2GyshNWVGVjniCzPyJEnTbwvKdyQ8EbbbwXSPDtNMm1ahZhsyTaMoFDu7g4zx9fmrBcxuayz65Yk4tpgbhSpPX8VAPCzPhzeDzZN73bFDSBiU3aFUqvGvNw2rQ8aupHgT5kVht4YaodDxPnFmJiWEHy49YgTaeUGtWm7aDqZtFraW4ga9cnRRsHeF1w3doSWM2ripjsxw3GxcpEWFPmuU8146thNGLXf5Wb8TkkhA6RuZUHu2BVx9ydUEcXgezq1cxKUMLhBSF6Z6u822hhJ6YMFC15Phv1qBPHPkoUMCxjzatDUmgJBs2k2UHvqDGw5epa2G5wahuhXAGPwZWvEykzzm2vbwtKRpWynV74bp2BJmS1QpmRadM9At3MMDp9hYSaWSY2ViyQtERqXFkZZo6ajbTk5t5G6gHSdF1q35ZWsnTbM3zyDsgB27WYxwhJ5a1a81komfGUTjuPjmMJBAB13qJEhxi8wzgrYEkcchAo183fKTBshjVSj57ejQdCCToAhh6xFp7mtzyJUMMJvMXbn38CyamU1LdwRCA1xt4GbgX9wdgT8d2N4PMcdTkhYc2EtDACX8zT46i38U1YNx9CnYH4FvqwEisJoko84B2vjAE1vXHRqUSKTXXaD6qhX6WCvb56TVrAMK5ZFCnnNRE7Y92CDCiv8t1zT4crotoqqjc1XfwYwLZiLf77bzJjbitY3JYUbB";  // Update this with the actual recipient address
    
                let value = "1000000";  // Adjust this as necessary
                console.log('Sale Box ID:', saleBoxId);
                console.log('Buyer Address:', buyerAddress);
                console.log('Sale Recipient:', saleRecipient);
                console.log('Revenue:', revenue);
    
                const utxos = await ergo.get_utxos();
                console.log('UTXOs:', JSON.stringify(utxos, null, 2));


                let r4 = SColl(SPair(SLong, SColl(SByte)), [[value, artistErgoTreeHex]]).toHex();
                console.log("R4:", r4);
                let r5 = SColl(SColl(SByte), [tokenId]).toHex();
                console.log("R5:", r5);
                let r6 = SLong(0).toHex();  
                console.log("R6:", r6);    
                let r7 = SColl(SByte, utf8.decode("3e609df78f81b0b233e83143f2c47fdb87e01790b15b2274133c074ecfafbfa6")).toHex();

                const inputBox: InputBox = {
                    "boxId": "88a47a56676f961c0f9e91a7a5be5d2b70bded2c5bd6de0f8f72b8da1b8822ba",
                    "transactionId": "a8f9348c184dcb34e7d09a78bdeae65d9c396ac5a922ba2a3942ec41293a6695",
                    "blockId": "4782e08317bb82e7ffa202582315e97b836d8fb21e1dd4d6fc5f0b2be100eed6",
                    "value": 1000000,
                    "index": 0,
                    "globalIndex": 32497992,
                    "creationHeight": 1087804,
                    "settlementHeight": 1087806,
                    "ergoTree": "100d0400040005000502040404000402040004000580dac40908cd03e0cec0822ad82f91a141a1333551fc448e7c9921ca2989569d5e2aaf0e5c420a04000e4063373430316638626263646435303862646264323632373937383663616535373461306462386133316635663661356230376365343363313435643362353663d1d805d601db6501fed602e4c6a7051ad603e4c6a7040c410ed604e4c6a70605d605e4c6a7074d0e9593b172017300d802d606b2a5730100d607e4c672060605edededed93c27206c2a79299c17206c1a77302af7202d901080eaedb63087206d9010a4d0eed938c720a017208928c720a027207ededed93e4c67206040c410e720393e4c67206051a7202937207997204730393e4c67206074d0e7205af7203d90108410eaea5d9010a63ed93c2720a8c72080292c1720a8c720801d807d606b2a5730400d607e4c672060404d608b2db63087206730500d609b27202720700d60ab2a5730600d60bb2a5730700d60cb27201730800edededededededed93c272068cb2720372070002ed938c7208017209928c720802720492c1720a730993c2720ad0730a93c2720bc2a793b5db6308a7d9010d4d0e948c720d017209b5db6308720bd9010d4d0e948c720d017209937205b2db6308720c730b0093cbc2720c730cededed93e4c6720b040c410e720393e4c6720b051a720293e4c6720b0605720493e4c6720b074d0e7205",
                    "address": "JnV5d3BsYC2GyshNWVGVjniCzPyJEnTbwvKdyQ8EbbbwXSPDtNMm1ahZhsyTaMoFDu7g4zx9fmrBcxuayz65Yk4tpgbhSpPX8VAPCzPhzeDzZN73bFDSBiU3aFUqvGvNw2rQ8aupHgT5kVht4YaodDxPnFmJiWEHy49YgTaeUGtWm7aDqZtFraW4ga9cnRRsHeF1w3doSWM2ripjsxw3GxcpEWFPmuU8146thNGLXf5Wb8TkkhA6RuZUHu2BVx9ydUEcXgezq1cxKUMLhBSF6Z6u822hhJ6YMFC15Phv1qBPHPkoUMCxjzatDUmgJBs2k2UHvqDGw5epa2G5wahuhXAGPwZWvEykzzm2vbwtKRpWynV74bp2BJmS1QpmRadM9At3MMDp9hYSaWSY2ViyQtERqXFkZZo6ajbTk5t5G6gHSdF1q35ZWsnTbM3zyDsgB27WYxwhJ5a1a81komfGUTjuPjmMJBAB13qJEhxi8wzgrYEkcchAo183fKTBshjVSj57ejQdCCToAhh6xFp7mtzyJUMMJvMXbn38CyamU1LdwRCA1xt4GbgX9wdgT8d2N4PMcdTkhYc2EtDACX8zT46i38U1YNx9CnYH4FvqwEisJoko84B2vjAE1vXHRqUSKTXXaD6qhX6WCvb56TVrAMK5ZFCnnNRE7Y92CDCiv8t1zT4crotoqqjc1XfwYwLZiLf77bzJjbitY3JYUbB",
                    "assets": [
                        {
                            "tokenId": "b0c124418c46bb32832ee0c15a8c6edd67ddedccc285de759f2554fbe7881a0d",
                            "index": 0,
                            "amount": 1,
                            "name": "Fleeting Construct",
                            "decimals": 0,
                            "type": "EIP-004"
                        }
                    ],
                    additionalRegisters: {
                        R4: "0c410e0180897a48303030386364303366363865326432613035663632643264636233646230313763363266636464393263353534666636663331636335616363636232313537633633623435323338",
                        R5: "0e4062306331323434313863343662623332383332656530633135613863366564643637646465646363633238356465373539663235353466626537383831613064",
                        R6: "0502",
                        R7: "0e4033653630396466373866383162306232333365383331343366326334376664623837653031373930623135623232373431333363303734656366616662666136"
                      },
                    "mainChain": true
                };

                console.log('Creating transaction builder...');  
                console.log("Input Box:", inputBox);

                const unsignedTx = new TransactionBuilder(height)
                .from([inputBox, ...await ergo.get_utxos()]) 
                .to(
                    new OutputBuilder("100000", buyerAddress)  
                        .addTokens({ 
                            tokenId: "b0c124418c46bb32832ee0c15a8c6edd67ddedccc285de759f2554fbe7881a0d",  
                            amount: BigInt(1) 
                        })
                )
                .to(
                    new OutputBuilder(value, artistErgoAddress)  
                        .setAdditionalRegisters({
                            R4: r4,
                            R5: r5,
                            R6: r6                      
                          })
                )
                .sendChangeTo(await ergo.get_change_address())
                .payMinFee()
                .configureSelector((selector) => selector.ensureInclusion(inputBox.boxId))
                .build()
                .toEIP12Object();

                console.log('Transaction builder created...', unsignedTx);
    
                console.log('Transaction built, signing...');  
                const signedTx = await ergo.sign_tx(unsignedTx);
    
                console.log('Transaction signed, submitting...');  
                const txId = await ergo.submit_tx(signedTx);
    
                console.log("Your tx ID is:" + txId);
                setBuyTxId("Your buy transaction has been initiated. Check the console for the transaction ID.");
                setLoading(false);
            }
        } catch (error) {
            console.error("Error buying files from contract:", error);
            console.error(error.stack);  
            setLoading(false);
        }
    };
    


    return (
        <div>
            <h1>Compile Your Contract</h1>
            <p>Timestamp being used: {timestamp}</p>
            <button className="Button bg-yellow-500 mt-6" onClick={handleCompile} disabled={isLoading}>Get Bootstrap P2S</button><br />
            {isLoading && <p>Compiling...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {compiledBootstrap && (
                <div>
                    <h2>Compiled Bootstrap Contract:</h2>
                    <p>{compiledBootstrap}</p>
                    <button onClick={() => navigator.clipboard.writeText(compiledBootstrap)}>Copy to Clipboard</button>
                </div>
            )}
            <button className="Button bg-green-500 mt-6" onClick={handleInitiateTransaction} disabled={isLoading}>Initiate Bootstrap Contract</button><br />
            <button className="Button bg-red-500 mt-6" onClick={() => withdrawFromContract(setIsLoading)} disabled={isLoading}>Withdraw from Bootstrap Contract</button><br />
            <button className="Button bg-blue-500 mt-6" onClick={() => sendFilesToContract(setIsLoading)} disabled={isLoading}>Send Files to Sale Contract</button><br />
            <button className="Button bg-pink-500 mt-6" onClick={() => buyFilesFromContract(setIsLoading)} disabled={isLoading}>Buy Files from Sale Contract</button><br />
{buyTxId && (
    <div>
        <h2>Buy Transaction Status:</h2>
        <p>{buyTxId}</p>
    </div>
)}

{secondTxId && (
    <div>
        <h2>Second Transaction Status:</h2>
        <p>{secondTxId}</p>
    </div>
)}
            {txId && (
                <div>
                    <h2>Transaction Status:</h2>
                    <p>{txId}</p>
                </div>
            )}
        </div>
    );
};

export default ContractCompiler;
