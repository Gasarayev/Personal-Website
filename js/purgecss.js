const fs = require('fs');
const { PurgeCSS } = require('purgecss');
const postcss = require('postcss');
const cssnano = require('cssnano');

const purgeAndMinifyCSS = async () => {
    
  const purgeCSSResult = await new PurgeCSS().purge({
    content: ['**/*.html', '**/*.js'],
    css: ['css/style.css'],
  });

  const minifiedCSS = await postcss([cssnano]).process(purgeCSSResult[0].css, { from: undefined });

  fs.writeFileSync('css/style.min.css', minifiedCSS.css);

  console.log('CSS successfully purged and minified.');
};

purgeAndMinifyCSS();
