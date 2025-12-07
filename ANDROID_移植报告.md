# Android移植技术报告

## 概述

本报告详细说明如何将Mate Engine Web项目移植到Android平台（包括ARM设备），提供完整的技术方案和实施路径。

---

## 📱 移植方案对比

### 方案一：WebView方式（推荐用于快速原型）

**优点：**
- ✅ 开发速度快，代码复用率高（95%+）
- ✅ 维护成本低，一套代码多平台
- ✅ 更新方便，无需重新打包

**缺点：**
- ⚠️ 性能略低于原生方案
- ⚠️ WebGL在部分老旧设备上可能不流畅
- ⚠️ 需要网络访问（或打包资源）

**技术栈：**
- Android WebView
- Three.js + VRM（当前Web技术栈）
- Cordova/Capacitor（可选）

### 方案二：Unity + Android（推荐用于最佳性能）

**优点：**
- ✅ 性能最优，原生3D渲染
- ✅ 完整功能支持（VRM、动画、物理等）
- ✅ 可以直接使用现有Unity项目代码
- ✅ AR/VR支持更好

**缺点：**
- ⚠️ 开发时间长
- ⚠️ APK体积大（100MB+）
- ⚠️ 需要Unity专业知识

**技术栈：**
- Unity 2022.3 LTS +
- UniVRM插件
- Android NDK

### 方案三：React Native + Three.js

**优点：**
- ✅ 性能较好
- ✅ 可使用现有Web代码
- ✅ 跨平台（iOS + Android）

**缺点：**
- ⚠️ 配置复杂
- ⚠️ 调试困难
- ⚠️ 社区生态相对小众

---

## 🎯 推荐方案详解

根据项目需求，我们提供两个主要推荐方案：

---

## 方案A：WebView混合应用（快速部署）

### 技术架构

```
Android App
├── WebView容器
│   ├── HTML/CSS/JS（Web版代码）
│   ├── Three.js引擎
│   └── VRM加载器
├── Native Bridge
│   ├── 文件访问
│   ├── 传感器数据
│   └── 性能优化
└── 资源管理
    ├── VRM模型打包
    └── 动画文件
```

### 实施步骤

#### 1. 创建Android项目

```bash
# 使用Android Studio创建新项目
# 选择 Empty Activity
# 最低SDK：API 24 (Android 7.0)
# 目标SDK：API 34 (Android 14)
```

#### 2. 添加WebView配置

**MainActivity.java**
```java
package com.mateengine.app;

import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    private WebView webView;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        webView = findViewById(R.id.webview);
        setupWebView();
        
        // 加载Web应用
        webView.loadUrl("file:///android_asset/index.html");
    }
    
    private void setupWebView() {
        WebSettings settings = webView.getSettings();
        
        // 启用JavaScript
        settings.setJavaScriptEnabled(true);
        
        // 启用DOM存储
        settings.setDomStorageEnabled(true);
        
        // 启用数据库
        settings.setDatabaseEnabled(true);
        
        // 启用WebGL
        settings.setJavaScriptCanOpenWindowsAutomatically(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        
        // 设置WebGL支持
        settings.setMediaPlaybackRequiresUserGesture(false);
        
        // 硬件加速
        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);
        
        // 设置WebViewClient
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }
        });
        
        // 设置WebChromeClient（用于文件选择等）
        webView.setWebChromeClient(new WebChromeClient());
    }
    
    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
```

**activity_main.xml**
```xml
<?xml version="1.0" encoding="utf-8"?>
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    
    <WebView
        android:id="@+id/webview"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />
</FrameLayout>
```

#### 3. 打包Web资源

将以下文件复制到 `app/src/main/assets/` 目录：
- index.html
- styles.css
- app.js
- Assets/（VRM模型文件）

#### 4. AndroidManifest.xml配置

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    
    <!-- 权限 -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    
    <!-- OpenGL ES 3.0 -->
    <uses-feature android:glEsVersion="0x00030000" android:required="true" />
    
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:usesCleartextTraffic="true"
        android:hardwareAccelerated="true"
        android:theme="@style/Theme.MateEngine">
        
        <activity
            android:name=".MainActivity"
            android:configChanges="orientation|screenSize"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

