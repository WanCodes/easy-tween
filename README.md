## Easy Tween

`easy-tween` is a very small JavaScript helper that makes it easy to apply CSS transitions to DOM elements using a simple, chainable API.

The project consists of:
- `easy-tween.js` – the tween helper
- `index.html` – a minimal demo page that uses `easy-tween.js`

## Getting Started

1. Open `index.html` in a modern browser.
2. You should see a red box animate to a wider blue box using `easy-tween`.

The example in `index.html` calls:

```js
tween.to("box", 2, {"background-color":"blue", "width":"300px"});
```

This:
- Selects the element with id `box`
- Animates over `2` seconds
- Tweens the `background-color` and `width` using CSS transitions

## Using `easy-tween.js` in Your Own Page

1. Include the script:

```html
<script src="easy-tween.js"></script>
```

2. Make sure the element you want to animate has an `id`.
3. Call `tween.to`:

```js
tween.to("myElementId", 1.5, {
  width: "300px",
  height: "200px",
  "background-color": "blue"
});
```

## Supported Options

The third argument to `tween.to` is an object of CSS properties plus a few special options:

- `delay` – delay before the transition starts (in seconds)
- `ease` – value for `transition-timing-function` (e.g. `"ease-in-out"`, `"linear"`)
- `onComplete` – a callback function invoked when the transition ends

Example:

```js
tween.to("box", 2, {
  width: "300px",
  "background-color": "blue",
  delay: 0.5,
  ease: "ease-in-out",
  onComplete: function () {
    console.log("Animation finished!");
  }
});
```

## Browser Support

`easy-tween` uses CSS transitions and adds several vendor-prefixed event listeners (`webkit`, `moz`, `ms`, `o`) to detect when the transition ends. It is intended for modern browsers that support CSS transitions.

## License

You can customize this section with your preferred license text.
