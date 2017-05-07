# StromDAO-BusinessObject - Messstellenbetrieb

Verwaltung und schreiben von Daten einer Messstelle (=Stromzähler) in der StromDAO Energy Blockchain. 

![Build Status](https://app.codeship.com/projects/0b53dce0-1501-0135-4829-1a2cb8d45999/status?branch=master) [![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/stromdao/BusinessObject)

## Verwendung
```
 stbo-mpo store meter_point_id value
 stbo-mpo retrieve meter_point_id
```

meter_point_id = Zählernummer

Jeder Messtelle wird auf Basis der angegebenen Meter_Point_Id eine eindeutige Adresse in der StromDAO Energy Blockchain zugewiesen. Diese Zuordnung erfoglt durch automatische Generierung eines Schlüsselpaares, welches lokal gespeichert wird. 



## Anbieter

### VARTA ENGION 

Mit dem StromDAO-BusinessObject ist es möglich, die Batteriespeicher vom Typ Varta-ENGION an die Blockchain anzuhängen und so zur Bilanzierung im Energiemarkt, der Bereitstellung von Regelenergie und Ausgleichenergie, sowie dem lokalen Lastausgleich, zu nutzen.
Im BO-Messstellenbetrieb werden hierfür die Speicherdaten an die StromDAO Energy Blockchain übermittelt und gespeichert.

```
  node vendors/varta.js ENGION_IP:10000
```

Die Abstraktion für den Netzbetrieb, den P2P Stromhandel (Austausch von Speicherkapazitäten) und alle anderen Marktkommunikationen werden über den Konsensmechanismus bereitgestellt.

## Light-Server

Mit Hilfe des Light-Server kann ein lokaler HTTP-Server verwendet werden, um direkt aus dem Browser die Messwerte zu übermitteln, oder diese zu senden. 

```
npm start
```

Nach dem Start ist der Server unter http://localhost:8000/ erreichbar.

### HTTP Anfragen

`http://localhost:8000/blockchain?address=0x6f8c627d20850a4C225292A9b1c1FBedBc05A62b`
`http://localhost:8000/store?mpid=100&reading=1234`
`http://localhost:8000/retrieve?mpid=100`
