# Pixelar — Data Flow Diagram Reference

## External Entities

1. **User** — Indie game developer using the app
2. **Replicate API** — AI model hosting (rd-plus for sprites/scenes, rd-animation for spritesheets)
3. **Firebase Auth** — Google sign-in identity provider
4. **Firebase Storage** — Blob storage for generated images
5. **Firestore** — Document database

---

## Data Stores

| Store | Location | Contents |
|-------|----------|----------|
| **DS1: Users** | Firestore `users` collection | `id`, `firebase_uid`, `email`, `display_name`, `photo_url`, `credits`, `created_at` |
| **DS2: Projects** | Firestore `projects` collection | `id`, `user_id`, `title`, `type` (sprite/scene), `thumbnail_url`, `status`, `created_at` |
| **DS3: Assets** | Firestore `assets` collection | `id`, `user_id`, `project_id`, `asset_type`, `blob_url`, `name`, `status`, `metadata` (prompt, style, dimensions, is_spritesheet, frame_width, frame_height, frame_count, animation_name) |
| **DS4: Generation Jobs** | Firestore `generation_jobs` collection | `id`, `user_id`, `type`, `status`, `input_params`, `result`, `credits_used` |
| **DS5: Image Blobs** | Firebase Storage | Generated PNGs (sprites, scenes, spritesheets) |
| **DS6: BYOK Key** | Browser localStorage | `replicate_api_key` — user's own Replicate API token |
| **DS7: Credits Transactions** | Firestore `credits_transactions` collection | `id`, `user_id`, `amount`, `type`, `description` |

---

## Processes & Data Flows

### P1: Authentication

```
User ──[Google Sign-in]──> Firebase Auth
Firebase Auth ──[ID Token]──> Frontend (AuthContext)
Frontend ──[POST /api/auth/sync-user + Bearer token]──> Backend
Backend ──[verifyToken()]──> Firebase Admin SDK
Backend ──[upsert user]──> DS1: Users
Backend ──[user profile + credits]──> Frontend
```

### P2: Sprite Generation

```
User ──[prompt, style, viewpoint, dimensions, colors, quantity, removeBg, tileX, tileY]──> Frontend (/sprites)
Frontend ──[+ apiKey from DS6]──> POST /api/generate/sprite ──> Backend
Backend ──[verify token]──> Firebase Auth
Backend ──[check credits OR skip if apiKey]──> DS1: Users
Backend ──[buildPrompt()]──> Replicate API (retro-diffusion/rd-plus)
Replicate API ──[base64 images]──> Backend
Backend ──[upload images]──> DS5: Image Blobs
Backend ──[create asset records]──> DS3: Assets
Backend ──[auto-create project]──> DS2: Projects
Backend ──[deduct credits if no apiKey]──> DS1: Users
Backend ──[log job]──> DS4: Generation Jobs
Backend ──[images[], assets[], projectId]──> Frontend
Frontend ──[display results, navigate to project]──> User
```

### P3: Scene Generation

```
User ──[prompt, style, viewpoint, dimensions, colors, quantity, tileX, tileY]──> Frontend (/scenes)
Frontend ──[+ apiKey from DS6]──> POST /api/generate/scene ──> Backend
Backend ──[verify token]──> Firebase Auth
Backend ──[check credits OR skip if apiKey]──> DS1: Users
Backend ──[buildPrompt()]──> Replicate API (retro-diffusion/rd-plus)
Replicate API ──[base64 images]──> Backend
Backend ──[upload images]──> DS5: Image Blobs
Backend ──[create asset records]──> DS3: Assets
Backend ──[auto-create project (type=scene)]──> DS2: Projects
Backend ──[deduct credits if no apiKey]──> DS1: Users
Backend ──[images[], assets[], projectId]──> Frontend
Frontend ──[display results, auto-select if single, navigate to project]──> User
```

### P4: Spritesheet Generation (within a project)

```
User ──[select animation preset, optional prompt]──> Frontend (AnimationGeneratePanel)
Frontend ──[assetId, projectId, animationPresetId, customPrompt, apiKey from DS6]──> POST /api/spritesheet/generate ──> Backend
Backend ──[verify token]──> Firebase Auth
Backend ──[check credits OR skip if apiKey]──> DS1: Users
Backend ──[GET /api/spritesheet/presets to resolve preset → style, width, height]──> ANIMATION_PRESETS config
Backend ──[fetch source asset blob_url]──> DS3: Assets
Backend ──[prompt, style, width, height, input_image, return_spritesheet=true]──> Replicate API (retro-diffusion/rd-animation)
Replicate API ──[spritesheet PNG URL]──> Backend
Backend ──[download + upload spritesheet]──> DS5: Image Blobs
Backend ──[create asset record (is_spritesheet=true, animation_name, frame_width, frame_height, frame_count)]──> DS3: Assets
Backend ──[deduct credits if no apiKey]──> DS1: Users
Backend ──[spritesheet asset]──> Frontend
Frontend ──[add to spritesheets list, auto-select, show SpritesheetPreview]──> User
```

### P5: Spritesheet Playback (client-side)

```
Frontend (SpritesheetPreview) ──[fetch spritesheet blob_url]──> DS5: Image Blobs
DS5 ──[image blob]──> Frontend
Frontend ──[URL.createObjectURL(blob)]──> Image element
Image.onload ──[img.naturalWidth / frameWidth = columns]──> Canvas rendering loop
Canvas ──[drawImage(sx, sy) per frame at 8fps]──> User sees animation
```

### P6: GIF Conversion (client-side)

