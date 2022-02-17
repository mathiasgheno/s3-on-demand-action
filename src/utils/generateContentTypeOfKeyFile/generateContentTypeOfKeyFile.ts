
export type ContentType =
  'text/html'
  | 'text/css'
  | 'application/javascript'
  | 'text/plain'

export type GenerateContentTypeOfKeyFile = (Key: string) => ContentType;

export const generateContentTypeOfKeyFile: GenerateContentTypeOfKeyFile = (Key) => {
  const keysElements = Key.toLowerCase().split('.');
  const extension = keysElements[keysElements.length - 1];
  switch (extension) {
    case 'js':
      return 'application/javascript';
    case 'css':
      return 'text/css';
    case 'html':
      return 'text/html';
    default:
      return 'text/plain'
  }
}
