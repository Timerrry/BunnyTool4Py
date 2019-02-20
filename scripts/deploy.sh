#!/bin/sh

NAME=$1
VERSION=$2
BRANCH=$3

DIST=/var/ftp

for filename in `ls $NAME-$VERSION-$BRANCH*`
do
  ext="${filename##*.}"
  case $ext in
    "exe")
      if [[ $filename =~ "x64" ]]
      then
        mkdir -p $DIST/$BRANCH/windows/x64
        mv -f $filename $DIST/$BRANCH/windows/x64
        cd $DIST
        ln -sf $BRANCH/windows/x64/$filename $NAME-latest-$BRANCH-windows-x64.$ext
        cd - > /dev/null
      else
        mkdir -p $DIST/$BRANCH/windows/
        mv -f $filename $DIST/$BRANCH/windows/
        cd $DIST
        ln -sf $BRANCH/windows/$filename $NAME-latest-$BRANCH-windows.$ext
        cd - > /dev/null
      fi
      ;;
    "dmg")
      mkdir -p $DIST/$BRANCH/mac/
      mv -f $filename $DIST/$BRANCH/mac/
      cd $DIST
      ln -sf $BRANCH/mac/$filename $NAME-latest-$BRANCH-mac.$ext
      cd - > /dev/null
      ;;
    "deb")
      mkdir -p $DIST/$BRANCH/ubuntu/
      mv -f $filename $DIST/$BRANCH/ubuntu/
      cd $DIST
      ln -sf $BRANCH/ubuntu/$filename $NAME-latest-$BRANCH-ubuntu.$ext
      cd - > /dev/null
      ;;
    "zip")
      mkdir -p $DIST/$BRANCH/raspberry-pi/
      mv -f $filename $DIST/$BRANCH/raspberry-pi/
      cd $DIST
      ln -sf $BRANCH/raspberry-pi/$filename $NAME-latest-$BRANCH-raspberrypi.$ext
      cd - > /dev/null
      ;;
    *)
      ;;
  esac
done
