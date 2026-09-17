/*
  BIRTHDAY WISH WALL LOGIC
  ========================
  You normally do not need to edit this file.
  Website settings live in js/config.js.
*/

(function () {
  "use strict";

  const config = window.JENIFFER_CONFIG || {};
  const storageKey = "jenifferBirthdayWishes";
  const maxFileSize = 5 * 1024 * 1024;

  const form = document.getElementById("wish-form");
  const nameInput = document.getElementById("name");
  const wishInput = document.getElementById("wish");
  const counter = document.getElementById("wish-counter");
  const avatarInput = document.getElementById("avatar");
  const avatarUpload = document.getElementById("avatar-upload");
  const previewRow = document.getElementById("avatar-preview-row");
  const previewImage = document.getElementById("avatar-preview");
  const removeAvatarButton = document.getElementById("remove-avatar");
  const sendButton = document.getElementById("send-button");
  const statusText = document.getElementById("form-status");
  const wishGrid = document.getElementById("wish-grid");
  const wishCount = document.getElementById("wish-count");
  const loadingMessage = document.getElementById("loading-message");
  const emptyMessage = document.getElementById("empty-message");

  let squareAvatarBlob = null;
  let previewUrl = "";

  const starterWishes = [
    {
      id: "starter-1",
      name: "J-Team",
      wish: "Happy birthday, Jeniffer! May this year bring you louder stages, softer days, and all the love you give back to us.",
      avatar_url: "",
      created_at: new Date().toISOString()
    },
    {
      id: "starter-2",
      name: "Jeadore",
      wish: "Keep shining, keep creating, and keep being our favorite reason to celebrate. We love you, Jeniffer!",
      avatar_url: "",
      created_at: new Date().toISOString()
    }
  ];

  function isSupabaseMode() {
    return (
      config.mode === "supabase" &&
      typeof config.supabaseUrl === "string" &&
      config.supabaseUrl.startsWith("https://") &&
      typeof config.supabaseAnonKey === "string" &&
      config.supabaseAnonKey.length > 20
    );
  }

  function supabaseHeaders(extraHeaders) {
    return Object.assign(
      {
        apikey: config.supabaseAnonKey,
        Authorization: "Bearer " + config.supabaseAnonKey
      },
      extraHeaders || {}
    );
  }

  function showStatus(message, type) {
    statusText.textContent = message;
    statusText.className = "form-status " + (type || "");
  }

  function setLoading(isLoading) {
    sendButton.disabled = isLoading;
    sendButton.querySelector("span").textContent = isLoading
      ? "Sending your love..."
      : "Send to Jeniffer";
  }

  function getInitials(name) {
    return name
      .trim()
      .split(/\s+/)
      .map(function (part) {
        return part.charAt(0);
      })
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Today";
    return new Intl.DateTimeFormat("en", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(date);
  }

  function escapeHtml(value) {
    const element = document.createElement("div");
    element.textContent = String(value);
    return element.innerHTML;
  }

  function renderWishes(wishes) {
    wishGrid.innerHTML = "";
    loadingMessage.classList.add("is-hidden");

    const visibleWishes = wishes.length ? wishes : starterWishes;
    emptyMessage.classList.add("is-hidden");

    visibleWishes.forEach(function (item) {
      const card = document.createElement("article");
      card.className = "wish-card";

      const avatarMarkup = item.avatar_url
        ? '<img src="' + escapeHtml(item.avatar_url) + '" alt="' + escapeHtml(item.name) + '\'s avatar">'
        : "<span>" + escapeHtml(getInitials(item.name)) + "</span>";

      card.innerHTML =
        '<div class="card-meta">' +
          '<div class="card-person">' +
            '<div class="card-avatar">' + avatarMarkup + "</div>" +
            '<div class="card-person-info">' +
              "<strong>" + escapeHtml(item.name) + "</strong>" +
              '<time datetime="' + escapeHtml(item.created_at) + '">' + formatDate(item.created_at) + "</time>" +
            "</div>" +
          "</div>" +
          '<span aria-hidden="true">♥</span>' +
        "</div>" +
        "<p>" + escapeHtml(item.wish) + "</p>";

      wishGrid.appendChild(card);
    });

    const visibleCount = visibleWishes.length;
    wishCount.textContent =
      visibleCount + (visibleCount === 1 ? " wish" : " wishes");
  }

  function loadLocalWishes() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch (error) {
      console.warn("Could not read saved wishes:", error);
      return [];
    }
  }

  function saveLocalWishes(wishes) {
    localStorage.setItem(storageKey, JSON.stringify(wishes));
  }

  async function loadSupabaseWishes() {
    const url =
      config.supabaseUrl +
      "/rest/v1/" +
      config.tableName +
      "?select=id,name,wish,avatar_url,created_at&order=created_at.desc";

    const response = await fetch(url, {
      headers: supabaseHeaders()
    });

    if (!response.ok) {
      throw new Error("Could not load the online wishes.");
    }

    return response.json();
  }

  async function loadWishes() {
    loadingMessage.classList.remove("is-hidden");
    try {
      const wishes = isSupabaseMode()
        ? await loadSupabaseWishes()
        : loadLocalWishes();
      renderWishes(wishes);
    } catch (error) {
      console.error(error);
      renderWishes([]);
      showStatus("The wish wall could not be loaded. Please check the setup guide.", "error");
    }
  }

  function clearPreview() {
    squareAvatarBlob = null;
    avatarInput.value = "";
    previewImage.src = "";
    previewRow.classList.add("is-hidden");
    avatarUpload.classList.remove("is-hidden");

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      previewUrl = "";
    }
  }

  function cropImageToSquare(file) {
    return new Promise(function (resolve, reject) {
      const image = new Image();
      const temporaryUrl = URL.createObjectURL(file);

      image.onload = function () {
        const size = Math.min(image.naturalWidth, image.naturalHeight);
        const sourceX = (image.naturalWidth - size) / 2;
        const sourceY = (image.naturalHeight - size) / 2;
        const canvas = document.createElement("canvas");

        canvas.width = 640;
        canvas.height = 640;

        const context = canvas.getContext("2d");
        context.drawImage(
          image,
          sourceX,
          sourceY,
          size,
          size,
          0,
          0,
          canvas.width,
          canvas.height
        );

        canvas.toBlob(
          function (blob) {
            URL.revokeObjectURL(temporaryUrl);
            if (!blob) {
              reject(new Error("The photo could not be processed."));
              return;
            }
            resolve(blob);
          },
          "image/jpeg",
          0.86
        );
      };

      image.onerror = function () {
        URL.revokeObjectURL(temporaryUrl);
        reject(new Error("The selected photo could not be opened."));
      };

      image.src = temporaryUrl;
    });
  }

  async function handleAvatarChange() {
    const file = avatarInput.files && avatarInput.files[0];
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
      squareAvatarBlob = await cropImageToSquare(file);
      previewUrl = URL.createObjectURL(squareAvatarBlob);
      previewImage.src = previewUrl;
      previewRow.classList.remove("is-hidden");
      avatarUpload.classList.add("is-hidden");
    } catch (error) {
      showStatus(error.message, "error");
      clearPreview();
    }
  }

  function blobToDataUrl(blob) {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async function uploadAvatarToSupabase(blob) {
    const fileName =
      "avatar-" +
      Date.now() +
      "-" +
      Math.random().toString(36).slice(2, 10) +
      ".jpg";

    const uploadUrl =
      config.supabaseUrl +
      "/storage/v1/object/" +
      config.bucketName +
      "/" +
      fileName;

    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: supabaseHeaders({
        "Content-Type": "image/jpeg",
        "x-upsert": "false"
      }),
      body: blob
    });

    if (!response.ok) {
      throw new Error("The avatar could not be uploaded.");
    }

    return (
      config.supabaseUrl +
      "/storage/v1/object/public/" +
      config.bucketName +
      "/" +
      fileName
    );
  }

  async function saveSupabaseWish(name, wish, avatarUrl) {
    const url = config.supabaseUrl + "/rest/v1/" + config.tableName;
    const response = await fetch(url, {
      method: "POST",
      headers: supabaseHeaders({
        "Content-Type": "application/json",
        Prefer: "return=representation"
      }),
      body: JSON.stringify({
        name: name,
        wish: wish,
        avatar_url: avatarUrl
      })
    });

    if (!response.ok) {
      throw new Error("The wish could not be saved.");
    }

    const saved = await response.json();
    return saved[0];
  }

  async function handleSubmit(event) {
    event.preventDefault();
    showStatus("", "");

    const name = nameInput.value.trim();
    const wish = wishInput.value.trim();

    if (!name || !wish) {
      showStatus("Please fill in your name and wish.", "error");
      return;
    }

    if (!squareAvatarBlob) {
      showStatus("Please add your ava first.", "error");
      avatarInput.focus();
      return;
    }

    setLoading(true);

    try {
      if (isSupabaseMode()) {
        const avatarUrl = await uploadAvatarToSupabase(squareAvatarBlob);
        await saveSupabaseWish(name, wish, avatarUrl);
      } else {
        const avatarDataUrl = await blobToDataUrl(squareAvatarBlob);
        const wishes = loadLocalWishes();
        wishes.unshift({
          id: "local-" + Date.now(),
          name: name,
          wish: wish,
          avatar_url: avatarDataUrl,
          created_at: new Date().toISOString()
        });
        saveLocalWishes(wishes.slice(0, 50));
      }

      form.reset();
      counter.textContent = "0/500";
      clearPreview();
      showStatus("Your wish is now on Jeniffer’s wall!", "success");
      await loadWishes();
      document.getElementById("wish-wall").scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    } catch (error) {
      console.error(error);
      showStatus(error.message || "Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  wishInput.addEventListener("input", function () {
    counter.textContent = wishInput.value.length + "/500";
  });

  avatarInput.addEventListener("change", handleAvatarChange);
  removeAvatarButton.addEventListener("click", clearPreview);
  form.addEventListener("submit", handleSubmit);

  loadWishes();
})();
