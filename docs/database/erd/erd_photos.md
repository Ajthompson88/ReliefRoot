## Photos

```text
photos
  id PK
  ├── user_id    FK → users.id
  ├── plant_id   FK → plants.id
  ├── product_id FK → products.id
  ├── harvest_id FK → harvests.id
  └── session_id FK → sessions.id
```
