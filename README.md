# Img War

A particle simulator using HTML5 canvas and pulled images. Created in 2 days for a school assignment.

Online demo can be seen here: http://sunmock.com/canvas/flamewar/

## Image Particles
Images are pulled from a source, and drawn in pieces on the canvas. Each piece is a particle with 6 different behaviours:
- Orbit Center of canvas
- Avoid each other
- Wander
- Rearrange itself to the original picture
- Orbit center of the mass of particles belonging to same picture
- Attract to each other 
- Boid - Attract but also avoid if too close

Handled in scripts/Image.js

## Background
The background is a series of squares that change colour according to the number of particles in that region. It is also used to optimize collision detection for the particles so that they only check a certain number of surrounding squares for contained particles.

Handled in scripts/Quad.js

## Misc Scripts/APIs
Math.js - For vector objects/calculations. https://gist.github.com/sunmockyang

LibraryMouse.min.js - Mouse coordinates on an element. https://github.com/sunmockyang/LibraryMouse

keycodes.js - Borrowed from here: http://code.google.com/p/keyboarder/downloads/detail?name=keycodes.json
