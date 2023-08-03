import { TransactionBuilder, OutputBuilder } from '@fleet-sdk/core';
import reducer from './reduceTransaction';

export async function purchaseWithErgoPay(price_erg, artistErgoAddress) {
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
    
    const inputs = unsignedTx.inputs;
    const [txId, ergoPayTx] = await reducer.getTxReducedB64Safe(unsignedTx, inputs, []);
    
    window.alert("Your ErgoPay link is:" + `ergopay:${ergoPayTx}`);
    
    return `ergopay:${ergoPayTx}`;
  }
}
