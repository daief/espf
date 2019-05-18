import { STARTUP_FILE_LIST } from '@espf/config';
import { Icon, List } from 'antd';
import { existsSync } from 'fs';
import { basename, resolve } from 'path';
import * as React from 'react';
import { GlobalCtx } from '../../GlobalCtx';
import styles from './style.module.less';

const actualFileList: string[] = STARTUP_FILE_LIST
  // prettier-ignore
  .map(_ => [_, `.${_}`])
  .flat<string>()
  .map(_ => [resolve('/etc', _), resolve(process.env.HOME, _)])
  .flat<string>()
  .filter(_ => existsSync(_))
  .sort();

export const FileList: React.SFC<{}> = () => {
  const { store, setStore } = React.useContext(GlobalCtx);
  const { selectedFile } = store;

  React.useEffect(() => {
    if (!selectedFile && actualFileList.length) {
      setStore({
        selectedFile: actualFileList[0],
      });
    }
  }, []);

  return (
    <List
      dataSource={actualFileList}
      className={styles.list}
      split={false}
      renderItem={(filepath: string) => {
        const fileName = basename(filepath);
        return (
          <List.Item
            key={filepath}
            className={selectedFile === filepath ? 'active' : ''}
            onClick={() => {
              setStore({
                selectedFile: filepath,
              });
            }}
            actions={[
              <a className="copy-click" title="click to copy">
                <Icon type="copy" />
              </a>,
            ]}
          >
            <List.Item.Meta
              title={
                <p className="file-title" title={fileName}>
                  <Icon type="file-text" />
                  &nbsp;&nbsp;
                  {fileName}
                </p>
              }
              description={
                <p className="file-abs-path" title={filepath}>
                  {filepath}
                </p>
              }
            />
          </List.Item>
        );
      }}
    />
  );
};
