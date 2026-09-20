# SignSpeak PWA

Installable web app for English ⇄ Indian Sign Language: the Nocturne home-screen design, ported to plain HTML/CSS/JS with a Three.js avatar slot. No build step — it deploys as static files.

## Run it locally

Camera, microphone and the service worker need HTTPS **or** `localhost`.

```bash
cd signspeak-pwa
python -m http.server 8080        # or: npx serve
# open http://localhost:8080
```

To test on your phone, deploy (below) or use an HTTPS tunnel such as ngrok.

## Deploy (GitHub → Vercel)

1. Push this folder to a GitHub repo.
2. In Vercel: **Add New → Project → import the repo**. Framework preset **Other**, no build command, output directory `.` (root).
3. Open the site on your phone and choose **Add to Home Screen** (Android/Chrome also offers Install in Profile).

`vercel.json` sets the right headers for `sw.js`, the manifest and `.glb` files.

## Adding your first clip (Summer)

The app is ready for it: the Dictionary already lists **Summer** with `file: 'assets/clips/summer.glb'`. Until that file exists you'll see a stand-in figure and Summer shows "Coming soon".

1. **Export from Blender:** File → Export → glTF 2.0, Format **glTF Binary (.glb)**. Export the armature and body mesh, include animation, and make sure the animation you want (the Summer action) is the one exported. Option labels vary a little between Blender versions.
2. Save it as `assets/clips/summer.glb`.
3. Reload. Summer becomes playable in the Dictionary, and typing "summer" in Translate signs it.

**How clips and the character fit together**

- One character is shown and clips are swapped onto it, so **every clip must come from the same rig with the same bone names**. Keep using the one Blender file and export each sign from it.
- By default the first available clip's `.glb` (mesh + rig + animation) is the character. If you'd rather keep the character separate, export it once to `assets/avatar/character.glb` and set `character: 'assets/avatar/character.glb'` in `js/clips.js`.
- If a `.glb` holds several animations, the first is used. Set `clip: 'Summer'` on the sign to pick one by name.
- The character rests on frame 1 of the first clip, so start every clip in the same neutral pose. Clips hold their last frame, so end in it too.

**Adding more signs:** save the `.glb`, then add `file: 'assets/clips/<id>.glb'` to that sign in `js/clips.js` (or add a new `{ id, en, tag }` entry). Nothing else changes.

**Framing:** if the character is cropped or too small, tune `AVATAR.frame` in `js/clips.js` (`focusY` = where the camera looks, `height`/`width` = how much is visible, as fractions of the character's height).

## What works today

- **Translate:** type or speak (Chrome/Edge/Safari) → words are matched to signs and played in order. Words without a clip are listed. Replay button, Slow/Normal speed in Profile.
- **Dictionary:** search, expand a sign, loop/pause its demo.
- **Scan sign:** opens the camera preview. **Recognition is not connected**; fill in `js/recognizer.js` (the contract is documented at the top of that file).
- **Offline:** the app shell works offline after the first visit, and any clip you've viewed is cached.

## Not done yet

- English → ISL grammar: `js/gloss.js` keeps English word order (only maps words that have a sign). Real gloss reordering goes in `toGloss()`.
- ISL → English recognition model (see above).
- Not yet tested with your real MPFB/Blender rig — only with a synthetic test rig. If a clip plays but the character doesn't move, the bone names between the character and the clip don't match.

## Updating

- After changing the list of files in the shell, bump `VERSION` in `sw.js`.
- To rebuild the bundled Three.js: `cd tools && npm install && npm run build:vendor`.

## Layout

```
index.html            app markup
css/                  Nocturne tokens + app styles
js/app.js             UI, navigation, speech, camera
js/avatar.js          Three.js avatar (load, frame, play clips)
js/clips.js           avatar config + the list of signs   ← edit this
js/gloss.js           English text → sign ids
js/recognizer.js      ISL → English hook (stub)
js/store.js           localStorage (direction, speed, progress)
sw.js, manifest.webmanifest, icons/
vendor/               Three.js bundle, Phosphor icons (self-hosted for offline)
assets/clips/         put sign .glb files here
```

Third-party: Three.js (MIT), Phosphor Icons (MIT), Inter (SIL OFL), Nocturne design tokens from your design bundle.
