# Page snapshot

```yaml
- main [ref=e4]:
  - heading "Address demo" [level=1] [ref=e5]
  - generic [ref=e8]:
    - strong [ref=e10]: Provide address details
    - generic [ref=e11]:
      - generic [ref=e13]: Enter a UK postcode
      - paragraph [ref=e14]:
        - generic [ref=e15]: "Error:"
        - text: Enter a valid postcode
      - generic [ref=e16]:
        - textbox "Enter a UK postcode" [ref=e17]
        - button "Find address" [active] [ref=e18] [cursor=pointer]
    - link "I can't enter a UK postcode" [ref=e19] [cursor=pointer]:
      - /url: "#"
  - heading "Demo form and event outputs" [level=2] [ref=e20]
  - generic [ref=e21]: "{ \"address\": { \"addressLine1\": null, \"addressLine2\": null, \"addressLine3\": null, \"postTown\": null, \"county\": null, \"postCode\": null, \"country\": null } }"
  - paragraph [ref=e22]:
    - text: "Selection events:"
    - generic [ref=e23]: "0"
  - paragraph [ref=e24]:
    - text: "Addresses available:"
    - generic [ref=e25]: "false"
```