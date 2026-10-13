# Page snapshot

```yaml
- main [ref=e4]:
  - heading "Service selection demo" [level=1] [ref=e5]
  - generic [ref=e7]:
    - generic [ref=e8]:
      - generic [ref=e10]: Choose services
      - generic [ref=e11]:
        - combobox "Choose services" [ref=e14]
        - link "Add service" [active] [ref=e15] [cursor=pointer]:
          - /url: "#"
          - text: Add
          - generic [ref=e16] [cursor=pointer]: service
    - list [ref=e17]:
      - listitem [ref=e18]:
        - link "Family" [ref=e19] [cursor=pointer]:
          - /url: "#"
  - button "Disable service search" [ref=e20] [cursor=pointer]
  - heading "Parent form and emitted events" [level=2] [ref=e21]
  - generic [ref=e22]: "[ { \"key\": \"family\", \"label\": \"Family\" } ]"
  - paragraph [ref=e23]:
    - text: "Change events:"
    - status [ref=e24]: "1"
```