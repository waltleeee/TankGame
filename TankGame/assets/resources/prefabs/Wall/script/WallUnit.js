

cc.Class({
    extends: cc.Component,

    properties:()=>( {
      
        checkPointList:[cc.Node],//check point for check contact
    }),

   
    //get checkPoint data, for check contact
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
