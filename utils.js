const fs = require("fs");
const DocxTemplater = require("docxtemplater");

const ImageModule = require("docxtemplater-image-module-free");
const JSZip = require("jszip");
const { join } = require("path");

const opts = {
  getImage: function (tagValue) {
    console.log('getImage', tagValue);
    return fs.readFileSync(join(__dirname, 'images', tagValue));
  },
  getSize: function (img, tagValue, tagName) {
    return [100, 100]
  }
};

const generateDoc = async (inputName, outputName, data, options = {}) => {
  const imageModule = new ImageModule(opts);
  const content = await fs.readFileSync(inputName);

  const zip = new JSZip(content);
  const doc = new DocxTemplater(zip, { modules: [imageModule], ...options })

  try {
    await doc.renderAsync(data);
    const buffer = doc.getZip().generate({
      type: "nodebuffer",
      compression: "DEFLATE"
    });

    await fs.writeFileSync(outputName, buffer);
    console.log("rendered", outputName);
  } catch (error) {
    console.log("An error occured", error);
  }
}

const _fixImages = (data, prefix) => {
  return data.reduce((acc, current, index) => {
    const [imgId] = current.split('.')
    acc[`${prefix}_${index}`] = current
    return acc
  }, {})
}

const applyImages = (data, imgsPaths) => {
  return imgsPaths.reduce((acc, key) => {
    const imgsData = _fixImages(data[key], key)
    const imgStr = Object.keys(imgsData).map(keyPath => `{%${keyPath}}`).join('\n')
    return Object.assign(acc, {
      [key]: imgStr,
      ...imgsData
    })
  }, data);
}

module.exports = { applyImages, generateDoc }