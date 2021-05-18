let CalculateTool = {
  
    //check contact by width and height
    checkContact:function(inData) {
    
        if(Math.abs(inData.positionAX-inData.positionBX)<=(inData.widthA/2)+(inData.widthB/2)){

            if(Math.abs(inData.positionAY-inData.positionBY)<=(inData.heightA/2)+(inData.heightB/2))  
                return true;
            else
                return false;    
       }

       return false;
    },


     //check contact by corner distance before real contact
     checkContactByCorner:function(inData) {
    
        let cornerWidthA=Math.sqrt(Math.pow(inData.widthA/2,2)+Math.pow(inData.heightA/2,2));
        let cornerWidthB=Math.sqrt(Math.pow(inData.widthB/2,2)+Math.pow(inData.heightB/2,2));

        if(Math.sqrt(Math.pow(inData.positionAX-inData.positionBX,2)+Math.pow(inData.positionAY-inData.positionBY,2))<cornerWidthA+cornerWidthB)
            return true;
     
        return false;
    },


    //get contact data
    getContactData:function(){

        let data={};
        data["positionAX"]=0;
        data["positionAY"]=0;
        data["positionBX"]=0;
        data["positionBY"]=0;
        data["widthA"]=0;
        data["widthB"]=0;
        data["heightA"]=0;
        data["heightB"]=0;

        return data;
    },


    //check contact by check point and vector, all vector need same counterclockwise , 
    //use cross to calculate point is in or out of area 
    checkContactByCheckPoint:function(inCheckPointList,inVectorList){

        if(inCheckPointList.length===0||inVectorList.length===0)
            return false;
        
        let checkVectorX=0;
        let checkVectorY=0;
        let areaValue=0;
        let isContact=false;

        for(let i=0;i<inCheckPointList.length;i++){

            isContact=true;
            for(let x=0;x<inVectorList.length;x++){

                checkVectorX=inVectorList[x].startPositionX-inCheckPointList[i].x;
                checkVectorY=inVectorList[x].startPositionY-inCheckPointList[i].y;
                areaValue=(inVectorList[x].vectorX*checkVectorY)-(checkVectorX*inVectorList[x].vectorY);

                if(areaValue<0){//mean position out of area
                    isContact=false;
                }
            }

            if(isContact)
                return true;
        }
      
        return false;
    }, 


    //get random number
    getRandomInteger:function(inRange){

        let number=Math.floor(Math.random()*inRange);

        return number;
    },


     //calculate vector, check point need sequence
    calculateVector:function(inCheckPointList){

        let vectorList=[];
        if(inCheckPointList.length===0)
            return vectorList;

        for(let i=0;i<inCheckPointList.length;i++){

            let data={};
            data["startPositionX"]=0;
            data["startPositionY"]=0;
            data["vectorX"]=0;
            data["vectorY"]=0;

            if(i+1>=inCheckPointList.length){//last point, need calculate

                data["startPositionX"]=inCheckPointList[i].x;
                data["startPositionY"]=inCheckPointList[i].y;
                data["vectorX"]=inCheckPointList[0].x-inCheckPointList[i].x;
                data["vectorY"]=inCheckPointList[0].y-inCheckPointList[i].y;
                vectorList.push(data);
                break;
            }

            data["startPositionX"]=inCheckPointList[i].x;
            data["startPositionY"]=inCheckPointList[i].y;
            data["vectorX"]=inCheckPointList[i+1].x-inCheckPointList[i].x;
            data["vectorY"]=inCheckPointList[i+1].y-inCheckPointList[i].y;
            vectorList.push(data);
         }   

         return vectorList;
    },


    //get calculate point after rote data
    getCalculateRotateData:function(){

        let data={};
        data["originAngle"]=0;// angle now
        data["positionX"]=0;//point position X what is need to rotate 
        data["positionY"]=0;//point position y what is need to rotate
        data["turnAngle"]=0;//angle need to turn
        data["originPositionX"]=0;//origin position x
        data["originPositionY"]=0;//origin position y

        return data;
    },

    //get position after rotate
    calculatePointAfterRotate:function(inData){

        let data=[];
        data["x"]=0;
        data["y"]=0;

        if(inData.turnAngle===0)
            return data;
        
        if(inData.turnAngle>=0){

            //x1=xcos(β)-ysin(β);
            //y1=ycos(β)+xsin(β);

            data["x"]=inData.positionX*Math.cos(inData.turnAngle*(Math.PI/180))-inData.positionY*Math.sin(inData.turnAngle*(Math.PI/180));
            data["y"]=inData.positionY*Math.cos(inData.turnAngle*(Math.PI/180))+inData.positionX*Math.sin(inData.turnAngle*(Math.PI/180));
        }
        else{

            //x1=xcos(β)+ysin(β);
            //y1=ycos(β)-xsin(β);
            
            data["x"]=inData.positionX*Math.cos(inData.turnAngle*(Math.PI/180))+inData.positionY*Math.sin(inData.turnAngle*(Math.PI/180));
            data["y"]=inData.positionY*Math.cos(inData.turnAngle*(Math.PI/180))-inData.positionX*Math.sin(inData.turnAngle*(Math.PI/180));
        }

        

        return data;
    },


    //check  position contact direction ,calculate distance about point to line equation
    checkContactTankDirection:function(inPrefabAData,inPrefabBData){

        let prefabCornerWidth=Math.sqrt(Math.pow(inPrefabAData.width/2,2)+Math.pow(inPrefabAData.height/2,2));
        let tankCornerWidth=Math.sqrt(Math.pow(inPrefabBData.width/2,2)+Math.pow(inPrefabBData.height/2,2));
        let fraction= Math.abs((inPrefabBData.xFactor*inPrefabAData.x)+ (inPrefabBData.yFactor*inPrefabAData.y)-inPrefabBData.finalValue);
        let numerator=Math.sqrt(Math.pow(inPrefabBData.xFactor,2)+Math.pow(inPrefabBData.yFactor,2));
             
        if((fraction/numerator)>prefabCornerWidth+tankCornerWidth)
            return false;
        else
            return true;
    },
}

module.exports = CalculateTool;
