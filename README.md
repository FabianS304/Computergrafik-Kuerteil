# Computergrafik-Kürteil

## Zusammenfassung
Dieses Projekt umfasst die Entwicklung und Visualisierung einer Hangar-Szene, in der eine F-16 Fighting Falcon als zentrales Objekt platziert ist. Ziel war es, eine realistische Umgebung zu schaffen, die sowohl technisch als auch visuell überzeugt.

## Featurelist:
- 1x F16 mit steuerbaren Höhen- und Querruder, zu öffnende Cockpithaube
- Rotierende Warnlampen innerhalb des Hangars
- Hangartüren sind zu öffnen
- Fahrende F16 auf einem sog. "Taxiway" (der Weg von Parkposition zur Startbahn)
- Tag-Nacht Rythmus mit dynamischen Lighting (Helligkeit passt sich an)

### Technische Umsetzung & Detailarbeit
- **Datenbasierte Konstruktion:** Die Dimensionierung des Hangars sowie Parameter wie die Rollgeschwindigkeit (Taxi-Velocity) und der Anstellwinkel der Höhenruder, des Seitenruders und der Cockpithaube des Jets wurden präzise aus fachspezifischen Dokumentationen (siehe Quellen) abgeleitet, um ein authentisches Flugfeld-Szenario zu gewährleisten.
- **Manuelle Modell-Optimierung:** Die beweglichen Teile der F-16 (wie Ruder und Klappen) wurden manuell in Blender segmentiert. Dabei wurde jeder Mesh-Knoten einzeln angepasst, neu gruppiert und anschließend wieder in das Modell integriert, um eine korrekte Kinematik zu ermöglichen.
- **Asset-Pipeline:** Alle extern bezogenen Modelle mussten zunächst in Blender importiert und für die Engine optimiert erneut als `.glb`-Dateien exportiert werden. Dies war notwendig, um die Kompatibilität und Performance der Assets, insbesondere der PBR-Materialien von Poly Haven, sicherzustellen.
- **Interaktivität:** Der Jet bietet verschiedene Interaktionsmöglichkeiten, die es erlauben, die aerodynamischen Konfigurationen im Hangar zu simulieren.
- **Entwicklung:** Der gesamte Programmcode wurde eigenständig und in Einzelarbeit erstellt. KI wurde lediglich unterstützend zur Klärung technischer Fragen und zur Optimierung von Workflows eingesetzt.

### Bekannte Fehler:
- Die Warnleuchten scheinen durch das Dach des Hangars
- Drehpunkt des Querruders der F16 ist nicht korrekt

## Quellen & Lizenzen

### 3D-Modelle & Materialien
- **F-16 Fighting Falcon:** Erstellt von bohmerang, zugegriffen am 12.06.2026 [Sketchfab-Link](https://sketchfab.com/3d-models/f-16-fighting-falcon-fighter-jet-free-f0b00989e5634764848ef2c235c64db5) | Lizenz: [Lizenz-Hinweis](https://creativecommons.org/licenses/by-nc-sa/4.0/)
- **Airport Tower:** Erstellt von abass20, zugegriffen am 14.07.2026, [Sketchfab-Link](https://sketchfab.com/3d-models/air-traffic-control-tower-84f215391662453680e646649d42b264) | Lizenz: [Lizenz-Hinweis](https://creativecommons.org/licenses/by/4.0/)
- **PBR-Materialien & Texturen:** [Poly Haven](https://polyhaven.com/)
    - [Concrete_Tiles_02_1k](https://polyhaven.com/a/concrete_tiles_02) Zugriff: 21.06.2026
    - [Concrete_Floor_Worn_001_1k](https://polyhaven.com/a/concrete_floor_worn_001) Zugriff: 11.06.2026
    - [Corrugated_Iron_03_1k](https://polyhaven.com/a/corrugated_iron_03) Zugriff: 11.06.2026
    - [Damaged_Plaster_1k](https://polyhaven.com/a/damaged_plaster) Zugriff: 11.06.2026
    - [Green_Metal_Rust_1k](https://polyhaven.com/a/green_metal_rust) Zugriff: 21.06.2026
    - [Rocky-Terrain_02_1k](https://polyhaven.com/a/rocky_terrain_02) Zugriff: 11.06.2026
- **Blender Models & GLB-Modelle:**
    - [caged_hanging_light_1k](https://polyhaven.com/a/caged_hanging_light) Zugriff: 14.07.2026
    - [CoffeeCart01_1k](https://polyhaven.com/a/CoffeeCart_01) Zugriff: 21.06.2026
    - [dartboard_1k](https://polyhaven.com/a/dartboard) Zugriff: 21.06.2026
    - [fire_alarm_1k](https://polyhaven.com/a/fire_alarm) Zugriff: 21.06.2026
    - [metal_office_desk_1k](https://polyhaven.com/a/metal_office_desk) Zugriff: 21.06.2026
    - [painted_wooden_chair_02_1k](https://polyhaven.com/a/painted_wooden_chair_02) Zugriff: 21.06.2026
    - [power_box_01_1k](https://polyhaven.com/a/power_box_01) Zugriff: 21.06.2026
    - [worn_metal_rack_1k](https://polyhaven.com/a/worn_metal_rack) Zugriff: 21.06.2026
- **Poster:**
    - [Chuck's Guide (F16CM) - Seite 14](https://chucksguides.com/aircraft/dcs/f-16cm/) Zugriff: 21.06.2026


### Dokumentationen & Referenzen
- **Technisch-Aerodynamische Daten:** [MSthesis_AFarre07.pdf](https://bpb-us-e2.wpmucdn.com/sites.uci.edu/dist/2/1678/files/2014/11/MSthesis_AFarre07.pdf)
- **DCS F-16C Early Access Guide (DE):** [Link](https://www.digitalcombatsimulator.com/upload/iblock/9e4/68pb1zcc05xx6s3ajbdpb0rkyjjrfh0f/DCS%20F-16C%20Early%20Access%20Guide%20DE.pdf)
- **Chuck’s Guide (F-16CM):** [Link](https://chucksguides.com/aircraft/dcs/f-16cm/)
    (Seite 14: Verwendet als Hangar-Poster sowie als visuelle Referenz für das Modellieren und Segmentieren in Blender)
