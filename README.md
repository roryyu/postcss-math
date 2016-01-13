# postcss-math
> [PostCSS](https://github.com/postcss/postcss) plugin for extending the function of `calc()`.

## Usage
```js
// dependencies
var fs = require("fs");
var postcss = require("postcss");
var math = require("postcss-math");

// css to be processed
var css = fs.readFileSync('src/app.css', 'utf8');

// process css
postcss([math({precision: 2})]).process(css)
    .then(function (result) {
        fs.writeFileSync('build/app.css', result.css);
    })
    .catch(function (error) {
    	console.error(error);
    });
```

**Example** (with [cssnext](https://github.com/MoOx/postcss-cssnext) enabled as well):

```js
// dependencies
var fs = require("fs");
var postcss = require("postcss");
var next=require('cssnext')({
	browsers:'> 5%',
	features: {
		calc:{precision: 1}
	},
	plugins:[require('postcss-math')({
		precision: 1
	})]
})

// css to be processed
var css = fs.readFileSync('src/app.css', 'utf8');

// process css
postcss([next]).process(css)
    .then(function (result) {
        fs.writeFileSync('build/app.css', result.css);	
    })
    .catch(function (error) {
    	console.error(error);
    });

```

Using this `src/app.css`:

```css
:root{
	--width: 200px;
	--minWidth: 100px;
	--paddingLeft: -20px;
}
h1 {
	width: calc.max(var(--width),var(--minWidth))
	padding-left: calc.abs(var(--paddingLeft));
	height: calc.sqrt(var(--width));
	padding-right: calc.random(10px);
}
```

you will get:

```css
h1 {
  width: 200px;
  padding-left: 20px;
  height:14.1px;
  /**10px*Math.random()**/
  padding-right: 9.8px;
}
```

### Options

#### `precision` (default: `5`)

Allow you to definine the precision for decimal numbers.

```js
var out = postcss()
  .use(math({precision: 10}))
  .process(css)
  .css
```
### Math Functions
please refer to [Mozilla/Math](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math)


## [Changelog](CHANGELOG.md)

## [License](LICENSE)