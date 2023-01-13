export interface CodeMessage {
  getMessage: (code: number) => string
  [key: number]: string
}
