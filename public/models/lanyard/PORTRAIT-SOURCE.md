# Card artwork

The live card and its static preview use the user-provided transparent `portrait-new.png`. The dither renderer preserves its alpha channel so the card background shows through.

`portrait.jpg` is a placeholder photograph from Unsplash, not a photograph of Kyle.

Source: https://images.unsplash.com/photo-1500648767791-00dcc994a43e

`grids-card-portrait.png` is the still Canvas2D rendering of the current card used for reduced-motion and loading/error fallbacks. The live card uses `src/lib/portrait-art.ts` with the supplied dither/shimmer recipe. No 21st.dev implementation code was used.
