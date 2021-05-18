

cc.Class({
    extends: cc.Component,

    properties:()=> ({
        
        mapManager:{
            default:null,
            type:require("MapManager")
        },

        upButton:{
            default:null,
            type:cc.Node
        },

        downButton:{
            default:null,
            type:cc.Node
        },

        leftButton:{
            default:null,
            type:cc.Node
        },

        rightButton:{
            default:null,
            type:cc.Node
        },
    }),

    start:function(){

        //lesten touch end and touch start event
        this.upButton.on(cc.Node.EventType.TOUCH_START, function (event) {this.onUpButton();}.bind(this));
        this.downButton.on(cc.Node.EventType.TOUCH_START, function (event) {this.onDownButton();}.bind(this));
        this.leftButton.on(cc.Node.EventType.TOUCH_START, function (event) {this.onLeftButton();}.bind(this));
        this.rightButton.on(cc.Node.EventType.TOUCH_START, function (event) {this.onRightButton();}.bind(this));
        this.upButton.on(cc.Node.EventType.TOUCH_END, function (event) {this.releaseUpButton();}.bind(this));
        this.downButton.on(cc.Node.EventType.TOUCH_END, function (event) {this.releaseDownButton();}.bind(this));
        this.leftButton.on(cc.Node.EventType.TOUCH_END, function (event) {this.releaseLeftButton();}.bind(this));
        this.rightButton.on(cc.Node.EventType.TOUCH_END, function (event) {this.releaseRightButton();}.bind(this));
        this.upButton.on(cc.Node.EventType.MOUSE_LEAVE , function (event) {this.releaseUpButton();}.bind(this));
        this.downButton.on(cc.Node.EventType.MOUSE_LEAVE , function (event) {this.releaseDownButton();}.bind(this));
        this.leftButton.on(cc.Node.EventType.MOUSE_LEAVE , function (event) {this.releaseLeftButton();}.bind(this));
        this.rightButton.on(cc.Node.EventType.MOUSE_LEAVE , function (event) {this.releaseRightButton();}.bind(this));
    },


    //press up button
    onUpButton:function(){

        this.mapManager.onUpButton();
    },

    //release up button
    releaseUpButton:function(){

        this.mapManager.releaseUpButton();
    },


    //press down button
    onDownButton:function(){

        this.mapManager.onDownButton();
    },


    //release down button
    releaseDownButton:function(){

        this.mapManager.releaseDownButton();
    },


    //press left button
    onLeftButton:function(){

        this.mapManager.onLeftButton();
    },


    //release left button
    releaseLeftButton:function(){

        this.mapManager.releaseLeftButton();
    },


    //press right button
    onRightButton:function(){

        this.mapManager.onRightButton();
    },


    //release right button
    releaseRightButton:function(){

        this.mapManager.releaseRightButton();
    },


    //click fire button
    onFireButton:function(){

        this.mapManager.onFireButton();
    },

    //click change tank button
    onChangeTankButton:function(){

        this.mapManager.onChangeTankButton();
    },
});
