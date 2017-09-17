# StromDAO-BusinessObject - Messstellenbetrieb

[![bitHound Overall Score](https://www.bithound.io/github/energychain/BusinessObject-MeterPointOperation/badges/score.svg)](https://www.bithound.io/github/energychain/BusinessObject-MeterPointOperation)
[![bitHound Dependencies](https://www.bithound.io/github/energychain/BusinessObject-MeterPointOperation/badges/dependencies.svg)](https://www.bithound.io/github/energychain/BusinessObject-MeterPointOperation/master/dependencies/npm)
[![bitHound Code](https://www.bithound.io/github/energychain/BusinessObject-MeterPointOperation/badges/code.svg)](https://www.bithound.io/github/energychain/BusinessObject-MeterPointOperation)


Verwaltung und Schreiben von Daten einer Messstelle (=Stromzähler) in der StromDAO Energy Blockchain. 

## Installation
```
npm install -g stromdao-bo-mpo
```

## Verwendung
```
stromdao-mp store meter_point_id value
 stromdao-mp retrieve meter_point_id
```

meter_point_id = Zählernummer

Jeder Messtelle wird auf Basis der angegebenen Meter_Point_Id eine eindeutige Adresse in der StromDAO Energy Blockchain zugewiesen. Diese Zuordnung erfoglt durch automatische Generierung eines Schlüsselpaares, welches lokal gespeichert wird. 

## Beispiele
```
# Setzen des Zählerstandes 100 für die Zählerkennung 1337
stromdao-mp store 1337 100

# Abruf des Zählerstandes für die Zählerkennung 1337
stromdao-mp retrieve 1337

# Setzen des Zählerstandes 100 für die Zählerkennung 1337 mit Verwendung eines Settlements via IPFS 
stromdao-mp store -a QmRroaKpLVJyLBWAAAjHzBEAEfQthj8ZrcRSpYyQe7uRyM 1337 100

# Setzen des Zählerstandes 100 für die Zählerkennung 1337 mit Verwendung eines Settlements via File basiertem Settlement und Tarifinfo für PLZ 69256
stromdao-mp store -f settlement_sample.js --de 69256 1337 100

# Starten eines einfachen Webservices zur SmartHome Integration (Port 8000)
stromdao-mp httpservice

```

## Webservice
Der Webservice ist für die einfache Integration mit einer Heimautomatisierung oder im Sandbox Betrieb eines Smart-Meter-Gateway gedacht. Der Service ist auf Localhost gebunden und sollte **nicht** im Netzwerk freigeben werden. 

Nutzung:
```
http://localhost:8000/store/?meter_point_id=1337&reading=1001&auto=69256
```

Die Request Parameter entsprechen dem Store Befehl.

## Anwendungsbeispiele
http://docs.stromdao.de/presentations/20170922/


## Feedback/Collaboration
- https://fury.network/
- https://stromdao.de/
- hhttps://gitter.im/stromdao/BusinessObject
