import { Empty, Input, Modal, notification } from 'antd';
import { readFile } from 'fs';
import * as React from 'react';
import FileList from './components/FileList';
import Editor from './components/MonacoEditor';
import { GlobalCtx } from './GlobalCtx';
import styles from './styles/app.module.less';
import { sudoWriteFile, writeContentToFile } from './utils';

notification.config({
  duration: 5,
});

export const App: React.SFC<{}> = () => {
  const { store, setStore } = React.useContext(GlobalCtx);
  const [visible, setVisible] = React.useState(false);
  const { selectedFile, password, monacoInstance } = store;
  const [fileContent, setFileContent] = React.useState('');

  React.useEffect(() => {
    if (selectedFile) {
      readFile(selectedFile, 'utf-8', (err, data) => {
        if (err) {
          return notification.error({
            description: err,
            message: 'Error when open file',
          });
        }
        setFileContent(data);
      });
    }
  }, [selectedFile]);

  const usePWDToSave = async () => {
    if (monacoInstance) {
      return sudoWriteFile(
        selectedFile,
        monacoInstance.getValue(),
        password,
      ).catch(err => {
        const str = err.toString();
        if (/incorrect password/i.test(str)) {
          // reset pwd
          setStore({ password: '' });
        }
        return notification.error({
          description: str,
          message: 'Error when save file',
        });
      });
    }
  };

  const handleOnSave = (val: string) => {
    writeContentToFile(selectedFile, val).catch(e => {
      if (/permission denied/i.test(`${e}`)) {
        needPWDToSave();
      } else {
        return notification.error({
          description: `${e}`,
          message: 'Error when save file',
        });
      }
    });
  };

  const needPWDToSave = () => {
    if (password) {
      usePWDToSave();
    } else {
      setVisible(true);
    }
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
      >
        <Input
          type="password"
          placeholder="Enter sudo password"
          value={password}
          autoFocus
          onChange={_ => setStore({ password: _.target.value })}
        />
      </Modal>
    </>
  );
};
