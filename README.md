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
