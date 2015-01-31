#! /bin/sh
echo 'setup'

lib='./ui/js/lib'

if [ ! -d $lib ]; then
	echo 'setup lib dir'
	mkdir $lib
	chmod go+rx $lib
fi

if [ ! -f $lib/angular.zip ] && [ ! -f $lib/angular-1.3.10/angular.js ]; then
	echo 'get angular zip'
	curl -Lk https://code.angularjs.org/1.3.10/angular-1.3.10.zip -o $lib/angular.zip
fi

if [ -f $lib/angular.zip ] && [ ! -f $lib/angular-1.3.10/angular.js ]; then
	echo 'install angular and cleanup zip'
	#unzip angular.zip js/lib/angular-1.3.10/*.* -x * -d ./ -u -o
	unzip $lib/angular.zip -d $lib/
	ln -s $lib/angular-1.3.10 ./ui/js/ng
#	rm -f $lib/angular.zip 
fi

echo 'update har loader'
curl https://raw.githubusercontent.com/thtr/harharhar/master/harharhar.js -o $lib/harharhar.js

echo 'fix permissions'
chmod -R go+r ui

echo 'all done'

