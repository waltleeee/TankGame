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

        EventManager.getInstance().registerEvent(EventMap.ReportInitialFinish,this.reportInitialFinish.bind(this));
        EventManager.getInstance().registerEvent(EventMap.GameFlowManagerInitial,this.initial.bind(this));
    },
   

    //manager initial
    initial:function(inEventData){
    
        this.checkEventCallback(inEventData);
        EventManager.getInstance().sendEventWithData(EventMap.ReportInitialOK,ManagerList.GameFlowManager);
    },


    //when initial process finish, call this function
    reportInitialFinish:function(inEventData){

        this.checkEventCallback(inEventData);
        this.gameStart();
    },

    
    //game start
    gameStart:function(){

        EventManager.getInstance().sendEvent(EventMap.OffLoading);
    },


    //check event callback
    checkEventCallback:function(inEventData){

        if(inEventData.callback!==null)
            inEventData.callback();
    },
});
