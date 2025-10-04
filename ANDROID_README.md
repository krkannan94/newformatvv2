# CBRE Report Generator - Android App

A native Android application for generating professional maintenance reports with before/after photos and PDF export capabilities.

## Features

### Core Functionality
- ✅ Create detailed maintenance reports with form data
- ✅ Capture photos using device camera
- ✅ Select multiple images from photo library
- ✅ Before/After image pairing
- ✅ Add text annotations to images
- ✅ Generate professional PDF reports
- ✅ Save PDFs to device storage
- ✅ Share reports via any app (email, WhatsApp, etc.)
- ✅ Save drafts for later editing
- ✅ Offline functionality with IndexedDB
- ✅ Activity tracking and statistics

### Native Android Features
- Native camera integration
- Photo library access
- File system storage
- Native share functionality
- Status bar customization (CBRE green theme)
- Splash screen
- Hardware back button support
- Optimized for mobile performance

## Quick Start

### For Developers

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Build and Run on Device**
   ```bash
   npm run android:run
   ```

3. **Open in Android Studio**
   ```bash
   npm run android:open
   ```

### Build Commands

```bash
# Development
npm run dev                 # Web development server
npm run android:run        # Build and run on Android device

# Production
npm run android:build      # Build release APK
npm run android:bundle     # Build release AAB for Play Store

# Utilities
npm run android:sync       # Sync web build to Android
npm run android:open       # Open project in Android Studio
```

## App Configuration

### App Details
- **Package ID**: com.cbre.reportgenerator
- **App Name**: CBRE Report Generator
- **Min SDK**: Android 5.1 (API 22)
- **Target SDK**: Latest Android

### Permissions
The app requests these permissions:
- **Camera**: Take photos for reports
- **Photos**: Select images from library
- **Storage**: Save PDF reports
- **Internet**: Optional online features

## Building for Play Store

See [ANDROID_BUILD_GUIDE.md](./ANDROID_BUILD_GUIDE.md) for complete instructions.

### Quick Build

```bash
npm run android:bundle
```

The release bundle will be at:
`android/app/build/outputs/bundle/release/app-release.aab`

## Project Structure

```
project/
├── src/                          # React app source
│   ├── components/              # React components
│   ├── utils/
│   │   ├── capacitor.ts        # Native API wrappers
│   │   └── pdfGenerator.ts     # PDF generation
│   └── db.ts                   # IndexedDB database
├── android/                      # Native Android project
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml
│   │   │   └── res/            # App icons, splash
│   │   └── build.gradle
│   └── build.gradle
├── capacitor.config.ts          # Capacitor configuration
└── ANDROID_BUILD_GUIDE.md       # Detailed build guide
```

## Key Technologies

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + Radix UI components
- **Native Bridge**: Capacitor 7
- **Storage**: IndexedDB (Dexie)
- **PDF**: jsPDF
- **Forms**: React Hook Form + Yup validation
- **Routing**: React Router v7

## Native Plugins Used

- `@capacitor/camera` - Camera and photo library
- `@capacitor/filesystem` - File storage
- `@capacitor/share` - Share functionality
- `@capacitor/status-bar` - Status bar styling
- `@capacitor/splash-screen` - App splash screen
- `@capacitor/app` - App lifecycle and back button

## Development Tips

### Testing on Device

1. Enable Developer Mode on Android device
2. Connect via USB and enable USB debugging
3. Run: `npm run android:run`

### Debugging

1. **Chrome DevTools**: `chrome://inspect`
2. **Android Studio Logcat**: View native logs
3. **Network Inspector**: Monitor API calls

### Common Issues

**Build Fails**
```bash
cd android
./gradlew clean
cd ..
npm run android:sync
```

**Camera Not Working**
- Check AndroidManifest.xml permissions
- Verify permissions are granted in device settings

**Images Not Loading**
- Ensure images are in `public/` folder
- Check file paths are correct
- Verify image formats (JPG, PNG)

## Performance Optimization

The app includes several optimizations for mobile:

1. **Image Compression**: Automatic compression to 600px max
2. **Lazy Loading**: Components load on demand
3. **PDF Optimization**: Compressed images in PDFs
4. **Offline First**: All data cached locally
5. **Memory Management**: Cleanup after PDF generation

## Security

- ✅ No sensitive data transmitted
- ✅ Local-only storage (IndexedDB)
- ✅ Secure file access permissions
- ✅ ProGuard enabled for release builds
- ✅ HTTPS for any network requests

## App Size

- Debug APK: ~15-20 MB
- Release APK: ~8-12 MB (with ProGuard)
- Release AAB: ~7-10 MB

## Requirements

### Development
- Node.js 18+
- Android Studio
- JDK 17+
- Gradle 8+

### Device Requirements
- Android 5.1 or higher
- 50 MB free storage
- Camera (optional)

## Support

For build issues:
1. Check [ANDROID_BUILD_GUIDE.md](./ANDROID_BUILD_GUIDE.md)
2. Run `npx cap doctor` for diagnostics
3. Check Android Studio Logcat for errors

## License

Proprietary - CBRE Internal Use

## Version History

### 1.0.0 (Current)
- Initial Android release
- Full feature parity with web app
- Native camera and file system integration
- PDF generation and sharing
- Offline functionality
