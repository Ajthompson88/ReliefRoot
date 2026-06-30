## Products

```text
products
  id PK
  ├── user_id FK → users.id
  ├── strain_id FK → strains.id
  │
  ├── sessions.product_id
  ├── coa_tests.product_id
  └── photos.product_id
```
