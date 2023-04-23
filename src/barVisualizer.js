   //canvas2 bar visualizer
   const canvas2 = document.getElementById('canvas2');
   const ctx = canvas2.getContext('2d');
   //canvas2.width = 840;
   //canvas2.height = 80;
       
   let x;
   
   
  export  function drawBarVisualizer(bufferLength, analyser, dataArray){
     let barWidth = canvas2.width / bufferLength;
     let barHeight;
        ctx.clearRect(0, 0, canvas2.width, canvas2.height);
        function drawText(){
             ctx.font = "12px Verdana";
             ctx.fillStyle = 'white';
             ctx.fillText('Bar Visualizer', 10, 16);              
        }
        drawText();

        x = 0;
        analyser.getByteFrequencyData(dataArray);
        for(let i = 0; i < bufferLength; i++){
             barHeight = dataArray[i] / 6;     
             //draw
             const h = i + barHeight / 5;
             const s = 90;
             const l = 50;
   
             ctx.fillStyle = 'white';
             ctx.fillRect(x + canvas2.width/2, canvas2.height - 15 - barHeight, barWidth, 5);
   
             ctx.fillStyle = 'hsl('+ h +' , '+ s +'%, '+ l +'%)';
             ctx.fillRect(x + canvas2.width / 2, canvas2.height - 15 -barHeight, barWidth, barHeight);
             
             ctx.fillStyle = 'white';
             ctx.fillRect(canvas2.width/2 - x , canvas2.height - 15 - barHeight, barWidth, 5);
   
             ctx.fillStyle = 'hsl('+ h +' , '+ s +'%, '+ l +'%)';
             ctx.fillRect(canvas2.width / 2 - x, canvas2.height - 15 - barHeight , barWidth, barHeight);
   
           x += barWidth;          
        }
        requestAnimationFrame(drawBarVisualizer);
   };