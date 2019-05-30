import { STARTUP_FILE_LIST } from '@espf/config';
import { Affix, Icon, List, message } from 'antd';
import { clipboard } from 'electron';
import { existsSync } from 'fs';
import { basename, resolve } from 'path';
import * as React from 'react';
import { GlobalCtx } from '../../GlobalCtx';
import { setExtarFileListToCache } from '../../utils';
import styles from './style.module.less';

const { useEffect, useState, useRef, useContext } = React;

const BUILT_IN_LIST: string[] = STARTUP_FILE_LIST
  // prettier-ignore
  .map(_ => [_, `.${_}`])
  .flat<string>()
  .map(_ => [resolve('/etc', _), resolve(process.env.HOME, _)])
  .flat<string>()
  .filter(_ => existsSync(_))
  .sort();

export const FileList: React.SFC<{}> = () => {
  const { store, setStore } = useContext(GlobalCtx);
  const { selectedFile, extraFileList } = store;
  const [userFileList, setUserFileList] = useState(extraFileList);
  const inputRef = useRef<HTMLInputElement>();

  const FILE_LIST = [...userFileList, ...BUILT_IN_LIST];

  useEffect(() => {
    if (!selectedFile && FILE_LIST.length) {
      setStore({
        selectedFile: FILE_LIST[0],
      });
    }
  }, []);

  useEffect(() => {
    setUserFileList(extraFileList.filter(_ => existsSync(_)));
    setExtarFileListToCache(extraFileList);
  }, [extraFileList]);

  const handleAddFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (file && !extraFileList.includes(file.path)) {
      const newList = [file.path, ...extraFileList];
      setStore({
        extraFileList: newList,
        selectedFile: file.path,
      });
    }
  };

  const handleMinusFile = (filepath: string) => (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    const newLs = extraFileList.filter(_ => _ !== filepath);
    setStore({
      extraFileList: newLs,
    });
    if (selectedFile === filepath && FILE_LIST.length) {
      setStore({
        selectedFile: newLs[0] || BUILT_IN_LIST[0],
      });
    } else {
      setStore({
        selectedFile: '',
      });
    }
  };

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        onChange={handleAddFileChange}
        style={{ display: 'none' }}
      />
      <Affix offsetTop={0} target={() => document.getElementById('appLeft')}>
        <div className={styles.actions}>
          <Icon
            type="plus"
            onClick={() => inputRef.current && inputRef.current.click()}
          />
        </div>
      </Affix>
      <List
        dataSource={FILE_LIST}
        className={styles.list}
        split={false}
        renderItem={(filepath: string) => {
          const fileName = basename(filepath);
          const isAddedByUser = extraFileList.includes(filepath);
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
                <a
                  className="action-btn"
                  title="click to copy"
                  onClick={() => {
                    clipboard.writeText(filepath);
                    message.success('Copied to clipboard!');
                  }}
                >
                  <Icon type="copy" />
                </a>,
                isAddedByUser ? (
                  <a
                    className="action-btn"
                    title="delete from list"
                    onClick={handleMinusFile(filepath)}
                  >
                    <Icon type="minus" />
                  </a>
                ) : null,
              ].filter(Boolean)}
            >
              <List.Item.Meta
                title={
                  <p className="file-title" title={fileName}>
                    <Icon
                      className={`title-icon ${
                        isAddedByUser ? 'user-mark' : ''
                      }`}
                      type="file-text"
                    />
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
    </>
  );
};
