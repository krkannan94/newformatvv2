# Quick Start: Publishing to Google Play Store

Your app is now ready to be built for the Play Store! Follow these steps in order.

## ✅ Current Status

- ✅ Web app built successfully
- ✅ Android configuration complete
- ✅ Capacitor sync successful
- ✅ Build files generated
- ✅ Version set to 1.0.0 (versionCode: 1)

## Step 1: Generate Signing Key (ONE TIME ONLY)

**⚠️ CRITICAL: Keep this key safe! You cannot update your app without it.**

Run this command to generate your signing key:

```bash
keytool -genkey -v -keystore cbre-report-generator.keystore -alias cbre-report-key -keyalg RSA -keysize 2048 -validity 10000
```

You will be prompted for:
- Keystore password (choose a strong password)
- Key password (can be the same as keystore password)
- Your name
- Organization (CBRE)
- City, State, Country

**Save these passwords securely! You'll need them for every app update.**

The file `cbre-report-generator.keystore` will be created in your current directory.

**Important:**
- Store this file in a secure location (backup to cloud storage)
- Never commit it to git (already in .gitignore)
- Keep the passwords in a password manager

## Step 2: Configure Signing

Create a file at `android/keystore.properties` with your signing information:

```properties
storeFile=/absolute/path/to/cbre-report-generator.keystore
storePassword=YOUR_KEYSTORE_PASSWORD
keyAlias=cbre-report-key
keyPassword=YOUR_KEY_PASSWORD
```

Replace:
- `/absolute/path/to/cbre-report-generator.keystore` with the full path to your keystore file
- `YOUR_KEYSTORE_PASSWORD` with your keystore password
- `YOUR_KEY_PASSWORD` with your key password

## Step 3: Update build.gradle for Signing

Update `android/app/build.gradle` to enable signing. Add this BEFORE the `android {` block:

```gradle
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
```

Then inside the `android {` block, add the signing configuration:

```gradle
android {
    namespace "com.cbre.reportgenerator"
    compileSdkVersion rootProject.ext.compileSdkVersion

    defaultConfig {
        // ... existing config ...
    }

    // ADD THIS:
    signingConfigs {
        release {
            if (keystorePropertiesFile.exists()) {
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
                storeFile file(keystoreProperties['storeFile'])
                storePassword keystoreProperties['storePassword']
            }
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release  // ADD THIS LINE
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

## Step 4: Build the Release AAB

Build the Android App Bundle for Play Store:

```bash
npm run android:bundle
```

This will:
1. Build your web app
2. Sync with Android
3. Build a signed AAB file

The AAB file will be located at:
```
android/app/build/outputs/bundle/release/app-release.aab
```

## Step 5: Test the Build

Before submitting, test the AAB locally using bundletool:

```bash
# Install bundletool if needed
npm install -g bundletool

# Generate APKs from AAB
bundletool build-apks --bundle=android/app/build/outputs/bundle/release/app-release.aab --output=app.apks --mode=universal

# Extract the universal APK
unzip -p app.apks universal.apk > app-universal.apk

