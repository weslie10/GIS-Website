let map = L.map("map").setView([0.5227016422194704, 101.45118713378908], 12);

// ----Function----------------------------------------------------------------------------------------
select.addEventListener('change', (e) => {
    e.preventDefault();
    if (e.target.value !== "") {
        fetch(`data/${e.target.value}`).then(res => res.json()).then(result => {
            makeMap();
            // L.geoJSON(result,{style: function(feature){
            //     return {"color": randomColor()}
            // }}).addTo(map)
            makeMapFeatures(result.features);
        });
    } else {
        makeMap();
    }
});

const randomColor = () => {
    return `rgb(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)})`
}

// ----Leaflet JS--------------------------------------------------------------------------------------

const makeMap = () => {
    map.remove();
    map = L.map("map").setView([0.5227016422194704, 101.45118713378908], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: `&copy; 
            <a href="https://www.openstreetmap.org/copyright">
                OpenStreetMap
            </a>
             contributors, 
            <a href="https://creativecommons.org/licenses/by-sa/2.0/">
                CC-BY-SA
            </a>`,
        tileSize: 512,
        zoomOffset: -1,
    }).addTo(map);
}
makeMap();

const makeMapFeatures = (data) => {
    makeMap();

    if (data !== "") {
        let markers = L.markerClusterGroup({
            chunkedLoading: true
        });
        data.map(el => {
            const prop = el.properties;
            let text = "";
            Object.keys(prop).forEach((key) => {
                text += `${key}: ${prop[key]}<br/>`; // key and value
            });
            console.log(text);

            if (el.geometry.type === "MultiPolygon") {
                const geo = el.geometry.coordinates[0][0]
                var poly = [];
                geo.map((element, i) => {
                    [element[0], element[1]] = [element[1], element[0]];
                    poly.push(element);
                });
                const polygon = L.polygon(poly, {
                        color: randomColor()
                    })
                    .bindPopup(text)
                    .addTo(map);
                polygon.on("mouseover", function (e) {
                    this.openPopup();
                });
                polygon.on("mouseout", function (e) {
                    this.closePopup();
                });
            } else if (el.geometry.type === "Point") {
                let coord = el.geometry.coordinates;
                [coord[0], coord[1]] = [coord[1], coord[0]];
                const marker = L.marker(coord)
                    .bindPopup(text)
                // .addTo(map);

                markers.addLayer(marker);

                marker.on("mouseover", function (e) {
                    this.openPopup();
                });
                marker.on("mouseout", function (e) {
                    this.closePopup();
                });

                map.addLayer(markers);
            } else if (el.geometry.type === "MultiLineString") {
                const geo = el.geometry.coordinates[0]
                var line = [];
                geo.map((element, i) => {
                    [element[0], element[1]] = [element[1], element[0]];
                    line.push(element);
                });
                const polyline = L.polyline(line, {
                        color: randomColor(),
                        width: 5
                    })
                    .bindPopup(text)
                    .addTo(map);
                // polyline.on("mouseover",function(e){
                //     this.openPopup();
                // });
                // polyline.on("mouseout",function(e){
                //     this.closePopup();
                // });
                polyline.on("click", function (e) {
                    this.openPopup();
                });
            }
        });
    }

    // L.marker([0.570012, 101.425655])
    //     .addTo(map)
    //     .bindPopup("This is at 0.570012, 101.425655")
    //     .openPopup();

    // map.addEventListener("click", (e) => {
    //     console.log(e.latlng);
    // });
}

const fetchData = () => {
    fetch('http://gis-drainase.pocari.id/api/titik_banjir')
        .then(res => res.json())
        .then(result => {
            result.forEach(el=>{
                const geo = JSON.parse(el.geometry);
                
                L.geoJSON(geo)
                .bindPopup("heheh")
                .addTo(map)
                // let coord = geo.coordinates;
                // [coord[0], coord[1]] = [coord[1], coord[0]];
                
                // let text = "";
                // Object.keys(el).forEach((key) => {
                //     if(key!="geometry")
                //         text += `${key}: ${el[key]}<br/>`; 
                // });
                // const marker = L.marker(coord)
                //     .addTo(map)
                //     .bindPopup(text)
            })
        })
}
fetchData();