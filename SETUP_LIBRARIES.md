# Setting Up Local Libraries (Optional)

If you have network restrictions or want to run the application completely offline, you can download the required libraries locally instead of using CDN.

## Quick Setup with NPM

If you have Node.js installed:

```bash
# Navigate to the repository
cd /path/to/Mate-Engine

# Create a libs directory
mkdir -p libs

# Install dependencies
npm install three@0.169.0 @pixiv/three-vrm@3.1.0

# Copy to libs folder
cp node_modules/three/build/three.module.js libs/
cp -r node_modules/three/examples/jsm libs/three-addons
cp node_modules/@pixiv/three-vrm/lib/three-vrm.module.js libs/
```

## Manual Download

### Option 1: Download from CDN

1. **Three.js**
   - Download: https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js
   - Save to: `libs/three.module.js`

2. **Three.js Addons**
   - Download the entire jsm folder: https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/
   - Save to: `libs/three-addons/`

3. **Three-VRM**
   - Download: https://cdn.jsdelivr.net/npm/@pixiv/three-vrm@3.1.0/lib/three-vrm.module.js
   - Save to: `libs/three-vrm.module.js`

### Option 2: Download from GitHub

```bash
# Create libs directory
mkdir -p libs

# Download Three.js
wget https://github.com/mrdoob/three.js/archive/refs/tags/r169.zip -O /tmp/three.zip
unzip /tmp/three.zip -d /tmp/
cp /tmp/three.js-r169/build/three.module.js libs/
cp -r /tmp/three.js-r169/examples/jsm libs/three-addons

# Download Three-VRM
wget https://github.com/pixiv/three-vrm/archive/refs/tags/v3.1.0.zip -O /tmp/vrm.zip
unzip /tmp/vrm.zip -d /tmp/
cp /tmp/three-vrm-3.1.0/packages/three-vrm/lib/three-vrm.module.js libs/
```

## Update index.html

Once you have the libraries locally, update the importmap in `index.html`:

```html
<!-- Replace the existing importmap with this: -->
<script type="importmap">
{
    "imports": {
        "three": "./libs/three.module.js",
        "three/addons/": "./libs/three-addons/",
        "@pixiv/three-vrm": "./libs/three-vrm.module.js"
    }
}
</script>
```

## Directory Structure

After setup, your directory should look like:

```
Mate-Engine/
├── index.html
├── app.js
├── README_WEB.md
├── QUICKSTART.md
└── libs/
    ├── three.module.js
    ├── three-vrm.module.js
    └── three-addons/
        ├── controls/
        │   └── OrbitControls.js
        └── loaders/
            └── GLTFLoader.js
```

## Verify Setup

1. Start a local server:
   ```bash
   python -m http.server 8000
   ```

2. Open http://localhost:8000

3. Check browser console (F12) - you should see:
   ```
   Mate Engine Web initialized
   Upload a VRM model to begin!
   ```

4. No CDN errors should appear

## Troubleshooting

### "Failed to resolve module specifier"
- Check that the file paths in importmap match your actual file structure
- Ensure all files are in the `libs` folder

### "CORS policy" errors
- You must use a local web server, not file:// protocol
- Try a different server (Python, Node.js, PHP)

### Files not found (404)
- Verify the directory structure matches the example above
- Check file permissions (should be readable)

## Benefits of Local Libraries

- ✅ Works completely offline
- ✅ No CDN dependencies
- ✅ Faster loading (no network requests)
- ✅ Version locked (no unexpected updates)
- ✅ Works in restricted network environments

## Drawbacks

- ❌ Larger repository size (~2-3 MB)
- ❌ Manual updates required
- ❌ More complex initial setup

## Recommended Approach

- **Development**: Use local libraries for reliability
- **Production**: Use CDN for better caching and performance
- **Demo**: CDN is fine for quick testing

---

**Note**: The default `index.html` uses CDN. You only need local libraries if you experience network issues or want offline capability.
