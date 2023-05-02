
export function fileUpload(){
     const file = document.getElementById('file_upload');
     file.addEventListener('change', function(){
       const files = this.files;
       audio1.src = URL.createObjectURL(files[0]);
       audio1.load();
       document.getElementById('track-name').innerHTML = `<span>${files[0].name.split('.').slice(0, files[0].name.split('.').length - 1).join('')}</span>`
     });
}
   
export function audioControls(){    
     const audioElement = document.getElementById('audio1')
     // progress bar
     const progressBar = document.getElementById('playbar-progress')
     const timeProgress = document.getElementById('time-progress')
     const timeLeft = document.getElementById('time-left')

     // progress bar //
     const updateDisplayTime = () => {
          progressBar.style.width = `${(audioElement.currentTime / audioElement.duration) * 100}%`
          timeProgress.innerHTML = `<span>${formatTime(audioElement.currentTime, audioElement.duration)}</span>`
          timeLeft.innerHTML = `<span>${formatTime(audioElement.duration - audioElement.currentTime, audioElement.duration)}</span>`
     }

          
     setInterval(() => {
          if (audioElement.src !== '') {
          updateDisplayTime()
          } else {
          timeProgress.innerHTML = ''
          timeLeft.innerHTML = ''
          progressBar.style.width = '0%'
          }
     }, 500) 

     // volume bar controls
     const range = document.querySelector(".volume input[type=range]");

     const barHoverBox = document.querySelector(".volume .bar-hoverbox");
     const fill = document.querySelector(".volume .bar .bar-fill");
          
     range.addEventListener("change", (e) => {
          console.log("value", e.target.value);
          audioElement.volume = e.target.value / 100;
     });

     const setValue = (value) => {
          fill.style.width = value + "%";
          range.setAttribute("value", value)
          range.dispatchEvent(new Event("change"))
     }
          
     setValue(range.value);
          
     const calculateFill = (e) => {
          let offsetX = e.offsetX;    
          if (e.type === "touchmove") {
          offsetX = e.touches[0].pageX - e.touches[0].target.offsetLeft;
          }
          
          const width = e.target.offsetWidth - 30;

          setValue(
          Math.max(
               Math.min(
               (offsetX - 15) / width * 100.0,
               100.0
               ),
               0
          )
          );
     }
          
     let barStillDown = false;

     barHoverBox.addEventListener("touchstart", (e) => {
          barStillDown = true;

          calculateFill(e);
     }, true);

     barHoverBox.addEventListener("touchmove", (e) => {
          if (barStillDown) {
          calculateFill(e);
          }
     }, true);
          
     barHoverBox.addEventListener("mousedown", (e) => {
          barStillDown = true;
          
          calculateFill(e);
     }, true);
          
     barHoverBox.addEventListener("mousemove", (e) => {
          if (barStillDown) {
          calculateFill(e);
          }
     });
          
     barHoverBox.addEventListener("wheel", (e) => {
          const newValue = +range.value + e.deltaY * 0.5;
          
          setValue(Math.max(
          Math.min(
               newValue,
               100.0
          ),
          0
          ))
     });
          
     document.addEventListener("mouseup", (e) => {
          barStillDown = false;
     }, true);

     document.addEventListener("touchend", (e) => {
          barStillDown = false;
     }, true);

} 

//more utility function
function formatTime(currentTime, duration){
if (isNaN(currentTime) || isNaN(duration)) {
     currentTime = 0
     duration = 0
}
const roundedTime = Math.floor(currentTime)
const hours = Math.floor(roundedTime / 3600)
const minutes = Math.floor((roundedTime - (hours * 3600)) / 60)
const seconds = roundedTime - (hours * 3600) - (minutes * 60)
return ((duration >= 3600 ? (hours + ':') : '') + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds))
}
