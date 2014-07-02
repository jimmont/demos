#! /bin/sh
if [ -n "$1" ]; then
  echo "version:$1"
#  mkdir tmp
#  curl https://raw.github.com/angular/code.angularjs.org/master/$1/angular-$1.zip -o tmp/angular.zip
#  rm -fr app/js/ng
  unzip tmp/angular.zip -d app/js
  mv app/js/angular-$1 app/js/ng
  rm -fr app/js/ng/docs
  mv app/js/ng/angular-mocks.js test/lib/angular
  mv app/js/ng/angular-scenario.js test/lib/angular
  cp app/js/ng/version.txt test/lib/angular

#  curl https://raw.github.com/monospaced/angular-hammer/master/angular-hammer.js -o app/js/angular-hammer.js
#  curl https://raw.github.com/EightMedia/hammer.js/master/hammer.js -o app/js/hammer.js

# angular auth related
  curl https://raw.github.com/witoldsz/angular-http-auth/master/src/http-auth-interceptor.js -o app/js/http-auth-interceptor.js

# fix permissions
  find app/ -type f -print0 | xargs -0 chmod 664

else
  echo "Usage: ./update-angular.sh <version>"
# https://code.angularjs.org/1.2.16/angular-1.2.16.zip
  echo "eg: ./update-angular.sh  1.2.5"
  echo "see versions at https://github.com/angular/code.angularjs.org/tree/master/"
fi
