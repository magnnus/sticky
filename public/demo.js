/* eslint-disable */

var demo1 = new AutoTs.Sticky('.demo1', {
  mode: 'affix',
  top: 0,
  style: {
    margin: 0,
  }
});
var affixBottom = new AutoTs.Sticky('.affix-bottom', {
  mode: 'affix',
  bottom: 40,
});
// var affixLeft = new AutoTs.Sticky('.affix-left', {
//   direction: 'horizontal',
//   mode: 'affix',
//   left: 0,
//   style: {
//     zIndex: 102,
//     bottom: 0,
//   }
// });
// var affixBottom = new AutoTs.Sticky('.affix-right', {
//   direction: 'horizontal',
//   mode: 'affix',
//   right: 0,
//   style: {
//     zInde: 103
//   }
// });

// var demo2 = new AutoTs.Sticky(document.querySelectorAll('.demo2'), {
//   scrollRefer: '.scroll-wrap'
// });

Array.prototype.slice.apply(document.querySelectorAll('.demo2')).forEach(function (el) {
  new AutoTs.Sticky(el, {
    style: {
      top: 0,
    },
    top: 10,
    scrollRefer: '.scroll-wrap'
  })
});

//var demo3 = new AutoTs.Sticky(document.querySelectorAll('.demo3'));
window.demo3 = new AutoTs.Sticky(document.getElementsByClassName('demo3')[0], {
  style: {
    top: '30px',
    zIndex: 300,
  },
  top: 20,
  offsetParent: '.inner-wrap'
});

window.demo3 = new AutoTs.Sticky(document.getElementsByClassName('demo3')[1], {
  style: {
    top: '30px',
    zIndex: 300,
  },
  top: 0,
  offsetParent: '.inner-wrap'
});

// var demo4 = new AutoTs.Sticky('.demo4', {
//   mode: 'affix',
//   top: 0,
//   style: {
//     marginLeft: '200px',
//   }
// });

document.getElementById('destroy').addEventListener('click', function () {
  demo1.destory();
  demo1 = null;
}, false);
document.getElementById('unbind').addEventListener('click', function () {
  demo3.unbind('#demo3-2');
}, false);

