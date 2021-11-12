const postcss = require('postcss');

const plugin = require('./');

async function run(input, output, opts = {}) {
  const result = await postcss([plugin(opts)]).process(input, { from: undefined });

  expect(result.css).toEqual(output);
  expect(result.warnings()).toHaveLength(0);
}

it('convert color(display-p3 0 0 0) to hex', async () => {
  await run(
    `
    * {
      background: color(display-p3 1 0 0);
    }
  `,
    `
    * {
      background: color(display-p3 0 0 0);
    }
  `
  );
});
