#!/bin/sh

rm -Rf .node-persist/*

echo "--- Initializing"
stromdao store objekt 1
stromdao store mieter1 1
stromdao store mieter2 1

echo "--- Tokenizing to Starting point"
stromdao cutokenize objekt
stromdao store objekt 100
stromdao cutokenize --add mieter1 objekt
stromdao cutokenize --add mieter2 objekt


# Zeit vergeht... neue Zählerstände
echo "--- Adding more readings"
stromdao store objekt 100
stromdao store mieter1 3
stromdao store mieter2 2
stromdao cutokenize objekt

