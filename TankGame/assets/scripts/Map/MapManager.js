let EventManager=require("EventManager");
let EventMap=require("EventMap");
let ManagerList=require("ManagerList");
let CalculateTool=require("CalculateTool");
let TankTool=require("TankTool");

cc.Class({
    extends: cc.Component,

    properties:()=>({

        mapDisplay:{
            default:null,
            type:require("MapDisplay")
        },

        floorRoot:{//floor prefab parent
            default:null,
            type:cc.Node
        },

        blocksRoot:{//hay wall prefab parent
            default:null,
            type:cc.Node
        },

        tankRoot:{//tank prefab parent
            default:null,
            type:cc.Node
        },

        bulletRoot:{//bullet parent
            default:null,
            type:cc.Node
        },

        leftUpLimitPoint:{//left up position check point about check move tank or floor
            default:null,
            type:cc.Node
        },

        leftDownLimitPoint:{//left down position  check point about check move tank or floor
            default:null,
            type:cc.Node
        },

        rightUpLimitPoint:{//right up position check point about check move tank or floor
            default:null,
            type:cc.Node
        },

        rightDownLimitPoint:{//right down position check point about check move tank or floor
            default:null,
            type:cc.Node
        },

        standbyPrefabMap:{default:null},//standby prefab map ,key:type  value:prefab list
        workPrefabMap:{default:null},//work prefab map, key:type   value:prefab map>key: ResourceInfo id   value:prefab  
        floorMoveData:{default:null},//move data for floor
        useTankData:{default:null},//use tank data for check tank state
        tankStateData:{default:null},//tank state data for make blocks
        limitPointData:{default:null},//tank move limit point data
        moveMode:{default:null},//0:tank 1:floor
        tankSelectList:{default:null},//tank select list,content is tank type
        tankSelectIndex:{default:null},//tank select index for tankSelectList
        checkContactData:{default:null},//data for check tank contant 
        calculateRotateData:{default:null},//data for position after rotate
        tankMotionBeforeContact:{default:null},//tank motion when contact   0:no Contact  1:leftTurn  2:RightTurn  3:moveForward  4:moveBack
        contactResourceID:{default:null},//contact block resource id
        lastContactResourceID:{default:null},//contact block resource id last time
    }),

    start:function () {

        this.tankSelectIndex=0;
        this.standbyPrefabMap={};
        this.workPrefabMap={};
        this.moveMode=0;
        this.tankMotionBeforeContact=0;
        this.contactResourceID="";
        this.lastContactResourceID="";

        this.standbyPrefabMap["Hay0"]=[];
        this.standbyPrefabMap["Wall0"]=[];
        this.standbyPrefabMap["Wall1"]=[];
        this.standbyPrefabMap["Floor"]=[];
        this.standbyPrefabMap["GreenTank"]=[];
        this.standbyPrefabMap["BlueTank"]=[];
        this.standbyPrefabMap["RedTank"]=[];
        this.standbyPrefabMap["GreenBullet"]=[];
        this.standbyPrefabMap["BlueBullet"]=[];
        this.standbyPrefabMap["RedBullet"]=[];

        this.workPrefabMap["Hay0"]={};
        this.workPrefabMap["Wall0"]={};
        this.workPrefabMap["Wall1"]={}
        this.workPrefabMap["Floor"]={};
        this.workPrefabMap["GreenTank"]={};
        this.workPrefabMap["BlueTank"]={};
        this.workPrefabMap["RedTank"]={};
        this.workPrefabMap["GreenBullet"]={};
        this.workPrefabMap["BlueBullet"]={};
        this.workPrefabMap["RedBullet"]={};
     
        this.floorMoveData={};
        this.floorMoveData["moveSpeedX"]=0;
        this.floorMoveData["moveSpeedY"]=0;
     
        this.tankStateData=TankTool.getTankStateData();
        this.useTankData=TankTool.getUseTankData();
        this.limitPointData=TankTool.getLimitPointData()
        this.limitPointData.rightUpLimitPoint=this.rightUpLimitPoint;
        this.limitPointData.rightDownLimitPoint=this.rightDownLimitPoint;
        this.limitPointData.leftUpLimitPoint=this.leftUpLimitPoint;
        this.limitPointData.leftDownLimitPoint=this.leftDownLimitPoint;
       
        this.tankSelectList=[];
        this.tankSelectList.push("GreenTank");
        this.tankSelectList.push("BlueTank");
        this.tankSelectList.push("RedTank");

        this.checkContactData=CalculateTool.getContactData();;
        this.calculateRotateData=CalculateTool.getCalculateRotateData();

        this.registerEvent();
    },


    //register event name and function
    registerEvent:function(){

        EventManager.getInstance().registerEvent(EventMap.MapManagerInitial,this.initial.bind(this));
    },
   

    //manager initial
    initial:function(inEventData){
    
        this.checkEventCallback(inEventData);

        this.getDefaultPrefab();
    },


    //get default prefab
    getDefaultPrefab:function(){

        let checkMap={};
        checkMap["Hay0"]=5;
        checkMap["Wall0"]=5;
        checkMap["Wall1"]=5;
        checkMap["Floor"]=9;
        checkMap["GreenTank"]=1;
        checkMap["BlueTank"]=1;
        checkMap["RedTank"]=1;
        checkMap["GreenBullet"]=10;
        checkMap["BlueBullet"]=10;
        checkMap["RedBullet"]=10;

        let hay0Data=this.makeGetPrefabData("Hay0",checkMap["Hay0"]);
        let wall0Data=this.makeGetPrefabData("Wall0",checkMap["Wall0"]);
        let wall1Data=this.makeGetPrefabData("Wall1",checkMap["Wall1"]);
        let floorData=this.makeGetPrefabData("Floor",checkMap["Floor"]);
        let greenTankData=this.makeGetPrefabData("GreenTank",checkMap["GreenTank"]);
        let redTankData=this.makeGetPrefabData("RedTank",checkMap["RedTank"]);
        let blueTankData=this.makeGetPrefabData("BlueTank",checkMap["BlueTank"]);
        let greenBulletData=this.makeGetPrefabData("GreenBullet",checkMap["GreenBullet"]);
        let blueBulletData=this.makeGetPrefabData("BlueBullet",checkMap["BlueBullet"]);
        let redBulletData=this.makeGetPrefabData("RedBullet",checkMap["RedBullet"]);

        EventManager.getInstance().sendEventWithDataCallback(EventMap.GetPrefab,hay0Data,this.receivePrefab.bind(this));
        EventManager.getInstance().sendEventWithDataCallback(EventMap.GetPrefab,wall0Data,this.receivePrefab.bind(this));
        EventManager.getInstance().sendEventWithDataCallback(EventMap.GetPrefab,wall1Data,this.receivePrefab.bind(this));
        EventManager.getInstance().sendEventWithDataCallback(EventMap.GetPrefab,floorData,this.receivePrefab.bind(this));
        EventManager.getInstance().sendEventWithDataCallback(EventMap.GetPrefab,greenTankData,this.receivePrefab.bind(this));
        EventManager.getInstance().sendEventWithDataCallback(EventMap.GetPrefab,redTankData,this.receivePrefab.bind(this));
        EventManager.getInstance().sendEventWithDataCallback(EventMap.GetPrefab,blueTankData,this.receivePrefab.bind(this));
        EventManager.getInstance().sendEventWithDataCallback(EventMap.GetPrefab,greenBulletData,this.receivePrefab.bind(this));
        EventManager.getInstance().sendEventWithDataCallback(EventMap.GetPrefab,blueBulletData,this.receivePrefab.bind(this));
        EventManager.getInstance().sendEventWithDataCallback(EventMap.GetPrefab,redBulletData,this.receivePrefab.bind(this));

        this.checkDefaultPrefab(checkMap);
    },


    //check get default prefab finish or not
    //report initial OK when get default prefab finish
    checkDefaultPrefab:function(inCheckMap){
        
        let keys=Object.keys(inCheckMap);
        if(keys.length===0){

            this.mapInitialWork();
            return;
        }

        //check standbyPrefabMap content is enougth or not
        for(let i=0;i<keys.length;i++){

            if(inCheckMap[keys[i]]===this.standbyPrefabMap[keys[i]].length)
                delete inCheckMap[keys[i]];
        }
        
        this.scheduleOnce(this.checkDefaultPrefab.bind(this,inCheckMap),0.1);
    },


    //make get prefab data
    makeGetPrefabData:function(inType,inNeedCount){

        let data={};
        data["type"]=inType;
        data["needCount"]=inNeedCount;
        
        return data;
    },


    //receive Prefab
    receivePrefab:function(inPrefabData){
       
        if(inPrefabData.prefabList===undefined ||inPrefabData.prefabList.length===0)
            return;

        let root=null;
        switch(inPrefabData.type){

            case "Hay0":
            case "Wall0":
            case "Wall1":
                root=this.blocksRoot;
                break;
            case "Floor":
                root=this.floorRoot;
                break;
            case "GreenTank":
            case "BlueTank":
            case "RedTank":
                root=this.tankRoot;
                break;
            case "GreenBullet":
            case "BlueBullet":
            case "RedBullet":
                root=this.bulletRoot;
                break;
            default:
                return;
                break;
        }    
       
        for(let i=0;i<inPrefabData.prefabList.length;i++){
           
            this.standbyPrefabMap[inPrefabData.type].push(inPrefabData.prefabList[i]);
            inPrefabData.prefabList[i].setParent(root);
            inPrefabData.prefabList[i].setPosition(-8000,-8000);
        }
    },


    //map initail work
    mapInitialWork:function(){

        //tank initial
        this.useTank=this.prefabActive(this.tankSelectList[this.tankSelectIndex]);
        this.useTank.setPosition(0,0);
        this.useTankUnit=this.useTank.getComponent("TankUnit");
        this.useTankUnit.setMoveCheckFunc(this.checkTankMove.bind(this));
        this.useTankData.useTank=this.useTank;
        this.useTankData.useTankUnit= this.useTankUnit;
        this.useTankData.transformNode=this.blocksRoot;

        //get hay prefab
        let hayList=[];
        for(let i=0;i<this.mapDisplay.hayOnMapLimit;i++){
            hayList.push(this.prefabActive("Hay0"));
        }
       
        //get wall prefab
        let wallList=[];
        for(let i=0;i<this.mapDisplay.wallOnMapLimit;i++){
            wallList.push(this.prefabActive("Wall0"));
            wallList.push(this.prefabActive("Wall1"));
        }

        TankTool.updateTankData(this.tankStateData,this.useTankData);
        this.mapDisplay.initialBlock(hayList,wallList,this.tankStateData);

        //floor initial
        let floorList=[];
        for(let i=0;i<9;i++){
            floorList.push(this.prefabActive("Floor"));
        }
        this.mapDisplay.initialFloor(floorList);

        EventManager.getInstance().sendEventWithData(EventMap.ReportInitialOK,ManagerList.MapManager);
    },


    //prefab active work and get prefab
    prefabActive:function(inType){

        if(this.standbyPrefabMap[inType].length===0)
            return null;

        let prefab=this.standbyPrefabMap[inType][0];
        prefab.active=true;
        let resourceInfo=prefab.getComponent("ResourceInfo");
        this.workPrefabMap[inType][resourceInfo.getID()]=prefab;
        this.standbyPrefabMap[inType].splice(0,1);

        return prefab;
    },


    //prefab recycle work
    prefabRecycle:function(inPrefab){

        inPrefab.active=false;
        inPrefab.setPosition(-8000,-8000);
        let resourceInfo=inPrefab.getComponent("ResourceInfo");
        this.standbyPrefabMap[resourceInfo.getType()].push(inPrefab);
        delete this.workPrefabMap[resourceInfo.getType()][resourceInfo.getID()];
    },


    //get block check vector
    getBlockCheckVector:function(inBlockPrefab){

        let resourceInfo=inBlockPrefab.getComponent("ResourceInfo");
        let checkPoint=null;
      
        switch(resourceInfo.getType()){

            case "Hay0":
                checkPoint=inBlockPrefab.getComponent("HayUnit").getCheckPointData(this.blocksRoot);
                break;
            case "Wall0":
            case "Wall1":
                checkPoint=inBlockPrefab.getComponent("WallUnit").getCheckPointData(this.blocksRoot);
                break;
            default:
                break;    
        }

        if(checkPoint===null ||checkPoint.length===0)
            return null;
       
        return CalculateTool.calculateVector(checkPoint);    
    },


    //next action work for check contact
    nextActionWork:function(inTankNextActionData){

        if(inTankNextActionData.turnAngle!==0){//tank next is turn mode,so calculate position after rotate

            this.calculateRotateData["originAngle"]=inTankNextActionData.originAngle;
            this.calculateRotateData["originPositionX"]=inTankNextActionData.originPositionX;
            this.calculateRotateData["originPositionY"]=inTankNextActionData.originPositionY;
            this.calculateRotateData["turnAngle"]=inTankNextActionData.turnAngle;
            let resultData=null;

            for(let i=0;i<inTankNextActionData.checkPointPositionList.length;i++){
                
                this.calculateRotateData["positionX"]=inTankNextActionData.checkPointPositionList[i].x;
                this.calculateRotateData["positionY"]=inTankNextActionData.checkPointPositionList[i].y;
               
                resultData=CalculateTool.calculatePointAfterRotate(this.calculateRotateData);
                inTankNextActionData.checkPointPositionList[i].x= resultData.x;
                inTankNextActionData.checkPointPositionList[i].y= resultData.y;
            }
        }
        else if(inTankNextActionData.moveDistanceX!==0 ||inTankNextActionData.moveDistanceY!==0){//tank next is move mode, so add move distance

            for(let i=0;i<inTankNextActionData.checkPointPositionList.length;i++){
                inTankNextActionData.checkPointPositionList[i].x+= inTankNextActionData.moveDistanceX;
                inTankNextActionData.checkPointPositionList[i].y+= inTankNextActionData.moveDistanceY;
            }
        }
    },

    //check contact block
    checkTankContactBlock:function(){

        let blocksList=this.mapDisplay.getMapBlockList();
        let tankContactData=this.useTankData.useTankUnit.getNextActiontData(this.blocksRoot);

        if(blocksList.length===0)
            return false;
      
        this.checkContactData.positionAX=this.tankStateData.selfPosition.x+tankContactData.moveDistanceX;
        this.checkContactData.positionAY=this.tankStateData.selfPosition.y+tankContactData.moveDistanceY;
        this.checkContactData.widthA=this.tankStateData.width;
        this.checkContactData.heightA=this.tankStateData.height;
   
        let cautionBlockList=null;//very close block
        for(let i=0;i<blocksList.length;i++){

            this.checkContactData.positionBX=blocksList[i].position.x;
            this.checkContactData.positionBY=blocksList[i].position.y;
            this.checkContactData.widthB=blocksList[i].width;
            this.checkContactData.heightB=blocksList[i].height;

            if(CalculateTool.checkContactByCorner(this.checkContactData)){

                if(cautionBlockList===null)
                    cautionBlockList=[];

                cautionBlockList.push(blocksList[i]);
            }
        }
      
        if(cautionBlockList===null)//no close block, so without advance check
            return false;
        
        if(tankContactData.checkPointPositionList!==undefined &&tankContactData.checkPointPositionList.length>0){

            this.nextActionWork(tankContactData);

            let blockVectorList=null;
            for(let i=0;i<cautionBlockList.length;i++){

                blockVectorList=this.getBlockCheckVector(cautionBlockList[i]);
               
                if(CalculateTool.checkContactByCheckPoint(tankContactData.checkPointPositionList,blockVectorList)){//tank next motion will contact block
                    
                    let resourceInfo=cautionBlockList[i].getComponent("ResourceInfo");
                    this.contactResourceID=resourceInfo.getID();
                    return true;
                }
            }
        }
        
        return false;
    },


    //check tank cna move or not, inMotionType  0:stop  1:leftTurn  2:RightTurn  3:moveForward  4:moveBack
    checkTankMove:function(inMotionType){

        TankTool.updateTankData(this.tankStateData,this.useTankData);
        if(this.checkTankContactBlock()){//tank contact block
         
            if(this.tankMotionBeforeContact===0)//mean tank not contact before this time
                this.tankMotionBeforeContact=inMotionType;
              
            if(!TankTool.checkTankLeaveContact( this.tankMotionBeforeContact,inMotionType)){//mean tank move to block,so not allow do motion
            
                this.lastContactResourceID=this.contactResourceID;
                return;
            }
            else {//allow leave block

                //avoid move bug 
                //so allow leave block will reset tankMotionBeforeContact at contact different block  
                if(this.contactResourceID!==this.lastContactResourceID)
                    this.tankMotionBeforeContact=0;
            }
        }
        else{
            this.tankMotionBeforeContact=0;

            if(this.contactResourceID!==""){
                this.contactResourceID="";
                this.lastContactResourceID="";
            }
        }

        this.moveMode=TankTool.checkMoveMode(this.useTankData,this.limitPointData);//check need move tank or floor
        this.mapDisplay.checkBlocks(this.tankStateData);//recycle and make block

        if(this.moveMode===0)//move tank
            this.useTankData.useTankUnit.doMotion();
        else{//check move floor

            if(this.useTankData.useTankUnit.getActionType()===0){//mean tank is move,so move floor

                this.mapDisplay.checkFloorMatch();
                this.floorMoveData.moveSpeedX=this.useTankData.useTankUnit.getMoveSpeedX();
                this.floorMoveData.moveSpeedY=this.useTankData.useTankUnit.getMoveSpeedY();
                this.mapDisplay.floorMove(this.floorMoveData);
            }
            else//tank is turn or stop, so not move floor
                this.useTankData.useTankUnit.doMotion();
        }    
    },


    //change tank work
    changeTankWork:function(){

        this.tankSelectIndex+=1;
        if(this.tankSelectIndex>this.tankSelectList.length-1)
            this.tankSelectIndex=0;

        let angle=this.useTankData.useTankUnit.getAngleData();//get tank last useAngle
        let newTank=this.prefabActive(this.tankSelectList[this.tankSelectIndex]); //get new tank
        let newTankUnit=newTank.getComponent("TankUnit");
      
        newTank.setPosition(this.useTankData.useTank.position.x,this.useTankData.useTank.position.y);
        newTank.angle=this.useTankData.useTank.angle;
        newTankUnit.setUseSpeed(this.useTankData.useTankUnit.getMoveSpeedX(),this.useTankData.useTankUnit.getMoveSpeedY());
        newTankUnit.setAngle(angle);

        this.prefabRecycle( this.useTankData.useTank);//recycle used tank
        this.useTankData.useTank=newTank;
        this.useTankData.useTankUnit=newTankUnit;
        this.useTankData.useTankUnit.setMoveCheckFunc(this.checkTankMove.bind(this));
    },


    //check bullet contact
    checkBulletContact:function(inCheckContactData,inBullet,inBlock){

        if(CalculateTool.checkContact(inCheckContactData)){          
                    
            let blockVectorList=this.getBlockCheckVector(inBlock);
            let bulletUnit=inBullet.getComponent("BulletUnit");

            if(CalculateTool.checkContactByCheckPoint(bulletUnit.getCheckPointData(this.blocksRoot),blockVectorList))//check bullet real contact block
                return true;
        }
       
        return false;
    },


    // bullet attack, return true is mean block life is need recycle, false mean block no need to recycle 
    bulletAttackWork:function(inBullet,inBlock){

        this.prefabRecycle(inBullet);//recycle bullet
        let resourceInfo=inBlock.getComponent("ResourceInfo");

        if(resourceInfo.getType()==="Hay0"){//if contact hay, calculate damage

            let bulletUnit=inBullet.getComponent("BulletUnit");
            let hayUnit=inBlock.getComponent("HayUnit");
            hayUnit.beAttack(bulletUnit.getPower());

            if(hayUnit.getLife()<=0)
                return true;
        }

        return false;
    },


    //on up button from MapControl
    onUpButton:function(){

        this.tankStateData["isForward"]=true;
        this.useTankData["isForward"]=true;
        this.useTankData.useTankUnit.setMoveForward();
    },


    //release up button from MapControl
    releaseUpButton:function(){

        this.useTankData.useTankUnit.setMoveStop();
    },


    //on down button from MapControl
    onDownButton:function(){

        this.tankStateData["isForward"]=false;
        this.useTankData["isForward"]=false;
        this.useTankData.useTankUnit.setMoveBack();
    },


    //release down button from MapControl
    releaseDownButton:function(){

        this.useTankData.useTankUnit.setMoveStop();
    },


    //on left button from MapControl
    onLeftButton:function(){

        this.useTankData.useTankUnit.setTurnLeft();
    },


    //release left button from MapControl
    releaseLeftButton:function(){

        this.useTankData.useTankUnit.setTurnStop();
    },


    //on right button from MapControl
    onRightButton:function(){

        this.useTankData.useTankUnit.setTurnRight();
    },


    //release right button from MapControl
    releaseRightButton:function(){

        this.useTankData.useTankUnit.setTurnStop();
    },


    //on fire button from MapControl
    onFireButton:function(){

        let bulletPrefab=this.prefabActive(this.useTankData.useTankUnit.getBulletType());
        if(bulletPrefab===null)
            return;

        let fireData=this.useTankData.useTankUnit.getFireData();
        bulletPrefab.angle=fireData.angle;
      
        let bulletUnit= bulletPrefab.getComponent("BulletUnit");
        bulletUnit.setSpeed(fireData.speedXBase,fireData.speedYBase);
        let bulletPosition=this.tankRoot.convertToNodeSpaceAR (fireData.firePosition);
        bulletPrefab.setPosition(bulletPosition.x,bulletPosition.y);
              
        this.mapDisplay.setBullet(bulletPrefab);
    },


    //on change tank button from MapControl
    onChangeTankButton:function(){

        this.changeTankWork();
    },


    //check event callback
     checkEventCallback:function(inEventData){

        if(inEventData.callback!=null)
            inEventData.callback();
    },
});
