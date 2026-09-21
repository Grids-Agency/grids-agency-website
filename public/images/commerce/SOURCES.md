# Commerce preview artwork

These are fictional website concepts designed for the possibilities section, not client projects or endorsements. The SVG files are editable layouts with embedded photographs; the slider uses optimized WebP exports to keep loading lightweight and typography consistent across devices.

`comparison-before` and `comparison-after` show two original layouts for the same fictional furniture brand, using the licensed chair photograph listed below. The first is a conventional template; the second is an editorial redesign. Neither represents an award-winning project or an actual client result. Their editable SVGs and optimized WebP exports are included.

The active slider compares two versions of Forme's Soft Form collection, with the same Loop Chair photograph and brand messaging. The left uses plain typography, a conventional navigation bar, a blue CTA, and three generic feature cards; the right uses an editorial layout.

`comparison-reference.webp` is the earlier website screenshot supplied by the user on September 21, 2026 (`5af200_31fbb5490fb243788ad1bfd15b11aa3a~mv2.avif`). It is retained as a reference and is no longer displayed. Only its outer gray margin was cropped.

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
