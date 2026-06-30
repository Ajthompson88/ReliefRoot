## Plants

```text
plants
  id PK
  ├── user_id FK → users.id
  ├── strain_id FK → strains.id
  │
  ├── grow_logs.plant_id
  └── harvests.plant_id
```
