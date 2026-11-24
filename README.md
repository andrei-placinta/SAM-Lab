# Android Application Reverse Engineering — OWASP UnCrackable Level 1

An Android application security lab focused on **static analysis, dynamic analysis, reverse engineering and runtime instrumentation**, using the OWASP UnCrackable Level 1 application.

The project explores Android application protection mechanisms, including root detection, debugging detection and encrypted secret validation, using JADX, APKTool and Frida.

## Features

- Static analysis of Android APK files using JADX.
- APK decompilation and resource inspection using APKTool.
- Decompiled Java source code and Smali analysis.
- Investigation of Android root detection mechanisms.
- Analysis of application debugging detection.
- Smali code modification to bypass root detection.
- APK rebuilding, alignment and signing.
- Dynamic analysis using Frida.
- Runtime method hooking to bypass root and debugging checks.
- Inspection of AES-based secret validation logic.
- Runtime extraction of decrypted application data.
- Android application testing using ADB and Android Emulator.
- Runtime log inspection using Android Logcat.

## Tech Stack

- **Platform:** Android
- **Target Application:** OWASP UnCrackable Level 1
- **Static Analysis:** JADX 1.4.7
- **APK Reverse Engineering:** APKTool 2.9.3
- **Dynamic Analysis:** Frida 16.2.1
- **Runtime Instrumentation:** Frida Java API
- **Decompiled Code Analysis:** Java, Smali
- **Scripting:** JavaScript, Python
- **Android Development Tools:** Android SDK, ADB
- **Testing Environment:** Android Emulator
- **APK Processing:** zipalign, apksigner, keytool
- **Runtime Monitoring:** Android Logcat

## Step-by-Step Implementation

### 1. Environment Setup

The development environment was configured on Windows using Android Studio, Android SDK and the required reverse engineering tools.

#### Required Tools

- Android Studio 2023.1.1.28
- Android SDK and Android Emulator
- JADX GUI 1.4.7
- APKTool 2.9.3
- Python 3.12.2
- Frida Server 16.2.1 (Android x86)
- Java Development Kit (Android Studio bundled JBR)

#### Environment Variables

Configure the following environment variables:

- `ANDROID_HOME`: Path to the Android SDK installation directory.
- `JAVA_HOME`: Path to the Java runtime bundled with Android Studio.

Add the following directories to the system `Path`:

- `%ANDROID_HOME%\platform-tools` — ADB
- `%ANDROID_HOME%\build-tools\34.0.0` — zipalign and apksigner
- `%ANDROID_HOME%\emulator` — Android Emulator
- `%JAVA_HOME%\bin` — Java and keytool

Ensure JADX and APKTool are also accessible from the command line or their installation directories.

### 2. Android Emulator Configuration

The Android Emulator was configured to support writable system operations.

List the available virtual devices:

```cmd
emulator -list-avds
```

Start the emulator with writable system support:

```cmd
emulator -avd Pixel_5_API_30 -writable-system
```

The AVD name can be replaced with the name of the emulator configured locally.

### 3. Initial APK Installation

Install the original OWASP UnCrackable Level 1 application using ADB:

```cmd
adb install CrackMe\UnCrackable-Level1.apk
```

The application package identifier is:

`owasp.mstg.uncrackable1`

Launch the application in the emulator and inspect its initial behavior and protection mechanisms.

### 4. Static Analysis with JADX

Open the original APK using JADX GUI:

```cmd
jadx-gui --show-bad-code CrackMe\UnCrackable-Level1.apk
```

The analysis focused on:

- Application entry points and activity behavior.
- `MainActivity` and its application initialization logic.
- Root detection methods in `sg.vantagepoint.a.c`.
- Debugging detection in `sg.vantagepoint.a.b`.
- Secret verification logic in `sg.vantagepoint.uncrackable1.a`.
- AES-based decryption and encrypted data handling.

The decompiled Java source was used to understand the application's protection mechanisms before modifying its Smali representation.

### 5. APK Decompilation with APKTool

Decompile the original APK:

```cmd
apktool d CrackMe\UnCrackable-Level1.apk -o CrackMe\UnCrackable-Level1-work
```

APKTool extracts the application manifest, resources and Smali code into a working directory.

The following files were inspected:

- `MainActivity.smali`
- `a.smali`
- Root detection classes under `sg/vantagepoint/a/`

### 6. Smali Code Analysis and Modification

#### Root Detection Removal

Open:

`sg/vantagepoint/uncrackable1/MainActivity.smali`

Inspect the `onCreate()` method and locate the root detection checks:

- `sg.vantagepoint.a.c.a()`
- `sg.vantagepoint.a.c.b()`
- `sg.vantagepoint.a.c.c()`

Remove the root detection block and its corresponding conditional handling and alert dialog logic.

Preserve the normal Android activity initialization, including the call to `Activity.onCreate()` and the layout initialization.

#### Secret Extraction Logging

