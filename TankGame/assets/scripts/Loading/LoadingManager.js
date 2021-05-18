let EventManager=require("EventManager");
let EventMap=require("EventMap");
let ManagerList=require("ManagerList");

cc.Class({
    extends: cc.Component,

    properties:()=>( {
        
        loadingDisplay:{
            default:null,
            type:require("LoadingDisplay")
        }
    }),

    start:function () {

        this.registerEvent();
    },


    //register event name and function
    registerEvent:function(){

        EventManager.getInstance().registerEvent(EventMap.OpenLoading,this.openLoading.bind(this));
        EventManager.getInstance().registerEvent(EventMap.OffLoading,this.offLoading.bind(this));
        EventManager.getInstance().registerEvent(EventMap.LoadingManagerInitial,this.initial.bind(this));
    },
   

    //manager initial
    initial:function(inEventData){
    
        this.checkEventCallback(inEventData);
        this.sendEventWithData(EventMap.ReportInitialOK,ManagerList.LoadingManager);
    },


    //open loading
    openLoading:function(inEventData){

        this.checkEventCallback(inEventData);
        this.LoadingDisplay.openLoading();
    },


    //off Loading
    offLoading:function(inEventData){

        this.checkEventCallback(inEventData);
        this.loadingDisplay.offLoading();
    },
    

    //check event callback
    checkEventCallback:function(inEventData){

        if(inEventData.callback!=null)
            inEventData.callback();
    },


    //send event with data
    sendEventWithData:function(inEventName,inData){

        let eventData=EventManager.getInstance().makeEventData(inEventName,inData,null);
        EventManager.getInstance().doWork(eventData);
    },
    
});
