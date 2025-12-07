# Mate Engine - Web VRM Viewer

A pure frontend web application for viewing and animating VRM models in the browser. This is a web-based demonstration version of the Mate Engine project, allowing you to upload VRM character models, play animations, and interact with them directly in your web browser.

## 🌟 Features

- **VRM Model Loading**: Upload and display any VRM model directly in the browser
- **Multiple Animations**: 
  - Idle animation (breathing)
  - Dance animations (2 different dance patterns)
  - Wave animation
- **Music Sync**: Upload background music and sync dance animations
- **Interactive Controls**:
  - Head tracking (follows mouse cursor)
  - Click and drag to rotate camera view
  - Scroll to zoom in/out
  - Auto-rotation toggle
- **Clothing System**: Automatically detect and toggle clothing items
- **Camera Controls**: Adjustable camera distance and reset functionality
- **Responsive UI**: Clean, modern interface with gradient design

## 🚀 Quick Start

### Option 1: Direct Browser Access

1. Simply open `index.html` in a modern web browser (Chrome, Firefox, Edge, Safari)
2. Upload a VRM model file (`.vrm`)
3. Start playing with animations and controls!

### Option 2: Local Web Server (Recommended)

For better performance and avoiding CORS issues:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server)
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## 📁 Using the Lazuli Model

The repository includes the Lazuli cat-girl model. Here's where to find the files:

### Lazuli Model Files

**Main Model File:**
- **Path**: `Assets/MATE ENGINE - Avatar/DLCs/Lazuli_VRM.vrm`
- **Size**: ~60 MB
- **Description**: Complete Lazuli character model with textures and blend shapes

**Related Files:**
- **Clothing Prefab**: `Assets/MATE ENGINE - Avatar/DLCs/Lazuli_VRM_Clothes.prefab`
- **Profile Image**: `Assets/MATE ENGINE - Avatar/DLCs/Lazuli_Profile.png`
- **Materials**: `Assets/MATE ENGINE - Avatar/DLCs/Lazuli_VRM.Materials/`
- **Textures**: `Assets/MATE ENGINE - Avatar/DLCs/Lazuli_VRM.Textures/`
- **Blend Shapes**: `Assets/MATE ENGINE - Avatar/DLCs/Lazuli_VRM.BlendShapes/` (expressions)

### Other Available Models

**Aldina Model:**
- **Path**: `Assets/MATE ENGINE - Avatar/DLCs/aldina.vrm`
- **Size**: ~12.8 MB

**Zome Model:**
- **Path**: `Assets/MATE ENGINE - Avatar/Zome.vrm`

## 🎵 Animation Files Reference

While the web version uses procedurally generated animations, the original Unity project contains these animation files:

### Dance Animations
- **Kawaii Macaron Motion 01**: `Assets/noirunn/KawaiiMacaronMotion/KawaiiMacaronMotion01.anim`
- **Kawaii Macaron Motion 02**: `Assets/noirunn/KawaiiMacaronMotion/KawaiiMacaronMotion02.anim`
- **Macaron FBX**: `Assets/noirunn/KawaiiMacaronMotion/FBX/macaron.fbx`

### Custom Dance System
- **Custom Dance Animation**: `Assets/MATE ENGINE - Custom Dance Player/Prefab/CUSTOM_DANCE.anim`
- **Dance End**: `Assets/MATE ENGINE - Custom Dance Player/Prefab/DANCE_END.anim`

## 🎮 How to Use

### 1. Load a Model

1. Click the "Load VRM Model" file input
2. Select a `.vrm` file from your computer
   - For Lazuli: Navigate to `Assets/MATE ENGINE - Avatar/DLCs/Lazuli_VRM.vrm`
3. Wait for the model to load (may take a few seconds for large models)
4. The model will appear in the 3D viewport

### 2. Play Animations

1. Select an animation from the dropdown:
   - **Idle**: Simple breathing animation
   - **Dance 1**: Kawaii dance pattern with rotation and bounce
   - **Dance 2**: Energetic dance with side-to-side movement
   - **Wave**: Simple waving motion
2. Click "▶️ Play Animation" to start the selected animation

### 3. Add Music

1. Click "Upload BGM" and select an audio file (MP3, WAV, OGG, etc.)
2. Click "🎵 Dance with Music" to play the selected dance animation with music
3. Use "⏹️ Stop All" to stop both music and animation

### 4. Clothing Controls

Once a model is loaded:
- Detected clothing items will appear in the "Clothing Controls" section
- Toggle checkboxes to show/hide individual clothing pieces
- Perfect for trying different outfit combinations!

### 5. Camera & Effects

- **Camera Distance Slider**: Adjust how close/far the camera is from the model
- **Auto Rotate Model**: Automatically rotates the model for a 360° view
- **Head Follows Mouse**: Model's head tracks your cursor position
- **Reset Camera**: Return to default camera position and angle

### 6. Manual Camera Control

