# Connect the Shared Online Wish Wall

Complete this guide only after the design works in Local Mode.

Supabase will store:

- Visitor names
- Birthday wishes
- Square avatar image links
- Square avatar files
- Submission dates

## Part 1 — Create a Supabase project

1. Open https://supabase.com/
2. Sign in or create an account.
3. Click New project.
4. Choose your organization.
5. Enter a project name, for example Jeniffer Birthday.
6. Create a strong database password and save it privately.
7. Choose a nearby region.
8. Click Create new project.
9. Wait until the project dashboard finishes loading.

You do not paste the database password into this website.

## Part 2 — Create the database and avatar storage

1. Open your Supabase project.
2. Click SQL Editor in the left menu.
3. Click New query.
4. Return to VS Code.
5. Open supabase/setup.sql.
6. Select everything with Ctrl + A.
7. Copy with Ctrl + C.
8. Return to the Supabase SQL Editor.
9. Paste with Ctrl + V.
10. Click Run.

You should see a success message.

The script creates:

- A table named birthday_wishes.
- Safe public read and insert rules.
- A public storage bucket named birthday-avatars.
- Upload and viewing rules for the avatar bucket.

## Part 3 — Find the project URL and publishable key

Supabase recommends a publishable key for code that runs in a browser.

1. Open your project dashboard.
2. Click Connect near the top of the page.
3. Copy the Project URL. It starts with https:// and ends with supabase.co.
4. Copy the Publishable key. It starts with sb_publishable_.
5. If the Connect dialog is not visible, open Project Settings > API Keys.

Important:

- The publishable key is allowed in this frontend website.
- Never use a key beginning with sb_secret_.
- Never use the legacy service_role key.
- Secret and service_role keys bypass security rules and must remain private.

## Part 4 — Add the values in VS Code

1. Open js/config.js.
2. Change mode from local to supabase.
3. Paste the Project URL.
4. Paste the publishable key.

The result should look similar to this:

    window.JENIFFER_CONFIG = {
      mode: "supabase",
      supabaseUrl: "https://YOUR-PROJECT.supabase.co",
      supabasePublishableKey: "sb_publishable_YOUR_KEY",
      supabaseAnonKey: "",
      tableName: "birthday_wishes",
      bucketName: "birthday-avatars"
    };

Do not change tableName or bucketName.

Save the file with Ctrl + S.

## Part 5 — Test the online mode

1. Make sure Live Server is running.
2. Refresh the website.
3. Enter a test name and message.
4. Choose an image.
5. Confirm the preview is square.
6. Click Send to Jeniffer.
7. Open the same Live Server URL in another browser, such as Chrome and Edge.
8. Confirm the same message appears there.

If the same message appears in both browsers, Supabase Mode is working.

## Part 6 — Check saved data

To see wish rows:

1. Open Supabase.
2. Click Table Editor.
3. Open birthday_wishes.

To see avatar files:

1. Open Supabase.
2. Click Storage.
3. Open birthday-avatars.

## Common errors

### “The wish could not be saved”

- Confirm mode is exactly "supabase".
- Confirm Project URL starts with https://.
- Confirm the publishable key is complete.
- Run supabase/setup.sql again if the table was not created.

### “The avatar could not be uploaded”

- Open Storage and confirm birthday-avatars exists.
- Confirm the bucket is public.
- Confirm the image is below 5 MB.
- Run setup.sql again to recreate the upload policy.

### Wishes load but images are broken

- Confirm the bucket is public.
- Confirm the avatar URL begins with your correct project URL.
- Open Storage and check whether the uploaded file exists.

### The browser shows a CORS or network error

- Confirm you copied the Project URL exactly.
- Do not add an extra slash at the end of the Project URL.
- Make sure Live Server uses http://127.0.0.1 or http://localhost.
- Confirm your internet connection is working.

## Delete test data

To delete a test wish:

1. Open Table Editor.
2. Open birthday_wishes.
3. Select the test row.
4. Click Delete.

To delete its avatar:

1. Open Storage.
2. Open birthday-avatars.
3. Select the matching file.
4. Click Delete.

These are manual administrator actions and are intentionally not available to
website visitors.
