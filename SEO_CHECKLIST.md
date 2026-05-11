# SEO Launch Checklist

## Domain and Indexing

- Set `NEXT_PUBLIC_SITE_URL` to the production domain, including `https://`.
- Use one canonical production host only, for example `https://example.com` or `https://www.example.com`.
- Redirect all other host variants to the canonical host.
- Make sure the production site returns `200` for `/`, `/robots.txt`, and `/sitemap.xml`.
- Submit `https://your-domain.com/sitemap.xml` in Google Search Console after deployment.

## Metadata

- Keep the homepage title concise and descriptive: `AI News - Hacker News AI Digest`.
- Keep the meta description human-readable and under roughly 160 characters when possible.
- Use one visible `h1` on the page.
- Keep canonical URLs absolute in production by setting `NEXT_PUBLIC_SITE_URL`.
- Add a custom Open Graph image before public sharing if social previews matter.

## Content Quality

- Make sure the page explains what the site does without relying only on external links.
- Keep the FAQ visible on the page if `FAQPage` structured data is present.
- Avoid keyword stuffing. Use natural language around AI news, Hacker News, LLMs, research, products, and engineering.
- Add more original editorial context over time if you want stronger search performance than an API-driven aggregator page.

## Technical SEO

- Use HTTPS in production.
- Confirm mobile layout, tap targets, text contrast, and no horizontal overflow.
- Monitor Core Web Vitals after launch.
- Avoid blocking search bots with auth, IP filters, or deployment preview protection.
- Confirm server-rendered HTML contains the main page content and structured data.

## Google FAQ Notes

- This project includes `FAQPage` JSON-LD with visible FAQ content.
- Google currently limits FAQ rich results mainly to well-known, authoritative government or health websites, so valid markup does not guarantee a FAQ rich result.
- Each FAQ question has exactly one accepted answer.
- Do not use FAQ structured data for advertising copy or content that is not visible to users.
- Validate the page after deployment with Google's Rich Results Test and Search Console URL Inspection.

## Post-Launch

- Add the domain property in Google Search Console.
- Request indexing for the homepage.
- Check `robots.txt` and `sitemap.xml` after DNS and SSL are live.
- Watch Search Console for indexing, structured data, and mobile usability issues.
- Add analytics only after confirming it does not hurt page performance or privacy expectations.
