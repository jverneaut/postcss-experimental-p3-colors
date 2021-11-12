# PostCSS Experimental P3 Colors

⚠️ This project is experimental and should not be used without a full understanding of its shortcomings.

## What is this?

This project is a PostCSS plugin that allows the display of colors from the Display-P3 color space on compatible monitors. It is a partial implementation of the syntax defined here: [color() - CSS: Cascading Style Sheets | MDN](<https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color()>)

Although Google Chrome currently allows the display of P3 tagged images, this proposal is only implemented in Safari as of november 2021.

## How does it work?

This implementation is quite naïve in its approach and should not be relied upon for Serious Business™.

Given a color defined as rgb in the following form:

```css
background: color(display-p3 0 0.5 0);
```

...this plugin will:

1. Map each rgb values to their 8 bits counterparts
2. Generate a temporary PNG File containing a single pixel of the provided color
3. Add metadata to the file to enable the Display-P3 color profile
4. Convert the image to base64
5. Replace the whole `color()` function with the inlined version of the base64 image.

## Limitations

The conversion happens at build time. As such :

- You can't animate colors applied using this method
- You can't use javascript to manipulate colors
- Each time a color is defined in CSS, ~740 bytes are added to your file.
