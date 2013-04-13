$(document).ready(function(){
    
    var online = false;
    var client_id = "";
    
    function msToTime(s) {
        var ms = s % 1000;
        s = (s - ms) / 1000;
        var secs = s % 60;
        s = (s - secs) / 60;
        var mins = s % 60;
        var hrs = (s - mins) / 60;

        return hrs + ':' + mins + ':' + secs + '.' + ms;
    }
    
    if(!online){
        client_id = "18057c47126031a99017661840257417";
        SC.initialize({
            client_id: client_id,
            redirect_uri: "http://localhost:3000/callback"
        });
    }
    else if(online){
        client_id = "988ae8ccee6597e1d4e45ac225d80ea2";
        SC.initialize({
            client_id: client_id,
            redirect_uri: "http://preso.ly:3000/callback"
        });
    }
    
    //TODO:Filter By Score
    $("#score").on('click',function(e){
        $(".tracks").each( function(){});
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
        var track_duration = msToTime($(this).data("duration"));
        
        //Trigger Loader
        $(".loader-gif-right").fadeIn('fast');
        $(".loader-gif-left").fadeIn('fast');
        
        $(".player").append("<div class='info-block'><div>");
        $(".info-block").append("<img src='" + artwork_url + "' />");
        $(".info-block").append("<h2>" + title + "</h2>");
        $(".info-block").append("<p> N!MP Score: " + score + "</p>");
        
        
        $(".info-block").append("<a class='download-track' href='"+download_url+"?client_id="+client_id+"' target='_BLANK'>.mp3 <i class=' icon-arrow-down icon-white'><i/></a>")
        
        
        $(".l-comments").addClass('isLeft');
        SC.get("/tracks/" + track_id, function(track){
            $.getJSON("http://waveformjs.org/w?callback=?", {
                url: track.waveform_url
            }, function(d){
                var sound;
                var waveform = new Waveform({
                    container: document.getElementById("waveform"),
                    height: '50',
                    width: '400',
                    interpolate: false,
                    innerColor: function(x){
                        if(track && x < track.position / track.durationEstimate){
                            return "rgba(255,  102, 0, 0.8)";
                        }else if(track && x < track.bytesLoaded / track.bytesTotal){
                            return "rgba(0, 0, 0, 0.8)";
                        }else{
                            return "rgba(0, 0, 0, 0.4)";
                        }
                    },
                    data: d
                });
                //var streamOptions = waveform.optionsForSyncedStream();
                var artist_name = track.user.username;
                $(".artist-name").text(artist_name);
                SC.stream(track.uri, 
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
            
                    sound.play({
                        onfinish: function() {
                            $("#player").modal('hide');
                        },
                        whileloading: function(){

                            console.log('whileplaying(): '+msToTime(this.position)+' / '+ track_duration);    
                        },
                        onplay: function(){
                            $(".loader-gif-right").fadeOut('fast');
                            $(".loader-gif-left").fadeOut('fast');
                        }
                    });
                    
                    //Pause/ Play
                    $(".plpo").on('click',function(e){
                        console.log($(this).hasClass('play'));
                        console.log($(this).hasClass('pause'));
                        if($(this).hasClass('play')){
                            sound.pause();
                            $(this).removeClass('play');
                            $(this).addClass('pause');
                            $(this).find('span').text('play');
                        } else if($(this).hasClass('pause')){
                            sound.resume();
                            $(this).removeClass('pause');
                            $(this).addClass('play');
                            $(this).find('span').text('pause');
                        }
                    });
            
                    //When Modal is hidden
                    $('#player').on('hidden', function () {
                
                        //Reset Play/Pause 
                        $(".plpo").off('click');
                        $(".plpo").removeClass('pause');
                        $(".plpo").addClass('play');
                        $(".plpo").find('span').text('pause');
                
                        //Hide Modal and remove comments
                        $("#player").modal('hide');
                        $(".info-block").remove();
                        $(".comment").remove();
                        $(".comments").hide();
                        
                        //reset waveform
                        $("#waveform").html("");
                        $(".artist-name").html("");
                        sound.stop();
    
                    });    
                });
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
    $("#connect").one('click',function(e){
        
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
                            
                            var single_track = {};
                            
                            $('.track').text(tracks_number + " tracks");
                            
                            
                            $(tracks).each(function(j, track){
                                
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
                                buzz = parseInt(buzz);
                                
                                

                                
                                //Generate Track Block
                                if(track.artwork_url){
                                    single_track = {
                                        'id':j,
                                        'buzz_score':buzz,
                                        'artwork_url':track.artwork_url,
                                        'track_id':track.id,
                                        'track_title':track.title,
                                        'downloadable': track.downloadable,
                                        'download_url':track.download_url,
                                        'duration':track.duration,
                                        'genre':track.genre
                                    };
                                    //TODO: download_url - duration - genre
                                    var block = "<div data-duration='"+track.duration+"' data-id='"+track.id+"' data-score='"+parseInt(buzz)+"' class='s-block tracks' style='display:none;'>\n\
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