```
User ──[clicks "Convert to GIF" from project OR uploads spritesheet via /tools/gif-converter]──>
Frontend ──[spritesheet URL + frameHint (fw, fh, fc)]──> SpriteSheetConverter
SpriteSheetConverter ──[fetch blob]──> DS5: Image Blobs
SpriteSheetConverter ──[auto-detect grid from frameHint OR pixel analysis]──> rows, cols
SpriteSheetConverter ──[slice frames via canvas]──> gif.js (Web Worker)
gif.js ──[encoded GIF blob URL]──> Frontend
Frontend ──[download link]──> User saves .gif file
```

### P7: Project Management

```
GET  /api/projects          User ──> Backend ──[query by user_id]──> DS2 ──> project list ──> Frontend
GET  /api/projects/:id      User ──> Backend ──[project + assets (filtered: !is_spritesheet)]──> DS2 + DS3 ──> Frontend
POST /api/projects           User ──> Backend ──[title, type]──> DS2 ──> new project ──> Frontend
PUT  /api/projects/:id       User ──> Backend ──[updates]──> DS2 ──> updated project ──> Frontend
DELETE /api/projects/:id     User ──> Backend ──> DS2 (delete) ──> confirmation ──> Frontend
```

### P8: Asset Management

```
POST /api/assets/upload      User ──[name, type, base64 image, createProject?]──> Backend ──> DS5 (upload) ──> DS3 (create) ──> optionally DS2 (create project) ──> Frontend
GET  /api/assets             User ──> Backend ──[query filters]──> DS3 ──> asset list ──> Frontend
GET  /api/assets/:id         User ──> Backend ──> DS3 ──> single asset ──> Frontend
PUT  /api/assets/:id         User ──> Backend ──[updates]──> DS3 ──> updated asset ──> Frontend
DELETE /api/assets/:id       User ──> Backend ──> DS3 (soft delete) ──> confirmation ──> Frontend
```

### P9: Spritesheet Queries

```
GET  /api/spritesheet/presets              Frontend ──> Backend ──> ANIMATION_PRESETS config ──> [{id, name, description, style, width, height, frameCount}] ──> Frontend
GET  /api/spritesheet/project/:projectId   Frontend ──> Backend ──[query assets where project_id AND is_spritesheet=true]──> DS3 ──> spritesheet list ──> Frontend
DELETE /api/spritesheet/:id                Frontend ──> Backend ──> DS3 (delete) + DS5 (delete blob) ──> Frontend
```

### P10: Export/Download (client-side)

```
User clicks Export ──> Frontend checks context:
  If animations tab + spritesheet selected:
    ──[fetch(spritesheet.blob_url)]──> DS5 ──> blob ──> URL.createObjectURL ──> <a download="4-direction_walking_48x48_16frames.png"> ──> User downloads
  If assets tab + asset selected:
    ──[fetch(asset.blob_url)]──> DS5 ──> blob ──> URL.createObjectURL ──> <a download="asset.png"> ──> User downloads
```

### P11: BYOK (Bring Your Own Key)

```
User ──[enters Replicate API key]──> Frontend (BYOKButton)
Frontend ──[store]──> DS6: localStorage("replicate_api_key")
On any generation request:
  Frontend ──[reads DS6]──> includes apiKey in request body
  Backend ──[if apiKey present: skip credit check, use apiKey for Replicate call]
  Backend ──[if no apiKey: check DS1 credits, use platform REPLICATE_API_TOKEN, deduct credits after]
```

### P12: Credits

```
Backend (on generation) ──[check user.credits >= required]──> DS1: Users
  If insufficient AND no BYOK ──> 402 error ──> Frontend shows error
  If sufficient OR BYOK ──> proceed with generation
  After success (no BYOK) ──> deductCredits() ──> DS1: Users
  After success (no BYOK) ──> log transaction ──> DS7: Credits Transactions
```

---

## Available Animation Presets (config, not a data store)

| Preset ID | Style (sent to API) | Frame Size | Frames |
|-----------|-------------------|------------|--------|
| `four_angle_walking` | `four_angle_walking` | 48x48 | 16 |
| `walking_and_idle` | `walking_and_idle` | 48x48 | 24 |
| `small_sprites` | `small_sprites` | 32x32 | 16 |
| `vfx` | `vfx` | 64x64 | 8 |

---

## Frontend Pages → Backend Route Mapping

| Page | Action | Endpoint |
|------|--------|----------|
| `/login` | Google sign-in | Firebase Auth SDK → `POST /api/auth/sync-user` |
| `/sprites` | Generate sprite | `POST /api/generate/sprite` |
| `/scenes` | Generate scene | `POST /api/generate/scene` |
| `/projects` | List projects | `GET /api/projects` |
| `/projects/[id]` | Load project | `GET /api/projects/:id` + `GET /api/spritesheet/project/:id` |
| `/projects/[id]` | Generate spritesheet | `GET /api/spritesheet/presets` + `POST /api/spritesheet/generate` |
| `/projects/[id]` | Delete asset/spritesheet | `DELETE /api/assets/:id` or `DELETE /api/spritesheet/:id` |
| `/projects/[id]` | Export | Client-side blob download (no backend call) |
| `/tools/gif-converter` | Convert to GIF | Client-side only (gif.js Web Worker) |
| Sidebar | Import asset | `POST /api/assets/upload` |

---

## Credit Costs

| Action | Credits Required |
|--------|-----------------|
| Sprite generation | 5 per request |
| Scene generation | 8 per request |
| Spritesheet generation | Defined in spritesheet route (variable) |

All credit checks are bypassed when the user provides a BYOK API key.
