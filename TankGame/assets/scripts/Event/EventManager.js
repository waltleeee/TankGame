
let EventMap=require("EventMap");

let EventManager =(function() {
  
    let instance=null;
     
    function makeInstance() 
    {
    
      return {
        

        checkWaitWorkTime:0.1,//check wait work time

        isReady:false,// true: is initial finish   false: is not initial finish
        isCheckingWaitWork:false,// true :checking wait Event work   false: not checking wait event work

        eventFuncMap:{},//event name with function
        waitEventWorkList:[],//list for event work but event not register 
        

        checkReady:function(){

            return this.isReady;
        },


        //initial event function map
        initial: function(){
            
            let eventList=Object.keys(EventMap)
            for(let i=0 ;i<eventList.length;i++){

                this.eventFuncMap[eventList[i]]=null;
            }
           
            this.isReady=true;
        },


        //register event and function
        registerEvent:function(inEventName,inFunc){

            if(this.eventFuncMap[inEventName]===null)//can register
                this.eventFuncMap[inEventName]=inFunc;
            else if(this.eventFuncMap[inEventName]===undefined)//can not register
                console.log("!!! Event Name Not Exist"); 
            else//allready registered
                console.log("!!! Event Name is allready registered");      
        },


        //do event work
        doWork:function(inEventData)
        {
            if(inEventData===null || inEventData===undefined || inEventData.eventName===null || inEventData.eventName===undefined)
                return;

            if(inEventData.data===undefined)
                inEventData["data"]=null;

            if(inEventData.callback===undefined)
                inEventData["callback"]=null;    

            if(this.eventFuncMap[inEventData.eventName]===null){// event name exist but function not register 

                inEventData["isFinish"]=false;
                this.waitEventWorkList.push(inEventData);

                if(!this.isCheckingWaitWork){

                    this.isCheckingWaitWork=true;
                    setTimeout(this.checkWaitData.bind(this),this.checkWaitWorkTime);
                }
            }
            else if(this.eventFuncMap[inEventData.eventName]===undefined){//event name not exist

                console.log("!!! Event Name Not Exist");  
            }
            else{//event name exist and function registered

                this.eventFuncMap[inEventData.eventName](inEventData);
            }
        },


        //make data for event
        makeEventData:function(inEventName,inData,inCallback){

            let eventData={};
            eventData["eventName"]=inEventName;
            eventData["data"]=inData;
            eventData["callback"]=inCallback;

            return eventData;
        },


        //check wait event data
        checkWaitData:function(){

            //if event of wait event work is registered, do work
            for(let i=0;i<this.waitEventWorkList.length;i++){
            
                if(this.eventFuncMap[this.waitEventWorkList[i].eventName]!==null){

                  this.eventFuncMap[this.waitEventWorkList[i].eventName](this.waitEventWorkList[i]);
                  this.waitEventWorkList[i].isFinish=true;
                }
            }

            //delete wait event work about finish 
            let check=true;
            while(check){

                check=false;  
                for(let i=0;i<this.waitEventWorkList.length;i++){

                    if(this.waitEventWorkList[i].isFinish){

                        check=true;
                        this.waitEventWorkList.splice(i,1);
                        break;
                    }
                }
            }

            //check need to continue checkWaitData or not
            if(this.waitEventWorkList.length===0)
                this.isCheckingWaitWork=false;
            else
                setTimeout(this.checkWaitData.bind(this),this.checkWaitWorkTime);
        },


        //receive Event
        sendEvent:function(inEventName){

            if(inEventName===null ||inEventName===undefined)
                return;

            let eventData=this.makeEventData(inEventName,null,null);
            this.doWork(eventData);    
        },


        //receive event with data
        sendEventWithData:function(inEventName,inData){

            if(inEventName===null ||inEventName===undefined)
                return;

            let eventData=this.makeEventData(inEventName,inData,null);
            this.doWork(eventData);
        },


        //receive event with data ,callback
        sendEventWithDataCallback:function(inEventName,inData,inCallback){

            if(inEventName===null ||inEventName===undefined)
                return;

            let eventData=this.makeEventData(inEventName,inData,inCallback);
            this.doWork(eventData);
        },
      }
    }

    return {
        
        getInstance: function() {

            if(instance==null) {

                instance = makeInstance(); 
            }

            return instance;　
        }
    }
})();

module.exports = EventManager;