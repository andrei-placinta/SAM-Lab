# Proiect laborator SAM

## OWASP Android App Reverse Engineering


* <i>Performed reverse engineering on the OWASP Uncrackable Level 1 Android app using static and dynamic analysis.</i></br>
* <i>Used tools like Frida, Jadx, and APKTool to bypass anti-root protections and extract encrypted data.</i>


### User variables:
ANDROID_HOME C:\Users\andrei\AppData\Local\Android\Sdk</br>
We recommend setting the environment variable for ANDROID_HOME when using the command line.
### Also, set your command search path to include 
ANDROID_HOME/tools, ANDROID_HOME/tools/bin, and ANDROID_HOME/platform-tools to find the most common tools.
### Android SDK Build Tools	&emsp; &mdash; AAPT2, apksigner, zipalign
Located in: android_sdk/build-tools/version/

### Android SDK Platform Tools	&emsp; &mdash; adb
Located in: android_sdk/platform-tools/


### Android SDK Command-Line Tools
Located in: android_sdk/cmdline-tools/version/bin/  						&emsp; &mdash; avdmanager</br>
Or Located in: android_sdk/tools/bin/

### Android Emulator										&emsp; &mdash; emulator
Located in: android_sdk/emulator/

### Download:
android-studio-2023.1.1.28-windows (Android Studio Default Installation with Emulator)		&emsp; &mdash; pentru instalare emulator</br>
jadx-gui-1.4.7-with-jre-win.zip	(Jadx)								&emsp; &mdash; pentru tool jadx (decompilator)</br>
apktool_2.9.3.jar, apktool.bat (Apktool)							&emsp; &mdash; pentru tool apktool (decompilator)		

### Environment Variables:
Path		&emsp; C:\Users\andrei\AppData\Local\Android\Sdk\platform-tools			&emsp; &mdash; pentru adb</br>
	&thinsp;&emsp;&emsp;&emsp;	C:\Users\andrei\AppData\Local\Android\Sdk\tools</br>
	&thinsp;&emsp;&emsp;&emsp;	C:\Users\andrei\AppData\Local\Android\Sdk\build-tools\34.0.0			&emsp; &mdash; pentru zipalign, apksigner (,aapt2)</br>
	&thinsp;&emsp;&emsp;&emsp;	C:\Program Files\Android\Android Studio\jbr\bin					&emsp; &mdash; pentru keytool</br>

### System Variables:
JAVA_HOME	C:\Program Files\Android\Android Studio\jbr					&emsp; &mdash; pentru apktool

### Command Prompt:
cd C:\Users\andrei\AppData\Local\Android\Sdk\emulator						&emsp; &mdash; director emulator</br>
emulator -list-avds										&emsp; &mdash; lista emulatoare</br>
emulator -avd Pixel_5_API_30 -writable-system							&emsp; &mdash; pornire emulator</br>
adb install C:\Crackme\UnCrackable-Level1.apk							&emsp; &mdash; instalare aplicatie defecta</br>
cd C:\Crackme\											&emsp; &mdash; director tool-uri</br>
C:\local\tools\jadx-gui-1.4.7 --show-bad-code "C:\Crackme\UnCrackable-Level1.apk"		&emsp; &mdash; afisare cod sursa java decompilat</br>
C:\local\tools\apktool d UnCrackable-Level1.apk</br>
cd UnCrackable-Level1</br>
C:\local\tools\apktool b</br>
zipalign -v 4 dist/UnCrackable-Level1.apk ../UnCrackable-Repackaged.apk</br>
keytool -genkey -v -keystore C:\Crackme\my.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias app	&emsp; &mdash; generare certificat</br>
<span>>></span>123456</br>
<span>>></span>a</br>
<span>>></span>a</br>
<span>>></span>a</br>
<span>>></span>a</br> 
<span>>></span>a</br>
<span>>></span>a</br>
<span>>></span>yes</br>
apksigner sign --ks-key-alias app --ks C:\Crackme\my.keystore C:\Crackme\UnCrackable-Repackaged.apk</br>
adb uninstall owasp.mstg.uncrackable1</br>
adb install C:\Crackme\UnCrackable-Repackaged.apk</br>
adb logcat -s "log-tag"</br>
<span>>></span>02-12 15:36:11.070  9526  9526 D log-tag : I want to believe</br>


C:\CrackMe\UnCrackable-Level1\smali\sg\vantagepoint\uncrackable1\MainActivity.smali</br>
delete all between</br> 
<pre>
    invoke-static {}, Lsg/vantagepoint/a/c;->a()Z</br>

    move-result v0


        ...
  

   invoke-super {p0, p1}, Landroid/app/Activity;->onCreate(Landroid/os/Bundle;)V
</pre>
C:\CrackMe\UnCrackable-Level1\smali\sg\vantagepoint\uncrackable1\a.smali</br>
add
<pre>
	.locals 8 		in loc de 5
	
 const-string v7, "log-tag"

 invoke-static {v7, v1}, Landroid/util/Log;->d(Ljava/lang/String;Ljava/lang/String;)I
</pre>
inainte de return p0 la metoda a

--
### Download:
python-3.12.2-amd64</br>
frida-server-16.2.1-android-x86

### Command Prompt:
pip install frida-tools

### Environment variables: 
Path	&emsp;	C:\Users\andrei\AppData\Roaming\Python\Python312\Scripts

### Command Prompt:
adb root</br>
adb push C:\local\tools\frida-server-16.2.1-android-x86 /data/media</br>
adb shell</br>
cd /data/media</br>
chmod +x frida-server-16.2.1-android-x86</br>
./frida-server-16.2.1-android-x86 &</br>
frida -U -f owasp.mstg.uncrackable1 -l C:\local\tools\root-bypass.js
