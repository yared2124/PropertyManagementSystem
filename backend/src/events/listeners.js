import eventBus from "./eventBus.js";
import { setupPaymentHandlers } from "./handlers/payment.handler.js";
import { setupContractHandlers } from "./handlers/contract.handler.js";

export const registerListeners = () => {
  setupPaymentHandlers(eventBus);
  setupContractHandlers(eventBus);
  console.log("✅ Event listeners registered");
};
