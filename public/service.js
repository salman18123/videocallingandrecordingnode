myapp.service('callingservice',function($http,$sessionStorage,$rootScope){
    
        var main=this;
       this.openStream=function openStream(){
        const config={audio:false,video:true}
        return navigator.mediaDevices.getUserMedia(config)
    }
    this.playstream=function playstream(){
        const video=document.getElementById(idvideotag)
        video.srcObject=stream
        video.play()
        
        }
        
        
    
    })