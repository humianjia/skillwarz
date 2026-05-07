# AdSense Pre-Submission Checklist

This checklist is for the current SkillWarz site structure and should be run after every meaningful content or template deployment.

## 1. Deploy The New Build

- [ ] Upload the regenerated site files, including updated HTML pages, `robots.txt`, `sitemap.xml`, `ads.txt`, and `css/content.css`.
- [ ] Confirm the live homepage is the rebuilt version, not the older long-form template.
- [ ] Confirm at least one new guide page is reachable on the live domain.

## 2. Verify Core Live URLs Return 200

- [ ] `/`
- [ ] `/categories.html`
- [ ] `/about.html`
- [ ] `/contact.html`
- [ ] `/privacy.html`
- [ ] `/terms.html`
- [ ] `/dmca.html`
- [ ] `/skillwarz-beginner-guide.html`
- [ ] `/robots.txt`
- [ ] `/sitemap.xml`
- [ ] `/ads.txt`

## 3. Verify Crawl And Index Signals

- [ ] `robots.txt` is live and references the correct sitemap URL.
- [ ] `sitemap.xml` is live and contains the homepage, trust pages, guide pages, and only the selected indexable game pages.
- [ ] Indexable pages contain `index, follow`.
- [ ] Support pages contain `noindex, follow`.
- [ ] Canonical URLs point to `https://skillwarz.online/...`

## 4. Verify Trust And Contact Signals

- [ ] The live footer links point to real pages, not placeholders.
- [ ] `422435896@qq.com` appears on contact or policy pages.
- [ ] `About`, `Privacy`, `Terms`, and `DMCA` reflect the real role of the site as a browser game discovery/editorial site.

## 5. Verify Content Quality Signals

- [ ] The homepage presents the rebuilt editorial copy and guide links.
- [ ] Category pages show real counts, not inflated totals.
- [ ] Random rating or fake play count widgets are gone.
- [ ] At least 4-8 original guide pages are indexed and live.
- [ ] Only a tighter set of stronger game pages is indexable.

## 6. Verify AdSense Readiness Items

- [ ] Replace the placeholder line in `ads.txt` with the real Google publisher ID.
- [ ] Add the real AdSense site verification / ad code once you have the correct `ca-pub-...` value.
- [ ] Recheck that live pages expose the AdSense code after deployment.

## 7. Verify Search And Monitoring

- [ ] Resubmit `sitemap.xml` in Google Search Console.
- [ ] Request indexing for the homepage and main guide pages.
- [ ] Recheck live status 24-48 hours after deploy.
- [ ] Wait for Google to recrawl before submitting the AdSense review.

## Recommended Run Order

1. Run `node verify_adsense_readiness.js`
2. Deploy the latest files
3. Run `node verify_adsense_readiness.js --live`
4. Fix any `FAIL` items
5. Resubmit sitemap in Search Console
6. Re-run the live check before applying for review
