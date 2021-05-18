

cc.Class({
    extends: cc.Component,

    properties:()=> ({

        lifeLabel:{//show life
            default:null,
            type:cc.Label
        },

        life:{default:100},//life
        checkPointList:[cc.Node],//check point for check contact
    }),

  
    initial:function(){

        this.life=100;
        this.lifeLabel.string=this.life.toString();
    },


    //get life
    getLife:function(){

        return this.life;
    },
   
    //call this function when being attack
    beAttack:function(inDamage){

        this.life-=inDamage;
        if(this.life<0)
            this.life=0;

        this.lifeLabel.string=this.life.toString();
    },


     //get checkPoint data, for check contact,inNode is whree do you want to transform
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
