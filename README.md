# StromDAO-BusinessObject - Messstellenbetrieb

Verwaltung und schreiben von Daten einer Messstelle (=Stromzähler) in der StromDAO Energy Blockchain. 

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

