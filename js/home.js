/* Floating wish bubbles on index.html. */
(function () {
  "use strict";

  var api = window.WishAPI;
  var bubbleContainer = document.getElementById("floating-wishes");
  var loadingMessage = document.getElementById("loading-message");

  function avatarMarkup(item) {
    if (item.avatar_url) {
      var image = document.createElement("img");
      image.src = item.avatar_url;
      image.alt = item.name + " avatar";
      return image;
    }
    var initials = document.createElement("span");
    initials.textContent = api.getInitials(item.name);
    return initials;
  }

  function render(wishes) {
    loadingMessage.classList.add("is-hidden");
    var visible = wishes.length ? wishes : api.starterWishes;
    bubbleContainer.innerHTML = "";

    if (!visible.length) {
      loadingMessage.textContent = "The sky is waiting for its first wish ♡";
      loadingMessage.classList.remove("is-hidden");
      return;
    }

    visible.forEach(function (item, index) {
      var button = document.createElement("button");
      var avatar = document.createElement("span");
      var copy = document.createElement("span");
      var label = document.createElement("small");
      var text = document.createElement("strong");

      button.type = "button";
      button.className = "wish-bubble bubble-position-" + ((index % 11) + 1) + (Math.random() < 0.5 ? " bubble-pink" : " bubble-yellow");
      button.style.setProperty("--bubble-delay", String(index * -0.7) + "s");
      button.setAttribute("aria-label", "Open the complete wish from " + item.name);
      button.title = item.wish;
      avatar.className = "bubble-avatar";
      avatar.appendChild(avatarMarkup(item));
      copy.className = "bubble-copy";
      label.textContent = "MESSAGE FROM " + item.name;
      text.textContent = item.wish;
      copy.appendChild(label);
      copy.appendChild(text);
      button.appendChild(avatar);
      button.appendChild(copy);
      button.addEventListener("click", function () {
        var wasExpanded = button.classList.contains("is-expanded");
        bubbleContainer.querySelectorAll(".wish-bubble.is-expanded").forEach(function (bubble) {
          bubble.classList.remove("is-expanded");
        });
        if (!wasExpanded) button.classList.add("is-expanded");
      });
      bubbleContainer.appendChild(button);
    });
  }

  async function start() {
    try {
      render(await api.loadWishes());
    } catch (error) {
      console.error(error);
      render([]);
    }
  }

  start();
})();
