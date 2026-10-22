# easy-tween

A lightweight JavaScript helper that animates DOM elements with CSS transitions. One file, no dependencies, and no build step.

**Wan Yau** · [GitHub @WanCodes](https://github.com/WanCodes)

`easy-tween` is the script behind a one-line animation call. The repository description sums up the original intent: a small helper "to make dynamic JavaScript animation much easier and lightweight." Loading [`easy-tween.js`](easy-tween.js) creates a global `tween` object. [`index.html`](index.html) is a self-contained demo. The helper was committed in July 2018.

Wan Yau's public GitHub profile: Senior Full Stack Developer · React, React Native & TypeScript · London.

## What a call does

```js
tween.to(id, duration, properties)
```

`to` looks up an element with `document.getElementById`, writes the destination values as inline styles, and sets a CSS transition so the browser interpolates them. Three keys are configuration. Every other key is a CSS property.

| Argument | Type | Meaning |
| --- | --- | --- |
| `id` | string | Element id. Passed straight to `document.getElementById`. |
| `duration` | number | Transition length in **seconds**. Each property is listed as `"<name> <duration>s"`. `2` means two seconds. |
| `properties` | object | CSS destinations plus the reserved keys `delay`, `ease`, and `onComplete`. |

The method returns `undefined`. Calls are separate statements.

```js
tween.to("box", 2, {
  "background-color": "blue",
  width: "300px"
});
```

For that call the script:

1. Resolves `#box` and clears the delay stored on the shared `tween` instance.
2. Walks the object with `for...in`. `delay`, `ease`, and `onComplete` are stored. Every other key is written to `element.style[key]` and appended to the transition list.
3. Assigns that list to `transition` and `WebkitTransition`. The demo's list is `background-color 2s,width 2s`.
4. Assigns `transitionDelay` and `WebkitTransitionDelay` (`transition-delay` and `-webkit-transition-delay`). With no `delay` key, the value is `0s`.
5. When `ease` is present, assigns `transitionTimingFunction` and `WebkitTransitionTimingFunction`.

Duration, delay, and easing are shared by every property in the call. In Chrome, a three-property call with `duration` `0.4`, `delay` `0.1`, and `ease` `"ease-in-out"` started three transitions, each 400ms long, delayed 100ms, timed with `ease-in-out`. Chrome's serialized `transition` shorthand can show that delay and easing on the first property only. The longhands are single values, and each property's animation uses them.

## Demo

`index.html` styles a single square and tweens it on load. The starting look lives in CSS, which is what gives the transition a from-value:

```css
#box {
    background-color: red;
    width: 100px;
    height: 100px;
}
```

```js
tween.to("box", 2, {"background-color": "blue", "width": "300px"});
```

On load, the 100×100 red square widens to 300px and turns blue over two seconds. Height stays 100px.

From the repository root, open the file directly, or serve the directory:

```bash
python3 -m http.server 8080
```

Then visit `http://127.0.0.1:8080/`. The demo is a classic script tag with a relative `src`, so either a local static server or opening `index.html` from disk is enough. Nothing is installed first.

## Use it on a page

Place the element in the document, then load the script and call `tween.to`. The demo keeps the script after the element so the id already exists.

```html
<div id="box"></div>
<script src="easy-tween.js"></script>
<script>
  tween.to("box", 1.25, {
    width: "320px",
    "background-color": "#1d4ed8",
    transform: "translateX(48px)",
    opacity: "1",
    delay: 0.25,
    ease: "ease-in-out",
    onComplete: function () {
      console.log("done");
    }
  });
</script>
```

Give the element its starting styles in CSS (size, color, opacity, transform). `easy-tween.js` is the whole library. Load it with a script tag, as the demo does. The file declares a global `Tween` constructor and a global `tween` instance.

## API

### `tween.to(id, duration, properties)`

Defined on `Tween.prototype` and used through the shared `tween` instance created at the bottom of `easy-tween.js`.

A missing id throws a `TypeError` when the script reads `.style` on `null`.

Pass at least one CSS property. A call whose object contains only `delay`, `ease`, or `onComplete` builds an empty transition list. After the trailing comma is stripped, that assigns `transition` to `""` and clears a transition already on the element.

### Reserved keys

These three names are read inside the loop and are left out of the transition list.

| Key | Type | Effect |
| --- | --- | --- |
| `delay` | number | Seconds before the transition starts. Written as `"<delay>s"` to `transition-delay` and `-webkit-transition-delay`. Each call sets this to `0` first, then overwrites it when `delay` is present, so an omitted `delay` stores `0s` and clears a previous delay on that element. |
| `ease` | string | Value for `transition-timing-function` and `-webkit-transition-timing-function`. Typical values are `"linear"`, `"ease-in-out"`, and `"cubic-bezier(0.22, 1, 0.36, 1)"`. The string is written through as given. |
| `onComplete` | function | Called with no arguments from the first transition-end event. Details below. |

Rewriting `transition` on every call resets the timing function to the CSS initial value, `ease`. A later call keeps a custom curve only when it passes `ease` again. `delay` is always written, using `0s` when the key is absent.

### CSS properties

Any other enumerable key is a destination:

- `element.style[key] = value`
- the transition shorthand gains `"key <duration>s"`

Use CSS property names, hyphenated where CSS hyphenates them: `"background-color"`, `"margin-left"`, `"font-size"`, `"transform"`. The demo uses `"background-color"` and `"width"`. Pass complete CSS values, including units (`"300px"`). The helper writes each value through unchanged.

Keys are copied into the shorthand unchanged. In Chrome, this call created no transitions and both values snapped to the destination immediately:

```js
tween.to("box", 0.4, { backgroundColor: "blue", width: "200px" });
```

The inline styles were set (`background-color` became blue, `width` became `200px`), and `element.getAnimations()` was empty. `backgroundColor` is not a CSS transition-property name, and that call did not start a `width` transition either.

Values that CSS can interpolate (`width`, `opacity`, `transform`, `background-color`, and the rest of the transitionable set) animate. When CSS cannot interpolate a property, the destination is applied immediately.

### `onComplete`

When `onComplete` is provided, the element listens for all of these events:

- `transitionend`
- `webkitTransitionEnd`
- `mozTransitionEnd`
- `msTransitionEnd`
- `oTransitionEnd`

The first event to run the handler removes all five listeners, then calls the function with no arguments. One `tween.to` therefore runs its callback once, including when several properties finish together. The callback receives no event.

The listener is attached to the tweened element and reads `event.target`. The first matching event wins, including a `transitionend` that bubbles from a descendant.

If the call does not produce a transition — the computed value is already the destination, or the name is not a transitionable CSS property — `transitionend` does not fire and `onComplete` is not called. Listeners from an earlier call stay in place until one of them fires. A second `tween.to` on the same element, made before that happens and given its own `onComplete`, adds another set of listeners.

```js
tween.to("box", 2, {
  width: "300px",
  "background-color": "blue",
  delay: 0.5,
  ease: "ease-in-out",
  onComplete: function () {
    console.log("Animation finished");
  }
});
```

## Behavior worth knowing

- **One shared instance.** `var tween = new Tween()` runs once. `_elementTag`, `_duration`, and `_delayTransition` are replaced on every call. A new call leaves the previous element's inline styles and `transition` as they were.
- **From-values come from styles already flushed.** `index.html` does this by setting the red square in CSS and calling `tween.to` afterward. An inline start value written in the same turn as `tween.to` is not the from-value. Checked against this script: an element whose stylesheet set `margin-left: 0` was assigned `margin-left: 10px` and then tweened to `200px` synchronously. The running transition's computed `margin-left` at progress `0` was `0px`.
- **Destinations stay inline** after the transition ends. Animate again by calling `tween.to` with a new destination.
- **Property order** in the shorthand follows `for...in` order. A plain object literal is the input the helper expects.

## Browser support

The script targets browsers that implement CSS transitions. It sets `transition`, `transitionDelay`, and `transitionTimingFunction`, plus the matching `WebkitTransition`, `WebkitTransitionDelay`, and `WebkitTransitionTimingFunction` properties. Completion listens for `transitionend` and for the prefixed `webkitTransitionEnd`, `mozTransitionEnd`, `msTransitionEnd`, and `oTransitionEnd` events. The first of those events handles completion.

## Project layout

| File | Role |
| --- | --- |
| `easy-tween.js` | The helper. Global `Tween` and `tween`. |
| `index.html` | Demo page. |
| `README.md` | This document. |

## License

This repository does not include a license file.
