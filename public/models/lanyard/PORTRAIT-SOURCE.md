# Card artwork

The live card and its static preview use the user-provided transparent lightbulb image `portrait-new2.png`, configured once in `src/components/studio-lanyard.tsx`. The dither renderer preserves its alpha channel so the card background shows through.

`portrait.jpg` is a placeholder photograph from Unsplash, not a photograph of Kyle.

Source: https://images.unsplash.com/photo-1500648767791-00dcc994a43e

The reduced-motion and loading/error preview layers the shared portrait over `grids-card.svg`, matching the live card's artwork placement. `grids-card-portrait.png` is an older still and is no longer used by this component. The live card uses `src/lib/portrait-art.ts` with the supplied dither/shimmer recipe. No 21st.dev implementation code was used.
