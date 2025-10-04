# Google Play Store Deployment Checklist

## Pre-Submission Checklist

### ✅ App Preparation

- [ ] App builds successfully without errors
- [ ] All features tested on physical Android devices
- [ ] Tested on multiple Android versions (5.1+)
- [ ] Camera permissions working correctly
- [ ] File storage permissions working correctly
- [ ] PDF generation tested with various image counts
- [ ] Share functionality tested
- [ ] Offline functionality verified
- [ ] App doesn't crash on low memory devices
- [ ] Tested on different screen sizes (phone, tablet)

### ✅ Assets Required

#### App Icons
- [ ] App icon prepared (512x512 PNG, no transparency)
- [ ] Icons generated for all densities using Android Studio
- [ ] Icons look good on different Android versions
- [ ] Icon follows Material Design guidelines

#### Screenshots
- [ ] At least 2 phone screenshots (16:9 ratio)
  - Landing page with form
  - Report generation with images
  - PDF preview/export screen
  - Dashboard with statistics
- [ ] At least 1 tablet screenshot (optional but recommended)
- [ ] Screenshots are 1080p or higher
- [ ] Screenshots show actual app functionality
- [ ] No Lorem Ipsum or placeholder content

#### Feature Graphic
- [ ] Feature graphic created (1024x500 PNG)
- [ ] Includes CBRE branding
- [ ] Clear and professional design
- [ ] Text is readable at small sizes

#### Splash Screen
- [ ] Splash screen image added to `android/app/src/main/res/drawable/splash.png`
- [ ] Splash screen tested on device
- [ ] Shows for appropriate duration (2 seconds)

### ✅ App Details

#### Store Listing Content

**App Title** (30 characters max)
```
CBRE Report Generator
```

**Short Description** (80 characters max)
```
Create professional maintenance reports with photos and generate PDF documents
```

**Full Description** (4000 characters max)
```
CBRE Report Generator - Professional Maintenance Reporting

Generate comprehensive maintenance reports with before/after photos and professional PDF output. Perfect for facility managers, maintenance teams, and service providers.

KEY FEATURES:

📸 Photo Capture & Management
• Take photos directly with your device camera
• Import multiple images from photo library
• Organize photos in before/after pairs
• Add text annotations to images
• Reorder and manage image layouts

📄 PDF Report Generation
• Professional PDF reports with CBRE branding
• Include all form data and images
• Automatic formatting and layout
• High-quality image reproduction
• Save to device or share directly

📝 Comprehensive Form Fields
• Account and site information
• PM task details
• Service provider information
• Technician name
• Maintenance date tracking

💾 Draft Management
• Save work in progress as drafts
• Continue editing saved drafts
• Manage multiple reports
• Never lose your work

📤 Easy Sharing
• Share PDFs via email, WhatsApp, or any app
• Save to device storage
• Quick export options
• Compatible with all PDF readers

📊 Activity Tracking
• View recent reports
• Track generation statistics
• Monitor report history

🔒 Privacy & Security
• All data stored locally on your device
• No data transmitted to external servers
• Secure file handling
• Camera and storage permissions only when needed

PERFECT FOR:
• Facility Managers
• Maintenance Technicians
• Property Managers
• Service Providers
• CBRE Team Members

REQUIREMENTS:
• Android 5.1 or higher
• Camera for photo capture (optional)
• 50 MB storage space

Download now and streamline your maintenance reporting workflow!
```

#### Categorization
- [ ] **Category**: Business
- [ ] **Tags**: maintenance, reports, PDF, CBRE, facility management
- [ ] **Content Rating**: Everyone
- [ ] **Contains Ads**: No
- [ ] **In-app Purchases**: No

### ✅ Privacy & Legal

