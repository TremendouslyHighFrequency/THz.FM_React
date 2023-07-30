import react from 'react';
import axios from 'axios';

let transactionConfirmed = false;
let txId = null;

export function setTransaction(txIdInput) {
  txId = txIdInput;
}

export function checkTransaction() {
  if (txId) {
    setInterval(async () => {
      try {
        const response = await axios.get('https://api.ergoplatform.com/api/v1/transactions/' + txId);
        if (response.status === 200 && response.data) {
          transactionConfirmed = true;
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          transactionConfirmed = false;
        }
      }
    }, 20000);
  }
  return transactionConfirmed;
}
