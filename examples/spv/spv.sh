#!/bin/sh

rm -Rf .node-persist/*
stromdao set --add investor1 spv 
stromdao set --add investor2 spv 
stromdao set --add investor3 spv 

stromdao store spv 0
stromdao tokenize spv
stromdao balancing spv
stromdao store spv 1000
stromdao tokenize spv


stromdao tokenize --transfer investor1 --amount 490 spv
stromdao tokenize --transfer investor2 --amount 490 spv
stromdao tokenize --transfer investor3 --amount 20 spv

stromdao store -f settlement_spv.js spv 0
stromdao store -f settlement_spv.js spv 1000
stromdao store -f settlement_spv.js spv 2000

