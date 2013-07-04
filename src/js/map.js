
$('#add-route-form').submit(function (e) {
    var form = $(this);
    var url = form.attr('action');

    $.post(url, function(json) {
        if (json.status) {
            alert('fail');
        }
        else {
            alert('success!');
        }
    }, 'json');

    return false;
});


var util = (function () {

    var uIdMap = {};
    /**
     * 获取不重复的随机串
     * 
     * @param {number} optLen 随机串长度，默认为10
     * @return {string}
     */
    function getUID( optLen ) {
        optLen = optLen || 10;
        
        var chars    = "qwertyuiopasdfghjklzxcvbnm1234567890",
            charsLen = chars.length,
            len2     = optLen,
            rand     = "";
            
        while ( len2-- ) {
            rand += chars.charAt( Math.floor( Math.random() * charsLen ) );
        }
        
        if ( uIdMap[ rand ] ) {
            return getUID( optLen );
        }
        
        uIdMap[ rand ] = 1;
        return rand;
    }

    return {
        getUID : getUID
    }

})();

var Map = (function() {
    var exports = {};

    var oMap;

    function init( id ) {
        oMap = new BMap.Map(id);
        oMap.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
    };

    var routes = {};

    function addRoute( start, end ) {
        var uid = util.getUID();

        var driving = new BMap.DrivingRoute(oMap, {
            renderOptions: {
                map: oMap, 
                autoViewport: true
            }
        });

        driving.search(start, end);

        routes[uid] = driving;

        return uid;
    };

    function renderRoutes( routes ) {
        var ids = [];

        for ( var i = 0, len = routes.length; i < len; i++ ) {
            ids.push( addRoute(routes[i].start, routes[i].end) );
        }

        return ids;
    };

    exports.render = renderRoutes;

    exports.init = init;

    exports.addRoute = addRoute;

    exports.getRoute = function ( id ) {
        return routes[id] || null;
    };

    return exports;
})();

// 初始化地图
Map.init('route-map');

$.get( 'data.json', function( json ) {
    if ( !json.status ) {
        Map.render(json.data);
    }
}, 'json' );