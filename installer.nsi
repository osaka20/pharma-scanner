; Script NSIS pour PharmaScanner
; Installer NSIS: sudo apt install nsis

!define APPNAME "PharmaScanner"
!define COMPANYNAME "PharmaScanner"
!define DESCRIPTION "Application de gestion pharmaceutique"
!define VERSIONMAJOR 1
!define VERSIONMINOR 0
!define VERSIONBUILD 0

!define INSTALLSIZE 10000

RequestExecutionLevel user
InstallDir "$LOCALAPPDATA\${APPNAME}"

Name "${APPNAME}"
OutFile "PharmaScanner-Setup.exe"

Page directory
Page instfiles

Section "install"
    SetOutPath "$INSTDIR"
    
    File "PharmaScanner.exe"
    File "pharma-data.json"
    File "app-standalone.html"
    File "README.md"
    File "INSTALLATION.md"
    
    CreateDirectory "$SMPROGRAMS\${APPNAME}"
    CreateShortcut "$SMPROGRAMS\${APPNAME}\${APPNAME}.lnk" "$INSTDIR\PharmaScanner.exe"
    CreateShortcut "$DESKTOP\${APPNAME}.lnk" "$INSTDIR\PharmaScanner.exe"
    
    WriteUninstaller "$INSTDIR\uninstall.exe"
    
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "DisplayName" "${APPNAME}"
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "UninstallString" "$\"$INSTDIR\uninstall.exe$\""
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "InstallLocation" "$INSTDIR"
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "Publisher" "${COMPANYNAME}"
    WriteRegDWORD HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "EstimatedSize" ${INSTALLSIZE}
SectionEnd

Section "uninstall"
    Delete "$INSTDIR\PharmaScanner.exe"
    Delete "$INSTDIR\pharma-data.json"
    Delete "$INSTDIR\app-standalone.html"
    Delete "$INSTDIR\README.md"
    Delete "$INSTDIR\INSTALLATION.md"
    Delete "$INSTDIR\uninstall.exe"
    
    RMDir "$INSTDIR"
    
    Delete "$SMPROGRAMS\${APPNAME}\${APPNAME}.lnk"
    RMDir "$SMPROGRAMS\${APPNAME}"
    Delete "$DESKTOP\${APPNAME}.lnk"
    
    DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}"
SectionEnd
