let apiKey, html2text, textMaxlength, audioMenuItem, Imgpond, Filepool, MobileLink, tinymceOptions

export const init = (opts = {}) => {
  apiKey = opts.apiKey
  html2text = opts.html2text
  textMaxlength = opts.textMaxlength
  audioMenuItem = opts.audioMenuItem
  Imgpond = opts.Imgpond
  Filepool = opts.Filepool
  MobileLink = opts.MobileLink
  tinymceOptions = opts.tinymceOptions
}

export {
  apiKey, html2text, textMaxlength, audioMenuItem, Imgpond, Filepool, MobileLink, tinymceOptions
}
