import { Empty, notification } from 'antd';
import { readFile } from 'fs';
import * as React from 'react';
import FileList from './components/FileList';
import Editor from './components/MonacoEditor';
import { GlobalCtx } from './GlobalCtx';
import styles from './styles/app.module.less';

export const App: React.SFC<{}> = () => {
  const { store } = React.useContext(GlobalCtx);
  const { selectedFile } = store;
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

  const handleOnSave = () => {
    // tslint:disable-next-line: no-console
    console.log(selectedFile);
    // writeFile(selectedFile, val, err => {
    //   if (err) {
    //     return notification.error({
    //       description: err,
    //       message: 'Error when save file',
    //     });
    //   }
    // });
  };

  return (
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
  );
};
