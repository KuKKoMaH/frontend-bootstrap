;(function(){
    var $body = $('body'),
        mapInited = false,
        mapInload = false,
        initQueue = [];

    $body.on('mapLoad', function(e, callback){
        if(!mapInload){
            mapLoad();
            initQueue.push(callback);
        }else{
            if(mapInited){
                callback();
            }else{
                initQueue.push(callback);
            }
        }
    });

    function mapInit() {
        mapInited = true;
        for(var i = 0, il = initQueue.length; i < il; i++){
            initQueue[i]();
        }
    }

    function mapLoad(){
        mapInload = true;

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = 'http://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/leaflet.js';

        script.onload = script.onerror = function() {
            if (!this.executed) {
                this.executed = true;
                mapInit();
            }
        };

        script.onreadystatechange = function() {
            var self = this;
            if (this.readyState == "complete" || this.readyState == "loaded") {
                setTimeout(function() {
                    self.onload()
                }, 0);
            }
        };
        document.body.appendChild(script);

        var ms=document.createElement("link");
        ms.rel="stylesheet";
        //ms.href="https://api.tiles.mapbox.com/mapbox.js/v2.2.1/mapbox.css";
        ms.href="http://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/leaflet.css";
        document.getElementsByTagName("head")[0].appendChild(ms);
    }
})();