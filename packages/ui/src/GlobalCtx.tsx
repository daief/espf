import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import * as React from 'react';

export interface SimpleGlobalStore {
  selectedFile: string;
  monacoInstance?: monaco.editor.IStandaloneCodeEditor;
  password?: string;
}

export const GlobalCtx = React.createContext<{
  store: SimpleGlobalStore;
  setStore: (s: Partial<SimpleGlobalStore>) => void;
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