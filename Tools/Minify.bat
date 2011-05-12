@echo off

set folder=..\Website\javascript\

java -jar yuicompressor-2.4.2\build\yuicompressor-2.4.2.jar %folder%jquery.onopager.js -o %folder%jquery.onopager.min.js

echo .
echo Selected Javascript files are minified and combined into '%folder%jquery.onopager.js'.
pause