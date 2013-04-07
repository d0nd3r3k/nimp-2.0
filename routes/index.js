
/*
 * GET home page.
 */

exports.index = function(req, res){
  
  res.render('index', { title: 'N!MP' });
};

/*
 * GET SoundCloud Callback.
 */

exports.callback = function(req, res){
  res.render('callback', { title: 'Connect with SoundCloud' });
};