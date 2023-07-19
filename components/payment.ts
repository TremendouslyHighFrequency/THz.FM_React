import { TransactionBuilder, OutputBuilder } from '@fleet-sdk/core';
import { ergoConnector } from './ergoConnector'; // You need to set up ergoConnector in this file or import it from another file

export async function purchase() {
  // requests wallet access
  if (await ergoConnector.nautilus.connect()) {
    // get the current height from the the dApp Connector
    const height = await ergo.get_current_height();

    const unsignedTx = new TransactionBuilder(height)
      .from(await ergo.get_utxos()) // add inputs from dApp Connector
      .to(
        // Add output
        new OutputBuilder(
          "100000000",
          "9fjTtRPuaSXU3QuK73EH7w6dCd2Z8oPDnXz5qBptKpD6MUdwiZX"
        )
      )
      .sendChangeTo(await ergo.get_change_address()) // Set the change address to the user's default change address
      .payMinFee() // set minimal transaction fee
      .build() // build the transaction
      .toEIP12Object(); // converts the ErgoUnsignedTransaction instance to an dApp Connector compatible plain object

    // requests the signature
    const signedTx = await ergo.sign_tx(unsignedTx);

    // send the signed transaction to the mempool
    const txId = await ergo.submit_tx(signedTx);

    // prints the Transaction ID of the submitted transaction on the console
    console.log(txId);
  }
};
