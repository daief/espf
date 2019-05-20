import { notification } from 'antd';
import { exec } from 'child_process';
import { writeFile } from 'fs';
import { promisify } from 'util';

const pExec = promisify(exec);

export function testNoPermission(s: any) {
  return /permission denied/i.test(`${s}`);
}

export function writeContentToFile(filepath: string, content: string) {
  return new Promise((_, reject) => {
    writeFile(filepath, content, err => {
      if (err) {
        return reject(err.toString());
      }

      return sourceFile(filepath);
    });
  });
}

export async function sudoWriteFile(
  filepath: string,
  content: string,
  pwd: string,
) {
  pwd = pwd || '';
  const cmd = [
    `echo '${pwd}' | sudo -S chmod 666 ${filepath}`,
    `echo "${content}" > ${filepath}`,
    `echo '${pwd}' | sudo -S chmod 444 ${filepath}`,
  ].join(' && ');

  try {
    await pExec(cmd);
  } catch (error) {
    return Promise.reject(error);
  }

  return sourceFile(filepath);
}

export async function sourceFile(filepath: string) {
  try {
    const result = await pExec(`. ${filepath}`, {
      // shell: process.env.SHELL,
    });
    return result;
  } catch (error) {
    // resolve source error
    notification.error({
      description: `${error}`,
      message: 'Error when source file',
    });
    return '';
  }
}

// https://developer.mozilla.org/zh-CN/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#Unicode%E9%97%AE%E9%A2%98
export function b64EncodeUnicode(str: string) {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => {
      // @ts-ignore
      return String.fromCharCode('0x' + p1);
    }),
  );
}

// https://developer.mozilla.org/zh-CN/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#Unicode%E9%97%AE%E9%A2%98
export function b64DecodeUnicode(str: string) {
  return decodeURIComponent(
    atob(str)
      .split('')
      .map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );
}

export function setPwdToCache(pwd: string) {
  localStorage.setItem('password', b64EncodeUnicode(pwd || ''));
}

export function getPwdTFromache() {
  try {
    return b64DecodeUnicode(localStorage.getItem('password') || '');
  } catch (_) {
    return '';
  }
}
