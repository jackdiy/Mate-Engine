# Quick Start Guide - Mate Engine Web

## 🚀 Instant Setup (No Installation Required)

### Method 1: Direct File Access
1. Download or clone this repository
2. Navigate to the repository folder
3. Double-click `index.html`
4. Your default browser will open the application

### Method 2: Local Server (Recommended)

#### Using Python (Most Systems)
```bash
# Navigate to the repository folder
cd /path/to/Mate-Engine

# Start server (Python 3)
python -m http.server 8000

# Or Python 2
python -m SimpleHTTPServer 8000
```

Then open: `http://localhost:8000`

#### Using Node.js
```bash
# Install http-server globally (one-time)
npm install -g http-server

# Start server
http-server -p 8000
```

Then open: `http://localhost:8000`

#### Using PHP
```bash
php -S localhost:8000
```

Then open: `http://localhost:8000`

## 📦 First Time Usage

### Step 1: Load the Lazuli Model

1. In the web interface, click "📁 Load VRM Model"
2. Navigate to: `Assets/MATE ENGINE - Avatar/DLCs/Lazuli_VRM.vrm`
3. Select the file and click "Open"
4. Wait 5-10 seconds for loading (it's a 60MB file)
5. The model will appear in the center of the screen

### Step 2: Play with Animations

1. Select an animation from the dropdown:
   - **Idle** - Gentle breathing
   - **Dance 1** - Bouncy dance with rotation
   - **Dance 2** - Energetic side-to-side dance
   - **Wave** - Friendly waving

2. Click "▶️ Play Animation"

### Step 3: Add Music (Optional)

1. Click "🎼 Upload BGM"
2. Select any music file from your computer (MP3, WAV, OGG)
3. Click "🎵 Dance with Music"
4. The model will dance to the beat!

### Step 4: Explore Controls

**Camera:**
- Click and drag: Rotate view
- Scroll wheel: Zoom in/out
- Camera Distance slider: Adjust distance
- Reset Camera button: Return to default

**Model:**
- Auto Rotate: Toggle automatic rotation
- Head Follows Mouse: Toggle head tracking
- Clothing Controls: Show/hide individual items

## 🎯 Testing Checklist

- [ ] Model loads successfully
- [ ] Idle animation plays automatically
- [ ] Can switch between different animations
- [ ] Music uploads and plays
- [ ] Dance syncs with music
- [ ] Stop button works
- [ ] Camera controls respond
- [ ] Mouse tracking moves head
- [ ] Clothing toggles work
- [ ] Can drag to rotate view
- [ ] Zoom works

## 🎨 Trying Different Models

### Use Aldina (Smaller, Faster)
```
File: Assets/MATE ENGINE - Avatar/DLCs/aldina.vrm
Size: ~13 MB (loads faster than Lazuli)
```

### Use Zome
```
File: Assets/MATE ENGINE - Avatar/Zome.vrm
Size: Varies
```

### Import Your Own
- Download VRM models from https://booth.pm/
- Look for free models tagged with "VRM"
- Common sources:
  - VRoid Hub: https://hub.vroid.com/
  - Booth.pm: https://booth.pm/
  - Niconi Solid: https://3d.nicovideo.jp/

## 🐛 Common Issues & Solutions

### Problem: Model won't load
**Solution:** 
- Check file is a valid .vrm file
- Try a smaller model first (aldina.vrm)
- Clear browser cache and reload

### Problem: Animations are choppy
**Solution:**
- Close other browser tabs
- Disable auto-rotate
- Try in Chrome for best performance

### Problem: Music doesn't play
**Solution:**
- Make sure browser allows autoplay (check address bar)
- Try a different audio format
- Check browser console for errors (F12)

### Problem: Clothing controls are empty
**Solution:**
- This is normal - not all models have detectable clothing
- The system looks for meshes with keywords like "cloth", "dress", etc.

### Problem: Page is blank
**Solution:**
- Check browser console (F12) for errors
- Make sure you're using a modern browser
- Try using a local server instead of opening file directly

## 💡 Tips & Tricks

1. **Best Model for Testing**: Start with `aldina.vrm` (smaller, loads faster)

2. **Smooth Performance**: 
   - Disable auto-rotate if laggy
   - Close other browser tabs
   - Use Chrome or Edge for best WebGL performance

3. **Cool Camera Angles**:
   - Zoom in close for portrait shots
   - Tilt camera up for dramatic angle
   - Combine auto-rotate with music for a showcase

4. **Music Recommendations**:
   - Use upbeat J-pop for dance animations
   - 120-140 BPM works best with Dance 1 & 2
   - Slower music for idle/wave animations

5. **Browser DevTools**: Press F12 to see console logs and debug info

## 🎬 Creating a Showcase

1. Load Lazuli model
2. Select "Dance 2" animation
3. Upload energetic music
4. Enable auto-rotate
5. Adjust camera distance to 1.2m
6. Click "Dance with Music"
7. Enjoy the show! 🎉

## 📱 Mobile Support

The app works on mobile browsers but with limitations:
- Touch to rotate (single finger)
- Pinch to zoom
- Performance depends on device
- Some older mobile browsers may struggle

**Recommended for mobile:**
- Use smaller models (aldina.vrm)
- Disable auto-rotate
- Close other apps

## 🔧 Development Mode

If you want to modify the code:

1. Edit `app.js` for functionality changes
2. Edit `index.html` for UI and styling changes
3. Changes take effect on page reload (F5)
4. Use browser DevTools (F12) for debugging

## 📊 Performance Expectations

| Model | Load Time | FPS (Desktop) | FPS (Mobile) |
|-------|-----------|---------------|---------------|
| Lazuli (60MB) | 5-10s | 60 | 30-45 |
| Aldina (13MB) | 2-3s | 60 | 45-60 |
| Simple VRM (<5MB) | <2s | 60 | 60 |

*FPS = Frames Per Second. 60 FPS is ideal.*

## 🌐 Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 90+ | ✅ Excellent | Recommended |
| Edge 90+ | ✅ Excellent | Chromium-based |
| Firefox 88+ | ✅ Good | Slightly slower |
| Safari 15+ | ✅ Good | May need WebGL2 enabled |
| Opera | ✅ Good | Chromium-based |
| Mobile Chrome | ⚠️ Limited | Device dependent |
| Mobile Safari | ⚠️ Limited | Device dependent |

## 📞 Need Help?

1. Check the troubleshooting section above
2. Read the full README_WEB.md
3. Check browser console for errors (F12)
4. Try with a different model
5. Try in a different browser

---

**Ready to start? Open `index.html` and have fun! 🎭**
