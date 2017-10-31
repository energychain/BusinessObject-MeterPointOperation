#!/bin/sh

rm -Rf .node-persist/*

echo "--- Initializing"
stromdao store objekt 1
stromdao store mieter1 1
stromdao store mieter2 1

echo "--- Tokenizing to Starting point"
stromdao cutokenize objekt
stromdao store -f settlement_generation.js objekt 10
stromdao cutokenize --add mieter1 objekt
stromdao cutokenize --add mieter2 objekt
stromdao cutokenize --issue objekt

# Zeit vergeht... neue Zählerstände
echo "--- Adding more readings"
stromdao store -f settlement_generation.js objekt 20
stromdao store mieter1 30
stromdao store mieter2 20
stromdao cutokenize --issue objekt

# Prüfen der Verteilung
echo "--- Retrieve Issued Tokens"
stromdao cutokenize --balance mieter1 objekt
stromdao cutokenize --balance mieter2 objekt

echo "--- Adding more readings"
stromdao store -f settlement_generation.js objekt 30
stromdao store mieter1 60
stromdao store mieter2 60
stromdao cutokenize --issue objekt

echo "--- Retrieve Issued Tokens"
stromdao cutokenize --balance mieter1 objekt
stromdao cutokenize --balance mieter2 objekt

# Clearing von Zählern...
echo "--- Settlement and Clearing"
stromdao store -f settlement_capacity.js mieter1 100
stromdao store -f settlement_capacity.js mieter2 100
