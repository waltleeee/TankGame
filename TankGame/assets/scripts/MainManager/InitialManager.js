let EventManager=require("EventManager");
let EventMap=require("EventMap");
let ManagerList=require("ManagerList");

cc.Class({
    extends: cc.Component,

    properties:()=>( {
       
        waitInitialList:{//wait initial manager list
            default:null
        },

        initialStep:{//0: first Initial(MainManager)   1:second initial(SubManager)
            default:null
        }
    }),

   
    start:function () {

        this.waitInitialList=[];
        this.initialStep=0;

        this.registerEvent();
    },


    //register event name and function
    registerEvent:function(){

        EventManager.getInstance().registerEvent(EventMap.ReportInitialOK,this.reportInitialOK.bind(this));
        EventManager.getInstance().registerEvent(EventMap.InitialManagerInitial,this.initial.bind(this));
    },
   

    //manager initial and enter first initial
    initial:function(inEventData){
    
        this.checkEventCallback(inEventData);
        this.firstInitial();
    },


    //when other manager initial OK ,call this function
    reportInitialOK:function(inEventData){
       
        this.checkEventCallback(inEventData);

        for(let i=0;i<this.waitInitialList.length;i++){

            if(this.waitInitialList[i]===inEventData.data){

                this.waitInitialList.splice(i,1);
                break;
            }
        }

        if(inEventData.callback!=null)
            inEventData.callback();

        if(this.waitInitialList.length===0){

            if(this.initialStep===0){//enter second initial
                
                this.initialStep+=1;
                this.secondInitial();
            }
            else if(this.initialStep===1){//Initial finish
               
                this.initialStep+=1;
                EventManager.getInstance().sendEvent(EventMap.ReportInitialFinish);
            }
        }
    },


    //first initial manager 
    firstInitial:function(){

        this.waitInitialList.push(ManagerList.GameFlowManager);
        this.waitInitialList.push(ManagerList.ResourceManager);
        this.waitInitialList.push(ManagerList.LoadingManager);

        EventManager.getInstance().sendEvent(EventMap.GameFlowManagerInitial);
        EventManager.getInstance().sendEvent(EventMap.ResourceManagerInitial);
        EventManager.getInstance().sendEvent(EventMap.LoadingManagerInitial);
    },


    //second initial manager who need to wait other manager initial OK
    secondInitial:function(){

        this.waitInitialList.push(ManagerList.MapManager);
        this.waitInitialList.push(ManagerList.SoundManager);

        EventManager.getInstance().sendEvent(EventMap.MapManagerInitial);
        EventManager.getInstance().sendEvent(EventMap.SoundManagerInitial);
    },


    //check event callback
    checkEventCallback:function(inEventData){

        if(inEventData.callback!=null)
            inEventData.callback();
    },
});
