#
# StromDAO Business Object - Meter Point Operation
# Deployment via Makefile to automate general Quick Forward 
#

PROJECT = "StromDAO Business Object"


all: commit

commit: ;cp node_modules/stromdao-businessobject/dist/loader.js stromkonto/;cp -R node_modules/stromdao-businessobject/smart_contracts/* stromkonto/abi/;git commit -a; git push;npm publish

