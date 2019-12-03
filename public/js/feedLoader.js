let Parser = require('rss-parser');
let parser = new Parser();

module.exports = {
  loadUser: function loadUser(){
    return firebase.auth().currentUser;
  },

  loadUserQueue: function loadUserQueue(user,db){
    let feedquerry = db.collection('userFeeds').doc(user.uid);
    return feedquerry.get().then(doc =>{
      if (!doc.exists) {
        console.log('No matching documents.');
        return;
      }else{
        //Load Heuerstic Function
        //Load Sources
        let sources = doc.data().sources;
        //Create server side priority queue
        //Loop over sources
        let queue = [];
        sources.forEach(source => {
          addSource(queue,source,db);
        });
        console.log("Returning Feed");
        return queue;
      }}).catch(err => {
            console.log('Error getting documents', err);
      });
    }

};

function addSource(queue, source, db){
  let type = source.type;
  if(type==="rss-public"){
    //Load first 5 articles
    return db.collection('publicFeeds').doc(source.publicID).get()
    .then(doc =>{
      if(!doc.exists){
        console.log("No Matching documents!");
        return;
      }
      else{
        parser.parseURL(doc.data().url, function(err,feed){
          for(let i=0;i<5;i++){
            let current_item = feed.items[i];
            queue.push({"title":current_item.title, "URL": current_item.link});
          }
        });
      }
    });
  }
  else if(type === "rss-custom"){
    //Load first 5 articles
    return parser.parseURL(source.url, function(err,feed){
      for(let i=0;i<5;i++){
        let current_item = feed.items[i];
        queue.push({"title":current_item.title, "URL": current_item.link});
      }
    });
}
}
