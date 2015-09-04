// засунуть все в self invoked function

(function() {
  // Create tree vars
  var container = document.getElementById('menuContainer');
  var content;
  var aLink;
  var aDiv;

  // Go trough JSON to find uplevel elements, then construct tree.
  for (var i = 0; i < menuData.data.length; i++) {
    if (menuData.data[i].itemParentId === 0) {
      aLink = document.createElement('a');
      aDiv = document.createElement('div');
      content = document.createTextNode(menuData.data[i].itemName);
      aLink.appendChild(content);
      aLink.setAttribute('href', '#');
      aLink.setAttribute('data-id', menuData.data[i].itemId);
      aLink.setAttribute('class', 'closed');
      aDiv.appendChild(aLink);
      container.appendChild(aDiv);
    }
  }

  //set click listener for menu (bubbling)
  container.addEventListener('click', function(event){
    if (event.target.tagName.toUpperCase() === 'A') {
      changeState.call(event.target);
    }
  });

  function changeState() {
    // add new class and go trough JSON to find elements in selected node
    var parentId = this.getAttribute('data-id');
    if (this.className === 'closed') {
      this.className = "";
      this.setAttribute('class', 'open');
      var parentLeftMargin = this.style.marginLeft.slice(0, -2);
      for (var i = menuData.data.length - 1; i > parentId - 1; i--) {
        if (menuData.data[i].itemParentId == parentId) {
          aLink = document.createElement('a');
          aDiv = document.createElement('div');
          content = document.createTextNode(menuData.data[i].itemName);
          aLink.appendChild(content);
          aLink.setAttribute('href', '#');
          aLink.setAttribute('data-id', menuData.data[i].itemId);
          aLink.setAttribute('data-parentid', menuData.data[i].itemParentId);
          aLink.setAttribute('class', 'closed');
          aLink.style.marginLeft = +parentLeftMargin + 10 + 'px';
          aDiv.appendChild(aLink);
          this.parentNode.parentNode.insertBefore(aDiv, this.parentNode.nextSibling);
        }
      }
    } else {
      this.className = "";
      this.setAttribute('class', 'closed');
      var nextElement = this.parentNode.nextSibling;
      var dataParentId = nextElement ? nextElement.firstChild.getAttribute('data-parentid') : null;
      while (nextElement && dataParentId == parentId) {
        if (nextElement.firstChild.getAttribute('class') === 'open') {
          changeState.call(nextElement.firstChild);
        }
        nextElement.remove();
        nextElement = this.parentNode.nextSibling;
        dataParentId = nextElement ? nextElement.firstChild.getAttribute('data-parentid') : null;
      }
    }
  }
})();