- **Click and Drag**: Rotate the camera around the model
- **Scroll Wheel**: Zoom in and out
- **Right Click + Drag**: Pan the camera

## 🛠️ Technical Details

### Technologies Used

- **Three.js** (v0.169.0): Core 3D rendering engine
- **@pixiv/three-vrm** (v3.1.0): VRM model loader and animation support
- **Pure JavaScript/HTML/CSS**: No build process required

### Browser Requirements

- Modern browser with WebGL 2.0 support
- Recommended browsers:
  - Chrome 90+
  - Firefox 88+
  - Safari 15+
  - Edge 90+

### Performance Notes

- Model loading time depends on file size and texture quality
- Larger models (like Lazuli at 60MB) may take 5-10 seconds to load
- Performance depends on your GPU and browser
- For best performance, close unnecessary browser tabs

## 📋 Features Comparison

### Original Unity Version vs Web Version

| Feature | Unity (Original) | Web Version |
|---------|------------------|-------------|
| VRM Model Support | ✅ | ✅ |
| Custom Model Upload | ✅ | ✅ |
| Idle Animation | ✅ | ✅ |
| Dance Animations | ✅ (MMD/FBX) | ✅ (Procedural) |
| Music Sync | ✅ | ✅ |
| Head Tracking | ✅ | ✅ |
| Clothing Toggle | ✅ | ✅ (Auto-detect) |
| Platform | Windows/Linux | Any Browser |
| Installation Required | ✅ Unity | ❌ None |
| File Size | ~500MB+ | <30KB (HTML/JS) |

## 🎨 Customization

### Adding Custom Animations

To add your own animations, edit the `createDanceAnimation()` function in `app.js`:

```javascript
function createDanceAnimation(type = 'myAnimation') {
    const tracks = [];
    const duration = 4; // Animation length in seconds
    
    // Add your keyframes here
    const times = [0, 1, 2, 3, 4];
    const values = [/* your values */];
    
    // Create animation tracks
    // ... your animation code
    
    return new THREE.AnimationClip(type, duration, tracks);
}
```

### Styling

All styles are in `index.html` within the `<style>` tag. Customize colors, sizes, and layout as needed.

## 🐛 Troubleshooting

### Model won't load

- **Issue**: File format not supported
- **Solution**: Ensure the file is a valid `.vrm` file (VRM 0.0 or VRM 1.0)

### Animations not playing

- **Issue**: Model doesn't have proper bone structure
- **Solution**: The model must have a humanoid bone structure for animations to work

### Performance issues

- **Issue**: Low framerate or stuttering
- **Solution**: 
  - Try a smaller/simpler model
  - Close other browser tabs
  - Disable auto-rotate and head tracking
  - Lower the screen resolution

### Clothing controls not appearing

- **Issue**: No clothing items detected
- **Solution**: The model may not have meshes with clothing-related names. This is normal for some models.

## 📝 Model Creation Guidelines

For best results when creating VRM models:

1. **Bone Structure**: Use standard humanoid bone naming
2. **Clothing**: Name meshes with keywords like "cloth", "dress", "shirt", etc.
3. **File Size**: Keep textures optimized (2K or lower for web)
4. **Blend Shapes**: Include standard VRM blend shapes for expressions
5. **Materials**: Use VRM-compatible shaders (MToon recommended)

## 🔗 Resources

- **VRM Specification**: https://vrm.dev/
- **Three.js Documentation**: https://threejs.org/docs/
- **@pixiv/three-vrm**: https://github.com/pixiv/three-vrm
- **Free VRM Models**: https://booth.pm/ (search for "VRM")

## 📄 License

This web viewer component is provided as part of the Mate Engine project.

- **Original Mate Engine**: Mixed — GNU AGPL v3 & MateProv2 License
- **Lazuli Model**: All Rights Reserved by [Yorshka Shop](https://yorshkasencho.booth.pm/)
- **Three.js**: MIT License
- **@pixiv/three-vrm**: MIT License

**Important**: Do not redistribute the included Lazuli model. It is for demonstration purposes only.

## 🎯 Future Enhancements

Potential features for future updates:

- [ ] Import real MMD/VMD animation files
- [ ] Face expression controls (blend shapes)
- [ ] Screenshot/video recording
- [ ] Multiple character support
- [ ] Custom shader effects
- [ ] VR/AR support
- [ ] Physics simulation
- [ ] Particle effects
- [ ] Advanced IK (Inverse Kinematics)

## 👥 Credits

- **Original Mate Engine**: Desktop avatar application
- **Three.js**: 3D graphics library
- **@pixiv/three-vrm**: VRM format support
- **Lazuli Model**: Created by Yorshka Shop
- **UI Design**: Custom gradient-based design

## 💬 Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review the original Mate Engine documentation
3. Check Three.js and three-vrm documentation
4. Open an issue on the GitHub repository

---

**Enjoy your virtual companion in the browser! 🎭✨**
