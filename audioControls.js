
export function fileUpload(){
     const file = document.getElementById('file_upload');
     file.addEventListener('change', function(){
          const files = this.files;
          audio1.src = URL.createObjectURL(files[0]);
          audio1.load();
     });
}

///// audio setup /////

/*  
export function audioVisualizer(){
   
 //////////////////////////

      const audioCtx = new AudioContext();
     analyser = audioCtx.createAnalyser();
     audioSource = audioCtx.createMediaElementSource(audioElement);
     audioSource.connect(analyser);
     analyser.connect(audioCtx.destination);
     analyser.fftSize = 512;
     let bufferLength = analyser.frequencyBinCount;
     dataArray = new Uint8Array(bufferLength); 

     const playBtn = document.getElementById('playBtn');
     const stopBtn = document.getElementById('stopBtn');
     const pauseBtn = document.getElementById('pauseBtn');

     playBtn.addEventListener('click', function(e){     
          e.preventDefault();
          //audio1.play();
          //audioElement.play();
          audioTrack.play();
     })
     stopBtn.addEventListener('click', (e) => {
          e.preventDefault();
          //audioElement.pause();
          audioTrack.stop();
     })
     pauseBtn.addEventListener('click', (e) => {
          e.preventDefault();
          //audioElement.pause();
          audioTrack.pause();
     })

     ///// video recording ////////
     const recordBtn = document.getElementById('recordBtn');
     const stopRecordBtn = document.getElementById('stopRecordBtn');
     let recording = false;
     let mediaRecorder;
     let recordedChunks = [];

     recordBtn.addEventListener('click', (e) => {
          e.preventDefault();
          let dest = audioCtx.createMediaStreamDestination();
          audioSource.connect(dest);
          let audioTrack = dest.stream.getAudioTracks()[0];
          recording = !recording;
          if(recording){
               recordBtn.innerText = "recordings...";
               const canvasStream = canvas.captureStream(60);
               mediaRecorder = new MediaRecorder(canvasStream, {
                    mimeType: 'video/webm;codecs=vp9'
               })
               canvasStream.addTrack(audioTrack);
               mediaRecorder.ondataavailable = e => {
                    if(e.data.size > 0){
                         recordedChunks.push(e.data);
                    }
               }
               mediaRecorder.start();
          }
     });

     stopRecordBtn.addEventListener('click', (e) => {
          e.preventDefault();
          recordBtn.innerText = "Start Record";
          mediaRecorder.stop();
          setTimeout((e) => {
               const blob = new Blob(recordedChunks, {
                    type: 'video/webm'
               })
               const url = URL.createObjectURL(blob);
               const a = document.createElement('a');
               a.href = url;
               a.download = 'recording.webm';
               a.click();
               url.revokeObjectURL(url);
          }, 100);
     });
}
*/


export function audioControls(){ 
     
     const audioElement = document.getElementById('audio1')
     const playBtn = document.getElementById('playBtn');
     const stopBtn = document.getElementById('stopBtn');
     const pauseBtn = document.getElementById('pauseBtn');

     playBtn.addEventListener('click', function(e){     
          e.preventDefault();
          audioElement.play();
     })
     stopBtn.addEventListener('click', (e) => {
          e.preventDefault();
          audioElement.pause();
     })
     pauseBtn.addEventListener('click', (e) => {
          e.preventDefault();
          audioElement.pause();
     })

} 