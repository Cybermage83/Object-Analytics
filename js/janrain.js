//Constructors
    var backplaneConst    = function(){},   janrainConst  = function(){}, livefyreConst  = function(){},
            badgeConst    = function(){},   toolConst     = function(){}, eventsConst    = function(){},
            uReportConst  = function(){},   requireConst  = function(){}, userConst      = function(){},
            omnitureConst = function(){},   whatCConst    = function(){}, domConst       = function(){},
            idmsConst     = function(){},
    //Prototypes
        backplaneProto = {}, janrainProto  = {}, livefyreProto  = {}, requireProto = {},
        badgeProto     = {}, toolProto     = {}, eventsProto    = {}, uReportProto = {},
        userProto      = {}, omnitureProto = {}, whatCProto     = {}, domProto     = {},
        idmsProto      = {};


    /*----------------------------------
                    CONFIG : is an external file
     ----------------------------------*/
    var CONFIG = {};
        CONFIG.janrain = {};
        CONFIG.livefyre = {};
        CONFIG.ureport = {};
        CONFIG.whatcounts = {};
var HOST = function(){};

    //------------END of CONFIG

    /*-------------------------------
                    TOOLS
    -------------------------------*/
	toolConst  = function(){

    };

    toolProto = {
        /**
         * [loadExtJs description] - loading external js files to execute callback once loaded : NOTE: can be updated with jquery loader
         * @param  {string}   src - destination for external source
         * @param  {string}   id - give an id to scrip tag
         * @param  {Function} callback - execute a function after loaded JS
         * @param  {string}   type - load css?
         * @return {null}
         */
		loadExtJs : function(src,id,callback,type) {

            var e   = document.createElement('script'), url;
                e.type  = 'text/javascript';
                e.id    = id || '';
                e.async = true;
                e.setAttribute('type','text/javascript');

            if (type === 'share') {
            	if (CONFIG.live) {
            		e.src = 'http://widget-cdn.rpxnow.com/js/lib/fox-news/widget.js';
            	} else {
            		e.src = 'http://widget-cdn.rpxnow.com/js/lib/fox-news-dev/widget.js';
            	}
            } else {
            	e.src = document.location.protocol + "//" + ((type === "www") ? "www." : "") + src;
            }

            if (typeof callback === 'function') {
                e.onload = e.onerror = e.onreadystatechange = function(event) {

                    if ((!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
                        callback();
                    }
                };
            }

            var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(e, s);
        },

        assert : function(entity,type) {
            return (typeof entity === type) ? true : false;
        },

        domTest : function(elm) {
            return (elm.length != 0) ? true : false;
        },

        getDomain : function() {
			var loc = window.location, host = loc.hostname, protocol = loc.protocol, arr = host.split('.');
            return 'www.' + arr[(arr.length - 2)] +'.'+ arr[(arr.length - 1)];
        }

    };
    /* ------------END TOOLS ------------ */

    /*
    ----------DOM CONSTRUCTOR----------------
     */
	domConst = function() {

	};

    /*
        DOM Prototype : Contains most essential elements for Janrain projects
     */
    domProto = {
        /**
         * [setDomReady() description] -- Dom is obtained via callback, prototypes are executed on DOC READY!
         * @param {function} callbackFN
         */
        setDomReady : function(callbackFN) {

            var auth = $('#authentication'), acc = $('#account'), userOptions = acc.find('.user-options'),
                body = $('body'), secContent = $('#section-content');

            var foo = {
                acc : acc,
                body : body,
                user : acc.find('.username'),
                login : auth.find('>li:last-child'),
                authen : auth,
                name : userOptions.find('span'),
                register : auth.find('.first'),
                noAccount  : auth,
                userOptions : userOptions,
                accountNav : acc.find('.encapsulate'),
                profile : userOptions.find('ul > li.first'),
                logout : userOptions.find('ul > li:last-child'),
                hasAccount : acc.find('.username'),

                /**
                 * [publicProfile description] - the reason this is a function is because the dom is dynamicly loaded
                 * @return {object}
                 */
                publicProfile : function() {
                    return  {
                        likes : $('#fox_lf_likes'),
                        shares : $('#fox_jr_shares'),
                        ureport : $('#fox_ur_reports'),
                        comments : $('#fox_lf_comments')
                    }
                },

                whatCounts : function() {
                    return $('.news-sub-form');
                },

                uReport : function() {
                    var acc = $('#account');

                    return {
                        acc : acc,
                        redBtn : $('#main').find('.red-butt ')
                    }
                },

                sectionContent : secContent
            };

            // still hide the nav, but with visibility
            // showing only triggers on session found/not found
            AUTH_Manager.onReady("capture",function() {
               // $("#account").removeClass("none").show().css("visibility","inherit");
            });

            callbackFN(foo);

        }
    };

    //------END of DOM-----------------

    /*============================================================================================
                   @ Require  @
     Prerequisite data or javascript that is needed before document is Ready
     ============================================================================================*/
	requireConst = function() {

    };

    //======Prototype====================
    requireProto = {

        token : null, // janrain token, is set on
        template : null, // not used
        /**
         * [getToken description] - this is for IE, and in case one needs a tocken from localstorage
         * @return {void}
         */
        getToken : function() {
            var _t = this;

            try{
            if(window.localStorage){
                _t.token  = localStorage.getItem("janrainCaptureToken");
            }else{

            }
            }catch (e){
				log(e);
            }
        },

        classLogin : 'capture_modal_open',//essential For Signing can use other method

        janrainFlow : false, // will get executed on initialize janrainFlow determines which templates elemets to load or not to load

        // state object was just a simple way to track what loaded or not in initial development, but no longer require but should be around.
        state : {

            janrain : false,
            ureport : false,
            livefyre : false,
            template : false,
            backplane : false,
            badgeville : false
        },
        // deprecated, but you never know, untill you run a visual data analyser.
        dataConfig : {

            janrain : {
               clientId : 'c5dr2na59wh3bmna2aqgdnbzapeffy7q'
            },

            livefyre : {

            },

            ureport : {

            },

            whatcounts : {

            }
        },

        /**
         * [loadTemplate description] - loading external JS variable that contains janrain's template, here we determine how we load it, and what needs to be displayed on the page.
         * @return {DOM} - janrain Template appended to the body
         */
        loadTemplate : function() {
            var _t = this,profile,tpl,inline,
                normalFlow  = ['resetPasswordUserSuccess', 'resetPassword', 'resetPasswordSuccess',
                               'registrationVerify', 'registrationVerified','editProfile'
                ],
                profileFlow = ['resetPasswordUserSuccess', 'resetPassword', 'resetPasswordSuccess'//,
                               //'registrationVerify', 'registrationVerified'
                ],
                specialFlow = ['resetPasswordUserSuccess', 'resetPassword', 'resetPasswordSuccess','signIn',
                               'registrationVerify', 'registrationVerified','returnTraditional','returnSocial',
                                'forgotPasswordSuccess'
                ];

            // template holder
            tpl = document.createElement('div');tpl.id ="templateHolder";

            // window.FOX_Janrain_Auth_TPL is the external janrain template
			inline = (window.FOX_Janrain_Auth_TPL) ? true : false;

            //if(_t.janrainFlow === 'publicFlow'){return false;}

            // inline means use external janrain variable string, instead of ajax
            if (inline) {
                var template = $(FOX_Janrain_Auth_TPL);

                if (_t.janrainFlow === 'profileFlow' || _t.janrainFlow === 'publicFlow') {
                    domProto.setDomReady().sectionContent.append(tpl);

                    for (var z = 0, len = template.length; z < len; z+=1) {
                        for (var d = 0, dlen = profileFlow.length; d < dlen; d+= 1) {

                            if (normalFlow[d] === template[z].id) {
                                template[z].innerHTML ='';
                                template[z].id ='';
                            }
                        }
                    }

                    $(tpl).html(template);
                    janrainProto.init();//boot up janrain
                } else if (_t.janrainFlow === 'authFlow') {

                    domProto.setDomReady().body.append(tpl);

                    for (z = 0, len = template.length; z < len; z+=1) {
                        for (d = 0, dlen = normalFlow.length; d < dlen; d+= 1) {

                            if(normalFlow[d] === template[z].id){

                                template[z].innerHTML ='';
                                template[z].id ='';
                            }
                        }
                    }
                	$(tpl).html(template);
                    janrainProto.init();//boot up janrain

                } else {

					domProto.setDomReady().sectionContent.append(tpl);
                    var temp = [];

                    for (z = 0, len = template.length; z < len; z+=1) {
                        var found = false;
                        for (d = 0, dlen = specialFlow.length; d < dlen; d+= 1) {

                            if (specialFlow[d] === template[z].id) {
                                //temp.push(z);
                                found = true;
                            }
                        }
                        if (!found) {
                            template[z].innerHTML ='';
                            template[z].id ='';
                        }
                    }

                    $(tpl).html(template);
                    janrainProto.init();//boot up janrain
                }
                requireProto.state.template = true;

            } else {
                // this is a back up, it should never really executed at all
                $.ajax({
                    type:'GET',
                    url:CONFIG.templateUrl,
                    dataType: 'html',
                    beforeSend: function(){

                    },
                    success: function(data){
                    	//_t.template = $(data).find('body').contents();


                        if(_t.janrainFlow === 'profileFlow'){
                            domProto.setDomReady().sectionContent.append(tpl);
                            tpl = $(tpl).html(data);
                        }else{
                            var holder = data.replace(/\'/gi, '\'');
                            //tpl = $(tpl).html(data);
                            //tpl.find('#editProfile').remove();
                            domProto.setDomReady().body.append(tpl);
                            var tpl = domProto.setDomReady().body.find('#templateHolder');
                            tpl.html(holder);
                            tpl.find('#editProfile').remove();
                            //tpl.find('#publicProfile').remove();
                        }

                        requireProto.state.template = true;
                        janrainProto.init();//boot up janrain
                    }
				});
            }
        }

    };

    /*++++++++++++End of Require+++++++++ */

    /*---------------------------
                    Backplane handled by janrain now
    ----------------------------*/
	backplaneConst = function() {

    };
    /* ========Prototype ==============*/
    backplaneProto = {

    };
    /*-------END BACKPLANE------------*/

    /*-----------------------------
                 JANRAIN
    To keeep in mind janrain.capture.ui.renderScreen('publicProfile')
    --------------------------------*/

    /**
     * [janrainConst description] - massive configuration setting for janrain, need to loaded on the page before janrain.js does
     * @return {[type]}
    */
	janrainConst = function() {
		//Configure Setting based on the special location

        if (typeof window.janrain !== 'object') window.janrain = {};
        window.janrain.settings = {};
        window.janrain.settings.capture = {};
        window.janrain.settings.share      = {};

        janrain.settings.appUrl = CONFIG.janrain.appUrl; // engage url to foxnews sigin.foxnew.com
        janrain.settings.custom = true;
        janrain.settings.capture.flowVersion   = 'HEAD';
        janrain.settings.capture.responseType  = 'token'; //for us
        janrain.settings.capture.flowName      = 'foxNewsFlow';   //will be changed
        janrain.settings.capture.stylesheets   = CONFIG.styleUrl; //found at the top
        janrain.settings.tokenUrl              = window.location.protocol+'//'+window.location.host+'/'; //   may not be required http://localhost/~chad/test.php

        janrain.settings.capture.appId         = CONFIG.janrain.appId;
        janrain.settings.capture.redirectUri   = window.location.protocol+'//'+window.location.host; //will test this for window.location
        janrain.settings.capture.clientId      = CONFIG.janrain.clientId;
        janrain.settings.capture.captureServer = CONFIG.janrain.captureServer; //register.foxnews.com

        janrain.settings.capture.recaptchaPublicKey = '6LeVKb4SAAAAAGv-hg5i6gtiOV4XrLuCDsJOnYoP';
        janrain.settings.capture.editPhotoAfterUpload = true;

        /* Configuring Modal Settings */
        janrain.settings.type = 'embed';
        janrain.settings.tokenAction = 'event';
        janrain.settings.format = 'two column';

        janrain.settings.capture.modalBorderOpacity = 0;
        janrain.settings.capture.modalBorderWidth = 0;
        janrain.settings.capture.modalBorderRadius = 2;
        janrain.settings.capture.modalCloseHtml = '<span class="janrain-icon-16 janrain-icon-ex"></span>';
        janrain.settings.capture.modalBorderColor = 'transparent';
        janrain.settings.language = 'en';
        janrain.settings.capture.setProfileCookie = true;
        janrain.settings.capture.keepProfileCookieAfterLogout = true;
        janrain.settings.capture.hideSavedProfileMessageDelay = 15000;

        // ---Settings are based of janrainFlow in requireConst object
        switch (requireProto.janrainFlow){
            case 'authFlow':
                janrain.settings.capture.setProfileData     = 'true';
                janrain.settings.capture.registerFlow  = 'socialRegistration';                  //starting flow for this particular page
                break;
            case 'profileFlow':
                janrain.settings.autoSave = true;
                janrain.settings.screenToRender = 'editProfile';
                break;
            case 'emailFlow':
                janrain.settings.screenToRender = 'registrationVerify';
                janrain.settings.capture.registerFlow   = 'socialRegistration'; //starting flow for this particular page
                break;
            case 'passwordFlow':
                janrain.settings.screenToRender = 'resetPassword';
                janrain.settings.capture.setProfileData = 'true';
                janrain.settings.capture.registerFlow   = 'socialRegistration'; //starting flow for this particular page
                break;
        }

        /* Backplane Settings */
        janrain.settings.capture.backplane = true;
        janrain.settings.capture.backplaneBusName = CONFIG.janrain.backplaneBusName;

        //federate SSO settings
        janrain.settings.capture.federate = true;
        janrain.settings.capture.federateServer = CONFIG.janrain.federateServer;
        janrain.settings.capture.federateXdReceiver = CONFIG.xdcomm;
        janrain.settings.capture.federateLogoutUri  = CONFIG.logout;

        /* Configuring Sharing settings       */
        janrain.settings.share.providers = ["facebook","twitter","linkedin","email"];
        janrain.settings.share.providersEmail = ["google","yahoo"];
        janrain.settings.share.modes = ["broadcast","contact"];
        janrain.settings.share.attributionDisplay = false;
        janrain.settings.share.previewMode = 0;

        // Janrain Mobile CSS
        janrain.settings.capture.mobileStylesheets = [CONFIG.janrain.mobileCSS];

        /* Attributes */
        //janrain.settings.share.message = "";
        //janrain.settings.share.title = "";
        //janrain.settings.share.url = "";
        //janrain.settings.share.description = "";

        // Modal Styles
        janrain.settings.share.modalBackgroundColor = "#000000";
        janrain.settings.share.modalBorderRadius = "2";
        janrain.settings.share.modalOpacity = "0";
        janrain.settings.share.modalWidth = "0";

        // Body Styles
        janrain.settings.share.bodyBackgroundColor = "#F3F3F3";
        janrain.settings.share.bodyBackgroundColorOverride = true;
        janrain.settings.share.bodyColor = "#333";
        janrain.settings.share.bodyContentBackgroundColor = "#ffffff";
        janrain.settings.share.bodyFontFamily = "Helvetica";
        janrain.settings.share.bodyTabBackgroundColor = "#F3F3F3";
        janrain.settings.share.bodyTabColor = "#424242";

        // Element Styles
        janrain.settings.share.elementBackgroundColor = "#f3f3f3";
        janrain.settings.share.elementBorderColor = "#ccc";
        janrain.settings.share.elementBorderRadius = "3";
        janrain.settings.share.elementButtonBorderRadius = "3";
        janrain.settings.share.elementButtonBoxShadow = "0";
        janrain.settings.share.elementColor = "#333333";
        janrain.settings.share.elementHoverBackgroundColor = "#333333";
        janrain.settings.share.elementLinkColor = "#173951";

        if(requireProto.janrainFlow === 'profileFlow'){
            janrain.settings.packages = ['login',  'capture'];
        }else if(requireProto.janrainFlow === 'publicFlow'){
            janrain.settings.packages = ['login','capture'];
            janrain.settings.capture.stylesheets   = []; //found at the top
        }else{
            janrain.settings.packages = ['login',  'capture', 'share'];
        }

        janrain.ready = true;//MUST BE READY on DOME
    };

    /*-------- PROTOTYPE -------------*/
    janrainProto = {

        config : {

            capture :{
                url : CONFIG.janrain.jsURL,//subject to change
                id  : 'janrainAuthWidget'
            },

            share : {
                url  : 'default',
                id   : 'janrainWidgets',
                type : 'share'
            }
        },

        session : null, // Essential Switch for being aware the status of the users session
        sessionType : '',
        reset : false, //for modals and validation

        /**
         * [init description] - exposes janrain's settings to window scope and loads janrain js b toolProto.loadExtJs
         * @return {object} - self
         */
        init : function(){
            var _t = this;
			//This needs to be loaded before Janrain Js is loaded
            _t.widgetOnload();//Calls on window janrain functions Essential Janrain Functions
            _t.captureWidgetOnLoad();//Calls on window janrain functions Essential Janrain Functions

            toolProto.loadExtJs(_t.config.capture.url, _t.config.capture.id, _t.loadedJS.loadJan);

            return this;
        },

        // Janrain API calls critical part here
        API : {
            requestSent : false,
            url : CONFIG.janrain.apiURL,
            token : '',//stored token do not delete

            /**
             * [updateAPI description]
             * @param  {string} type - which schema to target
             * @param  {[type]} value
             * @return {object} the actual parameters
             */
            updateAPI : function(type,value){
                var _t = this;
                if(type === 'livefyre'){
                    return  {
                        type_name : 'user',
                        access_token : _t.token,
                        attributes : '{"externalServices":{"livefyre":{"livefyre_id":"'+userProto.userLivefyre.id+'"}}}' //attr// example {"primaryAddress":{"zip":"11229"},"gender":"Male"}
                    };
                }else if(type === 'livefyre_temp'){
                    return  {
                        type_name : 'user',
                        access_token : _t.token,
                        attributes : '{"externalServices":{"livefyre":{"livefyre_id":"'+userProto.uuid+'@foxnewsprod.fyre.co"}}}' //attr// example {"primaryAddress":{"zip":"11229"},"gender":"Male"}
                    };
                }else if(type === 'badgeville_id'){
                    return  {
                        type_name : 'user',
                        access_token : _t.token,
                        attributes : '{"externalServices":{"badgeville_id":"'+userProto.uuid+'@user.foxnews.com"}}' //attr// example {"primaryAddress":{"zip":"11229"},"gender":"Male"}
                    };
                }else if(type === 'share'){
                    if(userProto.userJanrain.shares == null){userProto.userJanrain.shares = 0;}
                    userProto.userJanrain.shares+=1;

                    return {
                        type_name : 'user',
                        access_token : _t.token,
                        attributes : '{"shares" : '+userProto.userJanrain.shares+'}'
                    };

                    }
                else if(type === 'test'){
                    return  {
                        type_name : 'user',
                        access_token : _t.token,
                        attributes : '{"externalServices":{"livefyre":{"livefyre_id":"'+value+'"}}}' //attr// example {"primaryAddress":{"zip":"11229"},"gender":"Male"}
                    };
                }
            },

            /**
             * [execute description] - ajax request http://developers.janrain.com/documentation/api/entity-update/ : In this LOGIN sate a lot of conditions are called and checked
             * @param  {string} entity - 'entity' type of request entity.find or entity.update to janrain APU
             * @param  {object} attr - attributes with access token when user creates a sesssion on loging or session found ; {type_name:'user',access_token: result.accessToken}
             * @return {void} - ajax
             */
            execute : function(entity,attr) {
                var _t = this, successCB = 'FOX_Janrain_EXEC';

                attr.jsonp = successCB;

                if (typeof window[successCB] !== 'function') {

                    /**
                     * [ description] - if user loged in, call to ureport or idms depending, also check for livefre and badgeville.
                     * @param  {object} data - response from janrain on the session user
                     * @return {void}
                     */
                    window[successCB] = function(data) {
						if (data.code == 414){//Token Expired
                            eventsProto.janrain.tokenRefreshed();
                            eventsProto.janrain.signOut();

                            eventsProto.domEvents.logoutSuccess();
                            //janrain.capture.ui.federateRefreshToken(data);
                            //janrain.capture.ui.renderScreen('signIn');
                            return false;
                        } else if (data.code == 310 ) {
                            eventsProto.domEvents.logoutSuccess();
                            eventsProto.janrain.signOut();

                            //setTimeout(function(){janrain.capture.ui.renderScreen('signIn');},1000);
                            return false;
                        } else if (!data.code && !data.stat) {
                            eventsProto.domEvents.logoutSuccess();
                            eventsProto.janrain.signOut();

                            return false;
                        } else if (data.stat === 'ok') {
                            _t.requestSent = true;
                            //janrain.capture.ui.renderScreen('editProfile');

                            userProto.uuid  = data.result.uuid;
                            userProto.email = data.result.email;
                            userProto.userJanrain = data.result;
                            userProto.displayName = data.result.displayName;

                            //Engaging Follow ups
                            //badgeProto.setUp();

                            //DOM
                            eventsProto.displayName();
                            if ($('#authentication').css('display') === 'block') {
                                eventsProto.domEvents.loginSuccess();
                            }

                            //quick fix for publicfrofile in show pages
                            if (domProto.setDomReady().acc.hasClass('alt-style')) {
                                eventsProto.displayShowsProfile();
                            }

                            //uReport
                            uReportProto.uLogin(janrainProto.API.token,userProto.email,userProto.uuid);

                            //idmsLogin
                            idmsProto.idmsLogin(janrainProto.API.token,userProto.email,userProto.uuid);

                            // This is when livefyre API is done
                            if (data.result.externalServices.livefyre.livefyre_id == null || data.result.externalServices.livefyre.livefyre_id === "null" || data.result.externalServices.livefyre.livefyre_id === "") {
                                _t.update('entity.update',_t.updateAPI('livefyre_temp'));
                                /*
                                livefyreProto.API.execute(function(){
                                    log('livefyreAPI fired!',_t,_t.updateAPI({}));
                                    _t.update('entity.update',_t.updateAPI('livefyre'));
                                });
                                */
                            }

                            if (data.result.externalServices.badgeville_id == null || data.result.externalServices.badgeville_id === "null" || data.result.externalServices.badgeville_id === "") {
                                _t.update('entity.update',_t.updateAPI('badgeville_id'));
                            }

                            //BAdgeville
                            badgeProto.setUp();

                        }
                    };
                }

                $.ajax({
                    data : attr,
                    url : _t.url+entity,
                    dataType : 'script',
                    async : true,
                    cache : true
                });

            },

            /**
             * [update description] - simple update function, making a request will make updates to capture
             * @param  {string} entity - entity type, update
             * @param  {object} attr - object
             * @return {void}
             */
            update : function(entity,attr) {
                var _t = this, successCB = 'FOX_Janrain_UPD';

                attr.jsonp = successCB;

                if (typeof window[successCB] !== 'function') {
                    window[successCB] = function(data){

                    };
                }

                $.ajax({
                    data : attr,
                    url : _t.url+entity,
                    dataType : 'script',
                    async : true,
                    cache : true
                });

            }

        },

        // deprecated but who knows
        loadedJS : {

            loadJan : function() {
                if(typeof janrain === 'object'){

                    requireProto.state.janrain = true;
                    //var x = setInterval(function(){})
                    //window.janrainCaptureWidgetOnLoad();
                }
            },

            loadShare : function() {

            }
        },

        /**
         * [widgetOnload description] - essential part of janrain, Janrain is looking for this function and fires it , when janrain JS is loaded
         * @return {object} - self
         */
        widgetOnload : function() {

            window.janrainWidgetOnload = function(){
                //window.janrain.capture.ui.start();

                // fire ready state for janrain
				AUTH_Manager.fireReady("janrain");


                //window.janrainCaptureWidgetOnLoad();
            };
            return this;
        },

        /**
         * [captureWidgetOnLoad description] - initially this was a critical part of janrain, but it may appeart that it may not be the case. However, when developing
         * this what was suggested. window.janrainCaptureWidgetOnLoad is a function that janrain fires when Janrain js loads.
         * in this function we have a set of events that we add to janrain.
         * Originally it was thought that events needs to be configured in here, but they can be placed and used outside of this funcition.
         * every event can be found without the object or API page
         * @return {object} self
         */
        captureWidgetOnLoad : function() {

			window.janrainCaptureWidgetOnLoad = function() {
                var je = janrain.events;

				// fire ready state for janrain capture
				AUTH_Manager.fireReady("capture");

				//Badgeville
                //je.onCaptureBackplaneReady.addHandler(eventsProto.badgeVille.backplane);

                //------Janrain Events
                je.onCaptureLoginSuccess.addHandler(eventsProto.janrain.successfulLogin);
                je.onCaptureRegistrationSuccess.addHandler(eventsProto.janrain.successfulRegistration);
                je.onCaptureRegistrationStart.addHandler(eventsProto.janrain.registrationStart);
                je.onCaptureAccessDenied.addHandler(eventsProto.janrain.accessDenied);

                je.onAuthWidgetLoad.addHandler(eventsProto.janrain.onAuthWidgetLoad);

                //Modal
                je.onModalClose.addHandler(eventsProto.janrain.onModalClose);

                //Validation
                je.onCaptureValidationSuccess.addHandler(eventsProto.janrain.validation.onValidationSuccess);


                //-----Livefyre Set up, Crude Needs improved logic
                var livefyreDom = toolProto.domTest($('#livefyre_comment_stream')), dq = $('#disqus_thread');

                if (!livefyreDom) {

                    var lf = document.createElement('div');
                        lf.id = 'livefyre_comment_stream';

                    if (dq.length > 0) { // replace
						dq.attr("id","livefyre_comment_stream");
						dq.empty();
                        livefyreDom = true;
                    }
                    requireProto.livefyreSet = true;
                } else {
                	dq.remove(); // make sure we remove disqus
                    requireProto.livefyreSet = false;

                }

                if (livefyreDom && requireProto.janrainFlow === 'authFlow') {//we will test this if this article is good 2 go or what not
                    je.onCaptureBackplaneReady.addHandler(eventsProto.janrain.backplaneReady);//
                }

                // Janrain Profile
                je.onCaptureRenderComplete.addHandler(eventsProto.janrain.screen.onRenderComplete);
                je.onCaptureProfileSaveSuccess.addHandler(eventsProto.janrain.screen.editProfile.onProfileUpdate);
                je.onCaptureAutoSaveUpdate.addHandler(eventsProto.janrain.screen.editProfile.onProfileAutoSave);
                je.onCaptureProfileSaveFailed.addHandler(eventsProto.janrain.screen.editProfile.onProfileFailedSave);
                //je.onCaptureProfileCookieSet.addHandler(eventsProto.janrain.traditionalDisplayName);

                // Janrain Modal Events
                je.onCaptureScreenShow.addHandler(eventsProto.janrain.screen.onScreenShow); //DOM READY When rendered Screen
                je.onCaptureModalReady.addHandler(eventsProto.janrain.screen.uiReady);

                //Janrain Sessions
                je.onCaptureSessionFound.addHandler(eventsProto.janrain.sessionFound);
                je.onCaptureSessionNotFound.addHandler(eventsProto.janrain.sessionNotFound);
                je.onCaptureSessionEnded.addHandler(eventsProto.janrain.sessionEnded);
                //je.onCaptureSessionCreated.addHandler(eventsProto.janrain.sessionCreated);

                //Janrain Sessions    Master Triggere
                je.onCaptureLoginSuccess.addHandler(janrainProto.isLoggedIn.masterTrigger);
                je.onCaptureRegistrationSuccess.addHandler(janrainProto.isLoggedIn.masterTrigger);
                je.onCaptureSessionFound.addHandler(janrainProto.isLoggedIn.masterTrigger);
                je.onCaptureSessionNotFound.addHandler(janrainProto.isLoggedIn.masterTrigger);
                je.onCaptureSessionEnded.addHandler(janrainProto.isLoggedIn.masterTrigger);
                //je.onCaptureSessionCreated.addHandler(janrainProto.isLoggedIn.masterTrigger);

                //Token
                je.onCaptureExpiredToken.addHandler(eventsProto.janrain.tokenExpired);
                je.onCaptureFederateRefreshedToken.addHandler(eventsProto.janrain.onRefreshToken);

                //Share
                if (requireProto.janrainFlow === 'authFlow') {
                   //je.onShareSendComplete.addHandler(eventsProto.janrain.share.shareSendComplete);
                   // je.onShareSendComplete.addHandler(eventsProto.shareSendComplete);
                }

                //Error Handling
                je.onCaptureError.addHandler(eventsProto.janrain.errorEvent);

                //emailSent
                je.onCaptureEmailSent.addHandler(eventsProto.janrain.emailSent);

                //Essential
                window.janrain.capture.ui.start();
            };

            return this;
        },
        /**
         * [extend description] simple addhandler extender for janrain
         * @param  {string} name - namespace for janrain event EX: onCaptureProfileSaveSuccess
         * @param  {function} func - refence to a function that will fire when janrain is triggered
         * @return {void}
         */
        extend : function(name,func) {
            janrain.events[name].addHandler(func);
        },

        /**
         *  isLoggedIn object handles the logic for determining if the user is logged in or not, and what stat he is in.
         */
        isLoggedIn : {

            buffer : [],//name, func

            /**
             * [hasActiveSession description] a simple check for session with a callback. Session is obtained from janrain itself
             * @param  {function}  func - callback function
             * @return {void}
             */
            hasActiveSession : function(func){
                func(janrain.capture.ui.hasActiveSession());
            },

            /**
             * [eventDriven description] - provide an event that you want to listen to, and have a callback function ready.
             * @param  {string} type  - event you are listening to, found, not found, logout, sigin, register
             * @param  {[type]} func
             * @return {[type]}
             */
            eventDriven : function(type,func) {
                var _t = this;

                _t.buffer.push([type,func]);
            },

            /**
             * [masterTrigger description] - this function is triggered for most events when the user creates or loses a session with janrain
             * @param  {object} response - janrain object, contains token or other information
             * @return {void}
             */
            masterTrigger : function (response) {
                var _t = janrainProto.isLoggedIn;

                if (_t.buffer.length == 0) { return false;}

                var session = janrain.capture.ui.hasActiveSession(), found = false;

                for (var x = 0, l = _t.buffer.length; x<l; x+=1) {
                    switch (_t.buffer[x][0]) {
                        case 'found':
                            if (session && janrainProto.sessionType === 'found') {
                                //log('found execututed');
                                _t.buffer[x][1](session);
                                found  = true;
                            }
                            break;
                        case 'notfound':
                           if (!session && janrainProto.sessionType === 'notfound') {
                               //log('notfound execututed');
                               _t.buffer[x][1](session);
                               found  = true;
                           }
                           break;
                        case 'logout':
                            if (!session && janrainProto.sessionType === 'logout') {
                                //log('logout execututed');
                                _t.buffer[x][1](session);
                                found  = true;
                            }
                            break;
                        case 'signin':
                            if (session && (janrainProto.sessionType === 'signin')) {//} || janrainProto.sessionType === 'notfound' || janrainProto.sessionType === 'logout')){
                                //log('sigin execututed');
                                _t.buffer[x][1](session);
                                found  = true;
                            }
                            break;
                        case 'register':
                            if (session && (janrainProto.sessionType === 'register')) {// || janrainProto.sessionType === 'logout' || janrainProto.sessionType === 'notfound')){
                                //log('register execututed');
                                _t.buffer[x][1](session);
                                found  = true;
                            }
                            break;
                        default :
                            _t.buffer[x][1](session);
                            break;
                    }

                    if (found) {break;}

                }


            }
        },

        publicProfileLinkUUID : function() {

        }

    };

    /*------------------------------------
                 Badgeville
    --------------------------------------*/

	badgeConst = function() {

		var _t = badgeProto;

        /**
         *  Badgeville expects this function before badgevill JS loaded
         */
		window.BadgevilleAsynchInit = function() {
            var backplaneLogin = false;

            /**
             * [ window.Badgeville.BackplaneSubscription description ] - backplane sign in handler : Gather data about user from backplane respone
             * @param  {object} backplaneMessage - response from backplane, triggers ONLY on signin, signout and not in session : Data is img, displayname, image
             * @return {void}
             */
            window.Badgeville.BackplaneSubscription = window.Backplane.subscribe(function( backplaneMessage ) {
            	var messageState;
                try{
                    if(!backplaneMessage.message.payload.identities.entry){
                        log('Something is wrong with backplane'); return false;

                    }else{
                        log('Something is right with backplane'); return false;
                        messageState = backplaneMessage.message.payload.identities.entry;
                    }
                }catch(e){
                    log(e,'Backplane message has a problem');
                    messageState = backplaneMessage.payload.identities.entry;
                }

                var bpm  = messageState, reg = /uuid=(\S+)/gi, uuid;

                if ( backplaneMessage.type == 'identity/login' && window.Badgeville.Settings.player == null) {
                    var picture;
                    backplaneLogin = true;

                    try{
                        picture = userProto.userJanrain.photos[0].value;
                    }catch(e){picture = badgeProto.config.avatar;}
                    try {
                        uuid = bpm.id.match(reg)[0]; uuid = uuid.replace('uuid=','');

                    } catch (err) {}

                    userProto.userBadgeville = {
                        email : uuid+badgeProto.config.username,
                        display_name: bpm.displayName,
                        picture_url : picture
                    };

                    // Badgeville API to set the player with the object provided
                    window.Badgeville.setPlayer(userProto.userBadgeville);

                    //window.Backplane.unsubscribe( window.Badgeville.BackplaneSubscription );
                    //delete window.Badgeville.BackplaneSubscription;

                }
            });

            //login Without Backplane or Session based
            if (!backplaneLogin && typeof userProto.userJanrain.uuid !== 'undefined') {
                _t.events.playerSignIn();
            } else {

            }

            //Badgeville.Settings.autoReward = [ 'test', 'page read'];

            // do not commit these settings without FOX-34662 To Disable visual display of tracking events.
            window.Badgeville.Settings.backplaneLink = false;
            //window.Badgeville.crouton = function(){};
            window.Badgeville.Settings.showToast = 1;
            window.Badgeville.Settings.showWaffle = true;
            window.Badgeville.Settings.coutonShow = true;
			// FOX-34662

            //Login & Logout
            window.Badgeville.Settings.signIn = function() {

            };
            window.Badgeville.Settings.signOut = function() {

            };

            /**
             * [afterSetPlayer description] - run buffer events that badgeville related post login
             * @param  {object} event - na
             * @param  {object} data - na
             * @return {void}
             */
            window.Badgeville.afterSetPlayer = function(event,data) {//events and data appear to not show up

                if (badgeProto.buffer.length > 0) {
                   badgeProto.events.useBuffer();
                }
            	if (!_t.afterPlayerSet) {//for some reason afterSetPlayer is called twise by badgevill.e
            		_t.afterPlayerSet = true;
            		_t.socialNetworkingIntegration();
            	}

            	// this Settings.player can oly occure if the user logsIN and Player is Set
                //if (Badgeville.Settings.player) {
                    badgeProto.getBadgeFromSelf.gatherUserInfo();
                //}
            };


            window.Badgeville.ready(function() {
                var _bpReady = window.bpReady;
                _t.getBadgesFromOthers.getPlayer(_t.getBadgesFromOthers.email);
            });

        };

    };

    badgeProto = {

        config : {
            id :'badgeville',
            domain :'foxnews.com',
            username : '@user.foxnews.com',
            key : '5302cf0355a5410f0beacdf2de891c52',
            //url : 'sandbox.v2.badgeville.com/v4/badgeville-current.js?key=5302cf0355a5410f0beacdf2de891c52&domain=foxnews.com&debugInit=false',
            url : 'api.badgeville.com/v4/badgeville-current.js?key=5302cf0355a5410f0beacdf2de891c52&domain=foxnews.com&debugInit=false',
            avatar : 'http://livefyre-avatar.s3.amazonaws.com/a/anon/50.jpg'
        },

        afterPlayerSet : false,

        buffer  : [],//storing events

        setUp : function() {
            var _t = this;

            if(typeof window.Badgeville === 'undefined'){_t.loadBadgeville();
            }else{
                //window.BadgevilleAsynchInit();
            }


        },

        // loads baggeville file
        loadBadgeville : function() {
            var _t = this;
            //loading Badgevill once the Badgeville setting are all set up
            toolProto.loadExtJs(_t.config.url, _t.config.id, _t.badgeLoaded);
        },

        badgeLoaded : function() {

            if(typeof Badgeville === 'function') {
                requireProto.state.badgeville = true;

            }

        },

        credit : function(event) {
            if (typeof event !== 'object' ) {
                window.Badgeville.credit(event,function(response){

                });
            } else {
                window.Badgeville.credit(event);
            }
        },

        creditOther : function(arr) {//array,email,verb,callback function
            window.Badgeville.creditOther(arr[0],arr[1],arr[2]);
        },

        /**
         * [trigger description]  - this function handles badgeville tracking from outside of Badgeville SCOPE or outside of janrain
         * @param  {string} event - namespace for a specific badgeville event, using object as key
         * @param  {object} val - parameters and values look for badgeProto.events.tracking for more information about structure
         * @param  {string} email - uuid+badgeville email : af205b21-4a89-42a1-9ef7-d5aac7e464ba@user.foxnews.com
         * @return {void}
         */
        trigger : function(event,val,email) {
            try{log("Checking",event,(typeof window.Badgeville), janrainProto.session,(typeof window.Badgeville.ready));}catch(e){}

            if (typeof window.Badgeville === 'undefined' && !janrainProto.session ) {
                try {
                    if (typeof window.Badgeville.ready !== 'function') {
                       return false;
                    }
                }catch(e){}
            } else {
                try {
                    if (event in badgeProto.events.tracking) {
                        if (janrainProto.session) {
                            badgeProto.events.tracking[event](val,email);
                        }
                    } else {
                        log('Wrong Parameter is passed to Badgeville Credit Trigger!')
                    }
                } catch(e) {
                    log('e',e);
                }
            }
        },

        /**
         * [socialNetworkingIntegration description] - parses through the object to execute socialNetworkRelated functions
         * @return {void}
         */
        socialNetworkingIntegration : function() {
	        var _t = this, socialVendors = _t.social;

	        for(var socials in socialVendors){socialVendors[socials]();}
        },

        events : {

            // logs the badgevill user out!
            unsubscribe : function() {

                if (typeof Backplane !== 'undefined') {
                    //window.Backplane.unsubscribe( window.Badgeville.BackplaneSubscription );
                    //window.Badgeville.Settings.player = null;
                    window.Badgeville.setPlayer();
                }
            },

            // non Backplane badgevill signin
            playerSignIn : function() {
                var picture, _t = this;
                try {
                    picture = userProto.userJanrain.photos[0].value;
                } catch(e) { picture = badgeProto.config.avatar; }

                userProto.userBadgeville = {
                    email : userProto.userJanrain.uuid+badgeProto.config.username,
                    display_name: userProto.userJanrain.displayName,
                    picture_url : picture
                };
               window.Badgeville.setPlayer(userProto.userBadgeville);
            },

            // Whatcounts events before registering and pushed throught this, to asssign right points later, when user is created
            useBuffer : function() {

                try{
                    if(typeof window.Badgeville.ready === 'function'){


                        for(var x = 0,l = badgeProto.buffer.length; x<l; x+=1){
                            if(badgeProto.buffer[x] === 'newsletterSub'){
                                for(var realm in whatCProto.config.subscribeList){
                                    if(whatCProto.config.subscribeList[realm].length >0){
                                        for(var z = 0, l = whatCProto.config.subscribeList[realm].length; z < l; z+=1){
                                            var idList = whatCProto.config.subscribeList[realm][z];

                                            badgeProto.trigger(badgeProto.buffer[x],realm+idList);
                                        }
                                    }
                                }
                            }else{
                                badgeProto.trigger(badgeProto.buffer[x]);
                            }

                        }

                        badgeProto.buffer = [];
                    }
                }catch (e){
                    setTimeout(badgeProto.events.useBuffer,500);
                }

            },

            playerSignOut : function(e){

            },

            playerUpdate : function(e,o){

            },

            // current badgeville tracking events
            tracking : {
                chat : function() { badgeProto.credit({"verb" :"chat","siteID":window.location.href}); return this;},//integrated
                viewVideo : function(videoID) { badgeProto.credit({"verb": "view videos on the site", "videoID" : videoID}); return this;},
                completeProfile : function(uuid) { badgeProto.credit({"verb" : "completed profile", 'uuid' : uuid}); return this;}, //integrated
                friendTag : function() { badgeProto.credit({"verb" : "friend tag"}); return this;}, //integrated
                spank : function(arr) { badgeProto.creditOther(arr); return this;}, //integrated
                commentLike : function(arr) { badgeProto.creditOther(arr); return this;},//integrated
                contentShare  : function(articleId) { badgeProto.credit({"verb":"share","articleid_type":articleId}); return this;}, //integrtated
                newsletterSub : function(whatCountsListID,email) {
                    if(typeof whatCountsListID === 'object'){
                        try{if(email && email !== userProto.userJanrain.email){return false;}}catch(e){}
                        for(var realm in whatCountsListID){
                            var l = whatCountsListID[realm].length;

                            if(l > 0){
                                for(var z = 0; z < l; z+=1){
                                    var timeOut = setTimeout;
                                    timeOut(BadgevilleNewsletter(realm,whatCountsListID[realm][z],timeOut),100);
                                }
                            }
                        }
                        function BadgevilleNewsletter(realm,id,time){
                            badgeProto.credit({"verb" : "newsletter subscription" , "newsletterID" : realm + id});
                            clearTimeout(time);
                        }
                    }else{
                        if(typeof email === 'undefined'){
                            badgeProto.credit({"verb" : "newsletter subscription" , "newsletterID" : whatCountsListID});
                            return this;
                        }else {
                            try{
                                if(email === userProto.userJanrain.email){
                                    badgeProto.credit({"verb" : "newsletter subscription" , "newsletterID" : whatCountsListID});
                                    return this;
                                }
                            }catch(e){}
                        }
                    }
                    return this;
                },
                ureportApproved : function(ureportMediaID) { badgeProto.credit({"verb" : "ureport approved" , "uReportMediaID" : ureportMediaID }); return this;}, //integrated outside
                returnEightPerMonth : function() { badgeProto.credit('visits'); return this;} //integated
            },

            chatCheck : function() {
                if((window.location.host.indexOf('live') > -1) || (window.location.href.indexOf('/live-event') > -1) || (window.location.href.indexOf('/sunday-housecall') > -1)){
                    badgeProto.buffer.push('chat');
                }
            }
        },

        social : {

            facebook : function() {
            	try {
	                FB.Event.subscribe('edge.create',
	                    function(response) {
	                        badgeProto.trigger('contentShare',window.location.href+'#facebook');
	                        janrainProto.API.update('entity.update',janrainProto.API.updateAPI('share'));
	                    }
	                );
            	} catch(e) {}
            },

            twitter : function() {
            	try {
	                twttr.events.bind('tweet', function(event) {
	                    badgeProto.trigger('contentShare',window.location.href+'#twitter');
	                    janrainProto.API.update('entity.update',janrainProto.API.updateAPI('share'));
	                });
            	} catch(e) {}
            },

            google : function() {

            },

            linkedIn : function() {

            }

            },

            // everything that is realte to obtaining badgville date from non-signedIn user
            getBadgesFromOthers : {

                // store badgeville's response here
                tempUser : {},
                email : '', // store that temp email here  from janrain: uuid@+@user.foxnews.com

                // coming from displayPublicProfile
                turnIdToEmail : function(uuid) {
                    this.email = uuid+badgeProto.config.username;
                },

                /**
                 *
                 * @param email - string uuid+@user.foxnews.com
                 */
                getPlayer : function(email) {
                    var _t = this, rank = $('.rank');

                    window.Badgeville.getPlayer(email, function(playerObject) {
                        console.log('playerOBject Executed!', playerObject);
                        var imgBadge = rank.find('div'), titleBadge = rank.find('span'),
                            level = playerObject.level.name.toLocaleLowerCase()    ;

                        rank.find('img').remove();
                        rank.addClass(level);
                        titleBadge.text(playerObject.level.name);
                        imgBadge.show();
                        titleBadge.show();

                        _t.tempUser = playerObject;
                    });
                }
            },

        getBadgeFromSelf : {
            user : {},
            domElements : {},
            getDom : function () {
                var _t = this,
                    badgeStat = $('.badge-stats'),
                    iconBadge = badgeStat.find('> div:eq(0)'),
                    stats     = badgeStat.find('.stats'),
                    rank      = stats.find('ul > li:eq(0) > span:last-child'),
                    points    = stats.find('ul > li:eq(1) > span:last-child'),
                    nextLevel = stats.find('ul > li:eq(2) > span:eq(1)'),
                    nextLevelIcon = stats.find('ul > li:eq(2) > .next-level'),
                    barCount  = badgeStat.find('.bar-cont'),
                    bar       = barCount.find('.bar'),
                    percntBar = bar.find('span'),
                    percent   = barCount.find('> span:eq(0)'),
                    howItWork = barCount.find('> a:eq(0)'),
                    howModal  = $('#how-to'),
                    howClose  = howModal.find('> a');

                _t.domElements = {
                    badgeStat : badgeStat,
                    iconBadge : iconBadge,
                    stats     : stats,
                    rank      : rank,
                    points    : points,
                    nextLevel : nextLevel,
                    nextLevelIcon : nextLevelIcon,
                    barCount  : barCount,
                    bar       : bar,
                    percntBar : percntBar,
                    percent   : percent,
                    howItWork : howItWork,
                    howModal  : howModal,
                    howClose  : howClose

                };

                _t.editProfileBehaviors.domElements = _t.domElements;
                _t.editProfileBehaviors['self']= _t;
                _t.editProfileBehaviors.howItWorksBehaviors.domElements = _t.domElements;
                _t.editProfileBehaviors.howItWorksBehaviors['self']= _t;

                return _t;
            },

            gatherUserInfo : function () {
                var _t = this;

                _t.getDom();
                _t.user = Badgeville.Settings.player;
                _t.updateEditPrivateProfile()
            },

            updateEditPrivateProfile : function () {
                var _t = this, dom = _t.domElements, user = _t.user;

                dom.badgeStat.addClass(user.level.name.toLowerCase());
                dom.rank.html(user.level.name);
                dom.points.html(user.points_all);
                dom.nextLevel.html(user.next_level.name);

                _t.editProfileBehaviors.calculatePercentage();
                _t.editProfileBehaviors.getModal();
                _t.editProfileBehaviors.howItWorksBehaviors.close();

            },

            editProfileBehaviors : {
                calculatePercentage : function () {
                	var _t = this, dom = _t.domElements, user = _t['self'].user, percentage;

                    var levels = {
                        Apprentice : 250,
                        Specialist : 1500,
                        Commentator : 5000,
                        Pundit : 10000,
                        Analyst : 30000,
                        Adviser : 60000,
                        Captain : 1000000
                    };

                    switch(user.level.name) {
	                    case 'Rookie' :
	                        percentage  = (((user.points_all) * 100) / levels.Apprentice).toFixed(2);
	                        break;
	                    case 'Apprentice' :
	                        percentage  = (((user.points_all - levels.Apprentice) * 100) /
	                                        (levels.Specialist - levels.Apprentice)).toFixed(2);
	                        break;
	                    case 'Specialist' :
	                        percentage  = (((user.points_all - levels.Specialist) * 100) /
	                                        (levels.Commentator - levels.Specialist)).toFixed(2);
	                        break;
	                    case 'Commentator' :
	                        percentage  = (((user.points_all - levels.Commentator) * 100) /
	                                        (levels.Pundit - levels.Commentator)).toFixed(2);
	                        break;
	                    case 'Pundit' :
	                        percentage  = (((user.points_all - levels.Pundit) * 100) /
	                                        (levels.Analyst - levels.Pundit)).toFixed(2);
	                        break;
	                    case 'Analyst' :
	                        percentage  = (((user.points_all - levels.Analyst) * 100) /
	                                        (levels.Adviser - levels.Analyst)).toFixed(2);
	                        break;
	                    case 'Adviser' :
	                        percentage  = (((user.points_all - levels.Adviser) * 100) /
	                                        (levels.Captain - levels.Adviser)).toFixed(2);
	                        break;
	                    case 'Captain' :
	                        percentage  = 100;
	                        break;
	                }

                    dom.percntBar.css({'width': percentage+'%'});
                    dom.percent.html(percentage+'%');

                },

                getModal : function () {
                    var _t = this, dom = _t.domElements, user = _t['self'].user;
                    dom.howItWork.bind('click', function () {
                        dom.howModal.css('display', 'block');
                        return false;
                    });
                },

                howItWorksBehaviors : {
                    close : function () {
                        var _t = this, dom = _t.domElements, user = _t['self'].user;
                        dom.howClose.bind('click', function () {
                            dom.howModal.hide();
                            return false;
                        });
                    },

                    getHowManyPlayersInRank : function () {

                    }
                }
            }
        }
    };

	/*--------- End of Badgeville-------------------------*/

    /*--------------------------------------------------
                Start of LIVEFYRE
    ------------------------------------------------- */

    livefyreConst = function() {

        // executed before livefyreProto
		if ( typeof LF !== 'undefined') {
           livefyreProto.commentsCount(true);
        } else {
           livefyreProto.commentsCount(false);
        }
    };

    livefyreProto = {
        conv : null,
        url  : CONFIG.livefyre.jsURL,
        config  : [],//storing configuration here
        network : CONFIG.livefyre.network,
        eventsDelegate : null,//Actual object for Login/Logout call this
        commentsNumber : 0,
        // https://github.com/Livefyre/livefyre-docs/wiki/Customizing-Comments-3-Strings
        customStrings : {
            sortLabel: "SORT BY"
        },

        init : function (argument) {
            // body...
            var _t = this;
            if(typeof fyre !== 'object'){
                toolProto.loadExtJs(livefyreProto.url,'',livefyreProto.lfLoaded);
            }
        },

        // proper livefyre initalization
		lfLoaded : function() {

            // backplane response
            livefyreProto.eventsDelegate  = new fyre.conv.BackplaneAuthDelegate(window.Backplane);

            // livefyre event driven code
            livefyreProto.events.eventsDelegate();

            // essential meta data for livefyre, without it livefyre will not work
            livefyreProto.grabMetaData();
        },

        // grab metaDAta from meta Tags
        grabMetaData : function  (argument) {
            // body...
            var _t = this, holder = {}, arr = [], meta = $('meta[name="livefyreconfig"]'), betaTest=false,siteId;

            if (meta.attr('siteId')) {siteId = meta.attr('siteId')} else { siteId = CONFIG.livefyre.siteid;}
            if (meta.length > 0) {//temp
                holder = { //will be dom requests
                    el : CONFIG.livefyre.el,
                    siteId : siteId,
                    checksum  : meta.attr('checksum'),
                    articleId : meta.attr('articleId'),
                    collectionMeta : meta.attr('collectionmeta')
                };

            } else {
                holder = { //this is local
                    collectionMeta : 'eyJ0eXAiOiJqd3QiLCJhbGciOiJIUzI1NiJ9.eyJ0aXRsZSI6Iih0ZXN0aW5nIDMgMiAxKSBUaGlzIGlzIGFuIG90aGVyIHRlc3QgdGl0bGUuIiwidXJsIjoiaHR0cDpcL1wvZXhhbXBsZS5jYnMuY29tXC9leGFtcGxlMi5odG1sIiwidGFncyI6IiIsImFydGljbGVJZCI6InRlc3RpbmcxMjM0IiwiY2hlY2tzdW0iOiJlNzI0YjFkMGRjOTZmZjQ4NjcxN2EwNzkyOGU2YjU4MCJ9.3ywwCkxPrLxt0fzCTg6yqNlr79jep6IOaSJYS_jNEUk',
                    checksum : 'e724b1d0dc96ff486717a07928e6b580',
                    siteId : '303683',
                    articleId : 'testing1234',
                    el : 'livefyre_comment_stream'
                };
                betaTest = true;
            }

            if (!betaTest) {

                // metaData to be used for setting up Livefyre
                livefyreProto.config.push(holder);

                // !actual execution of livefyre
                _t.setUpLiveFyre();
            }

        },

        // this is the actuall execution of livefyre!
        setUpLiveFyre : function() {

            var _t  = this;

			var customeString = _t.customStrings;

            // livefyreProto.eventsDelegate comes form events.eventsDelegate
            _t.conv = fyre.conv.load({"strings": customeString, "network": _t.network, "authDelegate": livefyreProto.eventsDelegate}, _t.config, livefyreProto.events.doLivefyreAuth);
			//log('config', _t.grabMetaData, ' :: ', 'livefyreProto', livefyreProto.eventsDelegate, ' :: ', 'liveFAuth', livefyreProto.events.doLivefyreAuth);
           // _t.conv = fyre.conv.load({"network": _t.network, "authDelegate": livefyreProto.eventsDelegate}, _t.config, livefyreProto.events.doLivefyreAuth);
        },

        commentsCount : function(found) {
            console.log('FOUND');
            var spanWithCount = $('span.livefyre-commentcount'),
                LF = function() {
                    console.log('LF FIRED',(LF in window));
                    if ('LF' in window) { console.log('FIRE THE LASER');
                        try {
                            if (window.FOX_metadescriptor.name['prism.section'] === 'nation') {
                                window.LF.CommentCount({
                                    replacer: function(element, count) {
                                        element.innerHTML = count;
                                    }
                                });
                            } else {
                                window.LF.CommentCount({
                                    replacer: function(element, count) {
                                        element.innerHTML = count +' Comment'+ (count === 1 ? '' : 's');
                                    }
                                });
                            }
                        } catch (e) { console.log('error occured in comments number',e)}


                    }
                };

            if (spanWithCount.size() > 0 ) {
                console.log('found',found);
                if (found) {
                    try {
                        if (window.FOX_metadescriptor.name['prism.section'] === 'nation') {
                            window.LF.CommentCount({
                                replacer: function(element, count) {
                                    element.innerHTML = count;
                                }
                            });
                        } else {
                            window.LF.CommentCount({
                                replacer: function(element, count) {
                                    element.innerHTML = count +' Comment'+ (count === 1 ? '' : 's');
                                }
                            });
                        }
                    } catch (e) { console.log('error occured in comments number',e)}
                } else {
                    console.log('GOT HERE LETS ROLL');
                    toolProto.loadExtJs('zor.livefyre.com/wjs/v1.0/javascripts/CommentCount.js','lfExtCom',LF);
                }
            }

        },

        events : {

            eventsDelegate : function  (argument) {

                // This is livefyre's events and methods that we use to call to interact with the livefyre windget without the API
                // https://github.com/Livefyre/livefyre-docs/wiki/Backplane-1.2-Integration
                var ed = livefyreProto.eventsDelegate; //adding methods unto a constructor

                    ed.login = function(delegate) {

				       //eventsProto.janrain.signin();
                       //window.Backplane.expectMessages('identity/login');
                       //data.success();

                        var successCallback = function() {
                            delegate.success();
                            janrain.events.onCaptureLoginSuccess.removeHandler(successCallback);
                            janrain.events.onModalClose.removeHandler(failureCallback);
                        };

                        var failureCallback = function() {
                            delegate.failure();
                            janrain.events.onModalClose.removeHandler(failureCallback);
                            janrain.events.onCaptureLoginSuccess.removeHandler(successCallback);
                        };

                        eventsProto.janrain.signin();
                        window.Backplane.expectMessages('identity/login');
                        // These should only bind and fire once.
                        // Janrain doesn't seem to provide an API for this, we need to wrap and remove handler
                        janrain.events.onCaptureLoginSuccess.addHandler(successCallback);
                        janrain.events.onModalClose.addHandler(failureCallback);

                    };

                    ed.logout = function(delegate) {

                        eventsProto.janrain.signOut();
                        fyre.conv.BackplaneAuthDelegate.prototype.logout.call(ed, delegate);

                        window.livefyreLogout = function(){

                            fyre.conv.BackplaneAuthDelegate.prototype.logout.call(ed, delegate);
                        };

                        janrain.events.onCaptureSessionEnded.addHandler(livefyreLogout);
                    };

                    ed.viewProfile = function(view,user,el) {

                        if(user.id.indexOf('twitter') > -1 || user.id.indexOf('facebook') > -1){return false;}
                            var id = user.id.split('@')[0];
                            eventsProto.janrain.displayPublicProfile(id);
                    };

                    ed.editProfile = function(edit) {

                        eventsProto.editProfile();//calls editProfile
                    };

                    //janrain.engage.share
                    ed.share = function(data) {

                       data.success();
                    };

            },

            // livefyre event listeners - information can be found here https://github.com/Livefyre/livefyre-docs/wiki/
            doLivefyreAuth : function(widget) {// When Lifefyre loaded USe this to get additional data such as count and


               // livefyreProto.commentsNumber = widget.commentCount.collection.attributes.numVisible;


                widget.on('commentShared',function (data) {

                   badgeProto.trigger('contentShare',data.targetId);
                   janrainProto.API.update('entity.update',janrainProto.API.updateAPI('share'));
                });

                widget.on('commentPosted',function (data) {

                    omnitureProto.commentPost();

                    //BadgeVille
                    if (data.bodyHtml.indexOf('fyre-mention-twitter') > -1 || data.bodyHtml.indexOf('fyre-mention-facebook') > -1) {
                        $.loadAttempt(60,200,function() {return $('.fyre-modal').size() > 0 ? true : false;}, function() {

                            var modal = $('.fyre-modal');
                            modal.find('.goog-buttonset-default').click(function() {
                                badgeProto.trigger('friendTag');
                            });
                        });
                    }
                    //livefyreProto.publicProfile();
                });

                widget.on('commentLiked',function (data) {

					var id = data.targetAuthorId.split('@')[0], email = id+'@user.foxnews.com', articleID = data.targetId,
	                    uniqueComment = id+articleID, verb = {"verb" : "comment like", "comment_id" : uniqueComment},
	                    func  = function(data){log('DO WE HAVE CONNECTION?',data);};

                    badgeProto.trigger('commentLike',[email,verb,func])

                });

                widget.on('commentFlagged',function (data) {

                    var id = $('#fyre-message-'+data.targetId).find('.fyre-comment-user').attr('data-author-id').split('@')[0],email = id+'@user.foxnews.com',
                    verb = {"verb" : "spank"},
                    func  = function(data){log('DO WE HAVE CONNECTION?',data);};

                    badgeProto.trigger('spank',[email,verb,func])
                });

                widget.on('commentCountUpdated',function (data) {

                    livefyreProto.commentsNumber = data;
                    var commentNumber = $('.user-interaction > li.comments'), nationCount = $('.comment-count');

                    console.log('TRIGGER',data);
                    nationCount.find('span').html(data);

                    commentNumber = (commentNumber.size() > 0) ? commentNumber : $('.post-footer .comments');
                    /*
                    $.loadAttempt(250,150,function(){  log("$('.post-footer .comments')");
                        return ($('.post-footer .comments').size() > 0) ? true : false;
                    },function(){
                        commentNumber =  $('.post-footer .comments');
                    });
                   */

                    if (commentNumber.size() > 0) {
                        if (commentNumber.css("display") === 'none') {
                            if (commentNumber.find('span').size() == 0) {
                                commentNumber.find('a').html('<span></span> '+data+' Comments');
                            } else {
                                commentNumber.find('a').html(data+' Comments');
                            }

                            commentNumber.css({'display':'block'});
                        } else {
                            if (commentNumber.find('a > span').size() > 0) {
                                commentNumber.find('a').html('<span></span> '+data+' Comments');
                            } else {
                                commentNumber.find('a').html(data+' Comments');
                            }
                        }
                    } else {
                        try {
                            if (window.FOX_metadescriptor.name['prism.subsection1'] === 'willisreport') {
                                commentNumber = $('.post-footer > .comments');

                                if (commentNumber.size() > 0) {
                                    commentNumber.find('a').html(livefyreProto.commentsNumber+' Comments');
                                }
                            }
                        } catch(e) {}
                    }

                    //livefyreProto.publicProfile();
                });

                widget.on('initialRenderComplete',function (data) {

					if (window.FOX_LivefyreIntegrationService) { // integration stuff
						FOX_LivefyreIntegrationService.isReady();

                	}

                    eventsProto.livefyre.displayLogo();
                    eventsProto.livefyre.hashComment();
                    livefyreProto.events.omniture();
                    /*
                        if(!janrainProto.session){
                            log('LOGOUT CALLED FOR LIVEFYRE');
                            //fyre.conv.BackplaneAuthDelegate.prototype.logout();
                            setTimeout(function(){
                                livefyreProto.eventsDelegate.logout();
                                fyre.conv.BackplaneAuthDelegate.prototype.logout();
                                window.Backplane.expectMessages('identity/logout');
                            },500);

                        }
                    */
                    var commentNumber = $('.user-interaction > li.comments');

                    if (commentNumber.size() > 0) {
                        if (commentNumber.css("display") === 'none') {
                            if (commentNumber.find('a > span').size() > 0) {
                                commentNumber.find('a').html('<span></span> '+livefyreProto.commentsNumber+' Comments');
                            } else {
                                commentNumber.find('a').html(livefyreProto.commentsNumber+' Comments');
                            }
                            commentNumber.css({'display':'block'});
                        } else {
                            if (commentNumber.find('span').size() == 0) {
                                commentNumber.find('a').html('<span></span> '+livefyreProto.commentsNumber +' Comments');
                            } else {
                                commentNumber.find('a').html(livefyreProto.commentsNumber +' Comments');
                            }
                            commentNumber.css({'display':'block'});
                        }
                    } else {
                        try {
                            if (window.FOX_metadescriptor.name['prism.subsection1'] === 'willisreport') {
                                commentNumber = $('.post-footer > .comments');

                                if (commentNumber.size() > 0) {
                                    commentNumber.find('a').html(livefyreProto.commentsNumber+' Comments');
                                }
                            }
                        }catch(e){}
                    }

                    //livefyreProto.publicProfile();
                    //setInterval(livefyreProto.publicProfile,15000);
                });
            },

            omniture: function() {
                var dom = {
                    showMore : $('.fyre-stream-more-container'),
                    displayComments : $('.comments')
                };

                dom.showMore.bind('click',function() {
                    omnitureProto.commentLoad();
                });

                dom.displayComments.bind('click',function() {
                    omnitureProto.commentLoad();
                });


            }
        },

        API : {

            configUrl : function(uuid,cb) {
                var url = CONFIG.livefyre.activityAPI;

                return url.replace('{uuid}',uuid).replace('{cb}',cb);
            },

            /**
             * [displayDataToPublicProfile description] - ajax request to Livefyre and grabing user's information by providing a UUID
             * @param  {string} uuid - uuid from janrain and livefure interconnection
             * @return {void}
             */
            displayDataToPublicProfile : function(uuid) {
                var _t = this, callBack = 'FOX_Livefyre_PublicRequest';

                window[callBack] =  window[callBack] || function(response) {


                    userProto.commentCount = response.data.user_comment_count;
                    userProto.likeCount = response.data.user_liked_count;
                    userProto.rating = response.data.user_rating;

                    eventsProto.livefyre.populatePublicProfile();
                };

                $.ajax({
                    url : _t.configUrl(uuid,callBack)+'&userInfoFormat=true',//CONFIG.livefyre.activityPublicRequestAPI
                    dataType : 'script',
                    data : {cb : cacheBuster(5)},
                    async : true,
                    cache : true
                });

            },

            /**
             * [onProfileUpdate description] -- this is a simple request to livefyre, to update the user;s image and other information it does not return anything, request is enough
             * @return {void}
             */
            onProfileUpdate : function() {
            	var url = CONFIG.livefyre.apiProfile,
                    cb  = 'FOX_livefyreProfileUpdate';

                window[cb] = function(data){

                };

                $.ajax({
                    url : url+janrainProto.API.token+'&callback='+cb,
                    dataType : 'script',
                    async : true,
                    cache : true
				});
			},

			//  change the state of login button in livefyre to different states when user logs in from janrain singIn screen
			onLoginSuccessFromJanrain: function() {
				var commentDiv = $("#livefyre_comment_stream");

				// change the "sign in" button to "signing in..." - FOX-29997
				// While waiting for the livefyre system to log the user in, the user should be notified of the action
				var loggedOut = commentDiv.find(".fyre-widget .fyre-auth .fyre-login-bar .fyre-user-loggedout"), sText = "Signing In...";

				$.loadAttempt(250,150,function() {
					return (loggedOut && loggedOut.text() !== sText) ? true : false;
				},function() {
					loggedOut.text(sText);
				});


			}

		},

        // activity tab object applies to Private and Public Edit Profiles under the tab of Activity
        // also it is important to keep in mind that janrain redraws the template after a sucessfull update of a profile
        // this is not the case for a public one, since janrain's authentication is not required
        activityTab : {

            configUrl : function(uuid,cb) {

                var url = (requireProto.janrainFlow  === 'profileFlow') ? CONFIG.livefyre.activityAPI : CONFIG.livefyre.activityActiveAPI;

                return url.replace('{uuid}',uuid).replace('{cb}',cb);
            },
            uuid:null,
            location:null,
            activityWraper : null,
            domStorage : null,
            ajaxRequestsTries : 3,
            currentNumberAttempts : 0,
            maxCommentsGrab : 10,
            curTime : function(){ return window.AKAMAI_TIME_HELPER.getCurrent();},
            backup : null,
            user : {
                name : null,
                image : null
            },

            initCallFromJanrain : function() {

                var _t = this;
                _t.cloneMarkUp();
            },

            cloneMarkUp : function() {
                var _t = this;

                var livefyreTemplate = $('#livefyre-wrap'),
                    livefyreCloned   = livefyreTemplate.clone();
                _t.activityWraper = livefyreCloned;
                livefyreTemplate.remove();

                $('#account-wrap').before(livefyreCloned);
                _t.tabActivity();
                _t.gatherData();

            },

            // manages activity tab clicks and such
            tabActivity : function () {
                eventsProto.domEvents.tabControlsForActivityPages();
            },

            assessDom : function() {
                var _t = this;

                if(_t.dom == null){
                var structure = $('#livefyre-Activity').find('.livefyre-pro-activity'), ul = structure.find('ul');
                //ul.html('');
                    _t.dom = {
                    image: $('#livefyre-pro-image').find('> img'),
                    ul : ul,
                    name : structure.find('h1'),
                    body_plain : 'comment',
                    url : 'link',
                    created_at : 'time',
                    conv_title : 'whereTitle',
                    structure : structure
                };
                }

                return _t.dom;
            },

            dom: null,

            manageDomCopy : function() {
                var _t = this, copy = _t.activityWraper, str = copy.find('.livefyre-pro-activity'),
                    ul = str.find('.prof-activity ul');
                    //ul.html('');

                return {
                    image :copy.find('#livefyre-pro-image').find('> img'),
                    ul : ul,
                    name : str.find('h1')
                };
            },

            gatherData : function(uuid,location) {
                var _t = this, callBack = 'FOX_liveFYRE_Activity',
                    uuid = uuid || userProto.uuid,
                    loc = location || 'private';
                _t.uuid = uuid;
                _t.location = loc;

                if (typeof uuid === 'undefined') return false;

                _t.location = location || 'private';

                if (_t.location === 'private') {_t.gatherNameAndImage();}

				if (!window[callBack]) {
					window[callBack] = function(response){
						_t.populateMarkup(response);
						//_t.currentNumberAttempts+=1;
					};
				}


                $.ajax({
                    url : _t.configUrl(uuid,callBack),
                    dataType : 'script',
                    data : {cb : cacheBuster(5)},
                    async : true,
                    cache : true
                });

            },

            hashTagGatherer : function() {
                var _t = this,hash = window.location.hash;

                if (hash === '') { return _t;}

                _t.user.name = hash.replace('#','');

                //HashChanged do stuff here

                return _t;

            },

            hachChanged : function() {

            },

            getPhotosAndId : function() {
                var _t = this;

                if (_t.user.name === '' || _t.user.name == null) {_t.populateResponce({response:{status:'fail'}}); return false;}

                $.ajax({
                    url : CONFIG.janrain.publicRequestAPI+ _t.user.name,
                    dataType : 'json',
                    data : {cb : cacheBuster(5)},
                    async :true,
                    cache : true,
                    success : function(response) {
                        _t.populateResponce(response);
                    }
                });

            },

            populateResponce : function(responce) {
                var _t = livefyreProto.activityTab;

                if (responce.status !== 'ok') {

                    var dom = _t.assessDom();
                    dom.image.parent().hide();
                    dom.structure.html('User not found! Please make sure that the user is correct');
                    return false;
                }
                if (responce.result.photos.length > 0) {
                    _t.user.image = responce.result.photos[2].value;
                } else {
                    _t.user.image = 'http://cdn.quilt.janrain.com/2.1.2/profile_default.png';
                }
                _t.uuid = responce.result.uuid;

                _t.gatherData(_t.uuid,'public');

            },

            gatherNameAndImage : function() {
                var _t = this;

                switch (_t.location) {
                    case 'private':
                        _t.user.name = userProto.userJanrain.displayName;

                        if(userProto.userJanrain.photos.length > 0){
                            _t.user.image = userProto.userJanrain.photos[2]["value"]
                        }else{
                            _t.user.image = 'http://cdn.quilt.janrain.com/2.1.2/profile_default.png';
                        }

                        break;
                    case 'public':
                        _t.obtainDataFromExternalJanrain();
                        break;
                    default :
                        break;
                }
            },

            obtainDataFromExternalJanrain : function() {

            },

            /**
             * [populateMarkup description] - response from livefyre, livefyre has a bizzare tendency to change code error so watch out if this fails on you!
             * @param  {object} response - livefyre's object
             * @return {void}
             */
            populateMarkup : function(response) {
            	var _t = livefyreProto.activityTab,
                	liStorage=[], curTime = _t.curTime();


            	if (response.code === 404) {
                    var dom = _t.assessDom();
                    dom.image.parent().hide();
                    dom.structure.html('User not found! Please make sure that the user is correct');
                    return false;

                } else if (response.code !== 200) {
                    _t.gatherData(_t.uuid,_t.location);
                }

            	if (response.data.length == 0) {
                    var dom = _t.assessDom();
                    dom.image.parent().hide();
                    dom.structure.html('User has no comments');
                    return false;
                }


            	if (response.code === 200 && requireProto.janrainFlow) {
						var comments = response.data, max = 10, len = comments.length;

						// max only
						len = (len > max) ? max : len;

						var populateFeed = function(comments) {
							var arr = [], commentTime = new Date(_t.correctingCommentTime(comments.created_at)),
								timeDiffence = _t.createdSinceTime(commentTime,curTime);

								arr.push('<li><div>');
								arr.push('<p>'+manageBodyHtml(comments.body_html)+'</p>');
								arr.push('<span>'+timeDiffence.str+' <a href="'+comments.url+'" >'+comments.conv_title+'</a></span>');
								arr.push('</div><a href="'+comments.url+'"'+' >View</a></li>');

							function manageBodyHtml(html) {
								var body = $('<div/>').html(html);

	                            if(body.find('span').length > 0){
	                                body.find('span').each(function(){
	                                	var el = $(this), name = el.text();
                                    	el.text('@'+name);
                                        el.wrap('a');
	                                    if(el.attr('provider') !== 'livefyre'){
	                                        var link = el.attr('profile_url');

	                                        el.parent().attr('target','_blank');
	                                        el.parent().attr('href',link);
	                                    }else{
	                                        el.parent('a').removeAttr('href');
	                                    }
	                                });
	                                return body.html();
	                            }else{
	                            	return html;
	                            }


	                        }

							return (arr.join(""));
						};

						for ( var x = 0; x < len; x+=1 ) {
							liStorage.push(populateFeed(comments[x]));
						}

						liStorage= liStorage.join('');

						if (_t.location === 'private') {
							var domCopy = _t.manageDomCopy();
							domCopy.ul.html(liStorage);
							_t.insertNewMarkupIntoTab();
						} else {
							var dom = _t.assessDom();
							dom.ul.html(liStorage);
							_t.insertNewMarkupIntoTab();
						}

            	}

            },

            // creates a public profile on a found user in livefyre feeed
            parseThroughSpan : function() {
                $('.prof-activity > ul').find('li').each(function() {
                    var el = $(this);

                    el.find('span').each(function() {
                       var it = $(this);

                        if(it.attr('provider') === 'livefyre'){
                            var uuid = it.attr('jid').split('@')[0];
                            it.parent('a').removeAttr('href');
                            //userProto.uuid = uuid;

                            it.bind('click',function() {
                                janrain.capture.ui.getPublicProfile('publicProfile',uuid);
                            });
                        }
                    });
                });

            },

            // after clone thing this is implemented i think
            insertNewMarkupIntoTab : function() {
                var _t = this;

                if(_t.location === 'public') {
                    var dom = _t.assessDom();

                    dom.name.html(_t.user.name);
                    dom.image.attr('src',_t.user.image);
                } else {
                    var  domCopy = _t.manageDomCopy();
                    domCopy.name.html(_t.user.name);
                    domCopy.image.attr('src',_t.user.image);
                }

                _t.parseThroughSpan();

            },

            correctingCommentTime : function(comTime) {
            	// We're comparing via EST, so if Daylight's saving time is in effect, we need to adjust the GMT comparison
            	var isDST = window.AKAMAI_TIME_HELPER.isDST(), diff = "GMT" + ((isDST.val) ? "+100" : "-000");

            	var sp = comTime.split("T"), dateStr = sp[0], timeStr = sp[1];
				   //2012-11-29T18:21:55
            	// correct date
            	dateStr = dateStr.split("-");
            	dateStr = [dateStr[1],dateStr[2],dateStr[0]].join("/");

            	var date = new Date([dateStr,timeStr,diff].join(" "));

            	return date;
            },

            createdSinceTime : function(val,currentTime) {
            	var _t = this, time = val, str = false;

                if (!time) { return { str:"",val:false }; }

                var timeAgo = _t.dayDifferences(currentTime,time), strArr = [];

                var plural = function(str,val) {
						var ret = " " + str + ((val > 1) ? "s" : "")
                	return ret
                };

                var makePositive = function(time){
                    return time < 0 ? time * -1 : time;
                };

                if (timeAgo.s < 0) {
                	str = "Just Now on";
                    // str = 'Just now';
                } else if (timeAgo.m == 0 && timeAgo.d == 0 && timeAgo.h == 0) {

                	strArr.push(timeAgo.s + plural("second",timeAgo.s));

                } else if (timeAgo.m < 60 && timeAgo.h == 0 && timeAgo.d == 0) {

                	strArr.push(timeAgo.m + plural("minute",timeAgo.m));
                	if (timeAgo.s > 0) {
                		strArr.push(timeAgo.s + plural("second",timeAgo.s));
                	}


                } else if (timeAgo.h >= 1 && timeAgo.d == 0  ) {

                	strArr.push(timeAgo.h + plural("hour",timeAgo.h));
                	if (timeAgo.m > 0) {
                		strArr.push(timeAgo.m + plural("minute",timeAgo.m));
                	}

                } else if (timeAgo.d >=1 && timeAgo.d <= 30) {

                	strArr.push(timeAgo.d + plural("day",timeAgo.d));
                	if (timeAgo.h > 0) {
                		strArr.push(timeAgo.h + plural("hour",timeAgo.h));
                	}


                } else if (timeAgo.d > 30 && timeAgo.d <= 365) {
                    var month = Math.floor(timeAgo.d / 30), days = timeAgo.d % 30;

                    strArr.push(month + plural("month",month));
                    if (days > 0) {
                    	strArr.push(days + plural("day",days));
                    }

                } else if (timeAgo.d > 365) {
                    str = "1 year ago on";
                } else if (timeAgo.d > 730) {
                    str = "Many years ago on";
                }

                str = (str) ? str : (strArr.join(", ") + " ago on");

                var obj = { str:str,val:val };
                return obj;
            },

            dayDifferences : function(curDate,oldDate) {
                var diff = Date.parse( curDate ) - Date.parse( oldDate );

                return isNaN( diff ) ? NaN : {
                    diff : diff,
                    ms : Math.floor( diff            % 1000 ),
                    s  : Math.floor( diff /     1000 %   60 ),
                    m  : Math.floor( diff /    60000 %   60 ),
                    h  : Math.floor( diff /  3600000 %   24 ),
                    d  : Math.floor( diff / 86400000        )
                };
            },

            displayDiffenceTime : function(timeObj) {


                return ''+ timeObj.ms + ' Months' + timeObj.d +' Days '+ timeObj.m +  ' Minutes';
            },

            loadDataWhenFailed : function() {
                var _t = this;

                _t.copyToCopy();


            },

            copyToCopy : function() {
                var _t = this;

                $('#account-wrap').before($(_t.activityWraper));
                _t.activityTab();
            }

        }
    };
    /*----------------- End of LIvefyre ----------------- */

    /*--------------------------------------------------
                        uReport
        uReport lives on external server, and has files that needs to be modified, but they are using static assets
    ---------------------------------------------------*/

    /**
     * [uReportConst description] SABRE_ID is critical element for uReport as it is require to create a login session with fileMobile. Cookie is generated via API
     * @return {void}
     */
	uReportConst = function() {
		var _t = uReportProto;

        _t.cookieSet = function(){
            return ($.cookie('SABRE_ID')) ? true : false;
        };

        _t.ureportHost = (function() {
			return (window.location.host.indexOf("ureport") > -1) ? true : false;
        })();


        //$tartup.site.Add;
        //$tartup.site.OnDocReady;
        //$tartup.site.OnPageReady;
    };

    // this object has some legacy code, as a reference and a back up
    uReportProto = {

        config : {
            url : CONFIG.ureport.url,
            token : '&token=',
            email : '&email=',
            user  : '&username='
        },

        /**
         * [uReportIdLookupAndDisplay description]  a request to janrina via displayname to display ureports to public profile
         * @param  {string} userName - displayName
         * @param  {boolean} publicProfileEntryPageFlag true then this is a request to just public profile, else this is a editProfile and needs a more complex response
         * @return {void}
         */
		uReportIdLookupAndDisplay : function(userName, publicProfileEntryPageFlag) {
			var self = this, valid = (CONFIG && CONFIG.ureport && CONFIG.ureport.idLookup) ? true : false;
			if (!valid) { return false; }

			window.userNameLookup = function(data) {

				if(publicProfileEntryPageFlag){
					var aprvdFiles = (data.approvedFiles) ? data.approvedFiles : "0";
					$('#fox_ur_reports').html(aprvdFiles);

				}else{
					self.uReportTab(data.id)
				}
			};

			var url = CONFIG.ureport.idLookup.replace("[UREPORT_USER_ID]",userName);

			$.ajax({
				url:url,
				dataType:"script"
			})

		},

        /**
         * [uReportTab description] - ureport information displayed in edit Profile, private or public
         * @param  {number} ureportID - obtained from uReportIdLookupAndDisplay
         * @return {void}
         */
		uReportTab : function(ureportID) {
			var self = this, isPublicProfile = false;

			var preArrangeDom = {
				"acctWrap"     : $('#account-wrap'),
				"ureportWrap"  : $('#ureport-pro-wrap'),
				"activityWrap" : $('#livefyre-wrap'),
				"tabs"         : $('.tabs'),
				"wraps"        : $('.wrap'),
				"lastestUrep"  : $('.latest-urep'),
				"noSub"		   : $('.no-subs')
			};

			if (ureportID) {
				var ureportUserId = ureportID;
			} else {
				preArrangeDom["lastestUrep"].hide();
				preArrangeDom["noSub"].show();

				if (typeof auth_fox.user.userJanrain.externalServices === "undefined") { //no a ureport acct

					var counter = 0;
					var sI = setInterval(

						function() {
							var img = $('#livefyre-pro-image img').attr("src");
							if(img.indexOf("static/v/all") === -1){
								$('#ureport-avatar').prepend('<img src="'+img+'" width="139" height="139"/>');
								var usernameText = $('.livefyre-pro-activity h1').text();
								$('#ureport-pro-wrap h1').text(usernameText);
								//$('.sub-ur-banner a').attr("href","http://www.foxnews.com/community/user/profile/public#"+usernameText);
								$('.sub-ur-banner a').attr("href","http://ureport.foxnews.com/assignments?f=treeleft&o=ASC");
								clearInterval(sI);
							}else{
								if(counter === 5){clearInterval(sI);}
								counter ++;
							}
						},1000);

					return;
				} else {
					var ureportUserId = auth_fox.user.userJanrain.externalServices.uReport_id;
				}
			}

			if (typeof ureportID !== "undefined") {
				var isPublicProfile = true;
			}

			if (!isPublicProfile) {
				var ureportWrapClone = preArrangeDom["ureportWrap"].clone();
				preArrangeDom["ureportWrap"].remove();
				preArrangeDom["acctWrap"].after(ureportWrapClone);
			}

			(function () {
				var newAcctWrap = $('#ureport-pro-wrap'), newWraps = $('.wrap');

				preArrangeDom["tabs"].click(function() {
					var tab = $(this), id = tab.attr("id");
					newWraps.css("display","none");
					preArrangeDom["tabs"].removeClass("active");
					tab.addClass("active");

					if(id == "account-tab"){preArrangeDom["acctWrap"].css("display","block")}
				    if(id == "ureport-pro-tab"){newAcctWrap.css("display","block")}
				 	if(id == "ureport-act-tab"){preArrangeDom["activityWrap"].css("display","block")}
				})
			})();

			var dom = {
				//inserted data fields
				"approvedUploadsELM"    : $('#ureport-pro-wrap .prof-urep-stats ul li:eq(0) span'),
				"asSeenOnFoxChannelELM" : $('#ureport-pro-wrap .prof-urep-stats ul li:eq(1) span'),
				"featureduReportsELM"   : $('#ureport-pro-wrap .prof-urep-stats ul li:eq(2) span'),
				"assignmentsELM"        : $('#ureport-pro-wrap .prof-urep-stats ul li:eq(3) span'),
				"latestReport"			: $('#ureport-pro-wrap .prof-urep-latest'),
				"noSubs"				: $('#ureport-pro-wrap .no-subs'),
				"latestReportLink"		: $('#ureport-pro-wrap .latest-urep a'),
				"photoELM"				: $('#ureport-pro-wrap .latest-urep a img'),
				"title"                 : $('#ureport-pro-wrap .latest-urep div h2 a'),
				"message"               : $('#ureport-pro-wrap .latest-urep div p'),
				"userName"			    : $('#ureport-pro-name h1'),
				"publicURL"	  	   	 	: $('#ureport-pro-wrap .sub-ur-banner a'),
				"userName"			    : $('#ureport-pro-name h1'),
				"avatar"				: $('#ureport-avatar'),
				"accountWrap"	  	    : $('#account-wrap'),
				"lastestUrep"  			: $('.latest-urep'),
				"noSub"		   			: $('.no-subs')
			};

            // image handler
			if (isPublicProfile) {
				dom["userName"].text(location.href.split("#")[1]);
				var src = auth_fox.livefyre.activityTab.user.image
				dom["avatar"].html('<img src="'+ src + '" style="height:139px;width:139px" />');
			} else {
				dom["userName"].text(auth_fox.user.userJanrain.displayName);
				//if the user has an avatar...
				var src = (typeof auth_fox.user.userJanrain.photos[2] !== "undefined")? auth_fox.user.userJanrain.photos[2]["value"] : false;
				if(src){
					dom["avatar"].html('<img src="'+ src + '" style="height:139px;width:139px" />');
				}
			}

			dom["publicURL"].attr("href","http://ureport.foxnews.com/assignments?f=treeleft&o=ASC");

            // JSONP
			window.ureportActivity = ureportActivity = function(data) {
				var data = data.result,
				 asSeenOnArr = data.seenOnFNC.match(/,/g),
				 featuredURepArr = data.featuredUreports.match(/,/g);

				asSeenOnArr = asSeenOnArr? asSeenOnArr.length : 0;
				featuredURepArr = featuredURepArr? featuredURepArr.length : 0;

				if (data.approvedUploads !== "0" && !isPublicProfile) {
					$(".sub-ur-banner").css("visibility","hidden");
				}

				dom["approvedUploadsELM"].text(data.approvedUploads);
				dom["asSeenOnFoxChannelELM"].text(asSeenOnArr);
				dom["featureduReportsELM"].text(featuredURepArr);
				dom["assignmentsELM"].text(data.assignments);
				if (typeof data.publicUrl !== "undefined" && data.publicUrl !== "" ) {
					dom["photoELM"].attr("src",data.publicUrl);
					dom["lastestUrep"].show();
					dom["noSub"].hide();
				} else {
					dom["latestReportLink"].hide();
					dom["noSubs"].show();
				}
				dom["latestReportLink"].attr("href",data.viewUreport);
				dom["title"].text(data.title);
				dom["message"].text(data.description);

				if (typeof window.ureportInitialized ==="undefined") {
					window.ureportWrapClone = $('#ureport-pro-wrap').clone();
					window.ureportInitialized = true;
					window.refreshUR = refreshUR = function(){
						$('#account-wrap').after(window.ureportWrapClone);
					}
				}

			};

			(function() {
				$.ajax({
					url: CONFIG.ureport.ureportURL.replace("[UREPORT_USER_ID]",ureportUserId),
					dataType:"script"
				})
			})();
		},

        /**
         * [uLogin description] - Authenticating with uReport via cookie
         * @param  {string} token - obtained from janrain login or session found
         * @param  {string} email - obtained from janrain login or session found
         * @param  {string} username - this is UUID! : obtained from janrain login or session found
         * @return {void}
         */
		uLogin : function(token,email,username) {

            if(!HOST('ureport')){return false;}
            var _t = this, cb = 'FOX_ureport_SABRE', cfg = _t.config;

            // Escape the email address, except for the '@' symbol.
            // Our ureport service is currently not handling all escaped charachters.
            var _email = encodeURIComponent(email);
            _email = _email.replace('%40', '@');

            // JSONP
            window[cb] = function(response) {

                if (_t.ureportHost ) {//!(_t.cookieSet())

                    $.cookie('SABRE_ID',response.fm,{path: '/'});

                    var acc = domProto.setDomReady().uReport().acc;

                    // This block fixes the Firefox reload issue with respect to switching the pathname
                    if (!acc.hasClass('action') && typeof window.Backplane === 'function' && response['fm'] !== '') {
                        if ( window.location.pathname === '/assignment' ) {
                          setTimeout(function(){
                            var submitUrl = window.location.href;
                            submitUrl = submitUrl.replace('/assignment', '/submitreport');
                            window.open(submitUrl ,"_self");
                          }, 500);
                        } else { setTimeout(function(){ window.location.reload(true); }, 500); }
                    }


                }
            };

            $.ajax({
                url : cfg.url+cb+cfg.token+token+cfg.email+_email+cfg.user+username,
                async : true,
                cache : true,
                dataType : 'script'

            });
        },

        uLogout : function() {
            var _t = this,
                acc = domProto.setDomReady().uReport().acc;
			if(_t.cookieSet() && _t.ureportHost && acc.hasClass('action')){

                $.cookie('SABRE_ID', null, { path: "/" });
                $.cookie('SABRE_ID', null, { path: "/" });

                setTimeout(function() {
					window.location.reload(true);
				},3000);
            }
        },

		clearCookies : function() {

            var count = 0, runner=0;
            $.cookie('SABRE_ID', null, { path: "/" });
        },

        // legacy code, used as a reference
        docReady : (function() {
            if (!HOST('ureport')) { return false;}

            var DOC_Ready = $tartup.site.OnDocReady;

            function killCookie(ck) {
                //$tartup.site.SSOModule.loadIframe('logout');
				$.cookie(ck, null, { path: "/" });
				$.cookie('SABRE_ID', null, { path: "/" });
				$.cookie('p_UN', null, { path: "/" });
                setTimeout(function() {
                    window.location.reload(true) },
                3000);
            }

            DOC_Ready("slideShowCarousel",{
                init : function(){
                    var thisObj = this;
                    thisObj.setSlideshow();
                },
                setSlideshow : function(){
                    function buildSectioning(elm, obj) {
                        var html = [];
                        for (var x = 1; x <= obj.batch.max; x++ ) { html.push('<li><a href="#"></a></li>'); }
                        elm.html(html.join(""));
                    }

                    $(".c-slide").each(function(i){
                        var target = $(this),
                            cntrl = target.find("div.controls"),
                            section = target.find("ul.sectioning"),
                            controlsObj = false;

                        var sectioning = function(elm) {
                            elm.each(function(i){
                                $(this).click(function(){
                                    controlsObj.stopAutoScroll();
                                    controlsObj.scrollToBatch(i+1);
                                    return false;
                                });
                            });
                        };

                        var config = {
                            auto: { set:true, speed:5000, resume:true }, // auto scroll
                            slide: "horizontal", // horizontal or vertical
                            scroll: 1, // number of items to scroll per event
                            show: 1, // items shown
                            speed: "slow", // scroll speed
                            rotate: true, // rotate back to star if end
                            eventCallback: function(obj) { // callback function for all carousel events
                                var start = obj.start, end = obj.end;
                                if (obj.event==="init") {
                                    // log(section);
                                    buildSectioning(section,obj);
                                    sectioning(section.find("> li a"));
                                }
                                section.find("> li").each(function(i){
                                    $(this).toggleClass("active",(i+1 === obj.batch.current));
                                });
                            },
                            controlsCallback: function(control) { // callback to set up controls
                                cntrl.find(".prev").click(function(){ // previous link
                                    control.stopAutoScroll();
                                    control.slide("prev");
                                    return false;
                                });

                                cntrl.find(".next").click(function(){ // next link
                                    control.stopAutoScroll();
                                    control.slide("next");
                                    return false;
                                });
                                controlsObj = control;
                            }
                        };

                        target.jACarousel(config);
                    });

                }

            });

            DOC_Ready("emailSubmit",{
                init : function(){
                    var thisObj = this;

                    $('#signupSubmit').click(function(){
                        var email = $('#signupEmail').val();
                        thisObj.validate(email);
                        return false;
                    });

                    $('#signupEmail').attr("value","Enter Your Email").blur(function(){
						var elm = $(this), val = elm.attr("value");
                        elm.attr("value",(val==="")?"Enter Your Email":val);
                    }).focus(function(){
						var elm = $(this), val = elm.attr("value");
                        elm.attr("value",(val==="Enter Your Email")?"":val);
                    });
                },
                validate : function(email){
					var thisObj = this, reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

                    if(reg.test(email) == false) {
                        $('.newsletter-module form .error').text("Please enter a valid email address.").css("display","block");
                    }else{
                        thisObj.postEmail(email);
                        $('.newsletter-module form .error').text("Thank you for subscribing to uReport.").css("display","block");
                        $('#signupEmail').val("");
                    }
                },
                postEmail : function(email){
                    $.ajax({
                      url: "http://www.foxnews.com/portal/newsalertsubscribe",
                      data: "slids=3DC725E303A24F8D41CEA8699C0FE71E&email=" + email
                     // data:{email: email,slids: "3DC725E303A24F8D41CEA8699C0FE71E" }
                    });
					log(email);
                }
            });

            // SSO module
            DOC_Ready('SSOModule', {

                init: function() {
                    var r = this;

                    //$("#account").removeClass("none").show();

                    //r.attachEvents();
                    //r.setHashListener();
                    //r.submitreport = null;
                    //r.logout = null;
                },

                attachEvents: function() {
                    var r = this, overlay;

                    $('#authentication li:nth-child(1)').click(function(e) {
                        r.loadIframe('register');
                        e.preventDefault();
                    });

                    $('#authentication li:nth-child(2)').click(function(e) {
                        r.loadIframe('login');
                        e.preventDefault();
                    });

                    var requireLogin = $('#log-in');

                    if (requireLogin.length > 0 && !$.cookie('p_Thirdparty')) {
                        requireLogin.click(function(e) {
                            var href = requireLogin.attr('href');
                            r.submitreport = (href.split('?')[1]).split('=')[1];
                            r.loadIframe('login');
                            e.preventDefault();
                        });
                    }

                    $(window).resize(function() {
                        var frame = $('#foxFrame'), win = $(window);
                        if (frame.length) {
                            frame.width(win.width());
                            frame.height(win.height());
                        }
                    });

                    window.location.hash = '';
					var userOptions = $("#account"), user = $.cookie('p_UN'), thirdParty = $.cookie('p_Thirdparty');

                    if (userOptions.hasClass('inactive')) {
                        user = $.trim($.cookie('p_UN').replace('.', ' '));
                        userOptions.prop('onmouseout', null);
                        userOptions.click(function(e) {
                            var tar = e.currentTarget;
                            $(tar).toggleClass('active');
                        });
                        $('.user-options').prepend("<p>You're logged in as <span>" + truncate(user, 13) + "</span></p>");
                        if (thirdParty === 'true') {
                            userOptions.find('li.first').hide();
                        }
                    } else if (thirdParty) {
                        user = $.trim($.cookie('p_UN').replace('.', ' '));
                        userOptions.addClass('inactive').html('<div class="username"><div class="encapsulate"><img width="13" height="13" alt=" " src="http://www.foxnews.com/static/all/img/head/profile.png"/><span>Account</span></div><div class="user-options"><p>You\'re logged in as <span>' + truncate(user, 13) + '</span></p><ul><li class="first"><li><a onclick="killCookie(\'SABRE_ID\');" href="#">Logout</a></li></ul></div></div>');
                        userOptions.hover(function(e) {
                            var tar = e.currentTarget;
                            $(tar).toggleClass('active');
                        }, function(e) {
                            var tar = e.currentTarget;
                            $(tar).toggleClass('active');
                        });
                    }

                    userOptions.find('li:first a').attr('href', 'https://secure.foxnews.com/community/user/profile').attr('target','_blank');
                },

                loadIframe: function(overlay) {
                    var r = this, ifr, url, login = $("#login");
                    url = encodeURIComponent(window.location.href);
                    ifr = $('<iframe />', {
                        id: 'foxFrame', src: 'http://www.foxnews.com/static/v/all/html/ureport-login-ifr-2.html#' + overlay + '&url=' + url,
                        width: $(window).width(), height: $(window).height(),
                        allowTransparency: true, scrolling: 'no' });

                    login.show().css('visibility', 'hidden');
                    ifr.load(function() {
                        login.css('visibility', 'visible');
                    }).appendTo(login);
                },

                setHashListener: function() {
                    var r = this;
                    $(window).bind('hashchange', $.proxy(r.hashChange, r));
                    if ($.browser.msie && ($.browser.version === '7.0')) {
                        var prevHash = window.location.hash;
                        window.setInterval(function () {
                            if (window.location.hash !== prevHash) {
                                $.proxy(r.hashChange(), r);
                            }
                        }, 100);
                    }
                },

                hashChange: function() {
                    var r = this, hash = window.location.hash,
                        login, fmCookie, hide;

                    // hash-changes trigger favicon reset
                    $('<link href="http://www.foxnews.com/i/redes/foxnews.ico" rel="shortcut icon" type="image/x-icon" />').appendTo('head');

                    if (hash.replace('#','') === '') return;

                    try {
                        hash = hash.replace('#', '').split('&');
                        login = hash[0].split('=')[1];
                        fmCookie = hash[1].split('=')[1];
                        hide = hash[2].split('=')[1];
                    } catch(err) {}

                    if (login === 'true') {
                        $.cookie('SABRE_ID', fmCookie);
                        $(window).unbind('hashchange');
                        window.location.hash = '';
                        if (r.submitreport !== null) window.location.pathname = '/submitreport';
                        setTimeout(function(){ window.location.reload(true); },1000);
                    }

                    if (hide === 'true') {
                        window.location.hash = '';
                       $('#login').html('').hide();
                    }
                }
            });

		}())

    };
    /* =========== End of uReport ================== */

    /*--------------------------------------------
                        WhatCOUNTS
    ------------------------------------------- */
	whatCConst = function() {
		this.url = '';
    };
    /*===================Prototype============================ */
    whatCProto = {
            config : {
                url : CONFIG.whatcounts.subscribe,
    			iframeUrl : 'http://$.foxnews.com/feeds/app/newsletters/',
                sub : '?c=sub',
                unsub  : '?c=unsub',
                find   : '?c=find',
                email  : '&email=',
                r      : '&r=',
                listId : '&list_id=',
    			cbust     : '&cb=',
    			// TODO: CHANGE THIS URL
                unsubURL : CONFIG.whatcounts.unsubscribe,
                token    : '?token=',
                subRList : '&',
                callback : '&callback=FOX_whatcounts_UNSUB',
                cb       : 'FOX_whatcounts_UNSUB',
                realms   : ['foxnews','foxpromos','foxbusiness','foxnewsletter'],
                janrainHost : '&host=fox-news',  //NEEDS TO BE UPDATED when going live

                // this maybe deprecated.
                Realms : {
                    'foxnews' : 'foxnewsIDList' ,
                    'foxpromos' :'foxpromosIDList' ,
                    'foxbusiness' : 'foxbusinessIDList',
                    'foxnewsletter' : 'foxnewsletterIDList'
                },

                idRealms : {
                    'foxnewsIDList' : 'foxnews',
                    'foxpromosIDList' : 'foxpromos',
                    'foxbusinessIDList' : 'foxbusiness',
                    'foxnewsletterIDList' : 'foxnewsletter'
                },

                List  : {
                    'foxnewsIDList' : [],
                    'foxpromosIDList' : [],
                    'foxbusinessIDList' : [],
                    'foxnewsletterIDList' : []
                },

                subscribeList  : {
                    'foxnews' : [],
                    'foxpromos' : [],
                    'foxbusiness' : [],
                    'foxnewsletter' : []
                }
            },

            dom : {
                email: null,
                newsList: null,

                // dynamic load from Janrain, dom is not set on Doc.ready
                load : function() {
                    var _t = this;
                    _t.email              = $('#capture_editProfile_edit_email');
                    _t.newsList           = $('.news-sub-form').find('label');
    				_t.signInform	      = $('#capture_traditionalRegistration_registrationForm');
    				_t.signInEmail        = _t.signInform.find('#capture_traditionalRegistration_form_item_traditionalRegistration_emailAddress input');
    				_t.signInLabels	      = _t.signInform.find('.news-sub-form-reg label');
    				_t.signInIframeTarget = $('body');
                }
            },

            gatherData: function() {

            },

    		janrainNewsAlerts: function(SLIDnum,email) {
    			var realm,newsId;
                // realms, and lists are very connected in the implementation, debug them to have better picture of what is going on
    			var JanrainIdRealmLookup = {
    				"3DC725E303A24F8D197DA3C8590F80E2" : ["foxnewsletter","172"],
    				"3DC725E303A24F8D1C12D1E24CDEA25E" : ["foxnewsletter","166"],
    				"3DC725E303A24F8D9C92271F5026F381" : ["foxnewsletter","106"],
    				"3DC725E303A24F8D555BC7C7F3FD748B" : ["foxnewsletter","178"],
    				"3DC725E303A24F8D836CEAE9B885C87D" : ["foxnewsletter","76"],
    				"3DC725E303A24F8DCF015F07C61BABFD" : ["foxnewsletter","144"],
    				"3DC725E303A24F8DA5DBC7FFD49BC2B8" : ["foxnewsletter","160"],
    				"C2F278094FACCEA62391025B7A52D8EB" : ["foxnews","35"],
    				"3DC725E303A24F8DE5C63D14EAB8EF63" : ["foxnewsletter","162"],
    				"3DC725E303A24F8D95ACD1C9C0564C20" : ["foxnewsletter","96"],
    				"3DC725E303A24F8DA102192D9D5143D9" : ["foxnewsletter","173"],
    				"3DC725E303A24F8DAB69E1C048904762" : ["foxnewsletter","153"],
    				"3DC725E303A24F8DB05092D232355E43" : ["foxnewsletter","71"],
    				"3DC725E303A24F8DE5173CCC4F027046" : ["foxnewsletter","171"],
    				"3DC725E303A24F8D41CEA8699C0FE71E" : ["foxnewsletter","133"],
    				"D98A625593049BD2AC0F412BA1AF913A" : ["foxpromos","174"],
    				"D98A625593049BD2CBFB283F5508AF71" : ["foxpromos","43"],
    				"3DC725E303A24F8D64B4C05965F09E1A" : ["foxnewsletter","99"],
    			    "5C84B893BD6D939E84FAE1A8E6E9525A" : ["foxbusiness","32"],
    				"3DC725E303A24F8D870B96401050B31F" : ["foxnewsletter","90"],
    				"3DC725E303A24F8D518A0FB222399489" : ["foxnewsletter","151"],
    				"3DC725E303A24F8D39740C7B45D15F45" : ["foxnewsletter","69"],
    				"3DC725E303A24F8D3540B4B6FB335FC8" : ["foxnewsletter","108"],
    				"3DC725E303A24F8D5E4CD875B68955A6" : ["foxnewsletter","141"],
    				"3DC725E303A24F8D7E5F3A553E2E6154" : ["foxnewsletter","122"],
    				"3DC725E303A24F8D883169054890DC1B" : ["foxnewsletter","183"],
    				"3DC725E303A24F8D02B1F9D9AAF16982" : ["foxnewsletter","97"],
    				"D98A625593049BD23B5BE4FDF9C2351F" : ["foxpromos","139"]
                },newsletterList  = {
    	            'foxnews' : [],
    	            'foxpromos' : [],
    	            'foxbusiness' : [],
    	            'foxnewsletter' : []
    	        },
    			allListIds = [];

    			if (typeof SLIDnum != "undefined") {
    			if (SLIDnum instanceof Array) {
    				for(var x = 0; x < SLIDnum.length; x++){
    					realm  = JanrainIdRealmLookup[SLIDnum[x]][0];
    					newsId = JanrainIdRealmLookup[SLIDnum[x]][1];
    						allListIds.push(newsId);
    					newsletterList[realm].push(newsId);
    				}
    			} else {
    				realm  = JanrainIdRealmLookup[SLIDnum][0];
    				newsId = JanrainIdRealmLookup[SLIDnum][1];
    					allListIds.push(newsId);
    				newsletterList[realm].push(newsId);
    			}
    			} else {
    				realm = "foxbusiness";
    				newsId = "32";
    				allListIds = "32";
    			}

    			var obj = {
    				listIds : allListIds.join(","),
    				email : email,
    				cb : cacheBuster(),
    				callback : "badgevilleSubscribeSuccess"
    			};
    			window.badgevilleSubscribeSuccess = function(){};

    			log("badgeville request:", obj);

                // this could be a backend type of request, no actual js was needed to handle a response
    			$.ajax({
    				url: "http://" + CONFIG.whatcounts.subdomain + ".foxnews.com/feeds/app/badgeville/newsletters/subscribe.json",
    				data: obj,
    				dataType: "script"
    			});
    		},

            // on page load, grab approriate ids and realms for the user and check mark them
    		lookUpUser : function() {
                var _t = this, cfg = _t.config;
                _t.dom.load();

                if (_t.dom.email.length > 0) {

    				var realmIndex = 0;

    				var trigger = function() {
                        var url = [ cfg.url,
                                    cfg.find,
                                    cfg.r+cfg.realms[realmIndex],
                                    cfg.email+_t.dom.email.attr('value'),
    								cfg.cbust+cacheBuster(2,"milliseconds")
                        ].join('');

                        $.ajax({
                            url : url,
                            dataType : 'text',
                            type: 'GET',
                            success : function(data){


                                if (data) {

    					            if ($.browser.msie) {
    					                data = data.replace(/\s+/g,"");
    					                var xml = new ActiveXObject("Microsoft.XMLDOM");
    					                xml.loadXML(data);
    					  				var response = $(xml).find('lists').text();

    					            } else {
    					                var response = $(data).find('lists').text();
    					            }


    								//var response = data.match(/<lists>([0-9,]+)<\/lists>/) ? data.match(/<lists>([0-9,]+)<\/lists>/)[1]  : false;
    								if (response) {
    									response = response.split(',');

    									var successTrigger = function(z) {

    	                                       if (response[z] !== '') {
    	                                           cfg.List[cfg.Realms[cfg.realms[realmIndex]]].push(response[z]);
    	                                       }
    									};

    									for (var z = 0, len = response.length; z < len; z+=1) {
    										successTrigger(z);
    	                                }
    								}
                                }

    							if (realmIndex < 3) {
    								realmIndex++; trigger();
    							} else {
    								doneLookUp();
    							}

                            },
                            error : function(e) {
    						    log('Error',e);
                            }
                        });
    			    };
    			    trigger();

                    function doneLookUp() {

                       // _t.checkNewsLetters();
                        $(document).ready(function(){
                            _t.checkNewsLetters();
                        });
                    }

                } else {
    				log('dom not ready!');
                }
            },

            checkNewsLetters : function() {
    			//window.scrollTo(0,1070)
                this.dom.load();
                var _t = this, newletters = _t.dom.newsList, cfg = _t.config;


    			for (var i in cfg.List) {
    				if(cfg.List[i] != 0){
    					for(var j = 0; j < cfg.List[i].length; j++){
    						var el = $("#"+i+'_'+cfg.List[i][j]);
    						$(el).checked = true;
    						$(el[0]).attr('checked','checked');
    					}
    				}
    			}

				_t.setEventListener();

                // critical element for identifying state of the lookup, because of the way it works with janrain. true is default value
                eventsProto.janrain.screen.stateLookUp = false;
            },

            // retain checked state, since janrain refresh the markup
            onFail : function() {
    			window.scrollTo(0,1070);
                this.dom.load();
                var _t = this, newsletters = _t.dom.newsList, cfg = _t.config;

				newsletters.each(function() {
					var el = $(this).find('input'),temp;
					temp = el.attr('id').split('_');
					if (window._NewsletterBindings.subscribe[cfg.idRealms[temp[0]]].indexOf(temp[1]) > -1) {
						el[0].checked = true;
					}
					if (window._NewsletterBindings.original[cfg.idRealms[temp[0]]].indexOf(temp[1]) > -1 && window._NewsletterBindings.unsubscribe[cfg.idRealms[temp[0]]].indexOf(temp[1]) === -1) {
						el[0].checked = true;
					}
				});

				_t.setEventListener();
            },

    		updateSub : function() {

    			var _t = this, newletters = _t.dom.newsList, cfg = _t.config, bufferSubList = {},

    			subscribeListTemp  = {
                    'foxnews' : [],
                    'foxpromos' : [],
                    'foxbusiness' : [],
                    'foxnewsletter' : []
                },
    			unsubscribeList  = {
                    'foxnews' : [],
                    'foxpromos' : [],
                    'foxbusiness' : [],
                    'foxnewsletter' : []
                };

                // Pushing Checked Subscriptions into proper Array
    			newletters.each(function() {
                    var el = $(this).find('input'),temp;

                    temp = el.attr('id').split('_');


    				//CHECKED SUBSCRIBE
                    if (el.is(':checked')) {
    					subscribeListTemp[cfg.idRealms[temp[0]]].push(temp[1]);
    				}
    				//UNCHECKED UNSUBSCRIBE
                    else {

    					//INIT AJAX data
    					if (!eventsProto.janrain.screen.postAjaxInit) {
    						if(cfg.List[temp[0]].indexOf(temp[1]) > -1){
    							unsubscribeList[cfg.idRealms[temp[0]]].push(temp[1]);
    						}
    					}
    					//ON PAGE data
    					else {
    						if (cfg.subscribeList[cfg.idRealms[temp[0]]].indexOf(temp[1]) > -1) {
    							unsubscribeList[cfg.idRealms[temp[0]]].push(temp[1]);
    						}
    					}
    				}
                });

    			cfg.subscribeList = subscribeListTemp;

                for (var realm in window._NewsletterBindings.subscribe) {
                    if (window._NewsletterBindings.subscribe[realm].length != 0) {
                        var idList = window._NewsletterBindings.subscribe[realm].join(','),
                            url = [ cfg.url,
                                    cfg.sub,
                                    cfg.email+_t.dom.email.attr('value'),
                                    cfg.listId+idList,
                                    cfg.r+realm,
    								cfg.cbust+cacheBuster(2,"milliseconds")
                            ].join('');

                        // badgeville credit for signing up
    					for (var c = 0; c < window._NewsletterBindings.subscribe[realm].length; c++) {
    						badgeProto.credit({"verb" : "newsletter subscription" , "newsletterID" : realm + window._NewsletterBindings.subscribe[realm][c]});
    					}

                        $.ajax({
                            url : url,
                            dataType : 'html',
                            type: 'POST',
                            success : function(data){

                            },
                            error : function(e){
    							log('Error',data,e);
                            }
                        });
                    }
                }

                for (var realm in window._NewsletterBindings.unsubscribe) {
                    if (window._NewsletterBindings.unsubscribe[realm].length != 0) {
                        var idList = window._NewsletterBindings.unsubscribe[realm].join(','),
                            url = [ cfg.unsubURL,
                                    //cfg.token+janrainProto.API.token,
    								cfg.unsub,
                                    cfg.email+_t.dom.email.attr('value'),
                                    cfg.listId+idList,
                                    cfg.r+ realm,
    								cfg.cbust+cacheBuster(2,"milliseconds")

                            ].join('');

                        window[cfg.cb] = function(response){

                        };

                        $.ajax({
                            url : url,
                            dataType : 'script',
                            async : true,
                            cache : true
                        });

                    }
                }

    			eventsProto.janrain.screen.postAjaxInit = true;

    		},

            // subsribing user via iframes on registeration
    		subscribeOnSignIn : function() {


                var _t = this;
    			_t.dom.load();

    			var newsletters = _t.dom.signInLabels, fEmail = _t.dom.signInEmail.val(), iframeTarget = _t.dom.signInIframeTarget, cfg = _t.config;

    			//clear subscribeList and iframes
    			for (var j in cfg.subscribeList) {
    				cfg.subscribeList[j] = [];
    			}
    			$('.subIframe').remove();

                newsletters.each(function() {//Pushing Checked Subscriptions into proper Array
                    var el = $(this).find('input'),temp;
                    temp = el.attr('id').split('_');


                    if (el[0].checked == true) {
                        cfg.subscribeList[cfg.idRealms[temp[0]]].push(temp[1]);
                    }
                });

    			var subDomain = (function() {
    				var hArr = location.host.split(".");
    				hArr.pop();
    				hArr.pop();
    				return hArr.join(".");
    			 })();

                for(var realm in cfg.subscribeList){


                    if(cfg.subscribeList[realm].length != 0){
                        var idList = cfg.subscribeList[realm].join(','),
                        	url = [ cfg.iframeUrl.replace("$", subDomain),
                                    cfg.sub,
                                    cfg.email+fEmail,
                                    cfg.listId+idList,
                                    cfg.r+realm,
    								cfg.cbust+cacheBuster()
                            ].join('');


    					iframeTarget.append('<iframe height=0 width=0 class="subIframe" src="'+url+'"></iframe>');

                    }
                }

                // badgeville points will be credit later, when the user actually authenticate with janrain
                badgeProto.buffer.push('newsletterSub');
            },

            updateSubscribeState : function() {
				var _t = this

    			//scrollTo(0,1070);

                this.dom.load();

                var _t = this, newletters = _t.dom.newsList, cfg = _t.config;

                newletters.each(function() {
                   var el = $(this).find('input'),temp;

                    temp = el.attr('id').split('_');

                    var realm = cfg.idRealms[temp[0]];
                    if (cfg.subscribeList[realm].length != 0) {
                        for (var x = 0, len = cfg.subscribeList[realm].length; x < len; x+=1) {

                            if (temp[1] == cfg.subscribeList[realm][x]) {

                                el[0].checked = true;
                                //$(el[0]).attr('checked',true);

                                //badgeProto.trigger('')
                            }
                        }

                    }
                });
				_t.setEventListener(true);

            },

            /**
             * [setEventListener description] - idendifier of emails original, subsrived and ubsubsribed, and saving them
             * @param {boolean} reload
             */
			setEventListener : function(reload) {
						var _t = this, newsletters = _t.dom.newsList, cfg = _t.config, NS;

						if (reload || !window._NewsletterBindings) {
							NS = window._NewsletterBindings = {
								original: {},
								subscribe: {},
								unsubscribe: {}
							};
						} else {
							NS = window._NewsletterBindings;
						}

						var removeFromArr = function(val,arr) {
							var tmp = [];
							for (var x = 0; x < arr.length; x++) {
								if (arr[x]!==val) { tmp.push(arr[x]); }
							}
							return tmp;
						};

						var storeRealmInfo = function(id,checked,onChange) {
							var sp = id.split("_"), realmId = sp[0], val = sp[1],
								realm = (cfg.idRealms[realmId]) ? cfg.idRealms[realmId] : false;

							if (realm) {

								if (!NS.subscribe[realm]) {
									NS.original[realm] = [];
									NS.subscribe[realm] = [];
									NS.unsubscribe[realm] = [];
								}

								// not on change - it's the first time
								if (!onChange && checked) {

									if (checked && NS.subscribe[realm].indexOf(val) === -1) {
										NS.original[realm].push(val);
									}

								} else if (onChange) { // if on change event

									// if it's in the oritinal array
									var inOrig = (NS.original[realm].indexOf(val) > -1) ? true : false;

									// if checked
									if (checked) {

										if (!inOrig) { // if not in original, put to subscribe list

											NS.subscribe[realm].push(val);

										} else { // if in original

											// remove from the unsubscribe list
											if (NS.unsubscribe[realm].indexOf(val) > -1) {
												NS.unsubscribe[realm] = removeFromArr(val,NS.unsubscribe[realm]);
											}

										}

									} else { // if not checked

										if (inOrig) { // if in original

											// remove from subscribe list
											if (NS.subscribe[realm].indexOf(val) > -1) {
												NS.subscribe[realm] = removeFromArr(val,NS.subscribe[realm]);
											}

											// add to unsubscribe list
											if (NS.unsubscribe[realm].indexOf(val) === -1) {
												NS.unsubscribe[realm].push(val);
											}

										} else { // if not in original

											// remove from subscribe list
											if (NS.subscribe[realm].indexOf(val) > -1) {
												NS.subscribe[realm] = removeFromArr(val,NS.subscribe[realm]);
											}

										}

									}

								}
							}
						};


						newsletters.each(function() {
							var el = $(this), input = el.find("input"), id = input.attr("id");

							// bind only once, and re-bind if janrain freaking reloads the dom
							if (!el.data("_bindings") || reload) {
								el.data("_bindings",true);

								// first time
								storeRealmInfo(id,(input.is(":checked")) ? true : false);

								// on change
								input.unbind("change").bind("change",function(){
									storeRealmInfo(id,(input.is(":checked")) ? true : false, true);
								});
							}
						});

					}

        };


    /*===============End of what Counts==============*/

    /*------------------------------------------
                        IDMS
     ------------------------------------------*/

    idmsConst = function() {
        var _t = this;
        _t.defaultDom();
    };

    // http://www.foxbusiness.com/investing/
    idmsProto = {

        config : {
            url : CONFIG.ureport.url,
            token : '&token=',
            email : '&email=',
            user  : '&username=',
            logout: 'http://quote.foxbusiness.com/loggedout',
            watchList : 'http://www.foxbusiness.com/investing/tools/stock-watchlist',
            portFolio : 'http://www.foxbusiness.com/investing/tools/stock-portfolio'
        },

        domSet : function() {
        	var wAndP = $('#mod-portfolio-watchlist'),auth = $('.section-mod').find('.authentication'),
            createNewAccount = auth.find('.auth-new'),
            theW  = wAndP.find('li:eq(0) > .photo '), theP = wAndP.find('li:eq(1) > .photo '),
            auth_main = $('#investment-tracker'), cNA = auth_main.find('.auth-new'), list = $('.dv-feature-9.m-14'),
            aW  = list.find('li:eq(0)'), aP = list.find('li:eq(1)');

	        return {
	            wAndP : wAndP,
	            auth  : auth,
	            theW  : theW,
	            theP  : theP,
	            authM : auth_main,
	            aW    : aW,
	            aP    : aP,
	            lCNA  : createNewAccount,
	            mCNA  : cNA
	        };
        },

        // prevent old behavior, since janrain took over and also hide authentication upon login: this happens on janrain login
        domBehaviorLogin : function() {
            var _t = this;

            var dom = _t.domSet();

            dom.auth.hide();
            dom.authM.hide();
            $("#mod-portfolio-watchlist .content > ul > li .photo a").unbind('click');
            if (dom.theW.size() > 0) {
                dom.theW.unbind('click').bind('click',function(e){
                    window.location.href = _t.config.watchList;
                    e.preventDefault();
                });

                dom.theP.unbind('click').bind('click',function(e){
                    window.location.href = _t.config.portFolio;
                    e.preventDefault();
                });
            }

            if(dom.aW.size() > 0){
                dom.aW.unbind('click').bind('click',function(e){
                    window.location.href = _t.config.watchList;
                    e.preventDefault();
                });

                dom.aP.unbind('click').bind('click',function(e){
                    window.location.href = _t.config.portFolio;
                    e.preventDefault();
                });
            }


        },

        // prevent old behavior, and turn everything back to normal state after logout
        domBehaviorLogout : function() {
            var _t = this;

            var dom = _t.domSet();


            dom.auth.show();
            dom.authM.show();

            if (dom.theW.size() > 0) {
                dom.theW.unbind('click').bind('click',function(e){
                    janrain.capture.ui.renderScreen('signIn');
                    e.preventDefault();
                });

                dom.theP.unbind('click').bind('click',function(e){
                    janrain.capture.ui.renderScreen('signIn');
                    e.preventDefault();
                });
            }

            if (dom.aW.size() > 0) {
                dom.aW.unbind('click').bind('click',function(e){
                    janrain.capture.ui.renderScreen('signIn');
                    e.preventDefault();
                });

                dom.aP.unbind('click').bind('click',function(e){
                    janrain.capture.ui.renderScreen('signIn');
                    e.preventDefault();
                });
            }
        },

        // bring login janrain modal
        defaultDom : function() {
            var _t = this;

            var dom = _t.domSet();

            dom.lCNA.unbind('click').bind('click',function(e){
                janrain.capture.ui.renderScreen('signIn');
                e.preventDefault();
            });

            dom.mCNA.unbind('click').bind('click',function(e){
                janrain.capture.ui.renderScreen('signIn');
                e.preventDefault();
            });
        },

        /**
         * [idmsLogin description] -- executes on janrain login on session found, and only on foxbusiness. Also we have experience some strange behavior from unable to loging, has something to do with the cookies
         * @param  {sting} token - access token from janrain
         * @param  {string} email - email from janrain
         * @param  {string} username - this ia uuid
         * @return {void}
         */
        idmsLogin : function(token,email,username) {
            if(!HOST('foxbusiness')){return false;}
            var _t = this, cb = 'FOX_ureport_SABRE', cfg = _t.config;



            if ($.cookie('p_IDMS') != null) {_t.domBehaviorLogin(); return false;}

            window[cb] = function(response) {

                $.cookie('p_IDMS',response.idms,{path: '/',domain:'foxbusiness.com'});
                //$.cookie('p_UN','Andrey83',{path: '/',domain:'foxbusiness.com'});

                _t.domBehaviorLogin();

                //if(window.location.href){
                //to do more here
                //}

                //var acc = domProto.setDomReady().uReport().acc;
                //log('acc',acc,acc.hasClass('action'));
                //if(!acc.hasClass('action') && typeof window.Backplane === 'function' && response['fm'] !== ''){
                  //  if(window.location.pathname === '/assignment'){
                    //    setTimeout(function(){ window.location.pathname = '/submitreport';}, 500);
                    //}else{setTimeout(function(){ window.location.reload(true); },500);}
                //}
            };

            $.ajax({
                url : cfg.url+cb+cfg.token+token+cfg.email+email+cfg.user+username,
                async : true,
                cache : true,
                dataType : 'script'

            });
        },

        idmsLogout : function() {
            var _t = this;

            if ($.cookie('p_IDMS') != null) {
                _t.clearIdmsCookie();
                _t.domBehaviorLogout();

                if (window.location.pathname.indexOf('stock-watchlist') > 1 || window.location.pathname.indexOf('stock-portfolio') > 1) {
                    setTimeout(function(){
                        window.location.reload();
                    },3000);
                }

            }
        },

        clearIdmsCookie : function() {
            $.cookie('p_IDMS', null);
            $.cookie('p_IDMS', null,{path: '/'});
            $.cookie('p_IDMS', null,{path: '/',domain:'foxbusiness.com'});
        }

    };

    /*---------------------------------------
                    Ompniture
    --------------------------------------*/
	omnitureConst = function() {
		// Omniture Setup
    };
    /*===================Prototype============================ */
    omnitureProto = {

        networkShareSuccess : function(){
			$.ad.track({ "network-share-success": {} });  // integrated in share.js
        },

        emailShareSuccess : function(){
			$.ad.track({ "email-share-success": {} });   //integrated in share.js
        },

        networkShareStart : function(){
			$.ad.track({ "network-share-start": {} });    //integrated in share.js
        },

        emailShareStart : function(){
			$.ad.track({ "email-share-start": {} }); //integrated in share.js
        },

        registrationStart : function(){
            $.ad.track({ "registration-start": {} }); // integrated
        },

        registrationComplete : function(){
			$.ad.track({ "registration-complete": {} });  //integrated
        },

        logins : function(){
			$.ad.track({ "logins": {} }); // integrated
        },

        profileUpdates : function(){
			$.ad.track({ "profile-updates": {} });  // integrate
        },

        fbShare : function(){
			$.ad.track({ "fb-share": {} });        //integared in share.js
        },

        twttrFollow : function(){
			$.ad.track({ "twttr-follow": {} });
        },

        commentPost : function(){
			$.ad.track({ "comment-post": {} });  // integrated
        },

        commentLoad : function(){
            $.ad.track({ "comment-load" : {} });
        },

        commentRead : function(){
            $.ad.track({ "comment-read" : {} });
        }
    };

    /*----------Omniture End---------------------*/

    /*---------------------------------------
                Events
        Contains a magnitute of events from dom to janrain and other
    --------------------------------------*/
    eventsConst = function() {

    };
    /*------Prototype----*/
    eventsProto = {

        data : {
            body : {
                listener : null
            }
        },

        // dom based behaviors and events, critical for janrain
        domEvents : {

            // on janrain Login Success
            loginSuccess : function() {
                var dom = domProto.setDomReady();

				// livefyre ready
				AUTH_Manager.onReady("livefyre",function(){
					setTimeout(function() { // delay a bit - to cover for full page load
						livefyreProto.API.onLoginSuccessFromJanrain();
					},500);
				});

				// trigger onLogin
				if (window.AUTH_LoginState) {
					AUTH_LoginState.trigger("onLogin");
				}

				// visible
                dom.acc.css({"display" : "block"}) ;
                dom.acc.removeClass("none");
                dom.hasAccount.css({'display':'block'});
                dom.noAccount.css({'display':'none'});
            },

            // on jrain logout Success
            logoutSuccess : function() {
                var dom = domProto.setDomReady();

                // trigger onLogout
                if (window.AUTH_LoginState) {
					AUTH_LoginState.trigger("onLogout");
				}

				// visible
				dom.acc.css({"display" : "block"}) ;
                dom.acc.removeClass("none");
                dom.acc.removeClass('inactive');
                dom.acc.removeClass('active');
                dom.hasAccount.hide();
                dom.noAccount.show();
            },

            // in the top menu editProfile
            editProfile : function() {
                var dom = domProto.setDomReady();

                dom.profile.bind('click',function(e){
                    eventsProto.editProfile(e);
                });
            },

            // controller for tabs in edit Profile pages
			tabControlsForActivityPages : function() {
				if(typeof window.refreshUR == "function"){window.refreshUR();}

				if(location.href.indexOf("tab=ureport") > -1){
					$('.tabs').removeClass("active");
					$('#ureport-pro-tab').addClass("active");
					$('#ureport-pro-wrap').css("display","block");
					$('#livefyre-wrap').css("display","none");
				}

                $('#accounts-header').find('.tabs').unbind('click');
                $('#accounts-header').find('.tabs').click(function(){
					var tab = $(this), id = tab.attr("id"), wraps = $(".wrap");
					wraps.css("display","none");
					$('.tabs').removeClass("active");
					tab.addClass("active");

					if(id == "account-tab"){$('#account-wrap').css("display","block")}
				    if(id == "ureport-pro-tab"){$('#ureport-pro-wrap').css("display","block")}
				 	if(id == "ureport-act-tab"){$('#livefyre-wrap').css("display","block")}
				})
			}
        },

        // callback stack for "onLogin" state
        onLoginState: function(callback) {
			if (window.AUTH_LoginState) {
				AUTH_LoginState.bind("onLogin",callback);
			}
		},

		// callback stack for "onLogout" state
		onLogoutState: function(callback) {
			if (window.AUTH_LoginState) {
				AUTH_LoginState.bind("onLogout",callback);
			}
		},


        // General behavior for account dom Behavior, MASTER manager funciton
        accountDisplayBehaviour : function(e) {
            var dom = domProto.setDomReady(), hoverListen;

            if (!dom.acc.hasClass("alt-style")) {

	            dom.acc.hover(function() {
	                dom.accountNav.addClass("hover");
	                    hoverListen = 'over;'
	                },
	                function() {
	                    dom.accountNav.removeClass("hover");
	                    hoverListen = 'out';
	                }
	            );

	            dom.accountNav.click(function(e) {

	                if (dom.acc.hasClass('active')) {
	                    dom.acc.removeClass('active').addClass('inactive');
	                } else {
	                    dom.acc.addClass('active').removeClass('inactive');
	                }

	            });



	            dom.body.mousedown(function(e) {
	                if (hoverListen === 'out') {
	                    if (dom.acc.hasClass('active')) {
	                        dom.acc.removeClass('active').addClass('inactive');
	                    }
	                }
	            });

            } else {
                var profileBtn = dom.acc.find('.user-options >ul>li:eq(0) > a');

                if ( profileBtn.size() > 0) {
                    profileBtn.click(function() {
                        eventsProto.editProfile();
                    });
                }
            }

            dom.uReport().redBtn.bind('click',function(e) {

                if(janrainProto.API.token === ''){
                    eventsProto.janrain.signin();
                    return false;
                }
            });

            eventsProto.domEvents.editProfile();

        },

        // janrain related events, some of them are tied to the janrainCaptureWidgetOnLoad function where the event listenrs are set up
        janrain : {

            // janrain.capture.ui.renderScreen('signIn'); is what brings up modal up
            signin : function() {
                window.janrain.capture.ui.renderScreen('signIn');
                return false;
            },

            // deprecated but maybe used one days
            traditionalSigin : function () {
                janrain.capture.ui.modal.open('traditionalRegistration');
                return false;
            },

            // based of onCaptureProfileCookieSet, but it is commented out
            traditionalDisplayName : function(result) {
                var displayName = result.displayName,
                    displayNameSpan = document.getElementById('displayNameData');


                if (displayName && displayNameSpan) {
                    displayNameSpan.innerHTML = displayName;
                }

            },

            // on janrain Sigin or session found, execute the API request
            getJanrainUserAPI : function(entity,attr) {
                janrainProto.API.execute(entity,attr);
            },

            // janrain.capture.ui.endCaptureSession(); Janrain's way to end a session for SSO, and backplane.
            signOut : function() {

                janrain.capture.ui.endCaptureSession();

                // this can be removed, i believe, but is here for legacy
                window.Backplane.expectMessages('identity/logout');
            },

            registrationStart : function() {

                omnitureProto.registrationStart();
            },

            /**
             * [successfulRegistration description] - onCaptureRegistrationSuccess : successful registation event triggere from Janrain
             * @param  {object} result - contains, token, and other information about the user
             * @return {void}
             */
            successfulRegistration : function(result) {

                //To manage auto login on successfull registration without email confirmation
                //janrain.capture.ui.endCaptureSession();

                //WhatCounts trigger to set up iframers
                whatCProto.subscribeOnSignIn();

                //Token Behavior
                janrainProto.API.token = result.accessToken;

                //Avatar Approval, auto approve social registration accounts, we may want to put this request in the  config file
                // TO UPDATE
                if (result && result.action === 'socialRegister') {
                    var cb ='JANRAIN_socialAvatarUpdate', url  = 'https://signin.foxnews.com/entity.update?type_name=user&access_token='+result.accessToken+
                        '&attribute_name=photo_approval_status&value=%22approved%22&jsonp='+cb;

                    // simple update call to livefyre, they use their own backend to update their stuff
                    if (typeof window[cb] !== 'function') {
                        window[cb] = function(res){

                            if(res.stat === 'ok'){
                                livefyreProto.API.onProfileUpdate();

                            }else{

                            }
                        };
                    }

                    $.ajax({
                        url : url,
                        dataType : 'script',
                        async : true,
                        cache : true
                    });
                }

                // creating session
                janrain.capture.ui.createCaptureSession(result.accessToken);

                // this could be legacy code, but lets keep it
                window.Backplane.expectMessages('identity/login');

                // This is letting us all know that session is g2g
                janrainProto.session = true;
                janrainProto.sessionType = 'register';

                // Dom Behavior login
                eventsProto.domEvents.loginSuccess();//dom changes

                // API call to janrain.API.execute i think
                eventsProto.janrain.getJanrainUserAPI('entity',{type_name:'user',access_token: result.accessToken});

                //Badgeville
                badgeProto.events.chatCheck();
                //badgeProto.buffer.push('newsletterSub');

                //Omniture
                omnitureProto.registrationComplete();

                //Modal
                if(! result.renders) {janrain.capture.ui.modal.close();}

            },

            /**
             * [successfulLogin description] - onCaptureLoginSuccess : successful login
             * @param  {object} result
             * @return {void}
             */
            successfulLogin : function(result) {

                // Essential Set Up janrain.capture.ui.modal.close(); this guys will not auto close, so we have to do it for them
                janrain.capture.ui.modal.close();
                janrain.capture.ui.createCaptureSession(result.accessToken);

                //Sessitons
                window.Backplane.expectMessages('identity/login');
                janrainProto.session = true;//This is letting us all know that session is g2g
                janrainProto.sessionType = 'signin';

                // When a user get access denied on the private Edit Profile Page, he promted with login modal, on success, we want to rerender editProfile screen.
                eventsProto.janrain.screen.editProfile.reloadProfile();

                //Dom Behavior
                eventsProto.domEvents.loginSuccess();

                //Token Behavior
                janrainProto.API.token = result.accessToken;

                // API call to janrain.API.execute i think
                eventsProto.janrain.getJanrainUserAPI('entity',{type_name:'user',access_token: result.accessToken});

                // simple redirect
                if (window.FOX_Janrain_Page_Type === 'password-reset') {
                    setTimeout(function(){
                        window.location = 'http://www.foxnews.com/community/user/profile/edit'
                    },10000);
                }

                //Omniture
                omnitureProto.logins();

                //BadgeVille Events
                badgeProto.buffer.push('returnEightPerMonth');
                badgeProto.events.chatCheck();


            },

            /**
             * [sessionFound description] -  onCaptureSessionFound :janrain finds a session out local storage or cookies, the only thing we get is just a access token
             * @param  {objec} result - token
             * @return {void}
             */
            sessionFound : function(result) {
                if (!janrainProto.API.requestSent) {

                    janrain.capture.ui.createCaptureSession(result.accessToken);
                    eventsProto.domEvents.loginSuccess();
                    janrainProto.API.token = result.accessToken;

                    window.Backplane.expectMessages('identity/login');

                    eventsProto.janrain.getJanrainUserAPI('entity',{type_name:'user',access_token: result.accessToken});
                    janrainProto.session = true;
                    janrainProto.sessionType = 'found';

                    //Badgeville
                    badgeProto.events.chatCheck();
                }
            },

            // session not found on refresh : janrain onCaptureSessionNotFound event listener
            sessionNotFound : function(result) {

                eventsProto.domEvents.logoutSuccess();
                janrainProto.session = false;
                janrainProto.sessionType = 'notfound';

                if(HOST('ureport')){uReportProto.uLogout();}
                if(HOST('foxbusiness')){idmsProto.idmsLogout();}
            },

            // onCaptureSessionEnded : session ended on logout or token expiration, janrain.capture.ui.endCaptureSession() would triggere this
            sessionEnded : function() {


                if(HOST('ureport')){uReportProto.uLogout();}
                janrainProto.session = false;
                janrainProto.sessionType = 'logout';
                try {
                    if (fyre !== 'undefined' && fyre != null) {
                    	window.fyre.conv.BackplaneAuthDelegate.prototype.logout.call(livefyreProto.eventsDelegate);
                    }
                } catch(e) {}

                badgeProto.events.unsubscribe();

                eventsProto.domEvents.logoutSuccess();
                idmsProto.idmsLogout();
            },

            // onCaptureSessionCreated commented out
            sessionCreated : function(response) {

            },

            // TO DO
            tokenRefreshed : function() {
            	if (requireProto.janrainFlow === 'profileFlow') {
            		setTimeout(function(){janrain.capture.ui.renderScreen('signIn');},1000);
            	}
            },

            // onCaptureExpiredToken janrain event
            tokenExpired : function(response) {
                eventsProto.janrain.signOut();
            },

            // onCaptureAccessDenied when this triggers in edit Private Profile execute a SigIn modal
            accessDenied : function() {
                setTimeout(function(){janrain.capture.ui.renderScreen('signIn');},1000);

                // legacy code here
                //window.location = 'index.html';
                //janrain.capture.ui.modal.close();
                //janrain.capture.ui.renderScreen('signIn');
            },

            // onAuthWidgetLoad from janrain event listener, i believe this is to know when they executed their function, it might have been a request even
            onAuthWidgetLoad : function(response) {

            },

            // onCaptureFederateRefreshedToken to updated data with new access token, this could get more complex as we move forward with some new
            onRefreshToken : function(response) {

                janrain.capture.ui.createCaptureSession(response.accessToken);
                janrainProto.API.token = response.accessToken;
            },

            /**
             * [backplaneReady description] - a critical element of janrain application
             * Upon our request and livefyre, we needed to know when backplane loaded, so that we can triggere 3rd parties that rely on backplane, such as livefyre and badgeville
             * @param  {object} response - i am not sure what is the response here
             * @return {void}
             */
            backplaneReady : function(response) {

                // fire ready for backplane
                AUTH_Manager.fireReady("backplane");

                if ($.browser.msie  && parseInt($.browser.version, 10) <= 7) {
                    var comments = $('.comments');
                    if(comments.size() > 0){
                        comments.remove();
                    }
                    $('#livefyre_comment_stream').html('<p>To participate in commenting, please use Internet Explorer 8 or above.</p>');
                } else {

                    // livefyre fires, when backplane is g2g
                    livefyreProto.init();
                }

                // trigger janrainShare i guess, not sure why we need backplane for it?
                $(window).trigger('janrainShareInit');
            },

            /**
             * [displayPublicProfile description] - a custome feature request to display public profile, just by knowing uuid
             * @param  {string} uuid - a long 16 digit or something like that
             * @return {void}
             */
            displayPublicProfile : function(uuid) {
                // for livefyre activity tab in edit profile
                userProto.userLivefyre.lookUpUUID = uuid;
                badgeProto.getBadgesFromOthers.turnIdToEmail(uuid);
                janrain.capture.ui.getPublicProfile('publicProfile', uuid);

                //livefyreProto.API.displayDataToPublicProfile(uuid);
            },

            // different screens of janrain
            screen : {

                currentScreen : null,
                stateLookUp : true,
				postAjaxInit : false,
                failedToUpdate : null,
                stateOfEditProfile : false,

                editProfile : {

                    reloadProfile : function(){

                        if (requireProto.janrainFlow === 'profileFlow') {

                            $('#captureAccessDeniedBuiltIn').remove();
                            janrain.capture.ui.renderScreen('editProfile');
                        }
                    },

                    onProfileUpdate : function(result) {

                        window.scrollTo(0,0);
                        livefyreProto.API.onProfileUpdate();

                        //whatCounts
                        //whatCProto.subscribe();
                        //whatCProto.unsubscribe();
                        whatCProto.updateSub();
                        //whatCProto.updateSubscribeState();

                        eventsProto.janrain.screen.failedToUpdate = false;

                        //Omnnitre
                        omnitureProto.profileUpdates();

                      //Badegeville related
                        eventsProto.janrain.screen.editProfile.completedProfileCheck();
                    },

                    // janrain provided code, but i think it is not working
                    onProfileAutoSave : function(response) {

                        if ('durationSinceLastUpdate' in response) {
                            document.getElementById('capture_profile_saved').style.display = "block";
                            document.getElementById('capture_alert_callout').innerHTML = response.durationSinceLastUpdate;
                        }
                    },
                    // profile form check to give points to badgeville
                    completedProfileCheck : function() {
                        var completion = false,
                            zip    = $('#capture_editProfile_edit_zip').attr('value'),
                            city   = $('#capture_editProfile_edit_city').attr('value'),
                            first  = $('#capture_editProfile_edit_firstName').attr('value'),
                            email  = $('#capture_editProfile_edit_email').attr('value'),
                            gender = $('#capture_editProfile_edit_gender').attr('value'),
                            country  = $('#capture_editProfile_edit_country').find('option:selected').attr('value'),
                            address  = $('#capture_editProfile_edit_address1').attr('value'),
                            lastname = $('#capture_editProfile_edit_lastName').attr('value');

                        if(first !== '' && lastname !== '' && email !== '' && country !== '' && address !== '' && city !== ''
                            && zip !== '' && gender !== 'default' && first !== ' ' && lastname !== ' ' && email !== ' '
                            && address !== ' ' && city !== ' ' && zip !== ' ' ){
                            badgeProto.trigger('completeProfile',userProto.uuid);
                        }else{

                        }
                    },

                    // whatcounts related, to let know from a janrain Event LIstener that update has failed
                    onProfileFailedSave : function() {

                        //whatCProto.lookUpUser();
                        eventsProto.janrain.screen.failedToUpdate = true;
                    }
                },

                registration : {
                    clearInput : function() {

                    }
                },

                // onCaptureModalReady from janrain event trigger
                uiReady : function() {
                    if(requireProto.janrainFlow === 'profileFlow'){
                        janrain.capture.ui.renderScreen('editProfile');

                    }else if(requireProto.janrainFlow === 'emailFlow'){
                        janrain.capture.ui.renderScreen('registrationVerify');
                    }else if(requireProto.janrainFlow === 'passwordFlow'){
                        janrain.capture.ui.renderScreen('resetPassword');
                    }
                },

               /**
                * [onScreenShow description] - onCaptureScreenShow janrain event triggere : this event allows to identify which screen is actually is triggered to display
                * also i think this is not exactly dom ready, but it does behave like so, until we got onreadyComplete to work correctly
                * @param  {object} response - type of a screen
                * @return {void}
                */
                onScreenShow : function(response) {

                    var _t = eventsProto.janrain.screen;
                    switch (response.screen){
                        case 'editProfile':
                            _t.currentScreen = 'editProfile';

                            // loader appears that is fugly, hiding it
                            $('#captureRetrievingUserDataBuiltIn').hide();
                               //To be Deployed Later
                                //setTimeout(function(){whatCProto.lookUpUser();},1000);
                            var countryEventAdded = false;

                            // not dom ready, had to use setTimeout, this needs to be pushed to onreadyComplete
                            // TODO
                            setTimeout(function() {

                                // back button in editProfile page
                                $('.cancel-button').click(function(){
                                	if(window.location.href.indexOf('#') > 1){
                                        window.history.go(-2);
                                    }else{
                                        window.history.go(-1);
                                    }
                               });

                                function _addListener(element, type, listener) {
                                    if (element == null) return false;
                                    if (typeof window.attachEvent === 'object') {
                                        element.attachEvent('on' + type, listener);
                                    } else {
                                        element.addEventListener(type, listener, false);
                                    }
                                }

                                var countrySelect = document.getElementById('capture_editProfile_edit_country'),
                                    stateSelect   = $('#capture_editProfile_edit_state'),
                                    statePublic   = $('#capture_editProfile_display_indicator_public_edit_state'),
                                    statePrivate  = $('#capture_editProfile_display_indicator_private_edit_state'),
                                    stateCheckPublic = $('#capture_editProfile_display_option_public_edit_state'),
                                    stateCheckPrivate= $('#capture_editProfile_display_option_private_edit_state'),
                                    realValue = $('#capture_editProfile_form_item_edit_state').find('input');

                                // default states had to be corrected in editProfile page
                                function toggleStateSelect() {
                                    if (!countrySelect || !stateSelect) return false;

                                    var stateVal =  stateSelect.find('option:selected').attr('value');

                                    if (countrySelect.options[countrySelect.selectedIndex].value === 'United States') {
                                        if (stateSelect) {
                                            if(stateSelect.attr('disabled') && stateVal !== 'state'){
                                                statePublic.removeClass('capture_toggled');
                                                statePrivate.addClass('capture_toggled');

                                                stateCheckPublic.removeClass('capture_checked');
                                                stateCheckPrivate.addClass('capture_checked');

                                                realValue.attr('value','private');
                                                stateSelect.attr("disabled", false);
                                                stateSelect.css({'color':'black'});
                                            }else if(stateSelect.attr('disabled') && stateVal === 'state'){
                                                stateSelect.attr("disabled", false);
                                                stateSelect.css({'color':'black'});
                                            }
                                        }
                                    } else {
                                        if (stateSelect) {
                                            realValue.attr('value','private');

                                            stateSelect.attr("disabled", true);
                                            stateSelect.css({'color':'lightgrey'});

                                            statePublic.removeClass('capture_toggled');
                                            statePrivate.addClass('capture_toggled');

                                            stateCheckPublic.removeClass('capture_checked');
                                            stateCheckPrivate.addClass('capture_checked');
                                        }
                                    }
                                }

                                if (countrySelect && !countryEventAdded) {
                                    countryEventAdded = true;
                                    _addListener(countrySelect, 'change', toggleStateSelect);
                                }

                                toggleStateSelect();

                                //whatcounts
                                //whatCProto.lookUpUser();



                            },100);

                            //Password Removal for social registered users
                            try {
                                var loginMethod, passEl = $('.janrain_traditional_account_only');

                                if (typeof window.localStorage !== 'undefined') {
                                    loginMethod = localStorage.getItem('janrainLastAuthMethod');
                                    removePass();

                                } else {
                                    loginMethod = $.cookie('janrainLastAuthMethod');
                                    removePass();
                                }

                                function removePass() {
                                    if(loginMethod === 'socialSignin' && passEl.size() > 0){passEl.remove();}
                                }
                            } catch(e) {}

                            break;
                        case 'publicProfile':
                            var createAcc = $('.make-acc');

                            if (!janrainProto.session) {
                                createAcc.show();
                                /*createAcc.click(function(e){
                                    log('e_make-acc',e);
                                    e.preventDefault();
                                    window.janrain.capture.ui.renderScreen('signIn');
                                    return false;
                                });*/
                            } else {
                              createAcc.hide();
                            }

                            // loadBadgeville
                            badgeProto.setUp();

                            break;
                        case 'forgotPasswordSuccess':

                            if (window.FOX_Janrain_Page_Type === 'password-reset') {
                                setTimeout(function(){
                                    window.location = 'http://www.foxnews.com';
                                },5000);
                            }

                            break;
                        case 'returnTraditional':

                            setTimeout(function(){
                                var displayName = janrain.capture.ui.getProfileCookieData('displayName'),
                                    displayNameSpan = document.getElementById('displayNameData');

                                if (displayName && displayNameSpan) {
                                    displayNameSpan.innerHTML = displayName;
                                }
                            },500);

                            break;
                        case 'registrationVerified':
                        	var time = $('#redirectTime'),count = 9;

                            secondTimer();
                            function secondTimer(){
                                setTimeout(function(){
                                    if(count === 0){
                                        window.location = 'http://www.foxnews.com/community/user/profile/edit';
                                    }
                                    time.html(' '+count+((count <= 1) ? ' second' :' seconds'));
                                    count-=1;
                                    secondTimer();
                                },1000);
                            }
                            break;
                        default:
                        break;
                    }
                },
                /**
                 * [onRenderComplete description] - onCaptureRenderComplete janrain event trigger :  this is DOM ready trigger, and this what should be used
                 * to identify the modal screen sate
                 * @param  {object} responce
                 * @return {void}
                 */
                onRenderComplete : function(responce) {


                    var _t = eventsProto.janrain.screen;

                    switch (responce.screen) {

                        case 'editProfile':

                            //Whatcounts inital ajax call and when it is just an update
                            if (_t.stateLookUp) {

                                whatCProto.lookUpUser();  //_t.stateLookUp = false;
                            } else if (_t.failedToUpdate){
                                whatCProto.onFail();
                            } else {
                                whatCProto.updateSubscribeState();
                            }

                            //When input is wrong in EditProfile Page
                            // Also triggers ureport and livefyreActivity these are Tabs in editPRofile pages
                            // setTimeout is essential, some elements; particulary eventListenrs are not dom ready, when this executes
                            var domIt = setTimeout(function(){
	                            try {
	                            	if (responce.builtInScreenRendered === 'retrievingUserData' && responce.renderingBuiltInScreen ){
	                                    eventsProto.janrain.screen.stateOfEditProfile = true;
	                                } else if (eventsProto.janrain.screen.stateOfEditProfile && _t.failedToUpdate == null){
	                                    uReportProto.uReportTab();
	                                    livefyreProto.activityTab.initCallFromJanrain();
	                                } else if (eventsProto.janrain.screen.stateOfEditProfile && !_t.failedToUpdate){
	                                    uReportProto.uReportTab();
	                                    livefyreProto.activityTab.loadDataWhenFailed();
	                                    badgeProto.getBadgeFromSelf.gatherUserInfo();
	                                } else if (eventsProto.janrain.screen.stateOfEditProfile && _t.failedToUpdate){
	                                    //uReportProto.uReportTab();
	                                    //livefyreProto.activityTab.initCallFromJanrain();
	                                    livefyreProto.activityTab.loadDataWhenFailed();
	                                    badgeProto.getBadgeFromSelf.gatherUserInfo();
	                                }
	                            } catch(e) {
	                                if(eventsProto.janrain.screen.stateOfEditProfile){
	                                    uReportProto.uReportTab();
	                                    livefyreProto.activityTab.initCallFromJanrain();
	                                    badgeProto.getBadgeFromSelf.gatherUserInfo();
	                                }
	                            }
	                            clearTimeout(domIt);
                            },100);
                        break;

                        case 'publicProfile':

                            // making sure that public profile loaded, and check if lifeyre UUID is in object and make a request to display data
                            if (!responce.renderingBuiltInScreen){
                                janrainProto.publicProfileLinkUUID();
                                if ('lookUpUUID' in userProto.userLivefyre) {

                                    livefyreProto.API.displayDataToPublicProfile(userProto.userLivefyre.lookUpUUID);
                                } else {
                                    livefyreProto.API.displayDataToPublicProfile(userProto.uuid);
                                }

                                // ureport # to display in publicProfile
								auth_fox.ureport.uReportIdLookupAndDisplay($('.capture_display_name').text(),true);

								// badgeville Diplay badge
                                if (typeof Badgeville !== 'underfined') {
                                	if (requireProto.janrainFlow === 'profileFlow') {
                                		badgeProto.getBadgesFromOthers.turnIdToEmail(responce.flow.userUUID);
                                    }
                                    badgeProto.getBadgesFromOthers.getPlayer(badgeProto.getBadgesFromOthers.email);
                                }
                            }
                        break;
                    }

                    //Change for email resend text
                    var link = document.getElementById("capture_editProfile_resendLink");

                    if (link) {

                        link.hasBeenClicked = false;
                       /* if(link.innerHTML === 'Resend confirmation email'){
                            link.innerHTML = 'Email Sent';
                        }*/
                        $(link).click(function(){
                            link.hasBeenClicked = true;
                        });
                    }

                    //Reset Password
                    var div = document.getElementById("forgotPassword");
                    if (div && div.style.display === "block") {
                        if (janrainProto.reset) {
                            document.getElementById("capture_forgotPassword_forgotPassword_emailAddress").value = "";
                            document.getElementById("capture_forgotPassword_forgotPasswordForm_errorMessages").style.display = "none";
                        }
                    }
                }
            },

            share : {

                shareSendComplete : function(response) {

                    omnitureProto.emailShareSuccess();

                }
            },

            errorEvent : function(response) {


                try{
                    switch (response.stat){
                        case 'error' :
                            break;
                        default:

                            break;
                    }
                }catch(e){

                }

            },

            onModalClose : function() {
                janrainProto.reset = true;
            },

            validation : {

                onValidationSuccess : function(){
                    var div = document.getElementById("forgotPassword");

                    if (div && div.style.display === "block") {
                        janrainProto.reset = false;
                    }
                }
            },

            emailSent : function(result) {
                var link = document.getElementById("capture_editProfile_resendLink"),
                	linkDiv = $(link).parent();

                if (link) {
	                if (link.hasBeenClicked) {
                    linkDiv[0].removeChild(link);
                    linkDiv.append('<a style="cursor: default; ">Email Sent</a>')
                }
            }
            }
        },

        livefyre : {

            displayLogo : function() {
                $('#livefyre_comment_stream').append('<div id="powered_by_livefyre_new"><a href="http://livefyre.com" target="_blank">Powered by Livefyre</a></div> ');
            },

            hashComment : function() {
                var meta;
                try {
                    if (window.FOX_metadescriptor && window.FOX_metadescriptor.name['prism.subsection1'] === 'willisreport'){
                        $('#livefyre_comment_stream').prepend('<div id="commentsthread"></div>');
                    }
                    else if (window.location.host.indexOf('nation') > -1 || $('meta[name="dc.type"]').attr('content') === 'Text.Article'){
                        var aHref = $('.dv-util > .dv-util-1 > a:eq(1)'), newUrl = aHref.attr('href');
                        newUrl = newUrl.replace('#disqus_thread','#commentsthread');

                        aHref.attr('href',newUrl);
                        $('#livefyre_comment_stream').prepend('<div id="commentsthread"></div>');
                    } else {
                    	$('#livefyre_comment_stream').prepend('<div id="commentsthread"></div>');
                        //$('#livefyre_comment_stream').prepend('<div id="disqus_thread"></div>');
                    }
                } catch(e) {}

            },

            logOut : function() {
                $.loadAttempt(60,250,function(){
                    return ($('#livefyre_comment_stream').find('.fyre-user-loggedin').size() > 0) ? true : false;
                },function(){

                    //livefyreProto.eventsDelegate.logout();
                    fyre.conv.BackplaneAuthDelegate.prototype.logout();
                    window.Backplane.expectMessages('identity/logout');
                });
            },

            populatePublicProfile : function() {
                var dom = domProto.setDomReady().publicProfile();
                //livefyreProto.API.execute(function(){

                    dom.comments.text(userProto.commentCount);
                    dom.likes.text(userProto.likeCount);
                //});

                userProto.commentCount = 0;
                userProto.likeCount = 0;
            }
        },

        badgeVille : {
            backplane : function() {
                //badgeProto.setUp();
            }
        },

        displayName : function() {
            var _t = this, dom = domProto.setDomReady();

            if (dom.acc.hasClass("alt-style")) {
				dom.user.find(".encapsulate p").html('Welcome, <strong>' + userProto.displayName + '</strong>');
			} else {
                if(dom.name.size() > 0){
                    dom.name.text(userProto.displayName);
                }else if(auth_fox.dom.setDomReady().userOptions.find('p').size() > 0 ){
                    auth_fox.dom.setDomReady().userOptions.find('p').html('You\'re logged in as<span>' + userProto.displayName + '</span>');
                }

			}

            eventsProto.domEvents.loginSuccess();
        },

        // handles account dom behaviors, executed on docReady
        accountFuncBehaviour : function() {
            var dom = domProto.setDomReady(), _t = this;


            dom.login.addClass(requireProto.classLogin);//needs this class to login

            //dom.register.unbind('click');
            dom.login.bind('click',eventsProto.janrain.signin);
            dom.register.bind('click',eventsProto.janrain.traditionalSigin);
            dom.logout.bind('click', eventsProto.janrain.signOut);
        },

        editProfile : function(e){// this on click event to Edit Profile

            window.location = CONFIG.editProfile;
            //window.open(editProfile,'_blank');
        },

        displayShowsProfile : function(){
            var user = domProto.setDomReady().acc.find('strong');

            user.css('cursor','pointer');
            user.click(function(){
                eventsProto.editProfile();
                return false;
            })
        }
    };
    /* -------------End EVENTS--------------*/

    /*=========================================================================================
            USER DATA
     ========================================================================================*/

	userConst = function(){
    };

    // User information is storred in this object
    userProto = {
        uuid  : null,
        email : '',
        likeCount : 0,
        commentCount : 0,
        displayName  : '',
        userJanrain  : {},
        userLivefyre : {},
        userBadgeville : {}
    };