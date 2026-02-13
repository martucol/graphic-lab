# graphic lab

A creative coding lab for p5.js experiments hosted on GitHub Pages.

## Create a new experiment

```sh
npm run new "riso dither"
```

This scaffolds a new folder in `experiments/` with a starter sketch and metadata.

## Run locally

```sh
npm run serve
```

Or use VS Code Live Server. A local server is needed for fetch to work.

## Assets

Drop shared files (images, textures, fonts) into `assets/`. Reference them in sketches:

```js
loadImage(ASSETS_PATH + 'my-texture.jpg');
```

## Libraries

p5.js and p5.sound are included in `lib/` and loaded automatically.

For extra plugins, drop them into `lib/` and list them in your experiment's `meta.json`:

```json
{
  "libs": ["p5.riso.js", "p5.palette.js"]
}
```

They'll be loaded automatically before your sketch runs.
