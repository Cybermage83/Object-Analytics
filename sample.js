var sample = function(){this.something = 10;},myObject ={};
    sample.prototype  = {

        foo : function(){
            var _t = this;
            _t.odd = 2+2;
        },

        doo : function(){
            this.deeper.levelOne();
        },

        odd: 2,
        newTest :{
            check : function(){
                sample.newObject.check();
            }
        },

        deeper : {

            levelOne : function(){
                var _t = this;
                _t.leveltwo.funct();
                var o =_t.other();
            },

            leveltwo : {

                funct : function(){

                }
            },

            levelthree : {

                level  : {

                    func : function(){
                        myObject.something.just();
                    }
                }
            },

            levellevel :{
                ff :function(){},
                LL : {
                    aa :function(){},
                    SS : {
                      ss : function(){},
                      OO :{
                          oo: function(){
                              myObject.meth();
                          }

                      }
                    }
                }
            }
        },
        newObject : {
            check: function(){
                sample.deeper.leveltwo.funct();
            }
        },

        other : function(){
            var _t = this;

            return {

                levelTwo :  function(){
                    var _t = this;
                    _t.levelFour();
                },

                levelthree: _t.deeper.levelthree.level.func(),

                levelFour : function(){

                }
            }
        }
    };


    var myObject = {

        something: {
            aTest : function(){
                sample.deeper.levelthree.level.func();
            },

            just : function(){

            },

            simpleIt : {
                okie : function(){
                   sample.other();
                }
            }
        },
        meth : function(){

        },

        deeepASS : {
            how : {
                deep : {
                    can : {
                        it : {
                            go : function(){
                                sample.newObject.check();
                            }
                        }
                    }
                }
            }
        }
    };

    window.SAMPLE = new sample();