import { EventEmitter2 } from "eventemitter2";
const eventBus = new EventEmitter2({
  wildcard: true,
  delimiter: ":",
  maxListeners: 20,
});
export default eventBus;
