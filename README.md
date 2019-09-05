# sticky

a sticky lib to simulate stickily positioned element.

## Features

+ typescript features & vanilla js  
+ use CSS `sticky` firstly  
+ support ie9+
+ only support sticky `top`

## Installing

Using npm:

```
$ npm install @autots/sticky -S
```

Using yarn:

```
$ yarn add @autots/sticky
```

## Example

### layouts

```
<section id="demo">
  <div class="child"></div>
</section>
```

**Note:** When the host browser doesn't support css `position: sticky`, the lib will fall back to use `scroll` event on window object, and set some css properties to his fisrtElementChild.

### import as a module

```
import Sticky from '@autots/sticky';

// 1. The simplest way
new Sticky('#demo');

// 2. use config
new Sticky('#demo', {
  top: 10,
  zIndex: 100
})
```

### import as a lib

```
<script src="dist/sticky.min.js"></script>

<script>
  var stickyDemo = new AutoTs.Sticky(el, config);
</script>
```

## Config

| Name | Type | Default | Optional | Description |
|:-----------:|:---------------:|:----------:|:-------:|:-----------------------|
| scrollContainer | string \| HTMLElement \| Document \| Window | window | true | scroll container |
| top | number | 0 | true | css top (`px`) property |
| zIndex | number | 100 | true | css z-index  property |
| throttle | boolean | false | true | throttle feature when use scroll event(assigned when encounter special cases) |

## Todo

+ support config `direction`  