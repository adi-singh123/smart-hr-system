import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./features";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
  blacklist: [],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  // devTools: true
});

const clearStateAndPersistedData = async () => {
  store.dispatch({ type: "CLEAR_STATE_AND_PERSISTED_DATA" });
  await persistor.purge(); // Clear persisted data
  console.log("clear <<<<<<<<<<<<");
};

const persistor = persistStore(store);
export { store, persistor, clearStateAndPersistedData };
