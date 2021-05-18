let TankTool = {
  

    //get tank state data
    getTankStateData:function(){

        let data={};
        data["aimPosition"]=null;
        data["selfPosition"]=null;
        data["width"]=0;
        data["height"]=0;
        data["xFactor"]=0;
        data["yFactor"]=0;
        data["finalValue"]=0;
        data["isForward"]=true;

        return data;
    },


    //get use tank data
    getUseTankData:function(){

        let data={};
        data["useTank"]=null;
        data["useTankUnit"]=null;
        data["transformNode"]=null;
        data["isForward"]=true;
     
        return data;
    },


    //get limit point data
    getLimitPointData:function(){

        let data={};
        data["rightUpLimitPoint"]=null;
        data["rightDownLimitPoint"]=null;
        data["leftUpLimitPoint"]=null;
        data["leftDownLimitPoint"]=null;

        return data;
    },

    //set tank direction data, xFactor*X + yFactor*Y = finalValue
    updateTankData:function(inTankStateData,inUseTankData){

        inTankStateData.width=inUseTankData.useTank.width;
        inTankStateData.height=inUseTankData.useTank.height;
        inTankStateData.aimPosition=inUseTankData.transformNode.convertToNodeSpaceAR (inUseTankData.useTankUnit.getAimPosition())
        inTankStateData.selfPosition=inUseTankData.transformNode.convertToNodeSpaceAR (inUseTankData.useTank.convertToWorldSpaceAR(cc.v2(0, 0)));

        if (inTankStateData.aimPosition.y === inTankStateData.selfPosition.y) {

            inTankStateData.xFactor = null;
            inTankStateData.yFactor = 1;
            inTankStateData.finalValue = inTankStateData.aimPosition.y;

        } 
        else if(inTankStateData.aimPosition.x === inTankStateData.selfPosition.x) {

            inTankStateData.xFactor = 1;
            inTankStateData.yFactor = null;
            inTankStateData.finalValue =inTankStateData.selfPosition.x;

        }
        else {
            var first =inTankStateData.aimPosition.x - inTankStateData.selfPosition.x;
            var second =inTankStateData.aimPosition.y - inTankStateData.selfPosition.y;
            var xFactor = second;
            var yFactor = -first;
            var finalValue = -(first * inTankStateData.selfPosition.y) + (second * inTankStateData.selfPosition.x);
            inTankStateData.xFactor = xFactor;
            inTankStateData.yFactor = yFactor;
            inTankStateData.finalValue = finalValue;
        }
    },


     //check move mode, 0:move tank  1:move floor
     checkMoveMode:function(inUseTankData,inLimitPointData){

        let tankAngle=inUseTankData.useTankUnit.getAngleData();
        if(inUseTankData.useTank.position.x>=inLimitPointData.rightUpLimitPoint.position.x){//tank over right limit

            if(inUseTankData.useTank.position.y>=inLimitPointData.rightUpLimitPoint.position.y){//tank over right and up limit

                if(tankAngle>180||tankAngle>270){//mean tank direction is leftUp,Up, rightUp, right, rightDown
                    
                    if(inUseTankData.isForward)
                        return 1;
                    else
                        return 0;
                }
                else{

                    if(inUseTankData.isForward)
                         return 0;
                    else    
                        return 1;
                }    
                    
            }
            else if(inUseTankData.useTank.position.y<=inLimitPointData.rightDownLimitPoint.position.y){//tank over right and down limit
                
                if(tankAngle<90 ||tankAngle>180){//mean tank direction is leftDown,Down, rightDown, right, rightUp
                    
                    if(inUseTankData.isForward)
                        return 1;
                    else
                        return 0;
                }
                else
                {    
                    if(inUseTankData.isForward)
                        return 0;
                    else    
                        return 1;
                }
            }
            else{//tank over right limit only
                
                if(tankAngle<90 || tankAngle>270){//mean tank direction is rightDown, right, rightUp
                    
                    if(inUseTankData.isForward)
                        return 1;
                    else
                        return 0;
                }
                else{   

                    if(inUseTankData.isForward)
                        return 0;
                    else    
                        return 1;
                }
            }
        }
        else if(inUseTankData.useTank.position.x<=inLimitPointData.leftUpLimitPoint.position.x){//tank over left limit

            if(inUseTankData.useTank.position.y>=inLimitPointData.leftUpLimitPoint.position.y){//tank over left and up limit

                if(tankAngle<270){//mean tank direction is leftDown, left, leftUp, up, rightUp
                    
                    if(inUseTankData.isForward)
                        return 1;
                    else
                        return 0;
                }
                else{
                    
                    if(inUseTankData.isForward)
                        return 0;
                    else    
                        return 1;
                }
            }
            else if(inUseTankData.useTank.position.y<=inLimitPointData.leftDownLimitPoint.position.y){//tank over left and down limit
                
                if(tankAngle>90){//mean tank direction is leftUp, left, leftDown, down, rightDown
                    
                    if(inUseTankData.isForward)
                        return 1;
                    else
                        return 0;
                }
                else{   

                    if(inUseTankData.isForward)
                        return 0;
                    else    
                        return 1;
                }
            }
            else{//tank over left limit only

                if(tankAngle>90 &&tankAngle<270){//mean tank direction is leftUp, left, leftDown
                    
                    if(inUseTankData.isForward)
                        return 1;
                    else
                        return 0;
                }
                else{    
                    
                    if(inUseTankData.isForward)
                        return 0;
                    else    
                        return 1;
                }
            }
        }
        else if(inUseTankData.useTank.position.y>=inLimitPointData.leftUpLimitPoint.position.y){//tank over up limit only
            
            if(tankAngle>0 &&tankAngle<180){//mean tank direction is leftUp, up, rightUp
               
                if(inUseTankData.isForward)
                    return 1;
                else
                    return 0;
            }
            else{   

                if(inUseTankData.isForward)
                    return 0;
                else    
                    return 1;
            }
        }
        else if(inUseTankData.useTank.position.y<=inLimitPointData.leftDownLimitPoint.position.y){//tank over down limit only

            if(tankAngle>180){//mean tank direction is leftDown, down, rightDown
                
                if(inUseTankData.isForward)
                    return 1;
                else
                    return 0;
            }
            else{    

                if(inUseTankData.isForward)
                    return 0;
                else    
                    return 1;
            }
        }
        else//mean tank not over any limit
            return 0;
    },


    //check tank leave contact, 0:no contact  1:turn left  2: turn right  3:move forward  4:move back
    checkTankLeaveContact:function(inOriginMotion,inNewMotion){

        if(inOriginMotion===0)
            return true;

        switch(inOriginMotion){

            case 1://turn left
                if(inNewMotion===2)//turn right
                    return true;
                break;
            case 2://turn right
                if(inNewMotion===1)//turn left
                    return true;
                break;
            case 3://move forward
                if(inNewMotion===4)//move back
                    return true;
                break;
            case 4://move back
                if(inNewMotion===3)//move forward
                    return true;
                break;
            default:
                return true;
        }
        
        return false;
    },
}

module.exports = TankTool;
