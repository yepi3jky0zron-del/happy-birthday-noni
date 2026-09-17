# Jeniffer Birthday Wish Website

A beginner-friendly website with two pages:

- `index.html` is the first page. It shows glossy floating wish bubbles and
  multiple layers of moving clouds.
- `add-wish.html` contains the form for Name, Your Wish, and Your Ava.

The footer text is **MADE FOR ROLEPLAY PURPOSE | MADE WISHES FOR JENIFFER**.
The second part is a button that opens the form page.

This project uses plain HTML, CSS, and JavaScript. You do not need npm, React,
or a build command.

## 1. Folder structure

    Jeniffer-Birthday-Wish-Website/
    ├── index.html
    ├── add-wish.html
    ├── START-HERE.txt
    ├── README.md
    ├── SETUP-SUPABASE.md
    ├── UPLOAD-TO-GITHUB.md
    ├── assets/
    │   ├── cloud.svg
    │   └── favicon.svg
    ├── css/
    │   └── style.css
    ├── js/
    │   ├── add-wish.js
    │   ├── config.js
    │   ├── home.js
    │   └── shared.js
    └── supabase/
        └── setup.sql

## 2. Open it in VS Code

1. Download and extract `Jeniffer-Birthday-Wish-Website.zip`.
2. Open Visual Studio Code.
3. Click **File > Open Folder**.
4. Choose the extracted `Jeniffer-Birthday-Wish-Website` folder.
5. Install the **Live Server** extension by Ritwick Dey.
6. Open `index.html`.
7. Right-click inside the file and choose **Open with Live Server**.

The website usually opens at `http://127.0.0.1:5500/`.

## 3. How the website flows

1. A visitor opens `index.html` and sees the wishes immediately.
2. Wish bubbles gently float above the cloud layer.
3. The cloud layers continuously move to the right.
4. Clicking a bubble expands that bubble to show its complete message.
5. Clicking **MADE WISHES FOR JENIFFER** opens `add-wish.html`.
6. After the visitor submits the form, the website returns to `index.html`.
7. The newest wish appears as the first bubble and selected card.

## 4. Local Mode and Supabase Mode

The default in `js/config.js` is:

    mode: "local"

Local Mode works immediately, but each browser has its own wishes. Clearing
browser data removes them. This mode is useful for checking the design.

To make everyone see the same wishes, follow `SETUP-SUPABASE.md`. Supabase
stores the shared messages and uploaded avatars.

## 5. Edit visible text

- Open `index.html` to edit JENIFFER, the small heading, and footer text.
- Open `add-wish.html` to edit the form heading, labels, notes, and button.
- Keep IDs such as `wish-form`, `floating-wishes`, and `wish-detail` unchanged
  because JavaScript uses them.

## 6. Change colors or movement

Open `css/style.css`. The main colors are at the top inside `:root`.

The cloud speeds are set with `--cloud-speed` on `.cloud-track-one` through
`.cloud-track-four`. A larger number means slower movement.

The floating bubble animation is named `bubbleFloat`. The cloud animation is
named `cloudMoveRight`.

## 7. Avatar behavior

The form accepts browser-supported images up to 5 MB. The JavaScript:

1. Opens the selected image.
2. Takes a centered square crop.
3. Resizes it to 640 × 640 pixels.
4. Compresses it as JPG.
5. Shows a square preview.
6. Saves or uploads the square result.

The original photo on the visitor's device is not changed.

## 8. Important JavaScript files

- `js/config.js` changes Local Mode or Supabase Mode.
- `js/shared.js` loads and saves wishes and crops avatars.
- `js/home.js` creates and expands the floating bubbles.
- `js/add-wish.js` validates and submits the form.

Beginners normally do not need to edit these files.

## 9. Publish with GitHub Pages

Follow `UPLOAD-TO-GITHUB.md`. GitHub Pages hosts the website, while Supabase is
needed if you want a single shared wall for visitors on different devices.

## 10. Troubleshooting

### The page has no styling

Check that `css/style.css` exists and both HTML files contain the stylesheet
link.

### The footer button does not open the form

Check that `add-wish.html` is in the same folder as `index.html`.

### The form button does nothing

Press F12, open **Console**, and look for a red error. Check that
`js/config.js`, `js/shared.js`, and `js/add-wish.js` exist.

### Other visitors cannot see a wish

The project is probably still in Local Mode. Complete `SETUP-SUPABASE.md` and
change the mode to `supabase`.

### GitHub Pages shows 404

Make sure Pages uses the `main` branch and the root folder, then wait a few
minutes and refresh.

## 11. Safety

- Only use the Supabase publishable key in `js/config.js`.
- Never paste a secret or `service_role` key into this website.
- A public form can receive spam. Add moderation or CAPTCHA if it becomes busy.
- Do not collect private information through the form.
