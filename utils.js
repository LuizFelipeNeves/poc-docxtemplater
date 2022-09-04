const { writeFileSync, readFileSync } = require("fs");
const { TemplateHandler, MimeType } = require('easy-template-x');
const { join } = require("path");
const { get, set } = require("lodash");

const generateDoc = async (inputName, outputName, data, options = {}) => {
  try {
    console.log('generating ' + outputName)
    const templateFile = await readFileSync(inputName);
    const handler = new TemplateHandler();

    console.log('processing ' + outputName)
    const doc = await handler.process(templateFile, data);

    console.log('writing doc ' + outputName)
    await writeFileSync(outputName, doc);
    console.log("rendered", outputName);
  } catch (error) {
    console.log("An error occured", error);
  }
}

const applyImages = (data, imgsPaths) => {
  return imgsPaths.reduce((acc, key) => {
    const imgsData = get(data, key)
    const newData = imgsData.reduce((acc2, current, index) => {
      const currentPath = join(__dirname, 'images', current)
      const sourceImg = readFileSync(currentPath);
      acc2.push({
        IMAGE: {
          _type: "image",
          source: sourceImg,
          format: MimeType.Png,
          width: 200,
          height: 200
        }
      })
      return acc2
    }, [])

    set(data, key, newData)

    return acc
  }, data);
}

module.exports = { applyImages, generateDoc }