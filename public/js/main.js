$(document).ready(function(){
    
    var online = false;
    
    if(!online){
        SC.initialize({
            client_id: "18057c47126031a99017661840257417",
            redirect_uri: "http://localhost:3000/callback"
        });
    }
    else if(online){
        SC.initialize({
            client_id: "988ae8ccee6597e1d4e45ac225d80ea2",
            redirect_uri: "http://preso.ly:3000/callback"
        });
    }
    
    $("#score").on('click',function(e){
        $(".tracks").each( function(){
            
            });
    });
  
    //Filter dropdown sort-nav
    $(".filter").on('click',function(e){
        if($(this).attr("id") == "tracks"){
            $("ul.sort-tracks").fadeIn("slow");
        }
        else{
            $("ul.sort-tracks").fadeOut("fast");
        }
        e.preventDefault();
        $(this).attr('id');
        $(".filter").removeClass('active');
        $(this).addClass('active');
        $(".s-block").hide();
        $("."+$(this).attr('id')).fadeIn(300);
    });
    
    //Trigger modal and listen to track with comments visuals
    $('.listen').on('click', '.tracks', function(){
        
        var track_id = $(this).data("id");
        var score = $(this).data("score");
        var artwork_url = $(this).find('img').attr('src');
        var title = $(this).find('.title').text();
        
        var downloadable = $(this).find('#download-url').data('d');
        var download_url = $(this).find('#download-url').data('url');
        
        
        $(".player").append("<div class='info-block'><div>");
        $(".info-block").append("<img src='" + artwork_url + "' />");
        $(".info-block").append("<h2>" + title + "</h2>");
        $(".info-block").append("<p> N!MP Score: " + score + "</p>");
        
        $(".info-block").append("<a href='"+download_url+"'><i class=' icon-arrow-down icon-white'><i/></a>")
        
        
        $(".l-comments").addClass('isLeft');
        
        SC.stream("/tracks/" + track_id, 
        //Visualise Comments
        {
            ontimedcomments: function(comments){
                
                //Middle Comments Area
                $(".m-comments").show();
                
                //Left Comments Area
                $(".l-comments").show();
                
                //Right Comments Area
                $(".r-comments").show();
                
                var comment = "<div class='comment'>" + comments[0].body + "</div>";
                
                //Insert Comment in appropriate Area
                if($(".l-comments").hasClass('isLeft') && $(comment).text().length < 32 ){
                    $(".l-comments").prepend($(comment).hide()
                        .fadeIn("fast")
                        .delay(5000)
                        .fadeOut('fast'));
                    $(".l-comments").removeClass('isLeft');
                    $(".r-comments").addClass('isRight');
                }
                else if($(".r-comments").hasClass('isRight') && $(comment).text().length < 32){
                    $(".r-comments").prepend($(comment).hide()
                        .fadeIn("fast")
                        .delay(5000)
                        .fadeOut('fast'));
                    $(".l-comments").addClass('isLeft');
                    $(".r-comments").removeClass('isRight');
                }
                else{    
                    $(".m-comments").html($(comment).hide()
                        .fadeIn("fast")
                        .delay(10000)
                        .fadeOut('fast'));
                }
            }
        },
        
        //Play Track
        function(sound){
            sound.play();
            
            //When Modal is hidden
            $('#player').on('hidden', function () {
                $("#player").modal('hide');
                $(".info-block").remove();
                $(".comment").remove();
                $(".comments").hide();
                sound.stop();
    
            });    
        });
        $('#player').modal('show');
        
        //When Model is close with the x button
        $(".close").on('click',function(){
            $("#player").modal('hide');
        });
    
    });
    
    //Trigger Modal with artist page
    $('.listen').on('click', '.artists', function(){
        
        });

    //Get Artists and Tracks upon Login    
    $("#connect").on('click',function(e){
        
        e.preventDefault();
        
        //Sound Cloud Connection
        SC.connect(function(){
            
            //GET user info
            SC.get("/me", function(me){
                
                $("#username").text(me.username);
                $("#avatar img").attr("src",me.avatar_url);
                $("#connect").fadeOut(200);
                $('.logged-in').delay(200).fadeIn(300);
                
                //GET User's Following
                SC.get("/me/followings", function(followings){
                    
                    var tracks_number = 0;    
                    
                    $(followings).each(function(i, following){
                        
                        if(following.avatar_url && following.track_count > 0){
                            
                            //Calculate Reputation Score
                            var reputation = following.public_favorites_count + following.followers_count*0.3;
                            
                            //Generate Artist Block
                            var block = "<div data-id='"+following.id+"' class='s-block artists'>\n\
                                                <img src='"+following.avatar_url+"'/>\n\
                                                <div class='text'>\n\
                                                    <h2 class='title'>"+following.username+"</h2>\n\
                                                    <p class='reputation'>Reputation Score: "+parseInt(reputation)+"</p>\n\
                                                    <p class='reputation'>"+following.track_count+" Track</p>\n\
                                                </div>\n\
                                            </div>";
                            $('.l-holder').append(block);
                        }
                        
                        //GET User's Tracks
                        SC.get("/users/" + following.id + "/tracks", function(tracks){
                            tracks_number += tracks.length;
                            $('.track').text(tracks_number + " tracks");
                            
                            $(tracks).each(function(i, track){
                                
                                //Calculate Buzz
                                var buzz = 0;
                                
                                if(track.commentable){
                                    buzz += track.comment_count*2;
                                }
                                if(track.downloadable){
                                    buzz += track.download_count*1.5;
                                }
                                buzz += track.playback_count*0.3;
                                buzz += track.favoritings_count*0.7;
                                
                                //Generate Track Block
                                if(track.artwork_url){
                                    //TODO: download_url - duration - genre - 
                                    var block = "<div data-id='"+track.id+"' data-score='"+parseInt(buzz)+"' class='s-block tracks' style='display:none;'>\n\
                                                <img src='"+track.artwork_url+"'/>\n\
                                                <div class='text'>\n\
                                                    <h2 class='title'>"+track.title+"</h2>\n\
                                                    <p>N!MP Score: "+ parseInt(buzz) +"</p>\n\
                                                </div>";
                                    
                                    block += "<div data-d='"+track.downloadable+"' data-url='"+track.download_url+"' id='download-url'></div>";
                                    
                                    block += "</div>";
                                    $('.l-holder').append(block);
                                }     
                            });
                            
                        });
                        
                    });
                    
                });
                
            });
          
        });
        
    });
    

});


    artwork_url: "https://i1.sndcdn.com/artworks-000044267934-a6a57m-large.jpg?ca77017"
    attachments_uri: "https://api.soundcloud.com/tracks/85648420/attachments"
    bpm: null
    comment_count: 10
    commentable: true
    created_at: "2013/03/30 18:59:58 +0000"
    description: "VIP Promo Mix for Geminate Productions/Bushwacked 2013"
    download_count: 17
    download_url: "https://api.soundcloud.com/tracks/85648420/download" //
    downloadable: true
    duration: 1246288 //
    embeddable_by: "all"
    favoritings_count: 20 //
    genre: "Ghetto Swing Biznass" //
    id: 85648420
    isrc: ""
    key_signature: ""
    kind: "track"
    label_id: null
    label_name: ""
    license: "all-rights-reserved"
    original_content_size: 30008872
    original_format: "mp3"
    permalink: "droppin-weight-vip-mini-mix"
    permalink_url: "http://soundcloud.com/2lucid/droppin-weight-vip-mini-mix"
    playback_count: 231
    purchase_title: null
    purchase_url: null
    release: ""
    release_day: null
    release_month: null
    release_year: null
    sharing: "public"
    state: "finished"
    stream_url: "https://api.soundcloud.com/tracks/85648420/stream"
    streamable: true
    tag_list: "glitchy glitch bass ghetto swing deep broken"
    title: "Droppin Weight - VIP Mini Mix for Geminate Productions"
    track_type: ""
    uri: "https://api.soundcloud.com/tracks/85648420"
    user: Object
    user_favorite: false
    user_id: 327013
    user_playback_count: 1
    video_url: null
    waveform_url: "https://w1.sndcdn.com/fLuRUB8twYld_m.png"