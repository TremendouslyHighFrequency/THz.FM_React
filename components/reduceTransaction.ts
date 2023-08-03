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

    const inputBoxes = ErgoBoxes.from_boxes_json(inputs);
    const inputDataBoxes = ErgoBoxes.from_boxes_json(dataInputs);

    let ctx;
    try {
        ctx = await this.getErgoStateContext();
    } catch (e) {
        console.log("error", e);    
    }

    const id = unsignedTx.id().to_str();
    const reducedTx = ReducedTransaction.from_unsigned_tx(unsignedTx, inputBoxes, inputDataBoxes, ctx);
    return [id, reducedTx];
  }

  private async getErgoStateContext(): Promise<any> {
    let explorerHeaders: any = [];
    try {
        explorerHeaders = await getExplorerBlockHeaders();
    } catch (e) {
        console.log("error", e);
    }

    const block_headers = BlockHeaders.from_json(explorerHeaders);
    const pre_header = PreHeader.from_block_header(block_headers.get(0));
    const ctx = new ErgoStateContext(pre_header, block_headers);
    return ctx;
  }

  private byteArrayToBase64(byteArray) {
    var binary = '';
    var len = byteArray.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(byteArray[i]);
    }
    return window.btoa(binary);
  }
}
