import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
// import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution';
// tslint:disable-next-line: ordered-imports
import 'monaco-editor/esm/vs/basic-languages/shell/shell.contribution';
import 'monaco-editor/esm/vs/editor/contrib/find/findController.js';
import * as React from 'react';
import styles from './style.module.less';

const { useEffect, useRef } = React;

let monacoInstance: monaco.editor.IStandaloneCodeEditor | null = null;

export const Editor: React.SFC<{
  monacoOptions?: monaco.editor.IEditorConstructionOptions;
  initialValue?: string;
  onSave?(val: string): void;
}> = props => {
  const { initialValue, monacoOptions, onSave = () => void 0 } = props;
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

      monacoInstance.addCommand(
        // tslint:disable-next-line: no-bitwise
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S,
        () => {
          // console.log('SAVE pressed!', monacoInstance.getValue());
          onSave(monacoInstance.getValue());
        },
      );

      // monacoInstance.onDidChangeModelContent(() => {
      // });
    }

    return () => {
      if (monacoInstance) {
        monacoInstance.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (monacoInstance) {
      monacoInstance.setValue(initialValue);
    }
  }, [initialValue]);

  return <div ref={divRef} className={styles.editor} />;
};
