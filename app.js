
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/callback', routes.callback);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

/*//Visualise Comments
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
                }*/