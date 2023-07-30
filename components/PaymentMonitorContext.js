import { createContext, useContext } from 'react';

const PaymentMonitorContext = createContext({
  txId: null,
  setTxId: () => {},
});

export function usePaymentMonitor() {
  return useContext(PaymentMonitorContext);
}