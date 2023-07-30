// PaymentMonitorContext.js
import { createContext, useContext } from 'react';

export const PaymentMonitorContext = createContext({
  transactionConfirmed: false,
  setTransactionConfirmed: () => {},
  checkTransaction: () => {},
});

export function usePaymentMonitor() {
  return useContext(PaymentMonitorContext);
}