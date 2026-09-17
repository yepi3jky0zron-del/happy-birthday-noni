/* Shared data helpers for the wish wall and the add-wish page. */
(function () {
  "use strict";

  var config = window.JENIFFER_CONFIG || {};
  var storageKey = "jenifferBirthdayWishes";

  function getSupabaseKey() {
    return config.supabasePublishableKey || config.supabaseAnonKey || "";
  }

  // Empty by design: only real wishes from Supabase appear on the wall.
  var starterWishes = [];

  function isSupabaseMode() {
    var publicKey = getSupabaseKey();
    return config.mode === "supabase" &&
      typeof config.supabaseUrl === "string" && config.supabaseUrl.indexOf("https://") === 0 &&
      typeof publicKey === "string" && publicKey.length > 20;
  }

  function supabaseHeaders(extraHeaders) {
    var publicKey = getSupabaseKey();
    var headers = { apikey: publicKey };

    // Legacy anon keys are JWTs. New publishable keys only need apikey.
    if (publicKey.indexOf("eyJ") === 0) {
      headers.Authorization = "Bearer " + publicKey;
    }

    return Object.assign(headers, extraHeaders || {});
  }

  function loadLocalWishes() {
    try {
      var saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch (error) {
      console.warn("Could not read saved wishes:", error);
      return [];
    }
  }

  async function loadSupabaseWishes() {
    var url = config.supabaseUrl + "/rest/v1/" + config.tableName +
      "?select=id,name,wish,avatar_url,created_at&order=created_at.desc";
    var response = await fetch(url, { headers: supabaseHeaders() });
    if (!response.ok) throw new Error("Could not load the online wishes.");
    return response.json();
  }

  async function loadWishes() {
    return isSupabaseMode() ? loadSupabaseWishes() : loadLocalWishes();
  }

  function blobToDataUrl(blob) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () { resolve(reader.result); };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async function uploadAvatarToSupabase(blob) {
    var fileName = "avatar-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10) + ".jpg";
    var uploadUrl = config.supabaseUrl + "/storage/v1/object/" + config.bucketName + "/" + fileName;
    var response = await fetch(uploadUrl, {
      method: "POST",
      headers: supabaseHeaders({ "Content-Type": "image/jpeg", "x-upsert": "false" }),
      body: blob
    });
    if (!response.ok) throw new Error("The avatar could not be uploaded.");
    return config.supabaseUrl + "/storage/v1/object/public/" + config.bucketName + "/" + fileName;
  }

  async function saveSupabaseWish(name, wish, avatarUrl) {
    var response = await fetch(config.supabaseUrl + "/rest/v1/" + config.tableName, {
      method: "POST",
      headers: supabaseHeaders({ "Content-Type": "application/json", Prefer: "return=representation" }),
      body: JSON.stringify({ name: name, wish: wish, avatar_url: avatarUrl })
    });
    if (!response.ok) throw new Error("The wish could not be saved.");
    var saved = await response.json();
    return saved[0];
  }

  async function saveWish(name, wish, avatarBlob) {
    if (isSupabaseMode()) {
      var avatarUrl = await uploadAvatarToSupabase(avatarBlob);
      return saveSupabaseWish(name, wish, avatarUrl);
    }

    var avatarDataUrl = await blobToDataUrl(avatarBlob);
    var wishes = loadLocalWishes();
    var newWish = {
      id: "local-" + Date.now(),
      name: name,
      wish: wish,
      avatar_url: avatarDataUrl,
      created_at: new Date().toISOString()
    };
    wishes.unshift(newWish);
    try {
      localStorage.setItem(storageKey, JSON.stringify(wishes.slice(0, 12)));
    } catch (error) {
      throw new Error("Browser storage is full. Connect Supabase for a shared online wall.");
    }
    return newWish;
  }

  function cropImageToSquare(file) {
    return new Promise(function (resolve, reject) {
      var image = new Image();
      var temporaryUrl = URL.createObjectURL(file);
      image.onload = function () {
        var size = Math.min(image.naturalWidth, image.naturalHeight);
        var sourceX = (image.naturalWidth - size) / 2;
        var sourceY = (image.naturalHeight - size) / 2;
        var canvas = document.createElement("canvas");
        canvas.width = 640;
        canvas.height = 640;
        var context = canvas.getContext("2d");
        context.drawImage(image, sourceX, sourceY, size, size, 0, 0, 640, 640);
        canvas.toBlob(function (blob) {
          URL.revokeObjectURL(temporaryUrl);
          if (!blob) return reject(new Error("The photo could not be processed."));
          resolve(blob);
        }, "image/jpeg", 0.84);
      };
      image.onerror = function () {
        URL.revokeObjectURL(temporaryUrl);
        reject(new Error("The selected photo could not be opened."));
      };
      image.src = temporaryUrl;
    });
  }

  function getInitials(name) {
    return String(name || "J").trim().split(/\s+/).map(function (part) {
      return part.charAt(0);
    }).join("").slice(0, 2).toUpperCase();
  }

  function formatDate(value) {
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Today";
    return new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric" }).format(date);
  }

  window.WishAPI = {
    starterWishes: starterWishes,
    isSupabaseMode: isSupabaseMode,
    loadWishes: loadWishes,
    saveWish: saveWish,
    cropImageToSquare: cropImageToSquare,
    getInitials: getInitials,
    formatDate: formatDate
  };
})();
