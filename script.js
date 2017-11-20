var myCanvas = document.getElementById("myCanvas");
myCanvas.width = 1200;
myCanvas.height = 600;
  
var ctx = myCanvas.getContext("2d");

var coalitions = {
    "Order": 1100,
    "Federation": 850,
    "Alliance": 670,
    "Assembly": 1020
};

var myBarchart = new Barchart(
{
        canvas:myCanvas,
        outer_padding: myCanvas.width/20,
        inner_padding: myCanvas.width/10,
        arrow_height:30, // between 25 -> 35: proportionnal to each bar height
        data:coalitions,
        colors:["#FF6849","#184D9B", "#27C57D","#A15DD4"],
        images:["images/the_order-emoji.png","images/the_federation-emoji.png", "images/the_alliance-emoji.png","images/the_assembly-emoji.png"],
        bckgrnd:["images/order_background.png","images/federation_background.png", "images/alliance_background.png","images/assembly_background.png"],
        year_score:[1, 10, 2, 2]
    }
);
myBarchart.draw();