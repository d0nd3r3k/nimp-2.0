$(document).ready(function(){
    
    SC.initialize({
        client_id: "988ae8ccee6597e1d4e45ac225d80ea2",
        redirect_uri: "http://localhost:3000/callback"
    });

    $("#connect").click(function(e){
        e.preventDefault();
        SC.connect(function(){
            SC.get("/me", function(me){
                $("#username").text(me.username);
                $('.logged-in').fadeIn(300);
                SC.get("/me/followings", function(followings){
                    //console.log(followings[0].id);
                    
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