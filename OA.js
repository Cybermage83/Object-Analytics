window.objectAnalytics = (function (console) {
            /*syntax minor commit
            @settings : 'default','custom'
            @objects : [{'namespace':object,name: function&Constructor}]
            */
            var OA = function (settings, objects, objectListner) {
                var _t = this,name;
                _t.collection = []; _t.objectList = {};
                if (typeof settings !== 'string') { console.log('Please use string for settings'); return false;}
                if (!(objects instanceof Array)) { console.log('Please use [{"namespace":object}] for object'); return false;}

                if (this != window) {
                    //_t.t = this;
                    _t.objStructure = {};
                    _t.setConfig = settings;

                    for(var x = 0, l = objects.length; x< l; x+=1) {
                        for(var key in objects[x]){
                            if(objects[x].hasOwnProperty(key)){
                                if( key.indexOf('Const') == -1 && key.indexOf('excludeMethod') == -1){
                                    name = key;
                                }
                                if(key === 'excludeMethod'){

                                    for(var z = 0,ln = objects[x][key].length; z < ln; z+=1){
                                        //console.log('objects[x][name][key];',objects[x][name],'::',key,'::',objects[x][key][z],'::',objects[x][name][objects[x][key][z]]);
                                        delete objects[x][name][objects[x][key][z]];
                                    }

                                }
                            }
                        }
                    }

                    _t.objectsToAnalyse = objects;
                    _t.objectListner = objectListner;

                } else {
                    return new OA(settings,objects,objectListner).init();
                }

            };

            var o = {

                init : function(){console.log('OA initialized',this);
                    var _t = this;

                    // parent obj


                    if (typeof _t.objectListner !== 'undefined'){

                    } else {
                        _t.becomeAwareOfTheObject();
                    }

                },

                regexSearch : function () {

                },

                becomeAwareOfTheObject : function(){  //console.log('becomeAware',this);
                    var _t = this,arrObj =[], arrFunc = [];

                    for(var x = 0, l = _t.objectsToAnalyse.length; x < l; x+=1){
                        for(var key in _t.objectsToAnalyse[x]){//console.log('key',key,'obj',_t.objectsToAnalyse[x]);
                            if(_t.objectsToAnalyse[x].hasOwnProperty(key)){
                                if(key !== 'constructor'){
                                    var obj = _t.objStructure[key] = {};
                                    var el  = _t.objectsToAnalyse[x][key];
                                    obj.methods = {};
                                    //arrObj.push(key);
                                    //console.log('-------OBJECT CHECK--------------What am i passing here',el,key);
                                    objectCheck(el,key);

                                }else if(key.indexOf('Const') > -1){
                                    obj['constructor_t'] = _t.objectsToAnalyse[x][key].toString();
                                }
                            }

                        }
                    }

                    function objectCheck (object,key,name){
                        //console.log('-------INSIDE OBJECT CHECK : ',object,' <: Object :',key,' <: KEY : ',name,' <: NAME :');

                        for(var method in object){ //console.log('loop:: ','method ',method,' :: Element ',(name) ? name : key,'>> type', typeof object[method]);
                            arrObj.push(method+'_o');
                            deepCheck(object[method], method);
                            arrObj =[];
                        }

                    }

                    function deepCheck(object,method,name){
                        //console.log('INintial ArrayOBj',arrObj);
                        if(typeof object === 'function'){

                            obj.methods[method+'_f'] = object.toString();
                        }
                        for( var meth in object){
                            //console.log('OBJECT',object,'METHOD',method,'TYPE',(typeof object[meth] === 'function'),"meth",meth,'NAME',name);
                            if(object.hasOwnProperty(meth)){
                                if(typeof object[meth] === 'function'){
                                    //console.log('FUNCTION1',arrFunc,'OBJECT',arrObj);
                                    arrFunc = arrObj;
                                    arrFunc.push(meth+'_f');

                                    var arr = arrFunc.join('.');
                                    obj.methods[arr] = object[meth].toString();

                                    //console.log('Final >> ArrObj',arrObj);
                                    if(arrObj.length > 0){arrObj.pop();}
                                    //console.log('TRUE Final >> ArrObj',arrObj);
                                    //arrFunc=[];
                                }else if(typeof object[meth] === 'object'){
                                    if(arrObj[arrObj.length] !== meth){
                                        arrObj.push(meth+'_o');
                                    }
                                    //console.log('ArrObj',arrObj);
                                    //console.log('|||||||||--Object Check,',object[method],((name)? name: method),meth);
                                    deepCheck(object[meth],((name)? name: method),meth);

                                }

                            }
                        }
                    }

                    return _t;
                },

                displayTreeToDom : function(){//console.log('displayTreeToDom,Executed');
                    var _t = this, tree = $('#tree'),ul = document.createElement('ul'),li = document.createElement('li'),arr=[];
                    //console.log('_t.objStructure',_t.objStructure,ul,li);
                    for(var key in _t.objStructure){
                        arr.push('<li>');
                        arr.push('<ul>');
                        arr.push('<p>');
                        arr.push(key);

                        for(var el in _t.objStructure[key]){
                            arr.push('<li>');
                            arr.push('<ul>');
                            arr.push('<p>');
                            arr.push(el);

                            if(el !== 'constructor'){
                                for(var method in _t.objStructure[key][el]){
                                    arr.push('<li>');
                                    arr.push('<ul>');
                                    arr.push('<p>');
                                    arr.push(method);
                                    arr.push('</p>');
                                    arr.push('</ul>');
                                    arr.push('</li>');
                                }
                            }

                            arr.push('</p>');
                            arr.push('</ul>');
                            arr.push('</li>');
                        }

                        arr.push('</p>');
                        arr.push('</ul>');
                        arr.push('</li>');
                    }

                    arr = arr.join('');
                    tree.html(arr);

                    return _t;
                },

                findMeMethods : function(){
                    var _t = this;

                    for(var x = 0, l = _t.objectsToAnalyse.length; x<l; x+=1){
                        for(var obj in _t.objectsToAnalyse[x]){
                            if(_t.objectsToAnalyse[x].hasOwnProperty(obj)){
                                for(var otherObj in _t.objStructure){
                                    if(_t.objStructure.hasOwnProperty(otherObj)){
                                        //console.log('otherObj',otherObj, 'obj', obj);
                                        if(otherObj === obj){
                                            //console.log('OKie Lets ROll Deeper',_t.objStructure[otherObj]);
                                             var holder = _t.objectList[obj] = {};

                                            holder.name = obj;
                                            holder.analytics = {};
                                            holder.constructor = _t.objStructure[otherObj].constructor;

                                            for(var method in _t.objStructure[otherObj].methods){
                                                //console.log('objStructure','Method',method,'String',_t.objStructure[otherObj].methods[method]);
                                                if(_t.objStructure[otherObj].methods.hasOwnProperty(method)){
                                                    holder.analytics[method] = [];
                                                }
                                            }

                                            for(var method in _t.objStructure[otherObj].methods){
                                                if(_t.objStructure[otherObj].methods.hasOwnProperty(method)){
                                                    _t.identifyObjectsInString( method, _t.objStructure[otherObj].methods[method], obj );
                                                }
                                            }

                                            _t.collection.push(_t.objectList[obj]);
                                        }
                                    }

                                }
                            }
                        }
                    }

                },

                integrateCrossObjectMethods : function () {
                    var _t = this, col = _t.collection, struct = _t.objStructure;

                    for(var x = 0, l = col.length; x < l; x+=1){

                        if(col[x].name.indexOf('Const') == -1){
                            for(var anal in col[x].analytics){
                                if(col[x].analytics.hasOwnProperty(anal)){
                                    for(var obj in struct){
                                        if(struct.hasOwnProperty(obj)){
                                            if(obj.indexOf('Const') == -1 && col[x].name !== obj){
                                                for( var methods in struct[obj].methods){
                                                    //console.log('ORIGNAIL',col[x].name,'OBJ',obj,'Anal',anal,'method',methods,'OBject',col[x],'STRING',struct[obj].methods[methods]);
                                                    if(struct[obj].methods.hasOwnProperty(methods)){
                                                        _t.spotMethod(anal,struct[obj].methods[methods],col[x],methods,obj);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    _t.integrationDone = true;
                },

                identifyObjectsInString : function (method,string,objName) {
                    var _t = this, obj = _t.objectList[objName],newMethod;
                    //console.log('method',method,'code',string,'obj',obj);

                    //console.log('new Method',newMethod);
                    for(var meth in obj['analytics']){
                        if(obj['analytics'].hasOwnProperty(meth)){
                            newMethod = _t.correctingMethod(meth,'complex');
                            //console.log('new Method',newMethod,newMethod instanceof Array);
                            if(newMethod instanceof Array){
                                newMethod = newMethod.join('.');
                                //console.log('ARRAY MEthod',newMethod);
                                if(string.indexOf(newMethod+'(') > -1 || string.indexOf(newMethod+' ') > -1){//console.log('FOUND!! in ARRAY');
                                    obj['analytics'][meth].push(_t.correctingMethod(method,'path',objName));
                                }
                            }else{
                                //console.log('NORMAL NewMehtod',newMethod);
                                if(string.indexOf(newMethod+'(') > -1 || string.indexOf(newMethod+' ') > -1){//console.log('FOUND VIA NORMAL');
                                    obj['analytics'][meth].push(_t.correctingMethod(method,'path',objName));
                                }
                            }
                        }
                    }

                    _t.pushToAnalyticsRaw();
                },

                spotMethod : function (method,string,obj,altMethod,altObj) {
                    var _t = this, newMethod = _t.correctingMethod(method,'complex');

                    if(newMethod instanceof Array){
                        newMethod = newMethod.join('.');
                        //console.log('ARRAY MEthod',newMethod);
                        if(string.indexOf(newMethod+'(') > -1 || string.indexOf(newMethod+' ') > -1){//console.log('FOUND!! in ARRAY');
                            obj['analytics'][method].push(_t.correctingMethod(altMethod,'path',altObj));
                        }
                    }else{
                        //console.log('NORMAL NewMehtod',newMethod);
                        if(string.indexOf(newMethod+'(') > -1 || string.indexOf(newMethod+' ') > -1){//console.log('FOUND VIA NORMAL');
                            obj['analytics'][method].push(_t.correctingMethod(altMethod,'path',altObj));
                        }
                    }

                },

                correctingMethod : function(method,type,objName){
                    var _t = this, newMethod = method.replace(/\_o/gi,'').replace(/\_f/gi,'');

                    switch (type){
                        case 'path':
                            newMethod = objName+'.'+newMethod;
                            break;
                        case 'complex':
                            //console.log('!!newmothd',newMethod,newMethod.split('.'));
                            var temp = newMethod;

                            temp = temp.split('.');
                            //console.log('Defaul',newMethod,'temp',temp,temp.length);
                            if(temp.length > 2){
                                newMethod = temp.slice(-2);
                            }else{
                                newMethod = '.'+newMethod;
                            }

                            break;
                        default:
                        break;
                    }


                    return newMethod;
                },

                loadExternalJavaScripts : function(arr,callback){
                    var _t = this, constructionFunction =['console.log("this",this);$.when('];

                    if(arr instanceof Array){
                        for(var x = 0, len = arr.length; x < len; x+=1){
                            constructionFunction.push('this.events.jqAjax("'+arr[0]+'")');//'$.ajax({url : "'+arr[0]+'",dataType:"script",async:true})');//'jqAjax("'+arr[0]+'")');
                            if(x < len-1 && len != 1){
                                constructionFunction.push(',');
                            }
                        }
                        constructionFunction.push(').then(this.events.onSuccess,this.events.onFailure);');
                        var construct =  constructionFunction.join('');
                        //console.log('construction',construct);
                        var jsLoader = new Function (construct);
                        //console.log('new Made Function',jsLoader);
                        var jsLD = $.proxy(jsLoader,_t);
                        //console.log('THIS',_t,jsLD);
                        jsLD();
                    }else{
                        //console.log('please provide an Array ');
                    }
                },

                events : {
                    jqAjax : function(path){
                        //console.log('this',this);
                        $.ajax({url : path,dataType:'script',async:true});
                    },

                    onSuccess : function(){
                        console.log('All JS loaded, thank you for your time ;p');
                    },

                    onFailure : function(){
                        console.log('All JS failed to load');
                    }

                },

                pushToAnalyticsRaw : function (){
                    var _t = this;

                    if(!'integrationDone' in _t){console.log('please make sure that cross object iteration is complete'); return false;}

                    _t.analyticsRaw = {};

                    for(var object in _t.objectList){//objectList>>objectName

                        _t.analyticsRaw[object] = _t.objectList[object];
                    }

                },

                configureAnalyticsForJson : function(){
                    var _t = this,json,path,tempPath,count = 0, levelStorage ={};

                    json = _t.jsonReady = {};
                    for(var object in _t.analyticsRaw){
                        json[object] = {};
                        json[object]['methods'] = {};
                        json[object]['object'] = {};
                        for(var anal in _t.analyticsRaw[object]){

                            if(anal === 'analytics'){
                                for(var method in _t.analyticsRaw[object][anal]){
                                    var objStorage = {};
                                    path = breakupMethod(method);
                                    //console.log('path',path,!(path instanceof Array));
                                    if(!(path instanceof Array)){
                                        //console.log('function');

                                        json[object]['methods'][object+'.'+path] = _t.analyticsRaw[object][anal][method];
                                    }else{
                                        var temp = object+'.';
                                        for(var x = 0,len = path.length;x<len;x+=1){
                                            if(path[x].indexOf('_o') > -1){

                                                temp+=path[x].replace('_o','.');
                                            }else{
                                                temp+=path[x].replace('_f','');
                                            }

                                        }
                                        //console.log('WHAT IS TEMP',temp);
                                        json[object]['object'][temp] = _t.analyticsRaw[object][anal][method];
                                    }

                                }

                            }
                        }
                    }

                    function breakupMethod(method){
                        if(method.indexOf('.') != -1){
                            return method.split('.');
                        } else {
                            return method.replace('_f','');
                        }

                    }
                },

                turnMe : function(){
                    var _t = this;
                    return {
                        json : function(object){
                            console.log('o',_t);
                           _t.jsonData = JSON.stringify(_t.jsonReady);
                            return JSON.stringify(object);
                        },
                        object : function(){

                           _t.jsonObject = JSON.parse(_t.jsonData);
                            return JSON.parse(_t.jsonData);
                        }
                    };
                },

                codeFlowerGraph : function () {
                    var _t = this, sizeMultiplier = 100;
                    // source http://redotheweb.com/CodeFlower/
                    return {
                        parseJson : function () {
                            var json   = _t.turnMe().object(),
                                flower = {};
                            console.log('json',json);
                            flower['name'] = 'root';

                            for (var obj in json) {
                                if(json.hasOwnProperty(obj)) {
                                    if (!('children' in flower)) {
                                        flower['children'] = [];

                                    }
                                    var flowerParent = flower;
                                    if (obj.indexOf('Const') === -1) {
                                        var chart = {name : obj,children : [], size:0}; // size
                                        flowerParent.children.push(chart);
                                        var objectPostion = flowerParent.children.length-1;
                                        console.log('objecPosition',objectPostion);
                                        for (var name in json[obj]) {
                                            var size = 0;
                                            if (json[obj].hasOwnProperty(name)) {

                                                for(var method  in json[obj][name]) {

                                                    if(json[obj][name][method].length === 0) {

                                                        var methody = {
                                                            name : method,
                                                            size : 0.65 * sizeMultiplier,
                                                            language : obj
                                                        };
                                                        flowerParent.children[objectPostion].children.push(methody);
                                                        size +=1;
                                                    } else {

                                                        var extendMethod = {
                                                            name : method,
                                                            children : [],
                                                            size: sizeMultiplier * 100
                                                        };

                                                        for ( var x = 0, l = json[obj][name][method].length; x < l; x+=1) {

                                                            var item = {
                                                                name : json[obj][name][method][x],
                                                                size : 1.25 * sizeMultiplier,
                                                                language: obj
                                                            };

                                                            extendMethod.children.push(item);
                                                            size +=1;
                                                        }
                                                        flowerParent.children[objectPostion].children.push(extendMethod);
                                                    }
                                                }
                                                flowerParent.children.size = size * sizeMultiplier;
                                            }

                                        }


                                    }
                                }

                                var sizer = function () {
                                    //
                                };
                            }

                            _t.flowerJson = flower;

                            return this;
                        },

                        displayFlower : function (id, size, jsonData) {

                            var id = id || '#flower',
                                size = size || {width: window.innerWidth, height : window.innerHeight},
                                data  =jsonData || _t.flowerJson; //_t.turnMe().object(_t.turnMe().json(_t.flowerJson));
                            console.log('id',id,'size',size,'data',data);
                            var myFlower = new CodeFlower(id, size.width, size.height);
                            myFlower.update(data);
                        }
                    };
                },

                sortIdentifiedObjects : function(){

                },

                startDrawingObjectRelations : function(){

                },

                start : function(){
                    var _t = this;

                    _t.becomeAwareOfTheObject();
                    _t.findMeMethods();
                    _t.integrateCrossObjectMethods();
                    _t.configureAnalyticsForJson();
                    _t.turnMe().json();

                    _t.codeFlowerGraph().parseJson().displayFlower();


                },

                help : function(){
                    console.log('How to Use Object Analytics');
                    console.log('First: execute objecAnalytics like so: window.OA = new window.objectAnalytics("default",[{"namespace" :object,"constructorName":function},objects..]);');
                    console.log('       parameters explained: @default = string and determines how the object is handled, use default if not sure');
                    console.log('       parameters explained: @[namespace,object,function] = namespace for your object, object that you wish to passe through, function is constructor to object');
                    console.log('       multiple arrays can follow, and can be cross examined against each other.');
                    console.log('-------------------------------------------------------------------------------');
                    console.log('Second: execute methods from your new object. OA.becomeAwareOfTheObject()');
                    console.log('        becomeAwareOfTheObject gathers every single object and function from your parsed array');
                    console.log('-------------------------------------------------------------------------------');
                    console.log('Three: Optional* displayTreeDom(), this will display all gather objects and functions into a dom');
                    console.log('-------------------------------------------------------------------------------');
                    console.log('Four : Execute method findMeMethods(), this may take a while! depending on the complexity of your object and a number of them. This call finds every single method in your object');
                    console.log('       methods are loaded into objStructure and objectList');
                    console.log('-------------------------------------------------------------------------------');
                    console.log('Five : Execute method integrateCrossObjectMethods() this method cross checks objects and their methods and identifies them in objectList under Analytics');
                },

                visualizeME : function(){

                }

            };

            OA.prototype = o;

            return OA;
        })(window.console);

        $(document).ready(function(){
            window.OA = new window.objectAnalytics('default',[{'events':eventsProto,'eventsConst':eventsConst},
                        {'badgeville':badgeProto,'badgeConst':badgeConst},{'ureport':uReportProto,'uReportConst':uReportConst},
                        {'user':userProto,'userConst':userConst},{'omniture':omnitureProto,'omnitureConst':omnitureConst},
                        {'idms':idmsProto,'idmsConst':idmsConst}, {'livefyre':livefyreProto,'livefyreConst':livefyreConst},
                        {'whatcounts':whatCProto,'whatCConst':whatCConst,'excludeMethod':['dom']},         {'domProto':domProto,'domConst':domConst},{'toolProto':toolProto,'toolConst':toolConst},{'requireProto':requireProto,'requireConst':requireConst},{'janrainProto':janrainProto,'janrainConst':janrainConst}
            ]);

            OA.start();
        });
    /*
    ['tools',toolProto,toolConst],['dom',domProto,domConst],['require',requireProto,requireConst],
                        ['backplane', backplaneProto,backplaneConst],['janrain',janrainProto,janrainConst],
                        ['livefyre', livefyreProto, livefyreConst],['badgeville',badgeProto,badgeConst],
                        ['events',eventsProto,eventsConst],['ureport',uReportProto,uReportConst],
                        ['user',userProto,userConst],['omniture',omnitureProto,omnitureConst],
                        ['whatcounts',whatCProto,whatCConst],['idms',idmsProto,idmsConst]
    */
    /*window.OA = new window.objectAnalytics('default',[{'janrain':janrainProto,'janrainConst':janrainConst},
        {'require':requireProto,'requireConst':requireConst},{'livefyre':livefyreProto,'livefyreConst':livefyreConst},
        {'badgeville':badgeProto,'badgeConst':badgeConst}]);*/
    //OA.becomeAwareOfTheObject().displayTreeToDom().findMeMethods();
    /*
    window.OA = new window.objectAnalytics('default',[{'events':eventsProto,'eventsConst':eventsConst},
            {'badgeville':badgeProto,'badgeConst':badgeConst},{'ureport':uReportProto,'uReportConst':uReportConst},
            {'user':userProto,'userConst':userConst},{'omniture':omnitureProto,'omnitureConst':omnitureConst},
            {'idms':idmsProto,'idmsConst':idmsConst}, {'livefyre':livefyreProto,'livefyreConst':livefyreConst},
            {'whatcounts':whatCProto,'whatCConst':whatCConst,'excludeMethod':['dom']}
    ]);

    window.OA = new window.objectAnalytics('default',[{'events':eventsProto,'eventsConst':eventsConst},
                {'badgeville':badgeProto,'badgeConst':badgeConst},{'ureport':uReportProto,'uReportConst':uReportConst},
                {'user':userProto,'userConst':userConst},{'omniture':omnitureProto,'omnitureConst':omnitureConst},
                {'idms':idmsProto,'idmsConst':idmsConst}, {'livefyre':livefyreProto,'livefyreConst':livefyreConst},
                {'whatcounts':whatCProto,'whatCConst':whatCConst,'excludeMethod':['dom']},         {'domProto':domProto,'domConst':domConst},{'toolProto':toolProto,'toolConst':toolConst},{'requireProto':requireProto,'requireConst':requireConst},{'janrainProto':janrainProto,'janrainConst':janrainConst}
        ]);
    // {'whatcounts':whatCProto,'whatCConst':whatCConst},{'idms':idmsProto,'idmsConst':idmsConst}]);
    */
