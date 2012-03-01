@echo off

set folder=..\Website\javascript\
copy/b %folder%\jquery.onopager.core.js %folder%\jquery.onopager.js
copy/b %folder%\jquery.onopager.js + %folder%\jquery.onopagerswipe.js %folder%\jquery.onopager.js
copy/b %folder%\jquery.onopager.js + %folder%\jquery.onopager.scroller.js %folder%\jquery.onopager.js
copy/b %folder%\jquery.onopager.js + %folder%\jquery.onopager.pager.js %folder%\jquery.onopager.js
copy/b %folder%\jquery.onopager.js + %folder%\jquery.onopager.autopageAnimation.js %folder%\jquery.onopager.js
copy/b %folder%\jquery.onopager.js + %folder%\jquery.onopager.animation.js %folder%\jquery.onopager.js
copy/b %folder%\jquery.onopager.js + %folder%\jquery.onopager.tools.js %folder%\jquery.onopager.js

:: If this line below fails, try to replace "java" with something like "C:\Program Files (x86)\Java\jre6\bin\java.exe"
"C:\Program Files (x86)\Java\jre6\bin\java.exe" -jar yuicompressor-2.4.2\build\yuicompressor-2.4.2.jar %folder%jquery.onopager.js -o %folder%jquery.onopager.min.js
"C:\Program Files (x86)\Java\jre6\bin\java.exe" -jar yuicompressor-2.4.2\build\yuicompressor-2.4.2.jar %folder%jquery.onopager.animation-canvas.js -o %folder%jquery.onopager.animation-canvas.min.js

echo The Javascript files are now minified and combined into '%folder%jquery.onopager.min.js' and '%folder%jquery.onopager.animation-canvas.min.js'.
pause
