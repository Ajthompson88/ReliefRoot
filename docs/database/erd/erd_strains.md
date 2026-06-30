## Legend

```text
PK = Primary Key
FK = Foreign Key
→  = References
<  = One-to-many child relationship
```

---

## Strains

```
strains
  id PK
  │
  ├──< plants.strain_id
  ├──< products.strain_id
  └──< sessions.strain_id
```