- [ ] **Privacy Policy URL**: [Add your company's privacy policy URL]
- [ ] Data collection reviewed (app stores all data locally)
- [ ] Permissions justified in policy
- [ ] Terms of Service prepared (if required)

### ✅ Content Rating Questionnaire

Answer these questions in Play Console:

**Violence**
- No violent content

**Sexuality**
- No sexual content

**Language**
- No profanity

**Drugs**
- No drug-related content

**Gambling**
- No gambling content

**Expected Rating**: Everyone

### ✅ Target Audience

- [ ] **Target Age Group**: 18+
- [ ] **Target Audience**: Business professionals
- [ ] **Countries**: Select all countries or specific regions

### ✅ Technical Requirements

#### Version Information
- [ ] **Version Code**: 1 (increment for each release)
- [ ] **Version Name**: 1.0.0
- [ ] Updated in `android/app/build.gradle`

#### Signing
- [ ] Signing key generated and stored securely
- [ ] Keystore password documented (SECURELY!)
- [ ] Key alias documented
- [ ] Key password documented (SECURELY!)
- [ ] Backup of keystore file created
- [ ] Release build signed successfully

#### Build
- [ ] AAB file generated: `npm run android:bundle`
- [ ] AAB file tested: `bundletool build-apks --bundle=app-release.aab --output=app.apks`
- [ ] No ProGuard errors
- [ ] App size under 50MB
- [ ] No security vulnerabilities

### ✅ Testing

#### Functional Testing
- [ ] All forms validate correctly
- [ ] Images upload successfully
- [ ] Camera integration works
- [ ] PDF generation successful
- [ ] Share functionality works
- [ ] Drafts save and load correctly
- [ ] App handles low storage gracefully
- [ ] App handles network errors gracefully
- [ ] No crashes during normal use

#### Device Testing
- [ ] Tested on Samsung devices
- [ ] Tested on Google Pixel devices
- [ ] Tested on at least 3 different devices
- [ ] Tested on Android 5.1 (minimum)
- [ ] Tested on latest Android version
- [ ] Tested on small screens (phone)
- [ ] Tested on large screens (tablet)

#### Performance Testing
- [ ] App launches in under 3 seconds
- [ ] PDF generation completes in reasonable time
- [ ] No memory leaks detected
- [ ] Battery usage is reasonable
- [ ] Storage usage is appropriate

### ✅ Play Console Setup

#### Account Setup
- [ ] Google Play Developer account created ($25 one-time fee)
- [ ] Payment profile completed
- [ ] Tax information submitted
- [ ] Identity verification completed

#### App Creation
- [ ] New app created in Play Console
- [ ] App name set
- [ ] Default language set (English US)
- [ ] App declared as "App" (not game)
- [ ] Free/Paid status set (Free)

#### Store Listing
- [ ] All required fields completed
- [ ] App icon uploaded
- [ ] Feature graphic uploaded
- [ ] Screenshots uploaded
- [ ] Short description added
- [ ] Full description added
- [ ] Privacy policy URL added
- [ ] Category selected
- [ ] Contact email added
- [ ] Contact phone (optional) added

#### Content Rating
- [ ] Questionnaire completed
- [ ] Rating certificate generated
- [ ] Rating approved

#### Pricing & Distribution
- [ ] Countries/regions selected
- [ ] Pricing set (Free)
- [ ] Distribution channels selected
- [ ] Content guidelines accepted
- [ ] US export laws compliance confirmed

#### Release
- [ ] Production track selected
- [ ] Release name added (e.g., "Initial Release")
- [ ] Release notes added
- [ ] AAB file uploaded
- [ ] No errors in pre-launch report
- [ ] Review and rollout to production

### ✅ Post-Submission

#### After Submission
- [ ] Submission confirmed
- [ ] Review status checked
- [ ] Expected review time: 1-7 days

#### After Approval
- [ ] App live on Play Store
- [ ] Store listing reviewed
- [ ] Download link tested
- [ ] App installs correctly from store
- [ ] All features work in production

#### Monitoring
- [ ] Play Console set up for crash reporting
- [ ] User reviews monitored
- [ ] Update plan established
- [ ] Version 1.1.0 features planned

## Release Notes Template

### Version 1.0.0 - Initial Release

**New Features**
- Professional maintenance report generation
- Camera integration for photo capture
- Before/After image pairing
- Text annotations for images
- PDF export with CBRE branding
- Draft management system
- Activity tracking
- Offline functionality
- Share reports via any app

**What's Included**
- Comprehensive form fields
- Multiple image support
- Professional PDF output
- Local storage for privacy
- Intuitive user interface

## Future Updates Checklist

For version 1.1.0 and beyond:

- [ ] Plan new features based on user feedback
- [ ] Increment version code and name
- [ ] Update release notes
- [ ] Test all existing features still work
- [ ] Test new features thoroughly
- [ ] Build new AAB
- [ ] Submit to Play Console
- [ ] Monitor for issues

## Support Contacts

**Technical Issues**
- Check Android Studio Logcat
- Review build logs
- Contact: [Your technical team]

**Play Store Issues**
- Play Console Help Center
- Developer Support
- Contact: [Your Play Store manager]

## Important Reminders

⚠️ **NEVER** lose your signing keystore file - you cannot update your app without it!

⚠️ **ALWAYS** test on real devices before submitting

⚠️ **BACKUP** your keystore file in multiple secure locations

⚠️ **INCREMENT** version code for every submission

⚠️ **TEST** all features after each update

⚠️ **MONITOR** user reviews and respond promptly

⚠️ **COMPLY** with Google Play policies at all times

## Useful Links

- [Google Play Console](https://play.google.com/console)
- [Android Developer Guide](https://developer.android.com/guide)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Play Store Policies](https://play.google.com/about/developer-content-policy/)

## Success Criteria

Your app is ready when:
- ✅ All checklist items completed
- ✅ Tested on multiple devices
- ✅ No crashes or major bugs
- ✅ All assets uploaded
- ✅ Privacy policy in place
- ✅ AAB built and signed
- ✅ Ready for review

Good luck with your Play Store launch! 🚀
