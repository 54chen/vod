#!/bin/sh
for dir in `cat meta.txt|awk -F ',' '{print $1}'`
do
    if [ ! -d $dir ];then
        continue;
    fi
    i=`ls -l $dir|grep -c png`
    j=`ls -l $dir|grep -c swf`

    if [ -f $dir'/record.mp4' ];then
        echo $i' '$j' '$dir;
        rm -f $dir'/record.mp4';
    fi

done;
