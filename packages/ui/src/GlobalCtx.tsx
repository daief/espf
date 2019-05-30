import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import * as React from 'react';
import { getExtarFileListFromCache, getPwdTFromCache } from './utils';

export interface SimpleGlobalStore {
  selectedFile: string;
  monacoInstance?: monaco.editor.IStandaloneCodeEditor;
  password?: string;
  saveFileLoading: boolean;
  extraFileList: string[];
}

export const GlobalCtx = React.createContext<{
  store: SimpleGlobalStore;
  setStore: (s: Partial<SimpleGlobalStore>) => void;
}>(null);

export const initialStore: SimpleGlobalStore = {
  selectedFile: '',
  saveFileLoading: false,
  password: getPwdTFromCache(),
  extraFileList: getExtarFileListFromCache(),
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
