/* Form handling for add-wish.html. */
(function () {
  "use strict";

  var api = window.WishAPI;
  var maxFileSize = 5 * 1024 * 1024;
  var form = document.getElementById("wish-form");
  var nameInput = document.getElementById("name");
  var wishInput = document.getElementById("wish");
  var counter = document.getElementById("wish-counter");
  var avatarInput = document.getElementById("avatar");
  var avatarUpload = document.getElementById("avatar-upload");
  var previewRow = document.getElementById("avatar-preview-row");
  var previewImage = document.getElementById("avatar-preview");
  var removeAvatarButton = document.getElementById("remove-avatar");
  var sendButton = document.getElementById("send-button");
  var statusText = document.getElementById("form-status");
  var squareAvatarBlob = null;
  var previewUrl = "";

  function showStatus(message, type) {
    statusText.textContent = message;
    statusText.className = "form-status " + (type || "");
  }

  function setLoading(isLoading) {
    sendButton.disabled = isLoading;
    sendButton.querySelector("span").textContent = isLoading ? "Sending your love..." : "Send to Jeniffer";
  }

  function clearPreview() {
    squareAvatarBlob = null;
    avatarInput.value = "";
    previewImage.src = "";
    previewRow.classList.add("is-hidden");
    avatarUpload.classList.remove("is-hidden");
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = "";
  }

  async function handleAvatarChange() {
    var file = avatarInput.files && avatarInput.files[0];
    if (!file) return;
    showStatus("", "");
    if (!file.type.startsWith("image/")) {
      showStatus("Please choose an image file.", "error");
      clearPreview();
      return;
    }
    if (file.size > maxFileSize) {
      showStatus("Your photo must be smaller than 5 MB.", "error");
      clearPreview();
      return;
    }
    try {
      squareAvatarBlob = await api.cropImageToSquare(file);
      previewUrl = URL.createObjectURL(squareAvatarBlob);
      previewImage.src = previewUrl;
      previewRow.classList.remove("is-hidden");
      avatarUpload.classList.add("is-hidden");
    } catch (error) {
      showStatus(error.message, "error");
      clearPreview();
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    var name = nameInput.value.trim();
    var wish = wishInput.value.trim();
    showStatus("", "");
    if (!name || !wish) return showStatus("Please fill in your name and wish.", "error");
    if (!squareAvatarBlob) return showStatus("Please add your ava first.", "error");

    setLoading(true);
    try {
      await api.saveWish(name, wish, squareAvatarBlob);
      window.location.href = "index.html?sent=1";
    } catch (error) {
      console.error(error);
      showStatus(error.message || "Something went wrong. Please try again.", "error");
      setLoading(false);
    }
  }

  wishInput.addEventListener("input", function () { counter.textContent = wishInput.value.length + "/500"; });
  avatarInput.addEventListener("change", handleAvatarChange);
  removeAvatarButton.addEventListener("click", clearPreview);
  form.addEventListener("submit", handleSubmit);
})();
