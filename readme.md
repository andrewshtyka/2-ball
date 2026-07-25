# Three.js: rotating ball and timers

**Watermelon and timers rotate and react on hover**

Live website: https://2-ball-shtyka.netlify.app/

---

### Install

```bash
npm i
```

<br/>

### Run local server

```bash
npm run dev
```

<br />

---

### ✅ Done:

1. Ball `rotates`
2. Texts are bended and `rotate`
3. Whole scene react on cursor (`rotate` towards it)
4. Added debug ui with tweaks for `rotation` direction, `speed`, `cursor reaction`, etc.

<br />

### ⚠️ Caution:
**Live timers' update requires recalculation of all text geometries each second.** \
This behavior is `sync` (heavy), and blocks main JS thread. On low-end devices you may notice the ball rotating slightly faster then expected each second.