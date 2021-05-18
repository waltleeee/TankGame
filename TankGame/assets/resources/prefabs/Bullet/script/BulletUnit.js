

cc.Class({
    extends: cc.Component,

    properties:()=> ({
      
        power:{default:10},//bullet power
        moveSpeed:{default:500},// bullet move speed base
        moveSpeedX:{default:0},//bullet move real speedX
        moveSpeedY:{default:0},//bullet move real speedY
        checkPointList:[cc.Node],//check point for check contact
    }),

    //set real speed
    setSpeed:function(inSpeedX,inSpeedY){

        this.moveSpeedX=inSpeedX;
        this.moveSpeedY=inSpeedY;
    }, 

    //get power
    getPower:function(){

        return this.power;
    },
   
     //get checkPoint data, for check contact , inNode is whree do you want to transform
     getCheckPointData:function(inNode){

        let data=[];
        let position=null; 
        for(let i=0;i<this.checkPointList.length;i++){

            position=inNode.convertToNodeSpaceAR(this.checkPointList[i].convertToWorldSpaceAR(cc.v2(0, 0)));
            
            let positionData={};
            positionData["x"]=position.x;
            positionData["y"]=position.y;
            data.push(positionData);
        }
       
       return data;
   }, 
});