# Install on connected device
adb install app-universal.apk
```

Test all features thoroughly on the device!

## Step 6: Create Google Play Console Account

1. Go to https://play.google.com/console
2. Sign in with Google account
3. Pay $25 one-time registration fee
4. Complete account verification

## Step 7: Create Your App in Play Console

1. Click "Create app"
2. Fill in details:
   - **App name:** CBRE Report Generator
   - **Default language:** English (United States)
   - **App or game:** App
   - **Free or paid:** Free
3. Accept declarations and click "Create app"

## Step 8: Complete Store Listing

### App Details
- **App name:** CBRE Report Generator
- **Short description:** Create professional maintenance reports with photos and generate PDF documents
- **Full description:** (See PLAY_STORE_CHECKLIST.md for complete description)

### Graphics
You need to create these assets:

1. **App Icon** (512x512 PNG)
   - Square icon with your CBRE logo
   - No transparency
   - High quality

2. **Feature Graphic** (1024x500 PNG)
   - Banner for your app
   - Include app name and key feature

3. **Screenshots** (At least 2)
   - 1080x1920 or higher
   - Show main features:
     - Report generation form
     - Before/After photo view
     - PDF preview
     - Dashboard

### Categorization
- **App category:** Business
- **Tags:** maintenance, reports, PDF, facility management

### Contact Details
- **Email:** Your support email
- **Phone:** (Optional) Your support phone
- **Website:** (Optional) Your company website

### Privacy Policy
You must provide a privacy policy URL. Create a simple page stating:
- What data is collected (photos, form data)
- Where data is stored (locally on device)
- No data transmitted to external servers
- Camera and storage permissions usage

## Step 9: Content Rating

1. Go to "Content rating" section
2. Fill out questionnaire:
   - No violence
   - No sexual content
   - No profanity
   - No drugs
   - No gambling
3. Get "Everyone" rating

## Step 10: Set Up Pricing & Distribution

1. **Countries:** Select all countries (or specific ones)
2. **Pricing:** Free
3. **Contains ads:** No
4. **In-app purchases:** No
5. Accept program policies

## Step 11: Upload AAB

1. Go to "Release" > "Production"
2. Click "Create new release"
3. Upload `app-release.aab`
4. Fill in release notes:

```
Initial release of CBRE Report Generator

Features:
• Create professional maintenance reports
• Capture before/after photos
• Generate branded PDF documents
• Save drafts for later
• Share reports easily
• Offline functionality
```

5. Click "Review release"

## Step 12: Submit for Review

1. Review all sections (they should have green checkmarks)
2. Click "Start rollout to Production"
3. Confirm submission

**Review time:** Typically 1-7 days

## Step 13: After Approval

Once approved:
1. App will be live on Play Store
2. You'll receive an email notification
3. Test downloading from Play Store
4. Monitor reviews and ratings
5. Set up crash reporting in Play Console

## Updating Your App

For future updates:

1. Update version in `android/app/build.gradle`:
   ```gradle
   versionCode 2  // Increment by 1
   versionName "1.1.0"  // Update version number
   ```

2. Make your changes to the app
3. Build new AAB: `npm run android:bundle`
4. Upload to Play Console
5. Add release notes describing changes
6. Submit for review

## Troubleshooting

### Build fails
```bash
cd android
./gradlew clean
cd ..
npm run android:bundle
```

### Signing issues
- Verify keystore.properties file exists
- Check file paths are absolute
- Verify passwords are correct

### AAB upload rejected
- Ensure versionCode is higher than previous
- Check for security vulnerabilities
- Review pre-launch report errors

## Important Reminders

✅ **BACKUP YOUR KEYSTORE** - Store in multiple secure locations
✅ **TEST ON REAL DEVICES** - Emulators may not catch all issues
✅ **INCREMENT VERSION CODE** - Must be higher for each upload
✅ **MONITOR REVIEWS** - Respond to user feedback
✅ **FOLLOW POLICIES** - Stay compliant with Play Store rules

## Support

For issues:
- Check Android Studio Logcat
- Review build logs: `cd android && ./gradlew bundleRelease --stacktrace`
- Capacitor docs: https://capacitorjs.com/docs
- Play Console Help: https://support.google.com/googleplay/android-developer

---

## Quick Commands Reference

```bash
# Build debug version
npm run android:run

# Build release AAB
npm run android:bundle

# Sync changes
npm run android:sync

# Open in Android Studio
npm run android:open

# Check Capacitor status
npx cap doctor
```

## Next Steps

1. Generate your signing key
2. Configure keystore.properties
3. Update build.gradle with signing config
4. Build the AAB
5. Create Play Console account
6. Fill in store listing
7. Upload and submit!

Good luck with your Play Store launch! 🚀
