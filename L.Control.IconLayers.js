+ function() {
    function each(o, cb) {
        for (var p in o) {
            if (o.hasOwnProperty(p)) {
                cb(o[p], p, o);
            }
        }
    }

    function find(ar, cb) {
        if (ar.length) {
            for (var i = 0; i < ar.length; i++) {
                if (cb(ar[i])) {
                    return ar[i];
                }
            }
        } else {
            for (var p in ar) {
                if (ar.hasOwnProperty(p) && cb(ar[p])) {
                    return ar[p];
                }
            }
        }
    }

    function first(o) {
        for (var p in o) {
            if (o.hasOwnProperty(p)) {
                return o[p];
            }
        }
    }

    function length(o) {
        var length = 0;
        for (var p in o) {
            if (o.hasOwnProperty(p)) {
                length++;
            }
        }
        return length;
    }

    function prepend(parent, el) {
        if (parent.children.length) {
            parent.insertBefore(el, parent.children[0]);
        } else {
            parent.appendChild(el);
        }
    }

    L.Control.IconLayers = L.Control.extend({
        _getActiveLayer: function() {
            if (this._activeLayerId) {
                return this._layers[this._activeLayerId];
            } else if (length(this._layers)) {
                return first(this._layers);
            } else {
                return null;
            }
        },
        _getPreviousLayer: function() {
            var activeLayer = this._getActiveLayer();
            if (!activeLayer) {
                return null;
            } else if (this._previousLayerId) {
                return this._layers[this._previousLayerId];
            } else {
                return find(this._layers, function(l) {
                    return L.stamp(l.layer) !== L.stamp(activeLayer.layer);
                }.bind(this)) || null;
            }
        },
        _getInactiveLayers: function() {
            var ar = [];
            var activeLayerId = this._getActiveLayer() ? L.stamp(this._getActiveLayer().layer) : null;
            var previousLayerId = this._getPreviousLayer() ? L.stamp(this._getPreviousLayer().layer) : null;
            each(this._layers, function(l) {
                var id = L.stamp(l.layer);
                if ((id !== activeLayerId) && (id !== previousLayerId)) {
                    ar.push(l);
                }
            });
            return ar;
        },
        _arrangeLayers: function() {
            var behaviors = {};

            behaviors['previous'] = function() {
                var activeLayer = this._getActiveLayer();
                var previousLayer = this._getPreviousLayer();
                if (previousLayer) {
                    return [previousLayer, activeLayer].concat(this._getInactiveLayers());
                } else if (activeLayer) {
                    return [activeLayer].concat(this._getInactiveLayers());
                } else {
                    return null;
                }
            };

            return behaviors[this.options.behavior].apply(this, arguments);
        },
        _getElementByLayerId: function(id) {
            var els = this._container.getElementsByClassName('leaflet-iconLayers-layer');
            for (var i = 0; i < els.length; i++) {
                if (els[i].getAttribute('data-layerid') == id) {
                    return els[i];
                }
            }
        },
        _getLayerIdByElement: function(el) {
            return el.getAttribute('data-layerid') / 1;
        },
        _createLayersElements: (function() {
            function createLayerElement(layerObj) {
                var el = L.DomUtil.create('div', 'leaflet-iconLayers-layer');
                el.setAttribute('data-layerid', L.stamp(layerObj.layer));
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
                var currentRow, layerCell;
                var layers = this._arrangeLayers();
                for (var i = 0; i < layers.length; i++) {
                    if (i % this.options.maxLayersInRow === 0) {
                        currentRow = L.DomUtil.create('div', 'leaflet-iconLayers-layersRow');
                        prepend(this._container, currentRow);
                    }
                    layerCell = L.DomUtil.create('div', 'leaflet-iconLayers-layerCell');
                    var layerEl = createLayerElement(layers[i]);
                    if (i !== 0) {
                        L.DomUtil.addClass(layerEl, 'leaflet-iconLayers-layer_hidden');
                    }
                    layerCell.appendChild(layerEl);
                    currentRow.appendChild(layerCell);
                }
            };
        })(),
        _showLayers: function() {
            this._arrangeLayers().slice(1).map(function(l) {
                var el = this._getElementByLayerId(L.stamp(l.layer));
                L.DomUtil.removeClass(el, 'leaflet-iconLayers-layer_hidden');
            }.bind(this));
        },
        _hideLayers: function() {
            this._arrangeLayers().slice(1).map(function(l) {
                var el = this._getElementByLayerId(L.stamp(l.layer));
                L.DomUtil.addClass(el, 'leaflet-iconLayers-layer_hidden');
            }.bind(this));
        },
        _attachEvents: function() {
            each(this._layers, function(l) {
                var e = this._getElementByLayerId(L.stamp(l.layer));
                if (e) {
                    e.addEventListener('click', function(e) {
                        e.stopPropagation();
                        this.setActiveLayer(l.layer);
                        this._showLayers();
                    }.bind(this));
                }
            }.bind(this));
            var layersRowCollection = this._container.getElementsByClassName('leaflet-iconLayers-layersRow');
            for (var i = 0; i < layersRowCollection.length; i++) {
                var el = layersRowCollection[i];
                el.addEventListener('mouseenter', function(e) {
                    e.stopPropagation();
                    this._showLayers();
                }.bind(this));
                el.addEventListener('mouseleave', function(e) {
                    e.stopPropagation();
                    this._hideLayers();
                }.bind(this));
                el.addEventListener('mousemove', function(e) {
                    e.stopPropagation();
                });
            }
        },
        _render: function() {
            this._container.innerHTML = '';
            this._createLayersElements();
            this._attachEvents();
        },
        options: {
            position: 'bottomleft', // one of expanding directions depends on this
            behavior: 'previous', // may be 'previous', 'expanded' or 'first'
            expand: 'horizontal', // or 'vertical'
            autoZIndex: true, // from L.Control.Layers
            maxLayersInRow: 5
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
                this._layers[L.stamp(layer.layer)] = layer;
            }.bind(this));
            this._container && this._render();
        },
        setActiveLayer: function(layer) {
            if (!layer || L.stamp(layer) === this._activeLayerId) {
                return;
            }
            this._previousLayerId = this._activeLayerId;
            this._activeLayerId = L.stamp(layer);
            this._container && this._render();
        }
    });
}();