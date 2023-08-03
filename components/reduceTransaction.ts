import { ErgoBoxes, ErgoStateContext, BlockHeaders, PreHeader, ReducedTransaction, UnsignedTransaction } from 'ergo-lib-wasm-browser';
import JSONBigInt from 'json-bigint';
import { getRequestV1, getExplorerBlockHeaders } from './apiHelpers';

export class TransactionReducer {
  async getTxReducedB64Safe(json, inputs, dataInputs) {
    let txId: string|null = null;
    let reducedTx;

    try {
        [txId, reducedTx] = await this.getTxReduced(json, inputs, dataInputs);
    } catch (e) {
        console.log("error", e);
    }

    const txReducedBase64 = this.byteArrayToBase64(reducedTx.sigma_serialize_bytes());
    const ergoPayTx = txReducedBase64.replace(/\//g, '_').replace(/\+/g, '-');
    return [txId, ergoPayTx];
  }

  private async getTxReduced(json, inputs, dataInputs): Promise<[string, any]>{
    const unsignedTx =  UnsignedTransaction.from_json(JSONBigInt.stringify(json));
   
