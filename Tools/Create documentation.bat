@echo off

java -jar jsdoc-toolkit\jsrun.jar jsdoc-toolkit\app\run.js -d=..\Documentation\onoPager\ -D="title:OnoPager reference" -t=jsdoc-toolkit\templates\codeview -p -v ..\Website\javascript\jquery.onopager.js

echo .
echo Batch is done.
pause
