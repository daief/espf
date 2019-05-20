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
