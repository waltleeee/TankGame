let EventManager=require("EventManager");
let EventMap=require("EventMap");
let ManagerList=require("ManagerList");

cc.Class({
    extends: cc.Component,

    properties:()=>( {
        
    }),

    start:function () {

        this.registerEvent();
    },


    //register event name and function
    registerEvent:function(){

        EventManager.getInstance().registerEvent(EventMap.SoundManagerInitial,this.initial.bind(this));
    },
   

    //manager initial
    initial:function(inEventData){
    
        this.checkEventCallback(inEventData);
        EventManager.getInstance().sendEventWithData(EventMap.ReportInitialOK,ManagerList.SoundManager);
    },


    //check event callback
    checkEventCallback:function(inEventData){

        if(inEventData.callback!=null)
            inEventData.callback();
    },
});
