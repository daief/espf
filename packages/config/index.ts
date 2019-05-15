export enum NODE_ENV {
  DEV = 'development',
  PROD = 'production',
}

export const IS_PROD = process.env.NODE_ENV === NODE_ENV.PROD;
