@echo off

java -jar jsdoc-toolkit\jsrun.jar jsdoc-toolkit\app\run.js -d=..\Documentation\onoPager\ -D="title:Ono List Pager Reference" -t=jsdoc-toolkit\templates\codeview -p -v "..\Website\javaScript\jquery.onopager.core.js" "..\Website\javaScript\jquery.onopagerswipe.js" "..\Website\javaScript\jquery.onopager.scroller.js" "..\Website\javaScript\jquery.onopager.pager.js" "..\Website\javaScript\jquery.onopager.autopageAnimation.js" "..\Website\javaScript\jquery.onopager.animation.js" "..\Website\javaScript\jquery.onopager.tools.js"

echo .
echo Batch is done.
pause
