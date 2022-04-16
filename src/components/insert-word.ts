import mammoth from 'mammoth/mammoth.browser.min.js'
import { waitFor } from 'kayran'
import { name } from '../../package.json'
import 'cozyalert/dist/style.css'
import Swal, { confirm } from 'cozyalert'

export default miniMCE => confirm({
  input: 'file',
  inputAttributes: {
    placeholder: '将 docx 文件拖到此处',
    multiple: true,
  },
  titleText: '插入 Word 文档',
  confirmButtonText: `确定`,
  showLoaderOnConfirm: true,
  preConfirm: (fileList: FileList | null) => {
    if (fileList) {
      return Promise.allSettled([...fileList].map(file =>
        new Promise((resolve, reject) => {
          if (!file.name.endsWith('.docx')) {
            reject('仅支持 docx 格式')
          }

          const reader = new FileReader()
          reader.onload = async e => {
            const arrayBuffer = e.target.result
            if (arrayBuffer.byteLength) {
              const [res, err] = await waitFor(mammoth.convertToHtml({ arrayBuffer }))
              if (err) {
                reject(err)
              } else {
                const { messages, value } = res
                console.log(`[${name}] ${file.name} 解析结果：`, res)
                if (value) {
                  resolve(value)
                } else {
                  reject(`${file.name} 内容为空`)
                }
              }
            } else {
              reject(`${file.name} 内容为空`)
            }
          }
          reader.readAsArrayBuffer(file)
        })
      )).then(results => {
        results.map(result => {
          const { status, value, reason } = result
          if (status === 'fulfilled') {
            miniMCE.insertContent(value)
          } else {
            if (reason) {
              if (typeof reason === 'string') {
                Swal.showValidationMessage(reason)
              } else {
                console.error(reason)
                Swal.showValidationMessage('解析失败')
              }
            }
          }
        })
      })
    } else {
      Swal.showValidationMessage('未选择任何文件')
    }
  },
})
