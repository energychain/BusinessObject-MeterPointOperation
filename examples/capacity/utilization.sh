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
stromdao cutokenize --issue objekt

# Zeit vergeht... neue Zählerstände
echo "--- Adding more readings"
stromdao store objekt 120
stromdao store mieter1 3
stromdao store mieter2 2
stromdao cutokenize --issue objekt

# Prüfen der Verteilung
echo "--- Retrieve Issued Tokens"
stromdao cutokenize --balance mieter1 objekt
stromdao cutokenize --balance mieter2 objekt

# Erwartetes Ergebnis
# TotalSupply: 60
# Mieter1: 40
# Mieter2: 20

echo "--- Adding more readings"
stromdao store objekt 140
stromdao store mieter1 6
stromdao store mieter2 6
stromdao cutokenize --issue objekt

echo "--- Retrieve Issued Tokens"
stromdao cutokenize --balance mieter1 objekt
stromdao cutokenize --balance mieter2 objekt

# Erwartetes Ergebnis
# TotalSupply: 200
# Mieter1: 100
# Mieter2: 100
