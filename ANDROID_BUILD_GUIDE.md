# Android Build Guide - CBRE Report Generator

This guide explains how to build and deploy the CBRE Report Generator as a native Android application for the Google Play Store.

## Prerequisites

1. **Node.js and npm** installed
2. **Android Studio** installed (download from https://developer.android.com/studio)
3. **Java Development Kit (JDK)** 17 or higher
4. **Android SDK** (installed via Android Studio)

## Initial Setup

The app has already been configured with Capacitor. Follow these steps to complete the setup:

### 1. Build the Web App

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### 2. Sync Capacitor

After building, sync the web assets with the native Android project:

```bash
npx cap sync android
```

This copies the web build to the Android project and updates native dependencies.

## Configuring App Icons and Splash Screen

### App Icons

1. Prepare your app icon (should be 1024x1024 PNG with no transparency)
2. Use Android Studio's Image Asset tool:
   - Open the project in Android Studio: `npx cap open android`
   - Right-click on `app/res` folder
   - Select `New > Image Asset`
   - Choose `Launcher Icons` and follow the wizard
   - This will generate all required icon sizes

Alternatively, manually place icons in these directories:
- `android/app/src/main/res/mipmap-hdpi/ic_launcher.png` (72x72)
- `android/app/src/main/res/mipmap-mdpi/ic_launcher.png` (48x48)
- `android/app/src/main/res/mipmap-xhdpi/ic_launcher.png` (96x96)
- `android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png` (144x144)
- `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png` (192x192)

### Splash Screen

1. Create a splash screen image (2732x2732 PNG recommended)
2. Place it in `android/app/src/main/res/drawable/splash.png`
3. The splash screen configuration is already set in `capacitor.config.ts`

## Building the APK

### Debug Build (for testing)

1. Open Android Studio:
   ```bash
   npx cap open android
   ```

2. In Android Studio:
   - Click `Build > Build Bundle(s) / APK(s) > Build APK(s)`
   - Wait for the build to complete
   - The APK will be in: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release Build (for Play Store)

#### 1. Generate a Signing Key

```bash
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

Store this keystore file securely - you'll need it for all future updates!

#### 2. Configure Signing

Create/edit `android/keystore.properties`:

```properties
storeFile=/path/to/my-release-key.keystore
storePassword=YOUR_KEYSTORE_PASSWORD
keyAlias=my-key-alias
keyPassword=YOUR_KEY_PASSWORD
```

Edit `android/app/build.gradle` to add signing configuration:

```gradle
android {
    ...
    signingConfigs {
        release {
            if (project.hasProperty('android.injected.signing.store.file')) {
                storeFile file(project.property('android.injected.signing.store.file'))
                storePassword project.property('android.injected.signing.store.password')
                keyAlias project.property('android.injected.signing.key.alias')
                keyPassword project.property('android.injected.signing.key.password')
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

#### 3. Build Release APK

```bash
cd android
./gradlew assembleRelease
```

The signed APK will be in: `android/app/build/outputs/apk/release/app-release.apk`

#### 4. Build Android App Bundle (AAB) for Play Store

Google Play prefers AAB format:

```bash
cd android
./gradlew bundleRelease
```

The AAB will be in: `android/app/build/outputs/bundle/release/app-release.aab`

## Testing the App

### Testing on Physical Device

1. Enable Developer Mode on your Android device
2. Connect via USB
3. Run: `npx cap run android`

### Testing APK Installation

```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

## Updating Version

Before each Play Store release:

1. Update version in `android/app/build.gradle`:
   ```gradle
   android {
       defaultConfig {
           versionCode 2  // Increment this for each release
           versionName "1.1.0"  // Update as needed
       }
   }
   ```

2. Update version in `package.json`:
   ```json
   "version": "1.1.0"
   ```

## Publishing to Google Play Store

### 1. Create Developer Account

- Go to https://play.google.com/console
- Pay the one-time $25 registration fee
- Complete the account setup

### 2. Create New App

- Click "Create app" in the Play Console
- Fill in app details:
  - App name: CBRE Report Generator
  - Default language: English (United States)
  - App or game: App
  - Free or paid: Free

### 3. Complete Store Listing

Required items:
- App icon (512x512 PNG)
- Feature graphic (1024x500 PNG)
- At least 2 screenshots (phone and tablet)
- Short description (80 characters max)
- Full description (4000 characters max)
- Privacy policy URL

### 4. Complete Content Rating

Complete the questionnaire to get a content rating for your app.

### 5. Set Up Pricing and Distribution

- Select countries
- Confirm content guidelines
- Declare ads (if any)

### 6. Upload App Bundle

- Go to "Release > Production"
- Click "Create new release"
- Upload your `app-release.aab`
- Add release notes
- Review and rollout

### 7. Submit for Review

- Review all sections
- Submit for review
- Wait for approval (typically 1-7 days)

## Troubleshooting

### Build Errors

If you get Gradle errors:
```bash
cd android
./gradlew clean
./gradlew build
```

### Sync Issues

```bash
npx cap sync android
npx cap copy android
```

### Clear Cache

```bash
rm -rf node_modules
rm -rf android/app/build
npm install
npm run build
npx cap sync android
```

## Useful Commands

```bash
# Build web app
npm run build

# Sync to Android
npx cap sync android

# Open in Android Studio
npx cap open android

# Run on device
npx cap run android

# Update Capacitor
npm install @capacitor/cli@latest @capacitor/core@latest @capacitor/android@latest

# Check Capacitor doctor
npx cap doctor
```

## Features Enabled

The app includes these native capabilities:

- ✅ Camera access for taking photos
- ✅ Photo library access for selecting images
- ✅ File system access for saving PDFs
- ✅ Share functionality for sharing reports
- ✅ Offline storage using IndexedDB
- ✅ Status bar customization
- ✅ Splash screen
- ✅ Back button handling

## Performance Tips

1. Always build in production mode: `npm run build`
2. Test on actual devices, not just emulators
3. Monitor app size (keep under 50MB if possible)
4. Test on multiple Android versions (minimum API 22/Android 5.1)
5. Use Chrome DevTools for debugging: `chrome://inspect`

## Support

For issues:
- Check logs: `npx cap run android --verbose`
- Use Android Studio Logcat for native logs
- Check Capacitor docs: https://capacitorjs.com/docs

## Security Considerations

1. Never commit keystore files to git
2. Keep keystore passwords secure
3. Use environment variables for sensitive data
4. Enable ProGuard for release builds
5. Test with security tools before publishing
