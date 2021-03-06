(function() {
    'use strict';

    var mod = angular.module('ods-widgets');

    mod.service('MapRenderingShapePreview', ['ODSAPI', 'MapLayerHelper', '$q', function (ODSAPI, MapLayerHelper, $q) {
        return {
            render: function (layerConfig, map, timeout) {
                var deferred = $q.defer();
                var parameters = angular.extend({}, layerConfig.context.parameters, {
                    'rows': 1000,
                    'clusterprecision': map.getZoom(),
                    'geofilter.bbox': ODS.GeoFilter.getBoundsAsBboxParameter(map.getBounds())
                });
                var layerGroup = new L.LayerGroup();
                ODSAPI.records.geopreview(layerConfig.context, parameters, timeout.promise).success(function (data) {
                    var shape;
                    for (var i = 0; i < data.length; i++) {
                        shape = data[i];
                        MapLayerHelper.drawShape(layerConfig, map, shape.geometry, null, layerGroup, shape.geo_digest);
                    }
                    deferred.resolve(layerGroup);
                });
                return deferred.promise;
            }
        };
    }]);
}());
