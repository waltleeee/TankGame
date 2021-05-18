
//every resource load by ResourceManager, will add this componont
cc.Class({
    extends: cc.Component,

    properties:()=> ({
      
        id:{default:null},//resource id ,can modify by ResourceManager only
        type:{default:null},//resource type,can modify by ResourceManager only
    }),


    setInfo:function(inID,inType){

        this.id=inID;
        this.type=inType;
    },


    getID:function(){

        return this.id;
    },

    
    getType:function(){

        return this.type;
    },
});
