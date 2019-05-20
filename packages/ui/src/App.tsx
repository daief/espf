import { Empty, Input, Modal, notification } from 'antd';
import { readFile } from 'fs';
import * as React from 'react';
import FileList from './components/FileList';
import Editor from './components/MonacoEditor';
import { GlobalCtx } from './GlobalCtx';
import styles from './styles/app.module.less';
import { sudoWriteFile, testNoPermission, writeContentToFile } from './utils';

const { useContext, useState, useRef, useEffect } = React;

notification.config({
  duration: 5,
});

export const App: React.SFC<{}> = () => {
  const { store, setStore } = useContext(GlobalCtx);
  const [visible, setVisible] = useState(false);
  const { selectedFile, password, monacoInstance, saveFileLoading } = store;
  const [fileContent, setFileContent] = useState('');
  const inputRef = useRef<Input>();

  useEffect(() => {
    if (selectedFile) {
      readFile(selectedFile, 'utf-8', (err, data) => {
        if (err) {
          return notification.error({
            description: `${err}`,
            message: 'Error when open file',
          });
        }
        setFileContent(data);
      });
    }
  }, [selectedFile]);

  useEffect(() => {
    if (visible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [visible]);

  const usePWDToSave = async () => {
    if (monacoInstance) {
      setStore({ saveFileLoading: true });
      return sudoWriteFile(selectedFile, monacoInstance.getValue(), password)
        .then(() => {
          // cache correct pwd during localstorage
          localStorage.setItem('password', password);
        })
        .catch(err => {
          const str: string = err.toString();

          notification.error({
            description: str,
            message: 'Error when save file',
          });

          if (/incorrect password/i.test(str) || testNoPermission(str)) {
            // reset pwd
            setStore({ password: '' });
          }
        })
        .finally(() => {
          setStore({ saveFileLoading: false });
        });
    }
  };

  const needPWDToSave = () => {
    if (password) {
      usePWDToSave();
    } else {
      setVisible(true);
    }
  };

  const handleOnSave = (val: string) => {
    setStore({ saveFileLoading: true });
    writeContentToFile(selectedFile, val)
      .catch(e => {
        if (testNoPermission(e)) {
          needPWDToSave();
        } else {
          return notification.error({
            description: `${e}`,
            message: 'Error when save file',
          });
        }
      })
      .finally(() => {
        setStore({ saveFileLoading: false });
      });
  };

  const handlePWDModalOk = () => {
    usePWDToSave().finally(() => {
      setVisible(false);
    });
  };

  return (
    <>
      <div className={styles.app}>
        <div className={styles['left-wrap']}>
          <FileList />
        </div>
        <div className={styles['right-wrap']}>
          {selectedFile ? (
            <Editor initialValue={fileContent} onSave={handleOnSave} />
          ) : (
            <Empty description="No file is selected." />
          )}
        </div>
      </div>
      <Modal
        visible={visible}
        title="This file need your sudo rights to save"
        onCancel={() => setVisible(false)}
        onOk={handlePWDModalOk}
        confirmLoading={saveFileLoading}
      >
        <Input
          type="password"
          placeholder="Enter sudo password"
          ref={inputRef}
          value={password}
          onPressEnter={handlePWDModalOk}
          onChange={_ => setStore({ password: _.target.value })}
        />
      </Modal>
    </>
  );
};
