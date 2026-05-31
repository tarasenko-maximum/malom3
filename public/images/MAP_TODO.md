# Map Image — Custom Generation Required

The file `map.png` is currently a branded placeholder.  
A custom world map asset should be generated before production launch.

## Recommended Prompt (Midjourney / Flux / Recraft / DALL-E)

> "Minimalist world map illustration, flat design, light grey silhouette continents
> on warm white (#FAFAF8) background, no country labels, no borders, subtle texture.
> Highlighted dots in deep blue (#315972) at: Cyprus, Sweden, Poland, Serbia,
> Middle East. Clean, editorial, architectural style. 1200×600px, PNG."

## Specifications

| Property | Value |
|----------|-------|
| Dimensions | 1200 × 600 px |
| Format | PNG (transparency optional) |
| Style | Minimalist, flat, no fills — outline only |
| Continent fill | #A2A094 (Tatar Sage) at 20–30% opacity |
| Office dots | #315972 (Malom Blue), 6–8px radius |
| Background | #FAFAF8 (Warm White) |
| Labels | None, or very small Inter Light |

## Drop-in Instructions

Replace `images/map.png` with the generated file.  
Dimensions must be exactly 1200×600 or the `<img width="1200" height="600">` 
attribute in `index.html` will cause layout shift.  
Run `git add images/map.png && git commit -m "Replace map placeholder with final asset"`.
