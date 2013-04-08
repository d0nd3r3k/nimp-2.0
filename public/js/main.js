$(document).ready(function(){
    
    SC.initialize({
        client_id: "988ae8ccee6597e1d4e45ac225d80ea2",
        redirect_uri: "http://localhost:3000/callback"
    });
    
    /*SC.stream("/tracks/293", function(sound){
       // sound.play();
    });*/
    
    $("#connect").on('click',function(e){
        e.preventDefault();
        SC.connect(function(){
            SC.get("/me", function(me){
                $("#username").text(me.username);
                $("#avatar img").attr("src",me.avatar_url);
                console.log(me);
                $("#connect").fadeOut(200);
                $('.logged-in').delay(200).fadeIn(300);
                SC.get("/me/followings", function(followings){
                    //console.log(followings[0].id);
                    var tracks_number = 0;
                    for(var i = 0; i < followings.length; i++){
                        SC.get("/users/" + followings[i].id + "/tracks", function(tracks){
                            console.log(tracks);
                        });
                    }
                })
            });
        });
    });

});