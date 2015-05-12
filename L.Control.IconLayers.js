+ function() {
    function each(o, cb) {
        for (var p in o) {
            if (o.hasOwnProperty(p)) {
                cb(o[p], p, o);
            }
        }
    }

    L.Control.IconLayers = L.Control.extend({
        _createLayersElements: (function() {
            function createLayerElement(layerObj) {
                var el = L.DomUtil.create('div', 'leaflet-iconLayers-layer');
                if (layerObj.title) {
                    var titleContainerEl = L.DomUtil.create('div', 'leaflet-iconLayers-layerTitleContainer');
                    var titleEl = L.DomUtil.create('div', 'leaflet-iconLayers-layerTitle');
                    titleEl.innerHTML = layerObj.title;
                    titleContainerEl.appendChild(titleEl);
                    el.appendChild(titleContainerEl);
                }
                if (layerObj.icon) {
                    el.setAttribute('style', "background-image: url('" + layerObj.icon + "')");
                }
                return el;
            }

            return function() {
                each(this._layers, function(layer, id) {
                    this._container.appendChild(createLayerElement(layer));
                }.bind(this));
            };
        })(),
        _attachEvents: (function() {
            return function() {

            };
        })(),
        // re-create control element and attach events
        _render: function() {
            this._createLayersElements();
            this._attachEvents();
        },
        options: {
            position: 'bottomleft'
        },
        initialize: function(layers, options) {
            L.setOptions(this, options);
            this.setLayers(layers);
        },
        onAdd: function(map) {
            this._container = L.DomUtil.create('div', 'leaflet-iconLayers');
            L.DomUtil.addClass(this._container, 'leaflet-iconLayers_' + this.options.position);
            this._render();
            return this._container;
        },
        setLayers: function(layers) {
            this._layers = {};
            layers.map(function(layer) {
                this._layers[L.stamp(layer)] = layer;
            }.bind(this));
            this._container && this._render();
        },
        setActiveLayer: function(layer) {
            this._activeLayerId = L.stamp(layer);
            this._container && this._render();
        }
    });
}();