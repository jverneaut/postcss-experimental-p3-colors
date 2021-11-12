const postcss = require('postcss');
const sharp = require('sharp');
const tmp = require('tmp');
const fs = require('fs');

const keys = ['background', 'backgroundColor'];

module.exports = (opts = {}) => {
  return {
    postcssPlugin: 'display-p3',
    Declaration: Object.fromEntries(
      keys.map((key) => [
        key,
        async (decl) => {
          const displayP3Match = new RegExp(/color\(display-p3 *(.*)\)/g).exec(decl.value);
          if (!displayP3Match) return;

          const p3Values = displayP3Match[1].replace(/\s+/g, ' ').split(' ');

          const rgb = [p3Values[0] || 0, p3Values[1] || 0, p3Values[2] || 0].map((value) =>
            Math.floor(parseFloat(value) * 255)
          );

          await new Promise((resolve) => {
            tmp.file(
              {
                postfix: '.png',
              },
              async (err, path, fd, cleanupCallback) => {
                if (err) throw err;

                await sharp({
                  create: {
                    width: 1,
                    height: 1,
                    channels: 3,
                    background: { r: rgb[0], g: rgb[1], b: rgb[2] },
                  },
                })
                  .pipelineColorspace('rgb16')
                  // .withMetadata({ icc: path.join(__dirname, '/DisplayP3Compat-v2-micro.icc') })
                  .withMetadata({ icc: 'p3' })
                  .toFile(path);

                const generatedImage = fs.readFileSync(path);
                const generatedImageBase64 = Buffer.from(generatedImage).toString('base64');
                const generatedImageBase64Prefixed = `data:image/png;base64,${generatedImageBase64}`;

                const value = `url(${generatedImageBase64Prefixed})`;

                decl.value = decl.value.replace(/color\(display-p3 *(.*)\)/g, value);

                cleanupCallback();
                resolve();
              }
            );
          });
        },
      ])
    ),
  };
};

module.exports.postcss = true;
