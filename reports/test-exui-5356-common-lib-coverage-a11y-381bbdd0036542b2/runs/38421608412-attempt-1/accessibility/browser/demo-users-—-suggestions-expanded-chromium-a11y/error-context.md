# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - heading "CommonLib component coverage examples" [level=1] [ref=e5]
  - main [ref=e6]:
    - generic [ref=e7]:
      - heading "User selection" [level=2] [ref=e8]
      - paragraph [ref=e9]: Select a user
      - combobox "Select a user" [expanded] [active] [ref=e11]:
        - text: Alex
        - listbox [ref=e12]:
          - option "Alex Taylor - alex@example.test" [ref=e13] [cursor=pointer]:
            - generic [ref=e14] [cursor=pointer]: Alex Taylor - alex@example.test
      - status [ref=e15]: No user selected
```