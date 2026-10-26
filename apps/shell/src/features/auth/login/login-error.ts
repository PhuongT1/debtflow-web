export function getLoginErrorKey(error: string) {
  if (error === 'CredentialsSignin') {
    return 'invalidCredentials';
  }

  return 'systemError';
}
