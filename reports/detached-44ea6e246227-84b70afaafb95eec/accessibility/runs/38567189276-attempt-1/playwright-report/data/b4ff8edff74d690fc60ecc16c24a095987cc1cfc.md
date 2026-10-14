# Page snapshot

```yaml
- main [ref=e4]:
  - heading "Address demo" [level=1] [ref=e5]
  - generic [ref=e8]:
    - strong [ref=e10]: Provide address details
    - generic [ref=e11]:
      - generic [ref=e13]: Enter a UK postcode
      - generic [ref=e14]:
        - textbox "Enter a UK postcode" [ref=e15]
        - button "Find address" [ref=e16] [cursor=pointer]
    - link "I can't enter a UK postcode" [ref=e17] [cursor=pointer]:
      - /url: "#"
  - heading "Demo form and event outputs" [level=2] [ref=e18]
  - generic [ref=e19]: "{ \"address\": { \"addressLine1\": null, \"addressLine2\": null, \"addressLine3\": null, \"postTown\": null, \"county\": null, \"postCode\": null, \"country\": null } }"
  - paragraph [ref=e20]:
    - text: "Selection events:"
    - generic [ref=e21]: "0"
  - paragraph [ref=e22]:
    - text: "Addresses available:"
    - generic [ref=e23]: "false"
```