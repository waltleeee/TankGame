

cc.Class({
    extends: cc.Component,

    properties:()=> ({
       
        tankObject:{//tank object, is origin point for check contact
            default:null,
            type:cc.Node
        },

        aimObject:{//aim object
            default:null,
            type:cc.Node
        },

        firePoint:{//fire point
            default:null,
            type:cc.Node
        },


        moveSpeed:{default:null},//tank move speed
        turnSpeed:{default:null},//tank turn speed
        moveType:{default:null},//-1:back 0:stop 1:forward
        turnType:{default:null},//-1:right 0:stop 1:left
        motionType:{default:null},//0:stop  1:leftTurn  2:RightTurn  3:moveForward  4:moveBack 
        useAngle:{default:90},// use angle for checkAction, angle 0 is right direction, will allways plus 90 by node's angle
        useSpeedX:{default:null},// use x speed for checkAction
        useSpeedY:{default:null},// use y speed for checkAction
        turnAngle:{default:null},//turn angle
        moveCheckFunc:{default:null},// call check function before move
        moveDeltaTime:{default:null},//deltatime for move
        bulletType:{default:""},//bullet type, set from editor
        checkPointList:[cc.Node],//check point for check contact
    }),

   

    start:function () {

        this.motionType=0
        this.moveType=0;
        this.turnType=0;
        this.moveSpeed=300;
        this.turnSpeed=80;
        this.moveDeltaTime=0.016;
    },

    update:function (dt) {

        this.checkAction(dt);
    },


    initial:function(){

        this.moveType=0;
        this.turnType=0;
        this.node.angle=0;
        this.useSpeedX=0;
        this.useSpeedY=0;
    },


    //check move an turn
    checkAction:function(inDeltaTime){

        if(this.turnType!==0 ||this.moveType!==0){//only turn or move, turn and move in same time is error

            {//tank is turn mod
            if(this.turnType!==0)
                this.turnAngle=this.turnType*inDeltaTime*this.turnSpeed;

                if(this.turnType===1)
                    this.motionType=1;
                else
                    this.motionType=2;
            }
                      
            //tank is move mode
            if(this.moveType!=0){
            
                this.moveDeltaTime=inDeltaTime;
                this.useSpeedY=Math.sin(this.useAngle* Math.PI / 180)*(this.moveType* this.moveDeltaTime*this.moveSpeed);
                this.useSpeedX=Math.cos(this.useAngle* Math.PI / 180)*(this.moveType* this.moveDeltaTime*this.moveSpeed);

                if(this.moveType===1)
                    this.motionType=3;
                else
                    this.motionType=4;
            }

            if(this.moveCheckFunc!==null)//if have moveCheckFunc, call this function for check doMotion allow
                this.moveCheckFunc(this.motionType); 
            else
                this.doMotion();
        }
    },


    //set check function
    setMoveCheckFunc:function(inFunc){

        this.moveCheckFunc=inFunc;
    },


    //do move work
    doMotion:function(){
      
        if(this.turnType!==0){
        
            this.node.angle+=this.turnAngle;

            if(this.node.angle<0)
                this.node.angle+=360;

            this.useAngle=((this.node.angle+90)%360);
            this.turnAngle=0;
        }
        else if(this.moveType!==0)
            this.node.setPosition(this.node.position.x+ (this.useSpeedX),this.node.position.y+(this.useSpeedY));
    },


    //get action type 0: move  ,  1: turn
    getActionType:function(){

        if(this.turnType!==0)//tank is turn
            return 1;
        else if(this.moveType!==0)//tank is move
            return 0;
        else //tank is stop
            return 1;
    },


    //get tank move speed x
    getMoveSpeedX:function(){

        return this.useSpeedX;
    },


    //get tank move speed y
    getMoveSpeedY:function(){

        return this.useSpeedY;
    },


    //get tank use angle
    getAngleData:function(){

        return this.useAngle;
    },


    // get bullet type
    getBulletType:function(){

        return this.bulletType;
    },


    //get fire data
    getFireData:function(){

        let data={};
        data["speedXBase"]=Math.cos(this.useAngle* Math.PI / 180);
        data["speedYBase"]=Math.sin(this.useAngle* Math.PI / 180);
        data["angle"]=this.useAngle-90;
        data["firePosition"]=this.firePoint.convertToWorldSpaceAR(cc.v2(0, 0));

        return data;
    },


    //get aim position
    getAimPosition:function(){

        return this.aimObject.convertToWorldSpaceAR(cc.v2(0, 0));
    },


    //get next action data ,inNode is whree do you want to transform
    getNextActiontData:function(inNode){

         let data={};
         let position=null;

         if(this.moveType!==0){
         
            data["moveDistanceX"]= this.useSpeedX;
            data["moveDistanceY"]= this.useSpeedX;
         }
         else{
            data["moveDistanceX"]= 0;
            data["moveDistanceY"]= 0;
         }

         data["originAngle"]=this.useAngle;

        if(this.turnType!=0)
            data["turnAngle"]=this.turnType*this.moveDeltaTime*this.turnSpeed;
        else   
            data["turnAngle"]=0;

        position=inNode.convertToNodeSpaceAR(this.tankObject.convertToWorldSpaceAR(cc.v2(0, 0)));
        data["originPositionX"]=position.x;//object center position x
        data["originPositionY"]=position.y;//object center position y
        data["checkPointPositionList"]=[];

        for(let i=0;i<this.checkPointList.length;i++){

            position=inNode.convertToNodeSpaceAR(this.checkPointList[i].convertToWorldSpaceAR(cc.v2(0, 0)));

            let positionData={};
            positionData["x"]=position.x;
            positionData["y"]=position.y;
            data["checkPointPositionList"].push(positionData);
        }

        return data;
    }, 


    //set use angle
    setAngle:function(inAngle){
      
        this.useAngle=inAngle;
    },


    //set use speed
    setUseSpeed:function(inUseSpeedX,inUseSpeedY){

        this.useSpeedX=inUseSpeedX;
        this.useSpeedY=inUseSpeedY;
    }, 

    //change move type to forward
    setMoveForward:function(){
      
        this.moveType=1;
    },


    //change move type to back
    setMoveBack:function(){
        
        this.moveType=-1;
    },


    //change move type to stop
    setMoveStop:function(){
       
        this.moveType=0;
    },


    //change turn type to left
    setTurnLeft:function(){
      
        this.turnType=1;
    },


    //change turn type to right
    setTurnRight:function(){

        this.turnType=-1;
    },


    //change turn type to stop
    setTurnStop:function(){

        this.turnType=0;
    },
});
