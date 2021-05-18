let EventManager=require("EventManager");
let EventMap=require("EventMap");
let ManagerList=require("ManagerList");

cc.Class({
    extends: cc.Component,

    properties:()=>( {
        
        standbyObjectRoot:{// standby prefab parent
            default:null,
            type:cc.Node
        },

        standbyMap:{default:null},//standby prefab map
        workMap:{default:null},//working prefab map
        waitLoadFinishMap:{default:null},//wait prefab loading finish map
        waitSendMap:{default:null},//wait send prefab map, content is event data
        allPrefabTypeList:{default:null},//all prefab type list
        serialNumber:{default:null},//serial number for id of ResourceInfo
    }),


    //properties initial    
    start:function () {

        this.serialNumber=0;
        this.standbyMap={};
        this.workMap={};
        this.waitSendMap={};
        this.waitLoadFinishMap={};

        this.allPrefabTypeList=[];
        this.allPrefabTypeList.push("Wall0");
        this.allPrefabTypeList.push("Wall1");
        this.allPrefabTypeList.push("Hay0");
        this.allPrefabTypeList.push("Floor");
        this.allPrefabTypeList.push("RedTank");
        this.allPrefabTypeList.push("BlueTank");
        this.allPrefabTypeList.push("GreenTank");
        this.allPrefabTypeList.push("RedBullet");
        this.allPrefabTypeList.push("BlueBullet");
        this.allPrefabTypeList.push("GreenBullet");

        for(let i=0;i<  this.allPrefabTypeList.length;i++){

            this.standbyMap[this.allPrefabTypeList[i]]=[];
            this.workMap[this.allPrefabTypeList[i]]={};
            this.waitSendMap[this.allPrefabTypeList[i]]=[];
            this.waitLoadFinishMap[this.allPrefabTypeList[i]]=false;
           
        }

        this.loadPrefab("Hay0",5);
        this.loadPrefab("Wall0",5);
        this.loadPrefab("Wall1",5);
        this.loadPrefab("Floor",9);
        this.loadPrefab("GreenTan",1);
        this.loadPrefab("RedGreen",1);
        this.loadPrefab("BlueTank",1);
        this.loadPrefab("GreenBullet",10);
        this.loadPrefab("BuleBullet",10);
        this.loadPrefab("RedBullet",10);

        this.registerEvent();
    },


    //register event name and function    
    registerEvent:function(){

        EventManager.getInstance().registerEvent(EventMap.GetPrefab,this.getPrefab.bind(this));
        EventManager.getInstance().registerEvent(EventMap.ResourceManagerInitial,this.initial.bind(this));
    },
   

    //manager initial
    initial:function(inEventData){
    
        this.checkEventCallback(inEventData);
        this.checkInitialOK();
    },


    //check default prefab load finish
    checkInitialOK:function(){

        let keyList=Object.keys( this.waitLoadFinishMap)
        for(let i=0 ;i<keyList.length;i++){

           if( this.waitLoadFinishMap[keyList[i]]===true){

                this.scheduleOnce(this.checkInitialOK.bind(this),0.1);
                return;
           }
        }

        EventManager.getInstance().sendEventWithData(EventMap.ReportInitialOK,ManagerList.ResourceManager);
    },


    //make load data
    //inNeedCount mean need load count
    //inKey mean the key of standbyObjectMap
    //inCallback mean what need to call when load finish
    makeLoadData:function(inUrl,inNeedCount,inType,inCallback){

        let loadData={};
        loadData["url"]=inUrl;
        loadData["needCount"]=inNeedCount;
        loadData["type"]=inType;
        loadData["callback"]=inCallback;

        return loadData;
    },

   
    //check prefab type correct
    checkPrefabCorrect:function(inType){

        for(let i=0;i<this.allPrefabTypeList.length;i++){

            if(inType===this.allPrefabTypeList[i])
                return true;
        }

        return false;
    },

    //get prefab
    getPrefab:function(inEventData){

        if(inEventData.data.type===null ||inEventData.data.type===undefined){//no type data to know what prefab need

            this.checkEventCallback(inEventData,{});
            return;
        }

        if(this.checkPrefabCorrect(inEventData.data.type))//check prefab type correct
            this.checkPrefabCount(inEventData);
        else
            this.checkEventCallback(inEventData,{});
    },


    //check prefab count, if count enough, send prefab direct
    //if count not enough,wait load prefab finish to send 
    checkPrefabCount:function(inEventData){

        if(this.standbyMap[inEventData.data.type].length>=inEventData.data.needCount){//standby count is enough to send

            if( this.waitSendMap[inEventData.data.type].length>0)//other manager want get same prefab, need wait
                this.waitSendMap[inEventData.data.type].push(inEventData);
            else//no other manager want to get same prefab, so send prefab direct
                this.sendPrefab(inEventData);
        }
        else{////standby count is not enough to send, so load new prefab

            this.waitSendMap[inEventData.data.type].push(inEventData);
            this.loadPrefab(inEventData.data.type,inEventData.data.needCount-this.standbyMap[inEventData.data.type].length);
        }
    },


    //load prefab
    loadPrefab:function(inType,inNeedCount){

        switch(inType){

            case "Hay0":
                this.loadHay("0",inNeedCount);
                break;
            case "Wall0":
                this.loadWall("0",inNeedCount);
                break;
            case "Wall1":
                this.loadWall("1",inNeedCount);
                break;
            case "Floor":
                this.loadFloor(inNeedCount);
                break;
            case "GreenTank":
                this.loadTank("Green",inNeedCount);
                break;
            case "BlueTank":
                this.loadTank("Blue",inNeedCount);
                break;
            case "RedTank":
                this.loadTank("Red",inNeedCount);
                break;
            case "GreenBullet":
                this.loadBullet("Green",inNeedCount);
                break;
            case "BlueBullet":
                this.loadBullet("Blue",inNeedCount);
                break;
            case "RedBullet":
                this.loadBullet("Red",inNeedCount);
                break;
        }
    },


    //load hay prefab
    loadHay:function(inType,inCount){

        this.waitLoadFinishMap["Hay"+inType]=true;
        let loadData=this.makeLoadData("prefabs/Hay/Hay"+inType,inCount,"Hay"+inType,this.loadFinish.bind(this,"Hay"+inType));
        this.loadProcess(loadData);
    },


    //load wall prefab
    loadWall:function(inType,inCount){

        this.waitLoadFinishMap["Wall"+inType]=true;
        let loadData=this.makeLoadData("prefabs/Wall/Wall"+inType,inCount,"Wall"+inType,this.loadFinish.bind(this,"Wall"+inType));
        this.loadProcess(loadData);
    },


    //load floor prefab
    loadFloor:function(inCount){

        this.waitLoadFinishMap["Floor"]=true;
        let loadData=this.makeLoadData("prefabs/Floor/Floor",inCount,"Floor",this.loadFinish.bind(this,"Floor"));
        this.loadProcess(loadData);
    },


    //load tank prefab    
    loadTank:function(inType,inCount){

        this.waitLoadFinishMap[inType+"Tank"]=true;
        let loadData=this.makeLoadData("prefabs/Tank/"+inType+"Tank",inCount,inType+"Tank",this.loadFinish.bind(this,inType+"Tank"));
        this.loadProcess(loadData);
    },


    //load bullet prefab
    loadBullet:function(inType,inCount){

        this.waitLoadFinishMap[inType+"Bullet"]=true;
        let loadData=this.makeLoadData("prefabs/Bullet/"+inType+"Bullet",inCount,inType+"Bullet",this.loadFinish.bind(this,inType+"Bullet"));
        this.loadProcess(loadData);
    },


     //load prefab process
     loadProcess:function(inLoadData){

        cc.resources.load(inLoadData.url, function(err, prefab) {
            
            if(err)
                console.log(err);
            else{

                let resourceInfo=null;
                for(let i=0;i<inLoadData.needCount;i++){

                    let newNode = cc.instantiate(prefab);
                    this.standbyMap[inLoadData.type].push(newNode);

                    newNode.addComponent("ResourceInfo");
                    resourceInfo=newNode.getComponent("ResourceInfo");
                    resourceInfo.setInfo(this.serialNumber.toString(),inLoadData.type);
                    newNode.setParent(this.standbyObjectRoot);
                    newNode.setPosition(0,0);
                    newNode.active=false;

                    this.serialNumber+=1;
                }
            }    

            if(inLoadData.callback!==null &&inLoadData.callback!==undefined)
                inLoadData.callback();
        }.bind(this));
    },


    //when load prefab finish ,call this function
    loadFinish:function(inKey){
        
        this.waitLoadFinishMap[inKey]=false;

        if(this.waitSendMap[inKey].length>0){//have manager wait to send prefab

            this.sendPrefab(this.waitSendMap[inKey][0]);
            this.waitSendMap[inKey].splice(0,1);

            if(this.waitSendMap[inKey].length>0)//have other manager wait send ,check wait data
                this.checkPrefabCount(this.waitSendMap[inKey][0]);
        }
    },


    //send prefab work
    sendPrefab:function(inEventData){

        let prefabList=[];
        let resourceInfo=null;
        for(let i=0;i<inEventData.data.needCount;i++){

            resourceInfo=this.standbyMap[inEventData.data.type][0].getComponent("ResourceInfo");
            prefabList.push(this.standbyMap[inEventData.data.type][0]);
            this.workMap[inEventData.data.type][resourceInfo.getID()]=this.standbyMap[inEventData.data.type][0];
            this.standbyMap[inEventData.data.type].splice(0,1);
        }

        let data={};
        data["type"]=inEventData.data.type;
        data["prefabList"]=prefabList;

        this.checkEventCallbackWithData(inEventData,data);
    },


    //check event callback
    checkEventCallback:function(inEventData){

        if(inEventData.callback!=null)
            inEventData.callback();
    },


    //check event callback with data
    checkEventCallbackWithData:function(inEventData,inData){

        if(inEventData.callback!=null)
            inEventData.callback(inData);
    },
});
