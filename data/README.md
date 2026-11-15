# data/ — edit your content here, never the code

Every piece of text, link and image path shown on the website lives in this folder.
Save the file, refresh the browser — done.

| What you want to change | File |
|---|---|
| Name, contact info, hero text, About text, footer, social links, WhatsApp button, skill tabs, certificate filters, website title/URL | `profile.js` |
| Services cards | `services.js` |
| "Why choose me" cards | `why-choose-me.js` (progress bars are in `profile.js` → `performance`) |
| Work experience timeline | `experience.js` |
| Honors & awards | `awards.js` |
| Skills | `skills.js` |
| Education / qualifications | `qualifications.js` |
| Testimonials | `testimonials.js` |
| FAQ | `faq.js` |
| Certifications | `certifications.js` |
| Page titles / SEO descriptions | `metadata.js` |
| Projects | `projects/` (one file per project) |
| Blog posts | `blogs/` (one file per post) |

## Add a project
1. Copy any file in `data/projects/` → e.g. `10-my-new-app.js`.
2. Change `id` (must be unique), `title`, `description`, `image`, `tags`, `githubUrl`, `caseStudyContent` (plain HTML).
3. Open `data/loader.js` and add `"data/projects/10-my-new-app.js",` to the `projects` list. Order in the list = order on the site.
4. (Optional) add SEO info for it in `metadata.js` → `projectsMetadata`, keyed by the id.
5. Put the image in `assets/img/projects/`.

## Add a blog post
1. Copy a file in `data/blogs/` → e.g. `my-post.js`; change `id`, `title`, `slug` (used in the URL), `excerpt`, `content` (HTML), `category`, `tags`, `published_at`, `read_time`, `cover_image_url`.
2. Add `"data/blogs/my-post.js",` to `data/loader.js`.
3. Cover images go in `assets/img/blogs/`.

## Add a skill / certificate / service / FAQ …
Open the matching file and copy one `{ ... }` block inside the list, paste it below (keep the comma), and edit the values.
- New skill category tab → add `{ key: "...", label: "..." }` to `skillCategories` in `profile.js`, then use that key as `category` in `skills.js`.
- New certificate filter → add it to `certificationFilters` in `profile.js` and put the same key in the certificate's `categories`.

## Tips
- Text in backticks `` ` ` `` (projects/blogs) can span many lines and contain HTML.
- Keep commas between items and quotes around text. A typo in a file stops later files loading — open the browser console (F12) to see the error and the file name.
- Images: put files in `assets/img/...` and write the path like `assets/img/projects/my-image.webp`.
