import { exec } from 'child_process';
import { writeFile } from 'fs';
import { promisify } from 'util';

const pExec = promisify(exec);

export function writeContentToFile(filepath: string, content: string) {
  return new Promise((resolve, reject) => {
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
  const cmd = [
    `echo '${pwd}' | sudo -S chmod 666 ${filepath}`,
    `echo "${content}" > ${filepath}`,
    `echo '${pwd}' | sudo -S chmod 444 ${filepath}`,
  ].join(' && ');

  try {
    await pExec(cmd);
    return sourceFile(filepath);
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function sourceFile(filepath: string) {
  try {
    const result = await pExec(`. ${filepath}`, {
      // shell: process.env.SHELL,
    });
    return result;
  } catch (error) {
    return Promise.reject(error);
  }
}
