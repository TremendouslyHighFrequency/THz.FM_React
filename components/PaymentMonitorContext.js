// PaymentMonitorContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const PaymentMonitorContext = createContext({
  transactionConfirmed: false,
  setTransactionConfirmed: () => {},
  txId: null,
  setTxId: () => {},
});

export function PaymentMonitorProvider({ children }) {
  const [transactionConfirmed, setTransactionConfirmed] = useState(false);
  const [txId, setTxId] = useState(null);

  useEffect(() => {
    if (txId) {
      const interval = setInterval(async () => {
        try {
          const response = await axios.get('https://api.ergoplatform.com/api/v1/transactions/' + txId);
          if (response.status === 200 && response.data) {
            setTransactionConfirmed(true);
            clearInterval(interval);
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setTransactionConfirmed(false);
          }
        }
      }, 20000);
      return () => clearInterval(interval);
    }
  }, [txId]);

  return (
    <PaymentMonitorContext.Provider value={{ transactionConfirmed, setTransactionConfirmed, txId, setTxId }}>
      {children}
    </PaymentMonitorContext.Provider>
  );
}

export function usePaymentMonitor() {
  return useContext(PaymentMonitorContext);
}
