#!/bin/sh

if [ -d data ]
then
    find data -type f -exec binadd {} \;
fi
