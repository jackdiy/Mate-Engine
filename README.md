# Mate-Engine-Web3D-Jack - 现代化3D角色查看器 🎭

[![私有项目](https://img.shields.io/badge/许可证-专有-red.svg)](LICENSE.md)
[![Three.js](https://img.shields.io/badge/Three.js-v0.169.0-green.svg)](https://threejs.org/)
[![VRM](https://img.shields.io/badge/VRM-v3.1.0-orange.svg)](https://vrm.dev/)

一个令人惊艳的纯前端Web应用，用于在浏览器中查看和交互VRM 3D角色模型。采用玻璃拟态设计语言，支持动画、表情、服装切换和音乐同步舞蹈。

**注意：本项目为私有项目，未经授权禁止使用、复制或分发。**

![Mate-Engine-Web3D-Jack界面](https://github.com/user-attachments/assets/f6ee2d84-cf8d-4720-8e66-ceb8e187f9cb)

---

## ✨ 核心特性

### 🎨 现代化美学设计
- **玻璃拟态UI（Glassmorphism）** - 半透明磨砂玻璃效果，充满未来感
- **多巴胺配色方案** - 鲜艳的渐变色彩，第一眼就让人惊艳
- **流畅微交互动画** - 悬停效果、平滑过渡，每个细节都充满生命力
- **动态渐变背景** - 不断变化的色彩，营造沉浸式体验
- **响应式布局** - 完美适配各种屏幕尺寸
- **Inter现代字体** - Google Fonts专业排版

### 👤 四个3D角色支持

本项目完整支持原Unity版本中的四个3D模型角色，所有功能都在Web版本中实现：

1. **Lazuli（拉祖莉）** 🐱
   - 60MB高质量猫娘角色
   - 详细的纹理和服装
   - 完整的面部表情系统
   
2. **Aldina（阿尔迪娜）** ⚡
   - 13MB轻量级角色
   - 快速加载，性能优异
   - 精美的造型设计

3. **Zome（佐米）** 🌟
   - 默认角色模型
   - 多种服装选项
   - 丰富的动画支持

4. **自定义角色** 📁
   - 支持上传任何VRM或ME格式模型
   - 自动检测和适配
   - 完整的功能支持

### 💃 完整的动画系统

**6种预设动画：**
- 🧍 **待机** - 自然的呼吸动画，保持角色生动
- 💫 **舞蹈1** - 旋转弹跳，充满活力
- ✨ **舞蹈2** - 能量全开，激情四射
- 👋 **挥手** - 友好的打招呼动作
- 😊 **欢喜** - 欢快的蹦跳表情
- 🦘 **跳跃** - 灵动的跳跃动作

**高级功能：**
- 🎵 音乐同步舞蹈 - 上传BGM，角色随节奏起舞
- 🔄 平滑过渡 - AnimationMixer混合系统，无缝切换动画
- ⚡ 实时播放 - 60FPS流畅运行

### 😊 表情控制系统

**6种预设表情：**
- 😐 中性 - 默认平静表情
- 😊 开心 - 欢乐愉悦
- 😢 伤心 - 失落难过
- 😠 生气 - 愤怒不满
- 😲 惊讶 - 震惊意外
- 😆 有趣 - 搞笑逗趣

**技术特性：**
- ✅ VRM混合形状（Blend Shapes）完整支持
- ✅ 实时表情切换，无延迟
- ✅ 自动检测可用表情
- ✅ 动态生成控制界面

### 👗 智能服装系统

- 🔍 **自动检测** - 智能识别模型中的服装网格
- 🎯 **实时切换** - 即时显示/隐藏服装部件
- 🎨 **动态界面** - 根据模型自动生成控制选项
- 💡 **关键词识别** - 支持中英文服装名称

### 📷 专业相机控制

**鼠标交互：**
- 🖱️ **左键拖拽** - 360°旋转视角
- 🖱️ **滚轮** - 平滑缩放距离
- 🖱️ **右键拖拽** - 平移视图（部分浏览器）

**精细调节：**
- 📏 相机距离（0.5m - 5m）
- 📐 相机高度（0.5m - 2.5m）
- 🔄 自动旋转开关
- 👁️ 鼠标头部跟踪
- 🌓 实时阴影效果

**快捷功能：**
- 🔄 一键重置相机
- 📸 高清截图保存

### 🎵 音频同步系统

- 📂 支持多种音频格式（MP3, WAV, OGG等）
- 🎚️ 音量滑块控制（0-100%）
- 🔁 循环播放模式
- 💃 自动同步舞蹈动画
- ⏯️ 播放/停止控制

---

## 🚀 快速开始

### 方法一：直接运行（最简单）

1. **下载项目**
   ```bash
   git clone https://github.com/jackdiy/Mate-Engine-Web3D-Jack.git
   cd Mate-Engine-Web3D-Jack
   ```

2. **打开应用**
   - 双击 `index.html` 文件
   - 或在浏览器中打开

3. **开始体验**
   - 点击角色卡片加载模型
   - 享受互动！

### 方法二：本地服务器（推荐）

某些浏览器由于安全策略，需要通过HTTP服务器访问。

**使用Python：**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# 访问 http://localhost:8000
```

**使用Node.js：**
```bash
# 安装http-server
npm install -g http-server

# 启动服务器
http-server -p 8000

# 访问 http://localhost:8000
```

**使用PHP：**
```bash
php -S localhost:8000
```

---

## 📖 使用指南

### 1. 加载角色

**预设角色：**
1. 点击 **Lazuli**、**Aldina** 或 **Zome** 卡片
2. 等待模型加载（5-10秒，取决于网络）
3. 模型出现在3D场景中

**自定义角色：**
1. 点击 **自定义** 卡片
2. 选择本地 VRM 或 ME 文件
3. 上传并自动加载

### 2. 播放动画

1. 选择动画按钮（待机、舞蹈1、舞蹈2等）
2. 动画立即开始播放
3. 可随时切换不同动画

### 3. 音乐同步舞蹈

1. 点击 **选择音乐** 上传BGM
2. 点击 **播放音乐舞蹈**
3. 角色随音乐节奏起舞
4. 使用音量滑块调节音量
5. 点击 **停止** 结束播放

### 4. 切换表情

- 点击表情按钮（开心、伤心、生气等）
- 角色表情实时改变
- 支持VRM标准混合形状系统

### 5. 服装控制

- 模型加载后自动显示可用服装
- 切换开关即时显示/隐藏
- 实时预览效果

### 6. 相机操作

**基础操作：**
- 左键拖拽 → 旋转
- 滚轮 → 缩放
- 右键拖拽 → 平移

**高级设置：**
- 调节距离和高度滑块
- 开启/关闭自动旋转
- 启用鼠标头部跟踪
- 切换阴影效果

**其他功能：**
- 重置相机 - 恢复默认位置
- 截图 - 保存当前画面为PNG

---

## 📁 项目结构

```
Mate-Engine-Web3D-Jack/
├── index.html              # 主页面（玻璃拟态UI设计）
├── styles.css              # 样式表（渐变+微动画）
├── app.js                  # 核心逻辑（26KB精简代码）
├── 使用说明.md              # 详细中文使用指南
├── README.md               # 本文档
├── LICENSE.md              # 专有许可证
└── Assets/                 # 模型资源目录
    └── MATE ENGINE - Avatar/
        ├── DLCs/
        │   ├── Lazuli_VRM.vrm    (60MB - 拉祖莉)
        │   ├── aldina.vrm        (13MB - 阿尔迪娜)
        │   └── ME_02/Ayrina/     (ME格式示例)
        └── Zome.vrm              (佐米)
```

---

## 🛠️ 技术栈

### 前端技术
- **HTML5** - 语义化标记
- **CSS3** - Glassmorphism + 动态渐变
- **JavaScript ES6+** - 现代模块化编程

### 3D渲染引擎
- **Three.js** v0.169.0 - 强大的WebGL 3D引擎
- **@pixiv/three-vrm** v3.1.0 - VRM格式加载器
- **OrbitControls** - 专业相机控制

### 设计系统
- **Inter字体** - Google Fonts现代排版
- **玻璃拟态** - 2025最新设计趋势
- **多巴胺配色** - 高饱和度鲜艳渐变
- **CSS Grid + Flexbox** - 完美响应式布局

### CDN依赖
```html
<!-- 通过ES Modules从CDN加载 -->
<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/",
    "@pixiv/three-vrm": "https://cdn.jsdelivr.net/npm/@pixiv/three-vrm@3.1.0/lib/three-vrm.module.js"
  }
}
</script>
```

---

## 🎨 设计亮点

### 玻璃拟态效果实现
```css
.glass-panel {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
}
```

### 动态渐变背景
```css
body {
    background: linear-gradient(135deg, 
        #667eea 0%, 
        #764ba2 50%, 
        #f093fb 100%);
    background-size: 400% 400%;
    animation: gradientShift 15s ease infinite;
}
```

### 精心设计的配色方案
- **主色调：** 紫色渐变 `#667eea → #764ba2`
- **辅助色：** 粉色渐变 `#f093fb → #f5576c`
- **成功色：** 蓝色渐变 `#4facfe → #00f2fe`
- **警告色：** 橙粉渐变 `#fa709a → #fee140`

### 微交互动画
- ✨ 悬停放大效果（scale: 1.05）
- 🌊 平滑过渡动画（0.3s ease）
- 📊 加载进度条动画
- 💫 按钮点击反馈

---

## 📱 浏览器兼容性

| 浏览器 | 版本要求 | 支持度 | 备注 |
|--------|----------|--------|------|
| Chrome | 90+ | ✅ 完美 | 推荐使用 |
| Edge | 90+ | ✅ 完美 | 基于Chromium |
| Firefox | 88+ | ✅ 良好 | WebGL支持完整 |
| Safari | 15+ | ✅ 良好 | macOS/iOS |
| Opera | 最新 | ✅ 良好 | - |
| 移动Chrome | 最新 | ⚠️ 有限 | 性能受限 |
| 移动Safari | 最新 | ⚠️ 有限 | 性能受限 |

**系统要求：**
- ✅ WebGL 2.0 支持
- ✅ 4GB+ 系统内存
- ✅ 现代GPU（集成显卡可用）
- ✅ 稳定的网络连接（首次加载CDN）

---

## ⚡ 性能指标

### 加载时间

| 模型 | 文件大小 | 加载时间 | 内存占用 |
|------|----------|----------|----------|
| Lazuli | 60MB | 5-10秒 | ~200MB |
| Aldina | 13MB | 2-3秒 | ~80MB |
| Zome | 变化 | 2-5秒 | ~100MB |
| 自定义 | 取决于文件 | 变化 | 变化 |

### 运行性能

| 设备类型 | 目标FPS | CPU占用 | GPU占用 |
|---------|---------|---------|---------|
| 高端台式机 | 60 | 10-15% | 20-30% |
| 中端笔记本 | 50-60 | 15-25% | 30-50% |
| 低端设备 | 30-45 | 25-40% | 50-70% |

### 优化建议

**针对低端设备：**
```javascript
// 在 app.js 中可以调整以下参数
state.renderer.setPixelRatio(1); // 降低渲染分辨率
directionalLight.shadow.mapSize.width = 1024; // 降低阴影质量
```

---

## 🐛 常见问题

### 模型无法加载

**问题：** 点击角色卡片无反应

**解决方案：**
1. 打开浏览器控制台（F12）检查错误
2. 确认网络连接正常（CDN需要联网）
3. 尝试使用本地HTTP服务器
4. 清除浏览器缓存后重试
5. 检查文件路径是否正确

### 动画不流畅

**问题：** FPS低于30，卡顿严重

**解决方案：**
1. 关闭其他浏览器标签页释放内存
2. 禁用自动旋转和阴影效果
3. 降低浏览器缩放比例（100%最佳）
4. 更新显卡驱动到最新版本
5. 使用较轻的模型（如Aldina）

### 音乐无法播放

**问题：** 上传BGM后没有声音

**解决方案：**
1. 检查系统音量和浏览器音量设置
2. 确认音频文件格式支持（推荐MP3）
3. 查看浏览器自动播放策略设置
4. 手动点击播放按钮（避免自动播放限制）
5. 尝试其他音频文件

### CDN加载失败

**问题：** Three.js或VRM库无法加载

**解决方案：**
1. 检查网络连接状态
2. 尝试使用VPN（某些地区CDN可能被限制）
3. 下载库文件到本地并修改importmap路径
4. 等待片刻后刷新页面重试

---

## 🔧 高级配置

### 修改默认角色

在 `app.js` 的 `init()` 函数中：
```javascript
setTimeout(() => {
    loadCharacter('aldina'); // 改为 'lazuli', 'zome' 或 'aldina'
}, 500);
```

### 调整相机默认位置

```javascript
state.camera.position.set(0, 1.4, 2.0); // X, Y, Z坐标
state.controls.target.set(0, 1.2, 0); // 注视点
```

### 自定义动画速度

```javascript
state.mixer.timeScale = 1.5; // 1.5倍速，可调整
```

### 修改渐变背景

在 `styles.css` 中：
```css
body {
    background: linear-gradient(135deg, 
        #your-color-1 0%, 
        #your-color-2 50%, 
        #your-color-3 100%);
}
```

---

## 📚 相关资源

### 官方文档
- [Three.js官方文档](https://threejs.org/docs/)
- [VRM规范说明](https://vrm.dev/)
- [@pixiv/three-vrm GitHub](https://github.com/pixiv/three-vrm)

### 模型资源
- [VRoid Hub](https://hub.vroid.com/) - VRM模型分享平台
- [Booth.pm](https://booth.pm/) - 搜索"VRM"获取模型
- [VRoid Studio](https://vroid.com/studio) - 创建自己的VRM角色

### 学习教程
- [VRM格式创建指南](https://vrm.dev/en/vrm/how_to_make_vrm/)
- [Three.js入门教程](https://threejs.org/manual/)
- [WebGL基础知识](https://webglfundamentals.org/)

---

## 🎯 使用场景

### 个人用户
- ✅ 预览和测试VRM模型
- ✅ 角色展示和截图分享
- ✅ 学习VRM格式规范
- ✅ 动画效果测试

### 开发者
- ✅ VRM格式兼容性验证
- ✅ 动画原型快速设计
- ✅ Three.js学习和实践
- ✅ WebGL性能测试

### 内容创作者
- ✅ 角色设计预览
- ✅ 服装搭配测试
- ✅ 表情调试和优化
- ✅ 动作参考和截图

---

## 🤝 贡献指南

**注意：本项目为私有项目，暂不接受外部贡献。**

### 报告问题
如有问题，请联系项目维护者。

---

## 📄 许可证

### 专有许可

- **本项目：** 专有许可证 - 未经授权禁止使用、复制或分发
- **Three.js：** MIT License
- **@pixiv/three-vrm：** MIT License

### 模型许可
- **Lazuli（拉祖莉）：** © [Yorshka Shop](https://yorshkasencho.booth.pm/) - 仅供演示，请勿重新分发
- **其他模型：** 请查看各自的许可证条款

**重要提示：** 本项目为私有项目，所有代码和资源未经授权不得使用。使用自定义模型时，请确保遵守原作者的版权和许可证要求！

详细许可证内容请查看 [LICENSE.md](LICENSE.md)

---

## 🔮 未来计划

### 短期计划（1-2个月）
- [ ] 添加更多预设动画库
- [ ] 实现粒子效果系统
- [ ] 支持背景自定义上传
- [ ] 优化移动端触摸体验
- [ ] 添加更多表情预设

### 中期计划（3-6个月）
- [ ] VMD动画文件导入支持
- [ ] 多角色同屏显示功能
- [ ] 实时协作和分享
- [ ] VR/AR设备支持
- [ ] 云端模型库集成

### 长期计划（6个月+）
- [ ] **Android原生应用** - 基于WebView或Unity方案
- [ ] iOS原生应用开发
- [ ] AI驱动的动画生成
- [ ] 社交分享功能
- [ ] 直播集成功能

**注：** Android移植技术方案正在规划中，将在未来的专门分支中实现。

---

## 📞 联系方式

- **项目主页：** [https://github.com/jackdiy/Mate-Engine-Web3D-Jack](https://github.com/jackdiy/Mate-Engine-Web3D-Jack)
- **项目状态：** 私有项目

---

## 🌟 致谢

特别感谢以下项目和个人：

- **Three.js团队** - 提供优秀的3D引擎
- **Pixiv团队** - 开发VRM加载器
- **Yorshka Shop** - 提供Lazuli模型用于演示
- **所有贡献者** - 持续的支持和反馈
- **开源社区** - 提供技术支持和灵感

---

## 📈 项目统计

- **代码行数：** ~2,050行（HTML + CSS + JavaScript）
- **文件大小：** 53KB（压缩前，不含模型）
- **支持角色：** 4个3D模型
- **动画数量：** 6种预设
- **表情预设：** 6个
- **语言：** 100%简体中文
- **文档字数：** 15,000+

---

## ⭐ 项目信息

**Mate-Engine-Web3D-Jack** 是一个私有的3D角色查看器项目。

---

<div align="center">

**享受你的虚拟伙伴！🎭✨**

Made with ❤️ using Three.js and VRM

*最后更新：2025-12-07*

</div>
