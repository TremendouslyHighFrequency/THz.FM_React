import {
  OutputBuilder,
  TransactionBuilder,
  SConstant,
  SColl,
  SByte,
} from '@fleet-sdk/core';
import { sha256 } from '@noble/hashes/sha256';
import { utf8ToBytes } from '@noble/hashes/utils';
import { NFTStorage } from 'nft.storage';
import commonSiteConfig from '../../common_site_config.json';

const NFTstorageApiKey = commonSiteConfig.NFT_STORAGE_API_KEY;

export async function MintNFT(file: File, title: string, description: string, decimals: number, setLoading: (loading: boolean) => void) {
  setLoading(true);
  const client = new NFTStorage({ token: NFTstorageApiKey });
  const cid = await client.storeBlob(file);
  const ipfsLink = `ipfs://${cid}`;
  console.log(ipfsLink);
  setLoading(false);  

  const fileBytes = new Uint8Array(await file.arrayBuffer());
  const fileHash = sha256(fileBytes);

  if (await ergoConnector.nautilus.connect()) {
    const height = await ergo.get_current_height();
    const recipient = await ergo.get_change_address();

    const unsignedTx = new TransactionBuilder(height)
      .from(await ergo.get_utxos())
      .to(
        new OutputBuilder('1000000', recipient)
          .mintToken({ amount: 1 })
          .setAdditionalRegisters({
            R4: SConstant(SColl(SByte, utf8ToBytes(title))),
            R5: SConstant(SColl(SByte, utf8ToBytes(description))),
            R6: SConstant(SColl(SByte, utf8ToBytes(decimals.toString()))),
            R7: SConstant(SColl(SByte, [0x01, 0x02])),
            R8: SConstant(SColl(SByte, fileHash)),
            R9: SConstant(SColl(SByte, utf8ToBytes(ipfsLink))),
          })
      )
      .sendChangeTo(await ergo.get_change_address())
      .payMinFee()
      .build()
      .toEIP12Object();

    const signedTx = await ergo.sign_tx(unsignedTx);
    const txId = await ergo.submit_tx(signedTx);

    console.log("Your tx ID is:" + txId);
    return ipfsLink;
  }
}


// import {
//   OutputBuilder,
//   TransactionBuilder,
//   SConstant,
//   SColl,
//   SByte,
// } from '@fleet-sdk/core';
// import { sha256 } from '@noble/hashes/sha256';
// import { utf8ToBytes } from '@noble/hashes/utils';
// import * as IPFS from 'ipfs-core'

// const ipfs = await IPFS.create()
// const { cid } = await ipfs.add()
// console.info(cid)

// // TO ADD: UPLOAD FORM TO IPFS
// // TO ADD: IPFS LINKS TO NFT FILE ATTACHMENTS

// export async function MintNFT() {
//   if (await ergoConnector.nautilus.connect()) {
//     const height = await ergo.get_current_height();
//     const recipient = '9fjTtRPuaSXU3QuK73EH7w6dCd2Z8oPDnXz5qBptKpD6MUdwiZX';

//     const unsignedTx = new TransactionBuilder(height)
//       .from(await ergo.get_utxos())
//       .to(
//         new OutputBuilder('1000000', recipient)
//           .mintToken({ amount: 1 })
//           .setAdditionalRegisters({
//             R4: SConstant(SColl(SByte, utf8ToBytes('Fleeting Construct'))),
//             R5: SConstant(SColl(SByte, utf8ToBytes('The first NFT mint test from THz.FM'))),
//             R6: SConstant(SColl(SByte, utf8ToBytes('0'))), // decimals,
//             R7: SConstant(
//               SColl(SByte, [
//                 0x01, // required
//                   // 0x01, // image token type
//                 0x02, // audio token type
//                 // 0x03, // video token type
//                 // 0x04, // artwork collection token type
//                 // 0x0F, // NFT file attachments - collection of SHA256 hashes of the files encoded as Coll[Coll[Byte]] 

// // NFT File Attachments
// // NFT File attachments can be used to attach any number of files of any file format to an Ergo token.

// // An NFT File Attachment should have a multi-attachment content type as per the EIP-29 Standard, with the following structure:

// // Attachment 0: contentType = 2 (plain text) - Comma seperated list of file formats of the attached files
// // Attachment 1: contentType = 2 (plain text) - Link to the first file (the sha256 hash of this file should be in index 0 of R8 and the file extension should be given as the first file extenstion in attachment 0)
// // Attachment 2 (Optional): contentType = 2 (plain text) - Link to the second file (the sha256 hash of this file should be in index 1 of R8 and the file extension should be given as the second file extenstion in attachment 0)
// // Attachment n (Optional): contentType = 2 (plain text) - Link to the nth file (the sha256 hash of this file should be in index n-1 of R8 and the file extension should be given as the nth file extenstion in attachment 0)
// // NFT File Attachment Example

// // Files to be attached:

// // File Format	File Link	File Hash
// // glb	ipfs://link1	c5286e4a262c0a25e776124bfb09a961bfb6daf20b95fc201d2ac06b3134c199
// // png	ipfs://link2	eb56a7800112669108ef13b1e8bd2c00e3941775f0b5a6dcb091606e649146f3
// // png	ipfs://link3	39abad7b6e825b93d708b300434971fb62353441fd8690fa5596faa57a02cbf5
// // Registers (Rendered Values):

// // R7	R8	R9
// // 0201FF	[c5286e4a262c0a25e776124bfb09a961bfb6daf20b95fc201d2ac06b3134c199, bbfcfc944bffd3fe35cd94b44f5df2e96685baf27856a89fba29263b72469356, 39abad7b6e825b93d708b300434971fb62353441fd8690fa5596faa57a02cbf5]	(505250, ( 1,[
// // (2,676C622C706E672C706E67),
// // (2, 697066733A2F2F6C696E6B31),
// // (2, 697066733A2F2F6C696E6B32),(2, 697066733A2F2F6C696E6B33)] )

//               ])
//             ),
//             R8: SConstant(
//               SColl(SByte, sha256('artwork files bytes goes here'))
//             ),
//             R9: SConstant(
//               SColl(
//                 SByte,
//                 utf8ToBytes(
//                   // File for NFT attachment
//                   'https://thz.fm/files/row 1.mp3'
//                 )
//               )
//             ),
//           })
//       )
//       .sendChangeTo(await ergo.get_change_address())
//       .payMinFee()
//       .build()
//       .toEIP12Object();

//     const signedTx = await ergo.sign_tx(unsignedTx);
//     const txId = await ergo.submit_tx(signedTx);

//     console.log("Your tx ID is:" + txId);
//   }
// }