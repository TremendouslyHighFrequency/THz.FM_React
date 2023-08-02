import { TransactionBuilder, OutputBuilder } from '@fleet-sdk/core';
import { ErgoDappConnector } from 'ergo-dapp-connector';
import axios from 'axios';

export async function purchase(price_erg, artistErgoAddress) {
  const explorerAPI = 'https://api.ergoplatform.com/api/v1';

  if (await ergoConnector.nautilus.connect()) {
    const height = await ergo.get_current_height();

    const unsignedTx = new TransactionBuilder(height)
      .from(await ergo.get_utxos())
      .to(new OutputBuilder(price_erg * 1000000000, artistErgoAddress))
      .sendChangeTo(await ergo.get_change_address())
      .payMinFee()
      .build()
      .toEIP12Object();
    
    const signedTx = await ergo.sign_tx(unsignedTx);
    const txId = await ergo.submit_tx(signedTx);
    console.log(txId);

    window.alert("Your tx ID is:" + txId + " - The album download button will appear once your transaction confirms. Feel free to continue browsing the site while it confirms.");

    var interval = setInterval(checkTransaction, 20000);
    function checkTransaction() {
      axios.get(explorerAPI + '/transactions/' + txId)
      .then(function (response) {
        clearInterval(interval);
        console.log(response.data);
      })
    }

    return txId;  // Return txId here
  }
}
