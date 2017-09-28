/**
 * Wow Slides JS API
 */
 (function() {

    this.WowSlides = function(_selector, options){
        this.options = options;

        if(isNull(_selector)){
            return this;
        }

        this.element = document.querySelector(_selector);
        this.setDefaults();



        var _this = this;

        // Create IE + others compatible event handler
        var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        var eventer = window[eventMethod];
        var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

        // Listen to message from child window
            eventer(messageEvent,function(e) {
                if("wowapi://" == e.data.substring(0, 9)){
                    var msg = JSON.parse(e.data.split("wowapi://")[1]);

                    var _key = Object.getOwnPropertyNames(msg)[0]

                    switch (_key) {
                    case "currentslide":
                        _this._currentSlide = msg.currentslide;
                        break;
                    case "progress":
                        _this._progress = msg.progress;
                        break;
                    case "slidecount":
                        _this._slideCount = msg.slidecount;
                        break;
                    case "watchedlist":
                        if (isNull(_this._watchedList)) {
                            _this._watchedList = [];
                        }
                        _this._watchedList = _this._watchedList.concat(msg.watchedlist).unique();
                        _this._watchedList.sort(sortNumber);
                        break;

                    // Events
                    case "event":
                        if(msg.event == "ready"){
                            _this.options.onReady();
                        }else if(msg.event == "slidechange"){
                            _this.options.onSlideChange(_this.currentSlide());
                        }else if(msg.event == "progresschange"){
                            _this.options.onProgressChange(_this.progress());
                        }


                        break;
                    default:
                        break;
                    }

                }


            },false);

            this.init();



    }

    /**
    * Init
    */
    this.WowSlides.prototype.init = function(){
        this.createIframe();
    }


    /**
    * Set Defaults
    */
    this.WowSlides.prototype.setDefaults = function(){

        if(this.options.width == undefined && this.element.offsetWidth <= 0){
            this.options.width = '854px';
        }else{
            this.options.width = this.element.offsetWidth;
        }

        if(this.options.height == undefined && this.element.offsetHeight <= 0){
            this.options.height = '480px';
        }else{
            this.options.height =  this.element.offsetHeight;
        }

        if(this.options.width <= 0){
            this.options.width = '854px';
        }
        if(this.options.height <= 0){
            this.options.height= '480px';
        }

        if (typeof this.options.onready !== "function") {
            this.options.onready = function(){};
        }else if (typeof this.options.onplay !== "function") {
            this.options.onplay = function(){};
        }else if (typeof this.options.onpause !== "function") {
            this.options.onpause = function(){};
        }else if (typeof this.options.onprogress !== "function") {
            this.options.onprogress = function(){};
        }else if (typeof this.options.onend !== "function") {
            this.options.onend = function(){};
        }
    }



    this.WowSlides.prototype.createIframe = function(selector){

        var generator = new IDGenerator();
        var iframe = document.createElement('iframe'),
        iframeId = 'wows-ppp-'+generator.generate();
        iframe.setAttribute('id', iframeId); // assign an id

        var _src = this.options.url;



        if(this.options.embedded){
            _src = addQueryParam(_src, 'embedded', 'true');
        }

        if(this.options.sections != null){
            _src = addQueryParam(_src, 'sections', this.options.sections);
        }

        if(this.options.slide != null){
            _src = addQueryParam(_src, 'slide', this.options.slide);
        }

        if(!this.options.autoAdvance){
            _src = addQueryParam(_src, 'autoAdvance', 'false');
        }


        iframe.setAttribute('src', _src);
        iframe.setAttribute('width', this.options.width);
        iframe.setAttribute('height', this.options.height);
        iframe.setAttribute('position', 'inherit');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('webkitallowfullscreen', '');
        iframe.setAttribute('mozallowfullscreen', '');
        iframe.setAttribute('allowfullscreen', '');


        // Append iframe to element
        this.element.appendChild(iframe);

        this.iframeReceiver = document.getElementById(iframeId).contentWindow;

        var _this = this;


    }

    /**
    *  Send message to reciever
    */
    this.WowSlides.prototype.sendMessage = function(msg){
        this.iframeReceiver.postMessage("wow://"+JSON.stringify(msg), '*');
    }



    /**
    *   Get the next slide
    */
    this.WowSlides.prototype.next = function(){
        var msg = {"name": "next"};
        return this.sendMessage(msg);
    }

    /**
    *   Get the previous slide
    */
    this.WowSlides.prototype.previous = function(){
        var msg = {"name": "previous"};
        return this.sendMessage(msg);
    }


    /**
    *   Returns current slide number
    */
    this.WowSlides.prototype.currentSlide = function(slideNumber){
        if(isNull(slideNumber)){
            return this._currentSlide;
        }else {
            var msg = {"name": "setCurrentSlide", "value": slideNumber};
            return this.sendMessage(msg);
        }
    }

    /**
    *   Returns the progress of presentation (percentage 0.00/100.00)
    */
    this.WowSlides.prototype.progress = function(){
        return this._progress;
    }


    /**
    *   Returns the slide count of presentation
    */
    this.WowSlides.prototype.slideCount = function(){
        return this._slideCount;
    }


    /**
         * null/undefined checker
         * @param obj
         * @returns {Boolean}
         */
        function isNull(obj){
            if(obj == undefined || obj == null){
                return true;
            }

            return false;
        }

        function IDGenerator() {
             this.length = 16;
             this.timestamp = +new Date;

             var _getRandomInt = function( min, max ) {
                return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
             }

             this.generate = function() {
                 var ts = this.timestamp.toString();
                 var parts = ts.split( "" ).reverse();
                 var id = "";

                 for( var i = 0; i < this.length; ++i ) {
                    var index = _getRandomInt( 0, parts.length - 1 );
                    id += parts[index];
                 }

                 return id;
             }


         }


         function sortNumber(a,b) {
            return a - b;
         }

         Array.prototype.unique = function() {
            var a = this.concat();
            for(var i=0; i<a.length; ++i) {
                for(var j=i+1; j<a.length; ++j) {
                    if(a[i] === a[j])
                        a.splice(j--, 1);
                }
            }

            return a;
         };


        function addQueryParam(uri, key, value) {
              var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
              var separator = uri.indexOf('?') !== -1 ? "&" : "?";
              if (uri.match(re)) {
                return uri.replace(re, '$1' + key + "=" + value + '$2');
              }
              else {
                return uri + separator + key + "=" + value;
              }
        }

     return WowSlides;

 }());