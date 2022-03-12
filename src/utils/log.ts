const ENABLE_STORE_LOGGING = false;

export const storeLogger = {
  info: (message?: any, ...args: any[]) => {
    if (ENABLE_STORE_LOGGING) {
      console.log(message, ...args);
    }
  },
};
