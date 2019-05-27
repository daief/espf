import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
// languages & features imported by `monaco-editor-webpack-plugin`
import * as React from 'react';
import { GlobalCtx } from '../../GlobalCtx';
import styles from './style.module.less';

const { useEffect, useRef, useContext } = React;

let monacoInstance: monaco.editor.IStandaloneCodeEditor | null = null;

export const Editor: React.SFC<{
  monacoOptions?: monaco.editor.IEditorConstructionOptions;
  initialValue?: string;
  onSave?(val: string): void;
}> = props => {
  const { initialValue, monacoOptions, onSave = () => void 0 } = props;
  const { setStore } = useContext(GlobalCtx);
  const divRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (divRef.current) {
      monacoInstance = monaco.editor.create(divRef.current, {
        automaticLayout: true,
        language: 'shell',
        theme: 'vs-dark',
        value: initialValue,
        ...monacoOptions,
      });

      setStore({
        monacoInstance,
      });
    }

    return () => {
      if (monacoInstance) {
        monacoInstance.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (monacoInstance) {
      monacoInstance.setScrollTop(0);
      monacoInstance.setValue(initialValue);
    }
  }, [initialValue]);

  useEffect(() => {
    if (monacoInstance) {
      monacoInstance.addCommand(
        // tslint:disable-next-line: no-bitwise
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S,
        () => {
          onSave(monacoInstance.getValue());
        },
      );
    }
  }, [onSave]);

  return <div ref={divRef} className={styles.editor} />;
};
