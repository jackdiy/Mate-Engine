# Model Assets Reference

This document describes all the available character models and their associated files in the Mate Engine repository.

## Available Models

### 1. Lazuli (Primary Cat-Girl Character)

**Main Model File:**
- **Location**: `Assets/MATE ENGINE - Avatar/DLCs/Lazuli_VRM.vrm`
- **Size**: ~60 MB
- **Type**: VRM 0.0 format
- **Description**: High-quality cat-girl character with detailed textures

**Associated Files:**
```
Assets/MATE ENGINE - Avatar/DLCs/
├── Lazuli_VRM.vrm                    # Main VRM model file
├── Lazuli_VRM.prefab                 # Unity prefab
├── Lazuli_VRM_Clothes.prefab         # Clothing prefab
├── Lazuli_Profile.png                # Character portrait
├── Lazuli_VRM.Avatar/                # Avatar configuration
├── Lazuli_VRM.AvatarDescription/     # Avatar metadata
├── Lazuli_VRM.BlendShapes/           # Facial expressions (100+ blend shapes)
├── Lazuli_VRM.Materials/             # Material definitions
├── Lazuli_VRM.Meshes/                # 3D mesh data
├── Lazuli_VRM.MetaObject/            # VRM metadata
└── Lazuli_VRM.Textures/              # Texture files (diffuse, normal, etc.)
```

**Blend Shapes/Expressions:**
Located in `Lazuli_VRM.BlendShapes/`, this model includes:
- Basic expressions: Happy, Sad, Angry, Surprised
- Eye controls: Blink, Wink, Wide eyes
- Mouth shapes: A, I, U, E, O (for lip sync)
- Special: Cat ears movement, tail controls

**Clothing Items:**
The Lazuli model includes several clothing layers that can be toggled:
- Base outfit
- Accessories
- Optional layers

### 2. Aldina

**Main Model File:**
- **Location**: `Assets/MATE ENGINE - Avatar/DLCs/aldina.vrm`
- **Size**: ~12.8 MB
- **Type**: VRM 0.0 format
- **Description**: Alternative character model, lighter weight

**Associated Files:**
```
Assets/MATE ENGINE - Avatar/DLCs/
├── aldina.vrm                        # Main VRM model file
├── aldina.prefab                     # Unity prefab
├── Aldina_Profile.png                # Character portrait
├── Aldina_Underwear_Profile.png      # Alternative portrait
├── aldina.Avatar/                    # Avatar configuration
├── aldina.AvatarDescription/         # Avatar metadata
├── aldina.BlendShapes/               # Facial expressions
├── aldina.Materials/                 # Material definitions
├── aldina.Meshes/                    # 3D mesh data
├── aldina.MetaObject/                # VRM metadata
└── aldina.Textures/                  # Texture files
```

**Features:**
- Lighter file size (faster loading)
- Simplified texture set
- Good for testing and development

### 3. Zome

**Main Model File:**
- **Location**: `Assets/MATE ENGINE - Avatar/Zome.vrm`
- **Type**: VRM format
- **Description**: Additional character model

## Animation Assets

### Dance Animations

**Kawaii Macaron Motion:**
```
Assets/noirunn/KawaiiMacaronMotion/
├── KawaiiMacaronMotion01.anim        # Dance pattern 1
├── KawaiiMacaronMotion02.anim        # Dance pattern 2
├── FBX/macaron.fbx                   # Source FBX file
└── Texture/                          # Animation textures
```

**Custom Dance System:**
```
Assets/MATE ENGINE - Custom Dance Player/
├── Prefab/
│   ├── CUSTOM_DANCE.anim             # Custom dance animation
│   ├── DANCE_END.anim                # Dance ending animation
│   ├── CustomDancePlayer.prefab      # Dance player prefab
│   └── CustomDanceAvatarController.controller
└── README.md
```

### Animation Types

1. **Idle Animation** (Procedural in web version)
   - Gentle breathing motion
   - Subtle position shifts

2. **Dance 1** (Based on KawaiiMacaronMotion01)
   - Bouncy movements
   - Rotation elements
   - Upbeat energy

3. **Dance 2** (Based on KawaiiMacaronMotion02)
   - Side-to-side motion
   - More energetic
   - Quick transitions

4. **Wave Animation** (Procedural)
   - Simple greeting gesture
   - Friendly interaction

## DLC Content

### Cyber Interface DLC
```
Assets/MATE ENGINE - DLCs/CYBER INTERFACE/DLC_CONTENT/
└── fbx/                              # 3D props and effects
    ├── DOT_R.fbx
    ├── DOT_S.fbx
    ├── DOT_Q.fbx
    └── ... (various cyber effect models)
```

### Accessories DLC (Steam Exclusive)
According to README.md, Steam version includes:
- Flower Halo
- Sakura Halo
- Retro Halo
- ERROR! NSO Like Face Overlay

