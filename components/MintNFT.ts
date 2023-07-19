import {
  OutputBuilder,
  TransactionBuilder,
  SConstant,
  SColl,
  SByte,
} from '@fleet-sdk/core';
import { sha256 } from '@noble/hashes/sha256';
import { utf8ToBytes } from '@noble/hashes/utils';

export async function MintNFT() {
  if (await ergoConnector.nautilus.connect()) {
    const height = await ergo.get_current_height();
    const recipient = '9hq9HfNKnK1GYHo8fobgDanuMMDnawB9BPw5tWTga3H91tpnTga';

    const unsignedTx = new TransactionBuilder(height)
      .from(await ergo.get_utxos())
      .to(
        new OutputBuilder('1000000', recipient)
          .mintToken({ amount: 1 })
          .setAdditionalRegisters({
            R4: SConstant(SColl(SByte, utf8ToBytes('Token Name'))),
            R5: SConstant(SColl(SByte, utf8ToBytes('Token Description'))),
            R6: SConstant(SColl(SByte, utf8ToBytes('0'))), // decimals,
            R7: SConstant(
              SColl(SByte, [
                0x01, // NFT tyken type
                0x01, // 0x01 = picture, 0x02 = audio, 0x03 = video, see EIP-4 for more info
              ])
            ),
            R8: SConstant(
              SColl(SByte, sha256('artwork files bytes goes here'))
            ),
            R9: SConstant(
              SColl(
                SByte,
                utf8ToBytes(
                  // artwork link
                  'https://upload.wikimedia.org/wikipedia/commons/6/6e/USS_Nautilus_SSN571.JPG'
                )
              )
            ),
          })
      )
      .sendChangeTo(await ergo.get_change_address())
      .payMinFee()
      .build()
      .toEIP12Object();

    const signedTx = await ergo.sign_tx(unsignedTx);
    const txId = await ergo.submit_tx(signedTx);

    console.log(txId);
  }
}