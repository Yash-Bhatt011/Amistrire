# AMISTRIÉ — Precision 3D Printing Studio (Phase 1)

A cinematic, scroll-driven 3D printer showcase built with Next.js 15,
React Three Fiber, GSAP ScrollTrigger, and Framer Motion.

## What this is (and isn't)

This delivers the **spirit** of the original "ultra-realistic 3D printing
website" brief — a scroll-controlled cinematic printer experience, live
material switching, a 3D object catalog, and a custom-print upload flow —
built with an **original, non-replica printer design** and **procedural
geometry** rather than the literal specification, for two real reasons:

1. **Trademark risk.** An exact replica of a specific commercial printer
   (down to decals and part geometry) risks trade-dress/trademark issues.
   AMISTRIÉ's printer is an original industrial design.
2. **Technical reality.** True ray-traced reflections, 8K textures, and
   fingerprint/scratch-level micro-detail aren't achievable in a browser at
   production performance today — and directly conflict with the
   sub-3-second load / 95+ Lighthouse targets also requested. This build
   prioritizes the performance targets, since those are honorable and
   achievable, and gets as close to "premium and cinematic" as real-time
   WebGL PBR allows within that budget.

## What's real and working in this phase

- **Scroll-driven camera choreography** (GSAP ScrollTrigger) matching the
  spec's 0/20/40/60/80/100% beats — idle → start → printing → nozzle
  close-up → finished part → transition.
- **An original printer rig**: moving X-axis carriage, Y-axis bed motion,
  spinning cooling fans, pulsing LED status (idle/heating/printing/done),
  PTFE tube, wiring harness with subtle sway, procedural print-bed grid
  texture, filament spool with a semi-transparent material.
- **Procedural layer-by-layer print growth**, instanced for performance,
  driven directly by scroll progress.
- **Live filament switching** (PLA/PETG/TPU/ABS/Silk PLA/Carbon Fiber PLA)
  that updates the printer AND the product catalog in real time via a
  shared Zustand store.
- **A procedural product catalog** (3 rotating objects with studio
  lighting/reflections) standing in for "dragon statues, keychains,
  architectural models," etc. — swap in real GLB models here later.
- **STL/OBJ/3MF upload** with a clearly-labeled rough estimate (time,
  material, cost) based on file size — **not a real slicer**. Real slicing
  needs a WASM slicing engine or backend service; see roadmap below.
- **Performance practices applied throughout**: DPR capping, mobile shadow
  disabling, lazy-loaded/code-split 3D canvases (dynamic import + Intersection
  Observer), particle count scaling by device tier, `prefers-reduced-motion`
  support, instanced meshes instead of per-layer draw calls.

## Getting started

```bash
cp .env.example .env   # not required for Phase 1, only for Phase 2 features
npm install
npm run build           # verify it compiles — report any errors back
npm run dev              # localhost:3000
```

## Roadmap (not built yet)

- **Real slicing engine** for accurate layer preview/time/cost (biggest
  remaining gap versus the original brief)
- **Interactive exploded view** of the printer
- **Real GLB product models** replacing the procedural placeholders
  (Draco/Meshopt-compressed, KTX2 textures)
- **Checkout** (Stripe/Razorpay) and order storage (Supabase)
- **Admin/catalog management** so products aren't hardcoded

Same caveat as any freshly generated codebase: this hasn't been run through
a real `npm install && npm run build` yet — that's the required first step
before anything else.
