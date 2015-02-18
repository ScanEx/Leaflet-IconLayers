# Leaflet-IconLayers
Leaflet base layers control with icons

### Example
```javascript
var iconLayersControl = new L.Control.IconLayers(
    [
        {
            name: 'Map', //name is unique
            layer: mapLayer, //any ILayer
            icon: 'img/mapIcon.png' //no resize (?)
        },
        {
            name: 'Satellite',
            layer: satLayer,
            iconClass: 'sat-layer-icon' //if we want use sprite
        }
    ], {
        position: 'topright', //expanding direction depends on this?
        collapsed: true,
        autoZIndex: true, //from L.Control.Layers
        maxLayersInRow: 5
    }
);

iconLayersControl.addTo(map);

iconLayersControl.addLayer({
    name: 'Hybrid',
    layer: mapHybrid,
    icon: 'img/mapHybrid.png'
});

iconLayersControl.removeLayer('Map');

iconLayersControl.on({
    baselayerchange: function(){},
    layeradd: function(){},
    layerremove: function(){}
})
```