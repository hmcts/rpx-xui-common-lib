# Page snapshot

```yaml
- main [ref=e4]:
  - heading "Service selection demo" [level=1] [ref=e5]
  - generic [ref=e7]:
    - generic [ref=e8]:
      - generic [ref=e10]: Choose services
      - generic [ref=e11]:
        - combobox "Choose services" [expanded] [active] [ref=e14]:
          - text: Civil
          - listbox [ref=e15]:
            - option "Civil damages" [ref=e16] [cursor=pointer]:
              - generic [ref=e17] [cursor=pointer]: Civil damages
            - option "Civil enforcement" [ref=e18] [cursor=pointer]:
              - generic [ref=e19] [cursor=pointer]: Civil enforcement
        - link "Add service" [ref=e20] [cursor=pointer]:
          - /url: "#"
          - text: Add
          - generic [ref=e21] [cursor=pointer]: service
    - list
  - button "Disable service search" [ref=e22] [cursor=pointer]
  - heading "Parent form and emitted events" [level=2] [ref=e23]
  - generic [ref=e24]: "[]"
  - paragraph [ref=e25]:
    - text: "Change events:"
    - status [ref=e26]: "0"
```