 SC.initialize({
    client_id: "YOUR_CLIENT_ID",
    redirect_uri: "http://example.com/callback.html",
  });
  SC.get("/groups/55517/tracks", {limit: 1}, function(tracks){
  alert("Latest track: " + tracks[0].title);
});