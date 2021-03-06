/*
** This function return an barchart object
**
** @param: options <hashmap>
**        canvas:        the canvas which will contain the barchart
**        outer_padding: padding on the left of the first bar and on right of the last (may be: inner_padding / 2)
**        inner_padding: padding between the bar (may be: canvas_width / 10)
**        arrow_height:  arrow height proportionnal to each bar height (may be: between 25 -> 35)
**        data:          name and score of each coalition (exemple: { "Order": 1100, "Federation": 850, "Alliance": 670, "Assembly": 1020 } )
**        colors:        color of each coalition (exemple: ["#FF6849","#184D9B", "#27C57D","#A15DD4"])
**        images:        src of logo of each coalition (exemple ["order.png","federation.png", "alliance.png","assembly.png"])
**        bckgrnd:       src of background of each coalition (exemple ["order_bg.png","federation_bg.png", "alliance_bg.png","assembly_bg.png"])
**        year_score:    year won by each coalition (exemple: [1, 10, 2, 2])
**
*/
function Barchart(options){
    this.options = options;
    this.canvas = options.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.colors = options.colors;
    this.yearScore = options.year_score;
    this.percent = 1;
  
    this.draw = async function(){
        this.images = [await addImageProcess(options.images[0]), await addImageProcess(options.images[1]), await addImageProcess(options.images[2]), await addImageProcess(options.images[3])];
        this.background = [await addImageProcess(options.bckgrnd[0]), await addImageProcess(options.bckgrnd[1]), await addImageProcess(options.bckgrnd[2]), await addImageProcess(options.bckgrnd[3])];
        drawChart(this);
    }
}


// -------------------------------------------- //

function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius,color){
  var rot=Math.PI/2*3;
  var x=cx;
  var y=cy;
  var step=Math.PI/spikes;

  ctx.beginPath();
  ctx.moveTo(cx,cy-outerRadius)
  for(i=0;i<spikes;i++){
    x=cx+Math.cos(rot)*outerRadius;
    y=cy+Math.sin(rot)*outerRadius;
    ctx.lineTo(x,y)
    rot+=step

    x=cx+Math.cos(rot)*innerRadius;
    y=cy+Math.sin(rot)*innerRadius;
    ctx.lineTo(x,y)
    rot+=step
  }
  ctx.lineTo(cx,cy-outerRadius);
  ctx.closePath();
  ctx.lineWidth=innerRadius*2/3;
  ctx.strokeStyle=color;
  ctx.stroke();
  ctx.fillStyle='white';
  ctx.fill();
}

function drawLine(ctx, startX, startY, endX, endY,color){
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth=15;
    ctx.beginPath();
    ctx.moveTo(startX,startY);
    ctx.lineTo(endX,endY);
    ctx.stroke();
    ctx.restore();
}


function addImageProcess(src){
  return new Promise((resolve, reject) => {
    let img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function drawText(ctx, upperLeftCornerX, upperLeftCornerY, fontSize, fontColor, text) {
    ctx.font = fontSize + "px Arial";
    ctx.fillStyle=fontColor;
    ctx.textAlign = "center";
    ctx.fillText(text,upperLeftCornerX, upperLeftCornerY);
}

function drawRifter(ctx, upperLeftCornerX, upperLeftCornerY, width, height,color) {
    ctx.strokeStyle=color;
    ctx.lineWidth=width * 15/100;
    ctx.beginPath();
    ctx.moveTo(upperLeftCornerX, upperLeftCornerY);
    ctx.lineTo(upperLeftCornerX + width / 2, upperLeftCornerY + height);
    ctx.lineTo(upperLeftCornerX + width, upperLeftCornerY);
    ctx.stroke();
}

function drawBar(ctx, upperLeftCornerX, upperLeftCornerY, width, height, arrow_height,color, image, score, yearScore){
    height = Math.round(height - arrow_height);
    ctx.save();
    ctx.fillStyle=color;
    ctx.fillRect(upperLeftCornerX,upperLeftCornerY,width,height);
    ctx.beginPath();
    ctx.moveTo(upperLeftCornerX, upperLeftCornerY + height);
    ctx.lineTo(upperLeftCornerX + width, upperLeftCornerY + height);
    ctx.lineTo(upperLeftCornerX + width / 2, upperLeftCornerY + height + arrow_height);
    ctx.fill();
    ctx.drawImage(image, upperLeftCornerX, upperLeftCornerY + height - width, width, width);
    drawText(ctx, upperLeftCornerX + width/2, upperLeftCornerY + height - Math.round(width * 5/6), width * 20/100, "white", score);
    drawRifter(ctx, upperLeftCornerX + width * 9/140, upperLeftCornerY + height - width * 9/140, width - width * 9/140 * 2,  arrow_height - width * 6/140, "white");
    drawStar(ctx, upperLeftCornerX + width/2, upperLeftCornerY + height + arrow_height/4,5, arrow_height/4, arrow_height/8, color);
    drawText(ctx, upperLeftCornerX + width/6, upperLeftCornerY + height + arrow_height/8, width * 11/100, color, yearScore);
    drawText(ctx, upperLeftCornerX + width*5/6, upperLeftCornerY + height + arrow_height/8, width * 11/100, color, yearScore);
    ctx.restore();
}

function drawChart(chart) {
    // if not 100% done, request another frame
    if (chart.percent++ < 50) {
        requestAnimationFrame(function() {drawChart(chart);});
    }
    chart.ctx.clearRect(0, 0, chart.canvas.width, chart.canvas.height);
    var maxValue = 0;
    for (var categ in chart.options.data){
        maxValue = Math.max(maxValue,chart.options.data[categ]);
    }
    var canvasActualHeight = chart.canvas.height;
    var canvasActualWidth = chart.canvas.width - chart.options.outer_padding * 2;
    //drawing the bars
    var barIndex = 0;
    var numberOfBars = Object.keys(chart.options.data).length;
    var barSize = (canvasActualWidth)/numberOfBars - chart.options.inner_padding;

    for (categ in chart.options.data){
        var val = chart.options.data[categ];
        var barHeight = Math.round(0.90 * canvasActualHeight * val/maxValue);
        var arrow_height = Math.round(barSize * chart.options.arrow_height/100);
        let background = chart.background[barIndex%chart.background.length];
        ctx.drawImage(background, 0, 0, background.naturalWidth/numberOfBars, background.naturalHeight, barIndex * (canvasActualWidth)/numberOfBars, 0, (canvasActualWidth)/numberOfBars, canvasActualHeight);
        drawBar(
            chart.ctx,
            chart.options.outer_padding + barIndex * (barSize + chart.options.inner_padding),
            0,
            barSize,
            barHeight * chart.percent/50,
            arrow_height,
            chart.colors[barIndex%chart.colors.length],
            chart.images[barIndex%chart.images.length],
            Math.round(val * chart.percent/51),
            chart.yearScore[barIndex%chart.yearScore.length]
        );

        barIndex++;
    }
}