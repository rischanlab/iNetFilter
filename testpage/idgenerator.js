/*
$(document).ready(function(){
	
	$("img").attr("id", function(arr){
		return "testImage" + (arr+1);
	});

	var gambar = []; //var for all loaded image		
	var gbr = ['testImage1','testImage2','testImage3','testImage4','testImage5'];
	for (var i=0; i<= gbr.length-1; i++)
	{
		deteksiGambar(gbr[i]);
		gambar.push(gbr[i]);
		console.log(gambar);
		alert('a');
	}
});

function deteksiGambar(file){
	nude.load(file);
	nude.scan(function(result){
		if (result){
			console.log(file);
			$("#"+file).attr('src','images/garena.png');
		}
	});
}; 
*/

$(document).ready(function(){
  $("img").attr("id", function(arr){
    return "testImage" + (arr+1);
  });
 
  var gambar = []; //var for all loaded image            
  var i = 0;
  var j = 1;
  while (j <= $("img").length){
   	gambar.push("testImage"+ j++);
  }
       // $(document).everyTime(1000,'load_comment',function(){
    setInterval(function(){
	var coba =$("img").length;
	if (i<=coba){
      deteksiGambar(gambar[i++]);
      console.log(gambar[i]);
	}else {
		clearInterval();
		//alert("wsi");
		
	}
      //scanned_images.push(gambar[i-1]);
  	},500)

       	//	if (! deteksiGambar()){
       	//		stopTime('load_comment');
       	//	}
        //});
//        for (var i=0; i<= gbr.length-1; i++)
//        {
//                deteksiGambar(gbr[i]);
//                gambar.push(gbr[i]);
//                console.log(gambar);
////                alert('a');
//        }
});

function javascript_abort()
{
   throw new Error('This is not an error. This is just to abort javascript');
}

function deteksiGambar(file){
        nude.load(file);
        nude.scan(function(result){
                if (result){
                        console.log(file+" porn");
                        $("#"+file).attr('src','allah.jpeg');
                }else{
                    console.log(file+" tidak ketemu");
                }
        });
       
};