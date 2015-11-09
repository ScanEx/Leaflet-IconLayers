var L = require('leaflet');
var providers = require('./providers');
var iconLayers = require('../src/iconLayers');

window.addEventListener('load', function() {
    var map = L.map(document.body).setView([38.14, 19.33], 7);

    var layers = [];
    for (var providerId in providers) {
        layers.push(providers[providerId]);
    }

    layers.push({
        layer: {
            onAdd: function() {},
            onRemove: function() {}
        },
        title: 'empty'
    })

    var ctrl = iconLayers(layers).addTo(map);
});