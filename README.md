# natours

0. Basic routing with a in memory / file database
1. MVC taking form
2. Env config
3. Lint
4. morgan logs

5. adds db env vars (remember to add db at the end of the url, before the params)
6. updates to use mongo db
7. queries with filtering, sorting, pagination, and aliasing
8. query alias
9. aggregation pipelines
10. virtual property
11. mongoose middlewares (document, query, aggregate, and model)
12. model validation

13. debug/production run scripts
14. operational errors (predictable): failed to connect, invalid path, ... -> error handling middleware
15. programming errors (code): type mismatch, await with no async, ...
16. included several errors as operational (db, url, ...)
17. general uncaught exceptions handling

18. signup / login / logout
19. jwt
20. roles / authz
21. forgot / reset password
22. send email (mailtrap for development)
23. user routes for current user (get, update, delete)
24. security implemented
    - DB: encrypted passwords (bcrypt), reset tokens (SHA256)
    - Brute force: slow/strong encryption, rate limiting
    - XSS: jwt in httpOnly cookies, sanitize input, http headers (helmet pkg)
    - DOS: rate limiting (again), limit body payload (in body-parser)
    - NoSQL injection: mongoose (well-defined schema), sanitization
    - other: https, random reset tokens with expiration, revoke jwt after password change, config and error kept private, param pollution
25. security suggestions

    - Brute force: limit login attempts
    - DOS: evil regex (exponential time to run for non-matching inputs)
    - other: XSRF (csurf pkg), re-authn for critical action (payment), untrusted jwt blacklist, confirm email on signup (send email with link), refresh tokens (more complex), 2FA

26. geospatial data modeling (tour locations)
27. Relationship between mongo collections (child / parent referencing, embedding, ...)
28. Populating document references and virtual populate
29. Nested routes with populated attributes for relationships
30. Virtual populate: 'get' on parent also returns children it has no reference to (parent referencing)
31. Nested routes
32. Factory functions for controllers (models as closures "memory")
33. Database indexing
34. Geospatial aggregation queries

35. Enable pug templates in express
36. Include and Extend (block) templates
37. Front-end login/logout and Parcel/Babel
38. Handle form submission to update profile fields