#### 5. 优化性能

**在app.js中添加Android优化：**

```javascript
// 检测Android环境
const isAndroid = /Android/i.test(navigator.userAgent);

if (isAndroid) {
    // 降低渲染分辨率
    state.renderer.setPixelRatio(1);
    
    // 降低阴影贴图分辨率
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    
    // 启用性能模式
    state.renderer.powerPreference = 'high-performance';
}
```

---

## 方案B：Unity + Android（完整功能）

### 技术架构

```
Unity项目
├── VRM导入（UniVRM）
├── 动画系统
├── 音频系统
├── UI系统（uGUI）
└── Android构建
    ├── IL2CPP后端
    ├── ARM64架构
    └── 资源压缩
```

### 实施步骤

#### 1. Unity项目配置

**已有项目：** 
- 当前仓库已经是Unity项目
- 使用Unity 6000.2.6f2
- 已集成VRM支持

**构建配置：**

```csharp
// 在Unity Editor中
// File -> Build Settings
// Platform: Android
// Architecture: ARM64
// Compression Method: LZ4
// Scripting Backend: IL2CPP
```

#### 2. 优化Android构建

**PlayerSettings配置：**

```csharp
// C# 脚本示例
#if UNITY_EDITOR
using UnityEditor;

public class AndroidBuildSettings
{
    [MenuItem("Build/Configure Android")]
    static void ConfigureAndroid()
    {
        PlayerSettings.Android.minSdkVersion = AndroidSdkVersions.AndroidApiLevel24;
        PlayerSettings.Android.targetSdkVersion = AndroidSdkVersions.AndroidApiLevel34;
        
        // 图形API
        PlayerSettings.SetGraphicsAPIs(BuildTarget.Android, new[] {
            GraphicsDeviceType.Vulkan,
            GraphicsDeviceType.OpenGLES3
        });
        
        // IL2CPP
        PlayerSettings.SetScriptingBackend(BuildTargetGroup.Android, ScriptingImplementation.IL2CPP);
        
        // ARM64
        PlayerSettings.Android.targetArchitectures = AndroidArchitecture.ARM64;
        
        // 压缩
        EditorUserBuildSettings.androidBuildSystem = AndroidBuildSystem.Gradle;
        
        Debug.Log("Android配置完成");
    }
}
#endif
```

#### 3. VRM模型优化

**针对移动设备的优化：**

```csharp
// VRMOptimizer.cs
using UnityEngine;
using VRM;

public class VRMOptimizer : MonoBehaviour
{
    void OptimizeVRMForMobile(GameObject vrmRoot)
    {
        // 降低纹理分辨率
        Renderer[] renderers = vrmRoot.GetComponentsInChildren<Renderer>();
        foreach (var renderer in renderers)
        {
            foreach (var material in renderer.materials)
            {
                if (material.mainTexture != null)
                {
                    Texture2D tex = material.mainTexture as Texture2D;
                    if (tex != null && tex.width > 1024)
                    {
                        // 使用压缩格式
                        TextureImporter importer = AssetImporter.GetAtPath(
                            AssetDatabase.GetAssetPath(tex)) as TextureImporter;
                        if (importer != null)
                        {
                            importer.textureCompression = TextureImporterCompression.Compressed;
                            importer.maxTextureSize = 1024;
                            importer.SaveAndReimport();
                        }
                    }
                }
            }
        }
        
        // 优化骨骼数量
        SkinnedMeshRenderer[] smrs = vrmRoot.GetComponentsInChildren<SkinnedMeshRenderer>();
        foreach (var smr in smrs)
        {
            smr.quality = SkinQuality.Bone2; // 限制骨骼影响数
        }
        
        Debug.Log("VRM移动端优化完成");
    }
}
```

#### 4. 构建APK

**Gradle配置（build.gradle）：**

```gradle
android {
    compileSdkVersion 34
    
    defaultConfig {
        minSdkVersion 24
        targetSdkVersion 34
        versionCode 1
        versionName "1.0"
        
        ndk {
            abiFilters 'arm64-v8a'
        }
    }
    
    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android.txt')
        }
    }
    
    // 启用资源压缩
    aaptOptions {
        cruncherEnabled = true
    }
}
```

#### 5. 性能优化

