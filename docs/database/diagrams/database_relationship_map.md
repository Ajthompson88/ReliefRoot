```
                         users
                           │
       ┌───────────────────┼────────────────────┐
       │                   │                    │
       ▼                   ▼                    ▼
    plants             products             sessions
       │                   │                    │
       │                   │                    ├── session_ratings
       │                   │                    │
       │                   │                    ├── session_effects ─── effects
       │                   │                    │
       │                   │                    └── session_symptoms ── symptoms
       │                   │
       ├── grow_logs       └── coa_tests
       │                         │
       ▼                         ├── coa_cannabinoids ─── cannabinoids
    harvests                     │
       │                         └── coa_terpenes ─────── terpenes
       └────────────── coa_tests


                         strains
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
       plants          products         sessions


                         photos
                           │
      ┌────────────────────┼────────────────────┐
      │                    │                    │
      ▼                    ▼                    ▼
    plants              products             sessions
      │
      ▼
   harvests
```
