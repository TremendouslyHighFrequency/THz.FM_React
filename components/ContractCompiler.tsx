
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
    
    async function initiateBootstrap(setLoading) {
        try {
            setLoading(true);
            console.log('Initiating bootstrap...');  
    
            if (await ergoConnector.nautilus.connect()) {
                console.log('Nautilus connected...');  
                const height = await ergo.get_current_height();
                console.log(`Current height: ${height}`);  
    
                const recipient = "Fjp7ogHP6fdk2Xy782guv7jnMXQHH3Htjq7m7ZViEFR2JrWw8KxURU5SgET7FaXULXonQkcPdueZP54yDYojwaT5328tGnppvWBSRjcnMRUBAUmvKW7zXs3dyRuHHJMRUQ7b8Ybgp6H5xX4PkWzqnJNyjfBb5ocMjRPMuqazfLgC4K8uSsVotsUYM7qLaUNWF97gwEfzLRummjKB5Q2d1fu6LbCY8MtpaYCVxcSPYBeKdQZJuA9jVDK92roDT2UwUxjciTZ3MQB5ptCTzjipweRNM3tGU4RfrXKhSj56Z2mPL4GTZEptf9m3PhZv6XdYtwC6euV5KMyfFa4otmKcNT3yEL2D24aq16DnB6RvefHRcyRLCJgxah5sReEff4ZZfMKUS8QhrobkZ62xSha4zyRxhPXcdvz7U8EuTM7raHQm4hKZEc7YVRTMAgtSDKNXiQvrKrSas8ZgaANdB1XnhMS5bv18bWfuxseSsQZ2Fb3p96wJNhve3GGamRAqdrnCg7sFrWioXemYAo5SAAX7QXS95LwVYssrNVtxm9dAEubSeh4wReUpVMxaWWFJ8FediFR7Nfs3Tqk9UdduJhgMDcBXQe1TFD2rpE5FzsuXbgsuP58aQCbkyTshwwut38YgjJR9WtWXpSfJpoPegSoKkKQF7ZbP9E3DQgy6iX67zGj3iTxc7jdu6uyzPQ3JRpbL3e44gM87t7MT6qvWR2RUEKsKnk2KXUashPX5p3Ac4PXS6nhi2e3YTFJAoLaeKFoQS1cc4qLBy76Wjb2pnFUyM2HLy498QjbKFCJFk1zZCM7tGgSrsASKCxNbSLuAycqRHbQhQxzFXxLimWu1aitsTPDGE1ShCnYfHS2NeFNFmiDM";
                console.log(`Recipient set to: ${recipient}`);  
                
                let artistErgoAddress = await ergo.get_change_address();
                console.log(`Artist Ergo Address: ${artistErgoAddress}`);
                let artistErgoTreeHex: string = ErgoAddress.fromBase58(artistErgoAddress).ergoTree;
                
                let value = "1000000";

                const tokenId = "8c7ff0e5f1970be69aa3b9ad0428b398e9a9446b505f457f0d4ac6c9acfbeb93";

                let r4 = SColl(SPair(SLong, SColl(SByte)), [[value, utf8.decode(artistErgoTreeHex)]]).toHex();
                console.log("R4:", r4);
                let r5 =  "0e20" + tokenId
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

    async function sendFilesToContract(setLoading) {
        try {
            setLoading(true);
            console.log('Sending files to contract...');  
    
            if (await ergoConnector.nautilus.connect()) {
                console.log('Nautilus connected...');  
                const height = await ergo.get_current_height();
                console.log(`Current height: ${height}`);  
    
                const newRecipient = "JnV5d3BsYC2GyshNWVGVjniCzPyJEnTbwvKdyQ8EbbbwXSPDtNMm1ahZhsyTaMoFDu7g4zx9fmrBcxuayz65Yk4tpgbhSpPX8VAPCzPhzeDzZN73bFDSBiU3aFUqvGvNw2rQ8aupHgT5kVht4YaodDxPnFmJiWEHy49YgTaeUGtWm7aDqZtFraW4ga9cnRRsHeF1w3doSWM2ripjsxw3GxcpEWFPmuU8146thNGLXf5Wb8TkkhA6RuZUHu2BVx9ydUEcXgezq1cxKUMLhBSF6Z6u822hhJ6YMFC15Phv1qBPHPkoUMCxjzatDUmgJBs2k2UHvqDGw5epa2G5wahuhXAGPwZWvEykzzm2vbwtKRpWynV74bp2BJmS1QpmRadM9At3MMDp9hYSaWSY2ViyQtERqXFkZZo6ajbTk5t5G6gHSdF1q35ZWsnTbM3zyDsgB27WYxwhJ5a1a81komfGUTjuPjmMJBAB13qJEhxi8wzgrYEkcchAo183fKTBshjVSj57ejQdCCToAhh6xFp7mtzyJUMMJvMXbn38CyamU1LdwRCA1xt4GbgX9wdgT8d2N4PMcdTkhYc2EtDACX8zT46i38U1YNx9CnYH4FvqwEisJoko84B2vjAE1vXHRqUSKTXXaD6qhX6WCvb56TVrAMK5ZFCnnNRE7Y92CDCiv8t1zT4crotoqqjc1XfwYwLZiLf77bzJjbitY3JYUbB";  // Update this with the actual recipient address
                console.log(`Recipient set to: ${newRecipient}`);  
    
                let artistErgoAddress = await ergo.get_change_address();
                console.log(`Artist Ergo Address: ${artistErgoAddress}`);
                let artistErgoTreeHex: string = ErgoAddress.fromBase58(artistErgoAddress).ergoTree;
                
                let value = "1000000";  // Adjust this as necessary
    
                const tokenId = "8c7ff0e5f1970be69aa3b9ad0428b398e9a9446b505f457f0d4ac6c9acfbeb93";  // Adjust this as necessary
    
                let r4 = SColl(SPair(SLong, SColl(SByte)), [[value, utf8.decode(artistErgoTreeHex)]]).toHex();
                console.log("R4:", r4);
                let r5 =  "0e20" + tokenId
                console.log("R5:", r5);
                let r6 = SLong("1").toHex();  // Adjust this as necessary
                console.log("R6:", r6);
    
                let r7 = SColl(SByte, utf8.decode("3e609df78f81b0b233e83143f2c47fdb87e01790b15b2274133c074ecfafbfa6")).toHex();  // Define your new R7 value here
                console.log("R7:", r7);  // Log the new R7 value
    
                console.log('Creating transaction builder...');  
                const unsignedTx = new TransactionBuilder(height)
                .from(await ergo.get_utxos())
                .to(
                    new OutputBuilder('1000000', newRecipient)  // Using the new recipient address here
                        .setAdditionalRegisters({
                            R4: r4,
                            R5: r5,
                            R6: r6,
                            R7: r7  // Adding the new R7 value here
                        })
                        .addTokens({ 
                            tokenId: tokenId,  // Using the tokenId variable from earlier
                            amount: "1"  // Setting the amount to 1
                        })
                )
                .to(
                    new OutputBuilder('1000000', artistErgoAddress)  // Using the new recipient address here
                        .setAdditionalRegisters({
                            R4: r4,
                            R5: r5,
                            R6: r6,
                            R7: r7  // Adding the new R7 value here
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
    
                const tokenId = "8c7ff0e5f1970be69aa3b9ad0428b398e9a9446b505f457f0d4ac6c9acfbeb93";  // Adjust this as necessary
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


                let r4 = SColl(SPair(SLong, SColl(SByte)), [[value, utf8.decode(artistErgoTreeHex)]]).toHex();
                console.log("R4:", r4);
                let r5 =  "0e20" + tokenId
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
            <button className="Button bg-yellow-500 mt-6" onClick={handleCompile} disabled={isLoading}>Compile Contracts</button><br />
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
