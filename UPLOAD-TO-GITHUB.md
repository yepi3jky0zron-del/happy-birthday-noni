# Upload the Website to GitHub

Complete this after the website works correctly in VS Code.

## Option A — GitHub website upload (easiest)

### Create the repository

1. Open https://github.com/
2. Sign in.
3. Click the plus button in the top-right corner.
4. Select New repository.
5. Enter a repository name:

       jeniffer-birthday-wishes

6. Choose Public if you want free GitHub Pages.
7. Do not add a README because this project already has one.
8. Click Create repository.

### Upload the project files

1. On the empty repository page, click uploading an existing file.
2. Open the extracted Jeniffer-Birthday-Wish-Website folder on your computer.
3. Select all items inside the folder.
4. Drag the selected files and folders into GitHub.
5. Wait until all files finish uploading.
6. In the commit message box, write:

       Upload Jeniffer birthday website

7. Click Commit changes.

Important: Upload the contents of the project folder, not an extra outer folder.
index.html must appear on the repository's first page.

## Option B — Upload through VS Code Source Control

Use this if Git is already installed on your computer.

1. Open the project folder in VS Code.
2. Click Source Control on the left.
3. Click Initialize Repository.
4. Press Ctrl + Shift + P.
5. Search for Git: Add Remote.
6. Paste the repository URL from GitHub.
7. Name the remote origin.
8. Return to Source Control.
9. Click the plus icon next to Changes to stage all files.
10. Write a commit message such as:

        Upload Jeniffer birthday website

11. Click Commit.
12. Click Publish Branch or Sync Changes.
13. Sign in to GitHub if VS Code asks.

If this method feels confusing, use Option A.

## Turn on GitHub Pages

1. Open the repository on GitHub.
2. Click Settings.
3. Click Pages in the left menu.
4. Under Build and deployment, choose Deploy from a branch.
5. Select the main branch.
6. Select / (root).
7. Click Save.
8. Wait a few minutes.
9. Refresh the Pages settings.

GitHub will display a link similar to:

    https://YOUR-USERNAME.github.io/jeniffer-birthday-wishes/

## Update the live website later

When you edit the files:

1. Save the changes in VS Code.
2. Upload or commit the changed files to GitHub.
3. Wait for GitHub Pages to redeploy.
4. Refresh the public website.

## Important Supabase reminder

GitHub Pages only publishes the frontend files. To make all visitors see the
same birthday wishes:

1. Complete SETUP-SUPABASE.md.
2. Change js/config.js to Supabase Mode.
3. Upload the updated js/config.js to GitHub.

The Supabase publishable key is designed for frontend use when Row Level
Security policies are configured. Never upload a secret or service_role key.

## If GitHub Pages shows a blank page or 404

- Confirm index.html is in the repository root.
- Confirm the branch is main.
- Confirm Pages uses / (root).
- Check that all folder names remain lowercase.
- Wait several minutes after the first deployment.
- Try a hard refresh with Ctrl + F5.
