function get_data() {
  return;
}

function buildBoxElement(config){
  //Elements in a box
  content = document.createElement("div");
  contentheader = document.createElement("h4");
  link = document.createElement("a");
  thumbnail_img = document.createElement("img");
  content.append(div);
  content.append(a);
  content.append(h4);
  content.append(img);
  a.innerHTML = config2.name;
  div.setAttribute("class", "box");
  a.setAttribute("href", config.info);
  img.setAttribute("src", config.pic);
  return content
};
  //append dynamic content
function appendBoxElement(content){
  body = document.getElementById("feed");
  body.append(content);
};
data = get_data();
data.forEach(function(config){
  content=buildBoxElement(config);
  appendBoxElement(content);
});
