const { join } = require('path')
const { applyImages, generateDoc } = require('./utils')

const extendOptions = { linebreaks: true }

const data = applyImages({
  first_name: "Luiz",
  last_name: "Neves",
  phone: "0652455478",
  description: "New Website",
  images: ["0.png", "1.png"]
}, ['images']);

console.log(data, extendOptions)

generateDoc("template-img.docx", "temp-template.docx", data, extendOptions).then(() => {
  generateDoc("temp-template.docx", "output.docx", data, extendOptions).then(() => {
    console.log('done')
  })
})