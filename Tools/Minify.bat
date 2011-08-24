@echo off

set folder=..\Website\javascript\
copy/b %folder%\jquery.onopager.core.js %folder%\jquery.onopager.js
copy/b %folder%\jquery.onopager.js + %folder%\jquery.onopagerswipe.js %folder%\jquery.onopager.js
copy/b %folder%\jquery.onopager.js + %folder%\jquery.onopager.scroller.js %folder%\jquery.onopager.js
copy/b %folder%\jquery.onopager.js + %folder%\jquery.onopager.pager.js %folder%\jquery.onopager.js
copy/b %folder%\jquery.onopager.js + %folder%\jquery.onopager.autopageAnimation.js %folder%\jquery.onopager.js
copy/b %folder%\jquery.onopager.js + %folder%\jquery.onopager.animation.js %folder%\jquery.onopager.js
copy/b %folder%\jquery.onopager.js + %folder%\jquery.onopager.tools.js %folder%\jquery.onopager.js

java -jar yuicompressor-2.4.2\build\yuicompressor-2.4.2.jar %folder%jquery.onopager.js -o %folder%jquery.onopager.min.js

echo .
echo Selected Javascript files are minified and combined into '%folder%jquery.onopager.js'.
pause
