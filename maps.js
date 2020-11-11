let map = L.map("map").setView([0.5227016422194704, 101.45118713378908], 12);

// ----Function----------------------------------------------------------------------------------------
select.addEventListener('change',(e)=>{
    e.preventDefault();
    if(e.target.value!==""){
        fetch(`data/${e.target.value}`).then(res=>res.json()).then(result=>{
            // console.log(result.features);
            makeMapFeatures(result.features);
        });
    }
    else{
        makeMap();
    }
});

const randomColor = () =>{
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

const makeMapFeatures = (data) => {
    makeMap();

    if(data!==""){
        data.map(el => {
            const prop = el.properties;
            let text = "";
            Object.keys(prop).forEach((key)=> { 
                text += `${key}: ${prop[key]}<br/>`; // key and value
            });

            if(el.geometry.type==="MultiPolygon"){
                const geo = el.geometry.coordinates[0][0]
                var poly = [];
                geo.map((element,i) => {
                    [element[0], element[1]] = [element[1], element[0]];
                    poly.push(element);
                });
                const polygon = L.polygon(poly, { color: randomColor() })
                    .bindPopup(text)
                    .addTo(map);
                polygon.on("mouseover",function(e){
                    this.openPopup();
                });
                polygon.on("mouseout",function(e){
                    this.closePopup();
                });
            }
            else if(el.geometry.type === "Point"){
                let coord = el.geometry.coordinates;
                [coord[0], coord[1]] = [coord[1], coord[0]];
                const marker = L.marker(coord)
                    .bindPopup(text)
                    .addTo(map);
                marker.on("mouseover",function(e){
                    this.openPopup();
                });
                marker.on("mouseout",function(e){
                    this.closePopup();
                });
            }
            else if(el.geometry.type === "MultiLineString"){
                const geo = el.geometry.coordinates[0]
                var line = [];
                geo.map((element,i) => {
                    [element[0], element[1]] = [element[1], element[0]];
                    line.push(element);
                });
                const polyline = L.polyline(line, { color: randomColor() })
                    .bindPopup(text)
                    .addTo(map);
                polyline.on("mouseover",function(e){
                    this.openPopup();
                });
                polyline.on("mouseout",function(e){
                    this.closePopup();
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
makeMap("");