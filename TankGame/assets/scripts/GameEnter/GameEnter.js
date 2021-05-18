let EventManager=require("EventManager");
let EventMap=require("EventMap");

cc.Class({
    extends: cc.Component,

    properties:()=>( {
       
    }),

  
    start:function () {
       
        //EventManager Initial
        EventManager.getInstance().initial();
        this.checkEventManagerOK();
    },


    //check EventManager initial OK
    //start other manager initial when EventManager initial OK
    checkEventManagerOK:function(){

        if(!EventManager.getInstance().checkReady()){

            this.scheduleOnce(function(){
                this.checkEventManageOK();
            }.bind(this),0.1)
        }
        else{// EventManager is initial OK, other manager initial start

            let eventData={};
            eventData["eventName"]=EventMap.InitialManagerInitial;
            EventManager.getInstance().doWork(eventData);
        }
    }
});