## Props and Accessories

### Food Props
```
Assets/MATE ENGINE - Props/
├── Drinks/
│   └── Softdrinks.fbx
└── Cakes/
    └── Cakes_Pies_002.fbx
```

### Decorative Items
```
Assets/QuQu/Sakura_Halo/
└── Sakura_Halo.fbx                   # Decorative halo accessory
```

## Particle Effects

### Heart Particle System
```
Assets/[CooGee Works]/HeartParticle_MA_Gimmick/
├── _Animation-Controller/            # Particle animations
│   ├── HeartComet_L_shot_ON.anim
│   ├── HeartComet_R_shot_ON.anim
│   ├── HeartGun_L_ON.anim
│   ├── HandsBurst_R_ON_H.anim
│   └── ... (20+ particle animations)
└── model/                            # Particle models
    ├── QuadToCircle.fbx
    ├── RoundHeart.fbx
    └── heart edge.fbx
```

## Using Models in Web Version

### Loading Lazuli Model

1. Open the web application (`index.html`)
2. Click "📁 Load VRM Model"
3. Navigate to: `Assets/MATE ENGINE - Avatar/DLCs/Lazuli_VRM.vrm`
4. Select and wait for loading (~5-10 seconds)

**Expected Result:**
- Model appears in center of viewport
- Clothing controls populate with detected items
- Idle animation begins automatically
- All interaction features become active

### Loading Aldina Model

1. Follow same steps as Lazuli
2. Navigate to: `Assets/MATE ENGINE - Avatar/DLCs/aldina.vrm`
3. Faster loading due to smaller size (~2-3 seconds)

**Benefits:**
- Quicker testing iterations
- Lower memory usage
- Good for development

### Loading Custom VRM Models

The web viewer supports any valid VRM model:

**Requirements:**
- VRM 0.0 or VRM 1.0 format
- Humanoid bone structure
- MToon or standard PBR materials
- Recommended file size: < 100 MB

**Good Sources:**
- VRoid Hub: https://hub.vroid.com/
- Booth.pm: https://booth.pm/ (search "VRM")
- VRoid Studio: Create your own models

## Model Specifications

### Lazuli Technical Details

**Polygon Count:** ~30,000 - 40,000 triangles
**Texture Resolution:** 2048x2048 (main body), various for accessories
**Bone Count:** ~70 bones (humanoid standard + extras)
**Blend Shapes:** 100+ for expressions and accessories
**Materials:** MToon shader (VRM standard)

**Texture Maps:**
- Base Color (Diffuse)
- Normal Map
- Emission Map
- Shade Map (for toon shading)

### Aldina Technical Details

**Polygon Count:** ~20,000 - 25,000 triangles
**Texture Resolution:** 1024x1024 - 2048x2048
**Bone Count:** ~60 bones (humanoid standard)
**Blend Shapes:** 50+ for expressions
**Materials:** MToon shader

## Performance Considerations

### Web Browser Performance

| Model | Load Time | Memory Usage | Recommended For |
|-------|-----------|--------------|-----------------|
| Lazuli | 5-10s | ~200 MB | Final presentation |
| Aldina | 2-3s | ~80 MB | Development/Testing |
| Custom (< 20MB) | < 5s | Varies | General use |

### Optimization Tips

1. **For Development:**
   - Use Aldina model for faster iteration
   - Test with simple models first
   - Enable/disable features progressively

2. **For Presentation:**
   - Use Lazuli for full quality
   - Pre-load models before showing
   - Close other browser tabs

3. **For Distribution:**
   - Provide both models as options
   - Include file size in UI
   - Show loading progress

## File Format Notes

### VRM Format
- **Version 0.0**: Original VRM specification
- **Version 1.0**: Updated specification (more features)
- Both are supported by the web viewer

### Unity Assets
The following Unity-specific files are **NOT** needed for web version:
- `.prefab` files
- `.meta` files
- `.controller` files
- Separate texture/material folders

Only the `.vrm` file is required!

## License Considerations

**Important:** When using these models:

- **Lazuli Model**: All Rights Reserved by [Yorshka Shop](https://yorshkasencho.booth.pm/)
  - Do not redistribute
  - Personal use only
  - Not for commercial projects

- **Other Models**: Check individual licenses
- **Your Models**: You can use any VRM model you have rights to use

## Troubleshooting

### Model won't load
- **Check format**: Must be `.vrm` file
- **Check size**: Large models (>100MB) may timeout
- **Check browser**: Use Chrome/Edge for best compatibility

### Animations don't work
- **Check bones**: Model must have humanoid bone structure
- **Try different model**: Some models have non-standard setups

### Textures look wrong
- **MToon shader**: Web viewer approximates MToon rendering
- **Normal maps**: May look different than Unity
- **Transparency**: Some materials may render differently

---

**For more help, see QUICKSTART.md and README_WEB.md**
