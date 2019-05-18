import * as React from 'react';

export interface SimpleGlobalStore {
  selectedFile: string;
}

export const GlobalCtx = React.createContext<{
  store: SimpleGlobalStore;
  setStore: (s: { [k: string]: any }) => void;
}>(null);

export const initialStore: SimpleGlobalStore = {
  selectedFile: '',
};

export const GlobalCtxWrap: React.SFC = ({ children }) => {
  const [state, setState] = React.useState<SimpleGlobalStore>(initialStore);
  return (
    <GlobalCtx.Provider
      value={{
        setStore(newState: Partial<SimpleGlobalStore>) {
          setState(pre => ({
            ...pre,
            ...newState,
          }));
        },
        store: state,
      }}
    >
      {children}
    </GlobalCtx.Provider>
  );
};
