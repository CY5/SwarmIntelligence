
function random(min,max)
{
    return (Math.round(Math.random()*10)/10)*(max-min+1)+min;
}

function rand_color_rgb() 
{
    var r = Math.floor(Math.random()*256);
    var g = Math.floor(Math.random()*256);
    var b = Math.floor(Math.random()*256);
    return [r, g, b]
}

function rand_color_hsl(){
	return  (Math.random()*0xFFFFFF<<0).toString(16);
}

