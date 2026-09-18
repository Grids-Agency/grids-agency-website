# Commerce preview artwork

These are fictional website concepts designed for the possibilities section, not client projects or endorsements. The SVG files are editable layouts with embedded photographs; the slider uses optimized WebP exports to keep loading lightweight and typography consistent across devices.

Photography is used under the [Unsplash License](https://unsplash.com/license):

- `forme`: [Sculptural armchair](https://unsplash.com/photos/a-unique-sculptural-armchair-with-rounded-forms-dJgFoSzEf6s) by Eugenia Pan'kiv.
- `atelier`: [Concrete building](https://unsplash.com/photos/brown-concrete-building-during-daytime-qQ_LvMMNXoM) by RUBENIMAGES.
- `still`: [Aerial coastline](https://unsplash.com/photos/an-aerial-view-of-a-beach-with-rocks-and-water-7VroMbIpWdM) by Eduardo Drapier.

To export an updated layout, use the project's existing Sharp dependency:

```js
await sharp("public/images/commerce/forme.svg")
  .webp({ quality: 88, effort: 5 })
  .toFile("public/images/commerce/forme.webp");
```
