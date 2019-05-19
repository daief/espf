export enum NODE_ENV {
  DEV = 'development',
  PROD = 'production',
}

export const IS_PROD = process.env.NODE_ENV === NODE_ENV.PROD;

export const STARTUP_FILE_LIST: string[] = [
  'bash_profile',
  'bashrc',
  'zprofile',
  'zshrc',
];

export enum IPC_CHANNEL {
  PWD_CACHE = 'PWD_CACHE',
}
