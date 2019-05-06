; !include "LogicLib.nsh"
!include "Library.nsh"
LicenseText "kenrobot" "同意"
MiscButtonText "返回" "下一步" "取消" "关闭"
UninstallButtonText "卸载"
SubCaption 1 用户协议条款

; Section "-LogSetOn"
;   LogSet on
; SectionEnd

Section "安装驱动"
  ; Set output path to the driver directory.
  ${If} ${RunningX64}
    IfSilent +2
      ExecWait '"$INSTDIR\resources\data\driver\CP210xVCPInstaller_x64.exe" /lm'
  ${Else}
    IfSilent +2
      ExecWait '"$INSTDIR\resources\data\driver\CP210xVCPInstaller_x86.exe" /lm'
  ${EndIf}
SectionEnd