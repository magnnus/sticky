# sticky

a sticky lib to simulate stickily positioned element.

## Features

+ typescript features & vanilla js  
+ use CSS `sticky` firstly  
+ support ie9+

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

### import as a module

```
import Sticky from '@autots/sticky';

// 1. The simplest way
new Sticky('#demo');

// 2. use config
new Sticky('.classname', {
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
|:-----------:|:----------:|:----------:|:-------:|:-----------------------|
| top | number \| string | 0 | true | css top property |
| zIndex | number | 100 | true | css z-index  property |
| throttle | boolean | false | true | throttle feature when use scroll event |
