var myapp=angular.module('callingapp',['ngRoute','ngStorage']);
myapp.controller('signupcontroller',['$location','$http','$rootScope','$window','$sessionStorage','callingservice',function($location,$http,$rootScope,$window,$sessionStorage,callingservice){
    var main=this;
    console.log(main.userID)
    this.clicking=function(){

        $location.path(`/callingpage/${main.userID}`)
        
    }
}])

myapp.controller('callingcontroller',['$location','$routeParams','$http','$rootScope','$window','$sessionStorage','callingservice',function($location,$routeParams,$http,$rootScope,$window,$sessionStorage,callingservice){
    var main=this;
    this.data="me";
    this.portno=''
    var peer;
    var calling;
    var recorder;
    var screeningbool=false
    var elementToShare = document.getElementById('remoteStream');
    var canvas2d = document.createElement('canvas');
    var context = canvas2d.getContext('2d');
    canvas2d.width = 800;
    canvas2d.height = 800;
    canvas2d.style.top = 0;
    canvas2d.style.left = 0;
    canvas2d.style.display = "none";
    canvas2d.style.zIndex = -1;
    (document.body || document.documentElement).appendChild(canvas2d);
    var isRecordingStarted = false;
    var isStoppedRecording = false;

  
    elementToShare.addEventListener('play', function() {
        var $this = this; //cache
        (function loop() {
          if (!$this.paused && !$this.ended) {
            context.drawImage($this, 0, 0);
            setTimeout(loop, 1000 / 30); // drawing at 30fps
          }
        })();
      }, 0);
   
    
    
    this.userID=$routeParams.userID
    console.log(this.userID)
    
    function openStream(){
        const config={audio:true,video:true}
        return navigator.mediaDevices.getUserMedia(config)
    }
    function openStreamaudio(){
        const config={audio:true}
        return navigator.mediaDevices.getUserMedia(config)
    }
    function playstream(idvideotag,stream){
        const video=document.getElementById(idvideotag)
        video.srcObject=stream
        console.log(video)
        video.play()
        
       
        }
        this.getportno=function () {
            $http.get('/portno')
            .then((response)=>{
                main.portno=response.data.portno
                console.log(response)
                console.log(this.portno)
                peer = new Peer(`${this.userID}`, { path: '/'});
                console.log(peer)
                peer.on('call',(call)=>{
                    
                    openStream()
                    .then((stream)=>{
                        call.answer(stream)   
                        call.on('stream',(remoteStream)=>{
                            console.log("helldo")
                        connectedpersonsmedia=remoteStream
                        playstream('remoteStream',remoteStream)
                    })
                })
                })


            })
            
        }
        this.getportno()
    // peer = new Peer(`${this.userID}`, {host: 'localhost',port:`${this.portno}`, path: '/'});
    // console.log(peer)
    var connectedpersonsmedia=null;
    // peer.on('call',(call)=>{
        
    //     openStream()
    //     .then((stream)=>{
    //         call.answer(stream)   
    //         call.on('stream',(remoteStream)=>{
    //             console.log("helldo")
    //         connectedpersonsmedia=remoteStream
    //         playstream('remoteStream',remoteStream)
    //     })
    // })
    // })
    $("#buttoncall").click(()=>{
        calling=document.getElementById("mycall").value;
        openStream()
.then((stream)=>{
    
    
    var call=peer.call(calling,stream)
    call.on('stream',(remoteStream)=>{
        playstream('remoteStream',remoteStream)
      
    })
})
    })

    var btnStartRecording = document.querySelector('#btn-start-recording');
    var btnStopRecording  = document.querySelector('#btn-stop-recording');
    var btnscreensharing  = document.querySelector('#btn-screen-sharing');
    
    var videoElement      = document.querySelector('video');
    
    var progressBar = document.querySelector('#progress-bar');
    var percentage = document.querySelector('#percentage');
    
    // var recorder;

    // this function submits recorded blob to nodejs server
    function postFiles() {
        var blob = recorder.getBlob();
        console.log(blob)
        // getting unique identifier for the file name
        var fileName = generateRandomString() + 'mp4';
        
        var file = new File([blob], fileName, {
            type: 'video/webm'
        });
        //videoElement.src = '';
        // videoElement.poster = '/ajax-loader.gif';
        xhr('/uploadFile', file, function(responseText) {
            var fileURL = JSON.parse(responseText).fileURL;
            console.info('fileURL', fileURL);
            alert("done")  
            recorder.save()    
            //videoElement.src = fileURL;
            //videoElement.play();
            //videoElement.muted = false;
            //videoElement.controls = true;
            //document.querySelector('#footer-h2').innerHTML = '<a href="' + videoElement.src + '">' + videoElement.src + '</a>';
        });
        
        
    }
    function xhr(url, data, callback) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
                callback(request.responseText);
            }
        };
                
        request.upload.onprogress = function(event) {
            progressBar.max = event.total;
            progressBar.value = event.loaded;
            progressBar.innerHTML = 'Upload Progress ' + Math.round(event.loaded / event.total * 100) + "%";
        };
                
        request.upload.onload = function() {
            percentage.style.display = 'none';
            progressBar.style.display = 'none';
        };
        request.open('POST', url);
        var formData = new FormData();
        formData.append('file', data);
        request.send(formData);
    }
    function generateRandomString() {
        if (window.crypto) {
            var a = window.crypto.getRandomValues(new Uint32Array(3)),
                token = '';
            for (var i = 0, l = a.length; i < l; i++) token += a[i].toString(36);
            return token;
        } else {
            return (Math.random() * new Date().getTime()).toString(36).replace( /\./g , '');
        }
    }
    var mediaStream = null;
    // reusable getUserMedia
    function captureUserMedia(success_callback) {
        var session = {
            audio: true,
            video: true
        };
        
        navigator.getUserMedia(session, success_callback, function(error) {
            alert('Unable to capture your camera. Please check console logs.');
            console.error(error);
        });
    }
    // UI events handling
     
    function displayscreen(){
        var displaymediastreamconstraints = {
            video: {
                displaySurface: 'monitor', // monitor, window, application, browser
                logicalSurface: true,
                cursor: 'always' // never, always, motion
            }
        }
        return navigator.mediaDevices.getDisplayMedia(displaymediastreamconstraints)
    }
    btnscreensharing.onclick = function() {
       // screeningbool=true
        displayscreen()
        .then((screenstream)=>{
            console.log(screenstream)
            const call=peer.call(calling,screenstream)
            call.on('stream',(remoteStream)=>{
                console.log(remoteStream)
                playstream('remoteStream',screenstream)

               
            })


        })

    }
    btnStartRecording.onclick = function() {
      
        openStreamaudio()
        .then((audiostream)=>{
            var canvasStream = canvas2d.captureStream();
            var finalStream = new MediaStream();
            getTracks(audiostream, 'audio').forEach(function(track) {
                finalStream.addTrack(track);
                console.log(finalStream)
            });
            getTracks(canvasStream, 'video').forEach(function(track) {
                finalStream.addTrack(track);
                console.log(finalStream)
            });
            recorder = RecordRTC(finalStream, {
                type: 'video'
            });
            console.log(recorder)
            recorder.startRecording();
        })

    };
    btnStopRecording.onclick = function() {
        
        isStoppedRecording = true;
        
        recorder.stopRecording(postFiles);
    };
  }])


