import Write from 'write';
import request, { POST } from '../../../utils/request';

const cloudconvert = new (require('cloudconvert'))('u1FZiHJGOlz8u67WOUcAP_e3fkyA81nJ11kqkhUTSP4mxpEXJb8e0DJMSiwgagFoUnIKdD4Oec1aFb8xkjJbPw');

async function getWordURL(args) {
  const { tripKey, showDayNotes, showImages, showDescriptions, showCategoryAmounts, showLineAmounts } = args;
  const base64 = await request('http://localhost:8529/_db/exo-dev/bbt/convert/getBase64', POST, { tripKey, showDayNotes, showImages, showDescriptions, showCategoryAmounts, showLineAmounts });
  const convertFile = await new Promise((resolve, reject) => {
    cloudconvert.convert({
      inputformat: 'html',
      outputformat: 'docx',
      input: 'base64',
      wait: true,
      download: false,
      file: base64.fileBase64,
      converteroptions: {
        embed_images: true
      },
      filename: `${tripKey}.html`
    })
      .pipe(Write.stream(`../../docs/${tripKey}.doc`)
        .on('finish', () => {
          resolve({ url: `/assets/docs/${tripKey}.doc` });
        })
        .on('error', () => {
          reject('you error param');
        })
      );
  });
  return convertFile;
}

export {
  getWordURL
};
