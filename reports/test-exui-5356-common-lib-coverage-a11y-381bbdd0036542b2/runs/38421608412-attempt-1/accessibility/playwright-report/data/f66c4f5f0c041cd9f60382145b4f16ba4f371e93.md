# Page snapshot

```yaml
- main [ref=e4]:
  - heading "Address demo" [level=1] [ref=e5]
  - generic [ref=e8]:
    - strong [ref=e10]: Provide address details
    - generic [ref=e11]:
      - generic [ref=e13]: Enter a UK postcode
      - generic [ref=e14]:
        - textbox "Enter a UK postcode" [ref=e15]: ab1 2cd
        - button "Find address" [active] [ref=e16] [cursor=pointer]
    - generic [ref=e18]:
      - generic [ref=e20]: Select an address
      - combobox "Select an address" [ref=e21]:
        - option "2 addresses found" [selected]
        - option "10 Demo Street, Testville"
        - option "12 Demo Street, Testville"
    - link "I can't enter a UK postcode" [ref=e22] [cursor=pointer]:
      - /url: "#"
  - heading "Demo form and event outputs" [level=2] [ref=e23]
  - generic [ref=e24]: "{ \"address\": { \"addressLine1\": null, \"addressLine2\": null, \"addressLine3\": null, \"postTown\": null, \"county\": null, \"postCode\": null, \"country\": null } }"
  - paragraph [ref=e25]:
    - text: "Selection events:"
    - generic [ref=e26]: "0"
  - paragraph [ref=e27]:
    - text: "Addresses available:"
    - generic [ref=e28]: "true"
```