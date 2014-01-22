/*
 * main.js - SDK add-ons
 * iNetFilter - mozilla add-ons for blocking nude content
 * 
 * Author: Bambang S. | Nur Shalahuddin | Rischan Mafrur
 * Version: 0.1  (January 2013)
 * 
 */

$(document).ready(function(){
  
  // generate image id automaticly 
  $("img").attr("id", function(arr){
    return "testImage" + (arr+1);
  });
  var gambar = []; 
  var i = 0;
  var j = 1;
  while (j <= $("img").length){
   	gambar.push("testImage"+ j++);
  }
  
  // pausing function for a while
  setInterval(function(){
    if (i<= $("img").length-1){
      deteksiGambar(gambar[i++]);
    }

    else{
      clearInterval();
    }
  },300)

});

// analize and then swap detected nude image with another image 
function deteksiGambar(file){
        nude.load(file);
        nude.scan(function(result){
                if (result){
                        console.log(file+" terdeteksi nude");
                        $("#"+file).attr('src','http://3.bp.blogspot.com/-FV-EDYwmvyU/UTWfJ1YpL5I/AAAAAAAAAJ4/CNh9wOHfo7w/s1600/noporddn.png');
                }else{
                    console.log(file+" bukan nude");
                }
        });
       
};