

cc.Class({
    extends: cc.Component,

    properties:()=> ({
      
        loadingScreen:{//loading screen object
            default:null,
            type:cc.Node
        }
    }),

      
    //open loading screen
    openLoading:function(){

        this.loadingScreen.setPosition(0,0);
        this.loadingScreen.active=true;
        this.changeAlpha(true);
    },


    //off loading screen
    offLoading:function(){

        this.changeAlpha(false);
    },
    
    // change loading screen alpha
    // inisOpen is true ,mean loading open 
    // inisOpen is false ,mean loading off 
    changeAlpha:function(inIsOpen){

        if(inIsOpen){
           
            cc.tween(this.loadingScreen)
                .to(1, { opacity: 255 })
                .call(() => { this.openLoadingFinish(); })
                .start();
        }
        else{
          
            cc.tween(this.loadingScreen)
                .to(1, { opacity: 0 })
                .call(() => { this.offLoadingFinish(); })
                .start();
        }
    },


    //when open loading finish, call this function,but nothing to do now
    openLoadingFinish:function(){
       
    },


    //when off loading finish, call this function 
    offLoadingFinish:function(){
       
        this.loadingScreen.setPosition(-8000,-8000);
        this.loadingScreen.active=false;
    }
});
