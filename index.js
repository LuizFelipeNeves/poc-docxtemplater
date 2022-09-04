const {
  get
} = require('lodash')
const {
  join
} = require('path')
const flatten = require('flat')
const {
  applyImages,
  generateDoc
} = require('./utils')

const initialData = require('./data.json')

console.log('loaded data')

const paths = get(initialData, 'IMOVEL.AREAS', []).map((_, index) => `IMOVEL.AREAS.[${index}].IMAGES`)
const data = applyImages(initialData, paths);

const fixed = flatten(data, {
  safe: true
})

generateDoc("templates/Laudo de vistoria casa.docx", "output.docx", fixed).then(() => {
  console.log('done')
})