**针对ARM设备的优化：**

```csharp
// PerformanceManager.cs
using UnityEngine;

public class PerformanceManager : MonoBehaviour
{
    void Start()
    {
        // 设置目标帧率
        Application.targetFrameRate = 60;
        
        // 关闭vsync（移动设备）
        QualitySettings.vSyncCount = 0;
        
        // 动态调整质量
        if (SystemInfo.systemMemorySize < 4096) // 小于4GB内存
        {
            QualitySettings.SetQualityLevel(1); // 低质量
            QualitySettings.shadowDistance = 20f;
            QualitySettings.shadows = ShadowQuality.HardOnly;
        }
        
        // 多线程渲染
        PlayerSettings.MTRendering = true;
    }
}
```

---

## 📊 方案对比总结

| 特性 | WebView方案 | Unity方案 |
|------|------------|-----------|
| **开发时间** | 1-2周 | 4-6周 |
| **性能** | 中等（60fps @ 旗舰机） | 优秀（60fps @ 中端机） |
| **APK大小** | 20-50MB | 100-200MB |
| **维护成本** | 低 | 中 |
| **功能完整度** | 85% | 100% |
| **硬件要求** | Android 7.0+ | Android 7.0+ |
| **WebGL支持** | 需要 | 不需要 |
| **离线使用** | 支持（打包资源） | 完全支持 |
| **AR/VR** | 困难 | 简单 |

---

## 🔧 具体实施建议

### 阶段一：快速原型（推荐WebView）

1. **第一周：** WebView基础搭建
   - 创建Android项目
   - 集成WebView
   - 打包Web资源
   
2. **第二周：** 功能测试与优化
   - 性能调优
   - UI适配
   - 实际设备测试

### 阶段二：完整版本（Unity）

1. **第1-2周：** Unity项目配置
   - 导入现有项目
   - 配置Android构建
   - 优化资源

2. **第3-4周：** Android适配
   - 触摸输入适配
   - UI重新设计（移动端）
   - 性能优化

3. **第5-6周：** 测试与发布
   - 多设备测试
   - Bug修复
   - 打包发布

---

## 📱 ARM设备特殊考虑

### CPU架构

```java
// 检测CPU架构
String[] abis = Build.SUPPORTED_ABIS;
// 优先支持：arm64-v8a
// 向后兼容：armeabi-v7a
```

### 性能优化

1. **降低多边形数**
   - VRM模型：< 50K三角形
   - 场景物体：最小化

2. **纹理压缩**
   - 使用ASTC格式
   - 最大2K分辨率

3. **动画优化**
   - 骨骼数量 < 100
   - 关键帧压缩

### 热点设备测试

- ✅ 小米/红米（主流）
- ✅ OPPO/vivo
- ✅ 三星Galaxy系列
- ✅ 华为/荣耀

---

## 🎯 最终推荐

**对于当前项目：**

1. **短期（1-2个月）：** 使用WebView方案
   - 快速上线
   - 验证市场需求
   - 低成本试错

2. **长期（3-6个月）：** 迁移到Unity
   - 基于现有Unity代码
   - 完整功能支持
   - 更好的性能

3. **混合方案：** 两者并行
   - WebView版本用于快速迭代
   - Unity版本用于旗舰体验
   - 根据用户设备自动选择

---

## 📚 参考资源

### WebView方案
- Android WebView官方文档
- Capacitor框架
- Cordova插件

### Unity方案
- Unity Android开发指南
- UniVRM插件文档
- IL2CPP优化指南

### 测试工具
- Android Studio Profiler
- Unity Profiler
- Firebase Performance Monitoring

---

## ✅ 结论

**是的，您需要Unity + Android的代码来移植到ARM设备。**

但我们提供了两个方案：

1. **WebView方案（快速）：** 
   - 使用当前Web代码
   - 少量Java/Kotlin代码
   - 1-2周完成

2. **Unity方案（完整）：**
   - 使用现有Unity项目
   - C#代码为主
   - 4-6周完成

**推荐路径：** 先WebView验证，后Unity优化。

---

**报告日期：** 2025-12-07  
**技术栈版本：** Unity 6000.2.6f2 / Android API 34 / Three.js 0.169.0
