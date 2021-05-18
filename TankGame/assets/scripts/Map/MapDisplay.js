let CalculateTool=require("CalculateTool");

cc.Class({
    extends: cc.Component,

    properties:()=>({

        mapManager:{
            default:null,
            type:require("MapManager")
        },

        blocksRoot:{//hay wall prefab parent
            default:null,
            type:cc.Node
        },

        floorRoot:{//floor parent
            default:null,
            type:cc.Node
        },

        mainFloor:{default:null},//center floor
        subFloorList:{default:null},//not center floor prefab list
        standbyHayList:{default:null},//standby hay prefab list
        standybyWallList:{default:null},//standby wall prefab list
        workHayList:{default:null},//work hay prefab list
        workWallList:{default:null},//work wall prefab list
        mapBlocksList:{default:null},// blocks on map
        bulletList:{default:null},//nullet prefab list
        floorWidth:{default:null},//floor width
        floorHeight:{default:null},//floor height
        wallOnMapLimit:{default:null},// limit count on map about wall
        hayOnMapLimit:{default:null},//limit count on map about hay
        checkContactData:{default:null},//data for check contact
        randomPositionData:{default:null},//position data for random
        outScreenPointBaseX:{default:null},//out screen position x for check recyle and set new block
        outScreenPointBaseY:{default:null},//out screen position y for check recyle and set new block
        screenWidth:{default:null},//screen width
        screenHeight:{default:null},//screen height
        useBulletUnit:{default:null},//BulletUnit for bullet move
    }),

   

    start:function() {

        this.checkContactData=CalculateTool.getContactData();
        this.randomPositionData={};
        this.randomPositionData["x"]=0;
        this.randomPositionData["y"]=0;
        this.randomPositionData["width"]=0;
        this.randomPositionData["height"]=0;
        this.wallOnMapLimit=4;
        this.hayOnMapLimit=4;
        this.subFloorList=[];
        this.workHayList=[];
        this.workWallList=[];
        this.mapBlocksList=[];
        this.bulletList=[];
        this.floorWidth=0;
        this.floorHeight=0;
      
      
        this.floorAreaWidth=this.floorRoot.width;
        this.floorAreaHeight=this.floorRoot.height;
        this.outScreenPointBaseX=(this.floorAreaWidth/2)+200;
        this.outScreenPointBaseY=(this.floorAreaHeight/2)+200;
    },

    update:function(dt){

        this.bulletMove(dt);
    },

    //set block
    initialBlock:function(inHayPrefabList,inWallPrefabList,inTankData){
        
        this.standbyHayList=inHayPrefabList;
        this.standbyWallList=inWallPrefabList;

        this.makeBlock(inTankData,false);
    },


    //floor position initial
    initialFloor:function(inPrefabList){

        if(inPrefabList===null ||inPrefabList===undefined ||inPrefabList.length<9)
            return;

        if(inPrefabList.length>9){

            while(inPrefabList.length>9){

                inPrefabList.splice(0,1);
            }
        }    

        //this.allFloorList=inPrefabList;
        inPrefabList[0].setPosition(0,0);//center floor
        this.mainFloor= inPrefabList[0];
        this.floorWidth=inPrefabList[0].width;
        this.floorHeight=inPrefabList[0].height;
       
        inPrefabList[1].setPosition(this.mainFloor.position.x-this.floorWidth,this.mainFloor.position.y);//set left floor
        inPrefabList[2].setPosition(this.mainFloor.position.x-this.floorWidth,this.mainFloor.position.y+this.floorHeight);//set left up floor
        inPrefabList[3].setPosition(this.mainFloor.position.x,this.mainFloor.position.y+this.floorHeight);//set Up floor
        inPrefabList[4].setPosition(this.mainFloor.position.x+this.floorWidth,this.mainFloor.position.y+this.floorHeight);//set rightUp floor
        inPrefabList[5].setPosition(this.mainFloor.position.x+this.floorWidth,this.mainFloor.position.y);//set right floor
        inPrefabList[6].setPosition(this.mainFloor.position.x+this.floorWidth,this.mainFloor.position.y-this.floorHeight);//set rightDown floor
        inPrefabList[7].setPosition(this.mainFloor.position.x,this.mainFloor.position.y-this.floorHeight);//set down floor
        inPrefabList[8].setPosition(this.mainFloor.position.x-this.floorWidth,this.mainFloor.position.y-this.floorHeight);//set leftDown floor

        this.subFloorList.push(inPrefabList[1]);
        this.subFloorList.push(inPrefabList[2]);
        this.subFloorList.push(inPrefabList[3]);
        this.subFloorList.push(inPrefabList[4]);
        this.subFloorList.push(inPrefabList[5]);
        this.subFloorList.push(inPrefabList[6]);
        this.subFloorList.push(inPrefabList[7]);
        this.subFloorList.push(inPrefabList[8]);
    },


    //set contact data
    setContactData:function(inPositionA,inPositionB,inSizeA,inSizeB){

        this.checkContactData["positionAX"]= inPositionA.x;
        this.checkContactData["positionAY"]= inPositionA.y;
        this.checkContactData["positionBX"]=inPositionB.x;
        this.checkContactData["positionBY"]=inPositionB.y;
        this.checkContactData["widthA"]=inSizeA.width;
        this.checkContactData["heightA"]=inSizeA.height;
        this.checkContactData["widthB"]=inSizeB.width;
        this.checkContactData["heightB"]=inSizeB.height;
    },


    //recycle by ResourceInfo
    recycleByResourceInfo:function(inResourceInfo,inPrefab){

        inPrefab.setPosition(-8000,-8000);//set position leave screen

        let resourceInfo=null;
        if(inResourceInfo.getType()==="Hay0"){
            
            let hayUnit=inPrefab.getComponent("HayUnit");
            hayUnit.initial();

            this.standbyHayList.push(inPrefab);

            if(this.workHayList.length>0){
            
                for(let i=0;i<this.workHayList.length;i++){

                    resourceInfo=this.workHayList[i].getComponent("ResourceInfo");
                    if(inResourceInfo.getID()===resourceInfo.getID()){

                        this.workHayList.splice(i,1);
                        break;
                    }
                }
            }
        }
        else if(inResourceInfo.getType()==="Wall0" ||inResourceInfo.getType()==="Wall1"){   
            
            this.standbyWallList.push(inPrefab);
            if(this.workWallList.length>0){
            
                for(let i=0;i<this.workWallList.length;i++){

                    resourceInfo=this.workWallList[i].getComponent("ResourceInfo");
                    if(inResourceInfo.getID()===resourceInfo.getID()){

                        this.workWallList.splice(i,1);
                        break;
                    }
                }
            }
        }
    },


    //set work prefab to work list
    setWorkByResourceInfo:function(inResourceInfo,inPrefab){

        if(inResourceInfo.getType()==="Hay0"){

            let hayUnit=inPrefab.getComponent("HayUnit");
            hayUnit.initial;
            this.workHayList.push(inPrefab);
        }
        else if(inResourceInfo.getType()==="Wall0" ||inResourceInfo.getType()==="Wall1")   
            this.workWallList.push(inPrefab);
    },


    //set random position
    setRandomPosition:function(){

        this.randomPositionData.x=(-this.floorAreaWidth/2)+CalculateTool.getRandomInteger(11)*(this.floorAreaWidth/10);
        this.randomPositionData.y=(this.floorAreaHeight/2)-CalculateTool.getRandomInteger(11)*(this.floorAreaHeight/10);
    },


    //get random out screen position
    setRandomOutScreenPosition:function(inTankData){

        if(inTankData.aimPosition.x-inTankData.selfPosition.x>0){//tank direct right

            if(inTankData.isForward){
               
                this.randomPositionData.x= this.outScreenPointBaseX-CalculateTool.getRandomInteger(11)*(this.floorAreaWidth/10);
                if(inTankData.aimPosition.y-inTankData.selfPosition.y>0){//tank direct rightUp
                  
                    if(Math.abs(this.randomPositionData.x)<this.floorAreaWidth/2)//in screen x
                        this.randomPositionData.y=this.outScreenPointBaseY;
                    else//out screen x
                        this.randomPositionData.y=this.outScreenPointBaseY-CalculateTool.getRandomInteger(11)*(this.floorAreaHeight/10);
                }
                else{//tank direct rightDown
                  
                    if(Math.abs(this.randomPositionData.x)<this.floorAreaWidth/2)//in screen x
                        this.randomPositionData.y=-this.outScreenPointBaseY;
                    else//out screen x
                        this.randomPositionData.y=-this.outScreenPointBaseY+CalculateTool.getRandomInteger(11)*(this.floorAreaHeight/10);
                }
            }
            else{
              
                this.randomPositionData.x= -this.outScreenPointBaseX+CalculateTool.getRandomInteger(11)*(this.floorAreaWidth/10);
                if(inTankData.aimPosition.y-inTankData.selfPosition.y>0){//tank direct rightUp
                   
                    if(Math.abs(this.randomPositionData.x)<this.floorAreaWidth/2)//in screen x
                        this.randomPositionData.y=-this.outScreenPointBaseY;
                    else//out screen x
                        this.randomPositionData.y=-this.outScreenPointBaseY+CalculateTool.getRandomInteger(11)*(this.floorAreaHeight/10);
                }
                else{//tank direct rightDown
                  
                    if(Math.abs(this.randomPositionData.x)<this.floorAreaWidth/2)//in screen x
                        this.randomPositionData.y=this.outScreenPointBaseY;
                    else//out screen x
                        this.randomPositionData.y=this.outScreenPointBaseY-CalculateTool.getRandomInteger(11)*(this.floorAreaHeight/10);
                }
            }
        }
        else{//tank direct left

            if(inTankData.isForward){
               
                this.randomPositionData.x=-this.outScreenPointBaseX+CalculateTool.getRandomInteger(11)*(this.floorAreaWidth/10);
                if(inTankData.aimPosition.y-inTankData.selfPosition.y>0){//tank direct leftUp
                   
                    if(Math.abs(this.randomPositionData.x)<this.floorAreaWidth/2)//in screen x
                        this.randomPositionData.y=this.outScreenPointBaseY;
                    else//out screen x
                        this.randomPositionData.y=this.outScreenPointBaseY-CalculateTool.getRandomInteger(11)*(this.floorAreaHeight/10);
                }
                else{//tank direct leftDown
                   
                    if(Math.abs(this.randomPositionData.x)<this.floorAreaWidth/2)//in screen x
                        this.randomPositionData.y=-this.outScreenPointBaseY;
                    else//out screen x
                        this.randomPositionData.y=-this.outScreenPointBaseY+CalculateTool.getRandomInteger(11)*(this.floorAreaHeight/10);
                }
            }
            else{
               
                this.randomPositionData.x=this.outScreenPointBaseX-CalculateTool.getRandomInteger(11)*(this.floorAreaWidth/10);
                if(inTankData.aimPosition.y-inTankData.selfPosition.y>0){//tank direct leftUp
                   
                    if(Math.abs(this.randomPositionData.x)<this.floorAreaWidth/2)//in screen x
                        this.randomPositionData.y=-this.outScreenPointBaseY;
                    else//out screen x
                        this.randomPositionData.y=-this.outScreenPointBaseY+CalculateTool.getRandomInteger(11)*(this.floorAreaHeight/10);
                }
                else{//tank direct leftDown
                    
                    if(Math.abs(this.randomPositionData.x)<this.floorAreaWidth/2)//in screen x
                        this.randomPositionData.y=this.outScreenPointBaseY;
                    else//out screen x
                        this.randomPositionData.y=this.outScreenPointBaseY-CalculateTool.getRandomInteger(11)*(this.floorAreaHeight/10);
                }
            }
        }
    },


    //make and recycle blocks(hay,wall)
    checkBlocks:function(inTankData){
     
        this.recycleBlocks(inTankData);
        this.makeBlock(inTankData,true);
    },


    //get new block to put on map
    getNewBlock:function(){

        let newBlocksList=[];
        let needCount=0;
        let addCount=0;

        if(this.workHayList.length < this.hayOnMapLimit){//get hay need to show on the map

            needCount=this.hayOnMapLimit-this.workHayList.length;

            while(addCount<needCount){
              
                newBlocksList.push(this.standbyHayList[0]);
                this.standbyHayList.splice(0,1);
                addCount+=1;
            }
        }

        if(this.workWallList.length<this.wallOnMapLimit){//get wall need to show on the map

            needCount=this.hayOnMapLimit-this.workHayList.length;
            addCount=0;
            while(addCount<needCount){
               
                newBlocksList.push(this.standbyWallList[0]);
                this.standbyWallList.splice(0,1);
                addCount+=1;
            }
        }

        return newBlocksList;
    },


    //get block on map
    getMapBlockList:function(){

        return this.mapBlocksList;
    },


    //make hay and wall
    //random flow: 1:get new blocks >> 2:random position >> 3:if contact, recycle blocks, if not contact, set position
    makeBlock:function(inTankData,inNeedOutScreen){
       
        let newBlocksList=this.getNewBlock();
       
        if(newBlocksList.length===0)//no new block to put on map
            return;
               
        let resourceInfo=null;  
        let add=true;  
        for(let i=0;i<newBlocksList.length;i++){

            resourceInfo=newBlocksList[i].getComponent("ResourceInfo");
            if(inNeedOutScreen){//random position out screen

                this.setRandomOutScreenPosition(inTankData);

                this.randomPositionData.width=newBlocksList[i].width;
                this.randomPositionData.height=newBlocksList[i].height;

                if(CalculateTool.checkContactTankDirection(this.randomPositionData,inTankData)){//avoid tank direction
                   
                    this.recycleByResourceInfo(resourceInfo,newBlocksList[i]);
                    continue;
                }
            }
            else{//random position in screen     

                this.setRandomPosition();
                this.setContactData(this.randomPositionData,inTankData.selfPosition,newBlocksList[i],inTankData);

                if(CalculateTool.checkContact(this.checkContactData)){// position is contact other block or not               
                
                    this.recycleByResourceInfo(resourceInfo,newBlocksList[i]);
                    continue;
                }
            }

            if(this.mapBlocksList.length===0){//no block on map 

                newBlocksList[i].setPosition( this.randomPositionData.x, this.randomPositionData.y);
                this.mapBlocksList.push(newBlocksList[i]);
                this.setWorkByResourceInfo(resourceInfo,newBlocksList[i]);
            }
            else{//check block on map is contact new block or not

                add=true;
                for(let x=0;x<this.mapBlocksList.length;x++){

                    this.setContactData(this.randomPositionData,this.mapBlocksList[x].position,newBlocksList[i],this.mapBlocksList[x]);
                    if(CalculateTool.checkContact(this.checkContactData)){                    
                    
                        this.recycleByResourceInfo(resourceInfo,newBlocksList[i]);
                        add=false;
                        break;
                    }
                }

                if(add){
                    newBlocksList[i].setPosition( this.randomPositionData.x, this.randomPositionData.y);
                    this.mapBlocksList.push(newBlocksList[i]);
                    this.setWorkByResourceInfo(resourceInfo,newBlocksList[i]);
                }
            }
        }
    },


    //recycle out screen blocks and position on tank direction
    recycleBlocks:function(inTankData){

        if(this.mapBlocksList.length!==0){

            let resourceInfo=null;
            let deleteIndexList=[];
            let prefabData={};
            prefabData["width"]=0;
            prefabData["height"]=0;
            prefabData["x"]=0;
            prefabData["y"]=0;
         
            for(let i=0;i<this.mapBlocksList.length;i++){

                prefabData["width"]=this.mapBlocksList[i].width;
                prefabData["height"]=this.mapBlocksList[i].height;
                prefabData["x"]=this.mapBlocksList[i].position.x;
                prefabData["y"]=this.mapBlocksList[i].position.y;
               
                //over out screen base position 
                if(Math.abs(this.mapBlocksList[i].position.x)> this.outScreenPointBaseX ||Math.abs(this.mapBlocksList[i].position.y)> this.outScreenPointBaseY){
                    deleteIndexList.push(i);
                    continue;
                }
                
                if(Math.abs(this.mapBlocksList[i].position.x)>=(this.floorAreaWidth/2)+this.mapBlocksList[i].width/2 ){ //out of screen,but not over out screen base position x 

                    if(CalculateTool.checkContactTankDirection(prefabData,inTankData))
                        deleteIndexList.push(i);
                }
                else if(Math.abs(this.mapBlocksList[i].position.y)>=(this.floorAreaHeight/2)+this.mapBlocksList[i].height/2){//out of screen,but not over out screen base position y 
                     
                    if(CalculateTool.checkContactTankDirection(prefabData,inTankData))
                        deleteIndexList.push(i);
                }
            }

            if(deleteIndexList.length!==0){//have prefab to recycle

                for(let i=deleteIndexList.length-1;i>=0;i--){

                    resourceInfo=this.mapBlocksList[deleteIndexList[i]].getComponent("ResourceInfo");
                    this.recycleByResourceInfo(resourceInfo,this.mapBlocksList[deleteIndexList[i]]);
                    this.mapBlocksList.splice(deleteIndexList[i],1);
                }
            }
        }
    },


    //floor block move
    floorMove:function(inMoveData){

        this.mainFloor.setPosition(this.mainFloor.position.x-inMoveData.moveSpeedX,this.mainFloor.position.y-inMoveData.moveSpeedY);
        for(let i=0;i<this.subFloorList.length;i++){

            this.subFloorList[i].setPosition(this.subFloorList[i].position.x-inMoveData.moveSpeedX,this.subFloorList[i].position.y-inMoveData.moveSpeedY);
        }

        if(this.mapBlocksList.length!==0){

            for(let i=0;i<this.mapBlocksList.length;i++){

                this.mapBlocksList[i].setPosition(this.mapBlocksList[i].position.x-inMoveData.moveSpeedX,this.mapBlocksList[i].position.y-inMoveData.moveSpeedY);
            }
        }
    },


    //when player will go to screen limit, rematch floor
    checkFloorMatch:function(){

        if(Math.abs(this.mainFloor.position.x)>this.floorAreaWidth/2 || Math.abs(this.mainFloor.position.y)>this.floorAreaHeight/2){//need change main floor

            for(let i=0;i<this.subFloorList.length;i++){

                //check floor what is center point in the floor area in screen
                if(Math.abs(this.subFloorList[i].position.x)<=this.floorAreaWidth/2 && Math.abs(this.subFloorList[i].position.y)<=this.floorAreaHeight/2){
                   
                    let newMainFloor=this.subFloorList[i];
                    this.subFloorList[i]=this.mainFloor;
                    this.mainFloor=newMainFloor;
                    break;
                }
            }

            this.floorRematchWork();
        }
    },


    //floor rematch work
    floorRematchWork:function(){

        this.subFloorList[0].setPosition(this.mainFloor.position.x-this.floorWidth,this.mainFloor.position.y+this.floorHeight);//leftUp
        this.subFloorList[1].setPosition(this.mainFloor.position.x,this.mainFloor.position.y+this.floorHeight);//up
        this.subFloorList[2].setPosition(this.mainFloor.position.x+this.floorWidth,this.mainFloor.position.y+this.floorHeight);//right up
        this.subFloorList[3].setPosition(this.mainFloor.position.x+this.floorWidth,this.mainFloor.position.y);//right
        this.subFloorList[4].setPosition(this.mainFloor.position.x+this.floorWidth,this.mainFloor.position.y-this.floorHeight);//rightDown
        this.subFloorList[5].setPosition(this.mainFloor.position.x,this.mainFloor.position.y-this.floorHeight);//down
        this.subFloorList[6].setPosition(this.mainFloor.position.x-this.floorWidth,this.mainFloor.position.y-this.floorHeight);//leftDown
        this.subFloorList[7].setPosition(this.mainFloor.position.x-this.floorWidth,this.mainFloor.position.y);//left
    },


    //set bullet
    setBullet:function(inPrefab){

        this.bulletList.push(inPrefab);
    },


    //bullet move
    bulletMove:function(dt){

        if(this.bulletList.length===0)
            return;

        let deleteIndexList=[];    

        for(let i=0;i<this.bulletList.length;i++){

            //check out screen bullet
            if(Math.abs(this.bulletList[i].position.x)>this.floorAreaWidth/2 ||Math.abs(this.bulletList[i].position.y)>this.floorAreaHeight/2){

                deleteIndexList.push(i);
                continue;
            }

            this.useBulletUnit=this.bulletList[i].getComponent("BulletUnit");
            this.bulletList[i].setPosition(this.bulletList[i].position.x+(this.useBulletUnit.moveSpeed*this.useBulletUnit.moveSpeedX*dt),
                this.bulletList[i].position.y+(this.useBulletUnit.moveSpeed*this.useBulletUnit.moveSpeedY*dt));
        }

        if(deleteIndexList.length!==0){//recycle bullet

            for(let i=deleteIndexList.length-1;i>=0;i--){
        
                this.mapManager.prefabRecycle( this.bulletList[deleteIndexList[i]]);
                this.bulletList.splice(deleteIndexList[i],1);
            }
        }

        this.checkBulletContact();
    },


    //check bullet contact blocks
    checkBulletContact:function(){

        if(this.bulletList.length===0|| this.mapBlocksList.length===0)
            return;

        let deleteIndexList=[];
        let deleteMapBlockIndexList=[];
        let resourceInfo=null;
            
        for(let i=0;i<this.bulletList.length;i++){

            for(let x=0;x<this.mapBlocksList.length;x++){

                this.setContactData(this.bulletList[i].position,this.mapBlocksList[x], this.bulletList[i],this.mapBlocksList[x]);
                
                if(this.mapManager.checkBulletContact(this.checkContactData,this.bulletList[i],this.mapBlocksList[x])){

                    deleteIndexList.push(i);
                    if(this.mapManager.bulletAttackWork(this.bulletList[i],this.mapBlocksList[x])){

                        resourceInfo=this.mapBlocksList[x].getComponent("ResourceInfo");
                        deleteMapBlockIndexList.push(x);                            
                        this.recycleByResourceInfo(resourceInfo,this.mapBlocksList[x]);
                    }
                }
            }
        }    

        if(deleteIndexList.length!==0){

            for(let i=deleteIndexList.length-1;i>=0;i--){
        
                this.bulletList.splice(deleteIndexList[i],1);
            }
        }

        if(deleteMapBlockIndexList.length!==0){

            for(let i=deleteMapBlockIndexList.length-1;i>=0;i--){
                     
                this.mapBlocksList.splice(deleteMapBlockIndexList[i],1);
            }
        }
    },
});
