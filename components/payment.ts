//Ergo / Crypto Imports
import { TransactionBuilder, OutputBuilder } from '@fleet-sdk/core';
import { SHA256 } from 'crypto-js';
import { ErgoDappConnector } from 'ergo-dapp-connector';
import { MintNFT } from './components/MintNFT';

var downloadButton = 
'<div class="mt-8 bg-white rounded-lg max-w-md mx-auto p-4 fixed float-right overflow-x-none overflow-y-auto right-0 z-20 mb-4 mx-6 absolute">' +
  '<div class="flex items-center">' +
    '<div class="mt-4 text-center">' +
      '<p class="font-bold">Your download is ready.</p>' +
    '</div>' +
  '</div>' +
  '<div class="text-center mt-4">' +
    '<a target="_blank" href="/collection">' +
    '<button class="mt-4 shadow-md inline-block hover:text-white text-strong text-sm bg-white text-gray-800 hover:bg-blue-600 rounded-lg px-6 py-2 mx-2">Go to collection</button>' +
    '</a>' +
  '</div>' +
'</div>';

export async function purchase(price_erg) {
  const explorerAPI = 'https://explorer.ergoplatform.com/api/v1';

  if (await ergoConnector.nautilus.connect()) {
    const height = await ergo.get_current_height();

    const unsignedTx = new TransactionBuilder(height)
      .from(await ergo.get_utxos())
      .to(new OutputBuilder(price_erg * 1000000000, "9fjTtRPuaSXU3QuK73EH7w6dCd2Z8oPDnXz5qBptKpD6MUdwiZX"))
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
        document.getElementById("downloadButton").innerHTML = downloadButton;
      })
    }
  }
}