Open:

`sg/vantagepoint/uncrackable1/a.smali`

Locate the method:

`a(Ljava/lang/String;)Z`

Modify the local register declaration from:

```smali
.locals 5
```

to:

```smali
.locals 8
```

After the decrypted string is constructed and before the method returns the comparison result, add:

```smali
const-string v7, "log-tag"

invoke-static {v7, v1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I
```

This modification logs the decrypted string using Android Logcat, allowing the secret validation result to be inspected during execution.

### 7. APK Rebuilding, Alignment and Signing

Rebuild the modified application:

```cmd
apktool b CrackMe\UnCrackable-Level1-work
```

The generated APK is available in:

`CrackMe\UnCrackable-Level1-work\dist\UnCrackable-Level1.apk`

Align the rebuilt APK:

```cmd
zipalign -v 4 CrackMe\UnCrackable-Level1-work\dist\UnCrackable-Level1.apk CrackMe\UnCrackable-Repackaged.apk
```

Generate a signing keystore if one is not already available:

```cmd
keytool -genkey -v -keystore CrackMe\my.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias app
```

Sign the aligned APK:

```cmd
apksigner sign --ks-key-alias app --ks CrackMe\my.keystore CrackMe\UnCrackable-Repackaged.apk
```

Verify the APK signature:

```cmd
apksigner verify CrackMe\UnCrackable-Repackaged.apk
```

### 8. Modified APK Installation and Logcat Verification

Uninstall the original application:

```cmd
adb uninstall owasp.mstg.uncrackable1
```

Install the modified APK:

```cmd
adb install CrackMe\UnCrackable-Repackaged.apk
```

Start Logcat filtering:

```cmd
adb logcat -s log-tag
```

Launch the modified application, enter a value in the input field and trigger the verification method.

The decrypted secret is printed in Logcat:

```text
I want to believe
```

This confirms that the modified application successfully logs the decrypted value during secret validation.

### 9. Frida Setup and Server Configuration

Python 3.12.2 was used for the Frida tooling environment.

Install Frida tools:

```cmd
pip install frida-tools
```

Download the Frida Server binary matching the Android Emulator architecture.

The original setup used:

`frida-server-16.2.1-android-x86`

Start ADB with root access:

```cmd
adb root
```

Push Frida Server to the emulator:

```cmd
adb push frida-server-16.2.1-android-x86 /data/media
```

Open an Android shell:

```cmd
adb shell
```

Navigate to the directory and grant execution permissions:

```sh
cd /data/media
chmod +x frida-server-16.2.1-android-x86
```

Start Frida Server:

```sh
./frida-server-16.2.1-android-x86 &
```

Keep the server running while performing the dynamic analysis.

The Frida client and server versions must be compatible.

### 10. Runtime Instrumentation with Frida

The provided script is located at:

`local/tools/root-bypass.js`

The script uses the Frida Java API to hook application methods at runtime.

It implements the following operations:

- Hooks the three root detection methods in `sg.vantagepoint.a.c`.
- Overrides their return values to bypass root detection.
- Hooks the debugging detection method in `sg.vantagepoint.a.b`.
- Overrides the debugging detection result.
- Hooks the AES decryption method in `sg.vantagepoint.a.a`.
- Converts the returned decrypted byte array into a readable string.
- Prints the decrypted value in the Frida console.

For this test, reinstall the original application so the runtime hooks can demonstrate bypassing its original protection checks:

```cmd
adb uninstall owasp.mstg.uncrackable1
adb install CrackMe\UnCrackable-Level1.apk
```

Execute the Frida script:

```cmd
frida -U -f owasp.mstg.uncrackable1 -l local\tools\root-bypass.js
```

Frida attaches to the application process and applies the configured runtime hooks.

The decrypted secret is displayed in the Frida console:

```text
I want to believe
```

## Project Structure

```text
SAM-Lab/
│
├── CrackMe/
│   ├── UnCrackable-Level1.apk
│   ├── UnCrackable-Repackaged.apk
│   ├── my.keystore
│   │
│   └── UnCrackable-Level1/
│       ├── AndroidManifest.xml
│       ├── apktool.yml
│       ├── res/
│       ├── smali/
│       ├── original/
│       ├── build/
│       └── dist/
│
├── local/
│   └── tools/
│       └── root-bypass.js
│
├── sources/
│   └── Decompiled Java source files
│
└── README.md
```

## Purpose

This academic security lab demonstrates practical knowledge of:

- Android application reverse engineering.
- Static and dynamic application analysis.
- Java and Smali code inspection.
- Android root and debugging detection mechanisms.
- Runtime instrumentation using Frida.
- APK modification, rebuilding and signing.
- AES-based application logic inspection.
- Android debugging and runtime analysis using ADB and Logcat.

**Disclaimer:** This project is intended exclusively for educational purposes and authorized security testing of the OWASP UnCrackable Level 1 lab application.
