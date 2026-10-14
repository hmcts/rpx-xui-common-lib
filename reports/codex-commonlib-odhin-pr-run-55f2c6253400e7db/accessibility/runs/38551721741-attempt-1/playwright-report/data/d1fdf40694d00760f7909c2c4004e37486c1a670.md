# Page snapshot

```yaml
- main [ref=e4]:
  - heading "Address demo" [level=1] [ref=e5]
  - generic [ref=e10]:
    - generic [ref=e11]: Enter address details
    - generic [ref=e12]:
      - generic [ref=e13]: Building and Street
      - textbox "Building and Street" [ref=e14]: 12 Demo Street
    - generic [ref=e15]:
      - generic [ref=e16]: Address line 2 (Optional)
      - textbox "Address line 2 (Optional)" [ref=e17]
    - generic [ref=e18]:
      - generic [ref=e19]: Address line 3 (Optional)
      - textbox "Address line 3 (Optional)" [ref=e20]
    - generic [ref=e21]:
      - generic [ref=e22]: Town or City
      - textbox "Town or City" [ref=e23]: Testville
    - generic [ref=e24]:
      - generic [ref=e25]: County (Optional)
      - textbox "County (Optional)" [ref=e26]
    - generic [ref=e27]:
      - generic [ref=e28]: Postcode
      - textbox "Postcode" [ref=e29]: AB1 2CD
  - heading "Demo form and event outputs" [level=2] [ref=e30]
  - generic [ref=e31]: "{ \"address\": { \"addressLine1\": \"12 Demo Street\", \"addressLine2\": \"\", \"addressLine3\": \"\", \"postTown\": \"Testville\", \"county\": null, \"postCode\": \"AB1 2CD\", \"country\": \"United Kingdom\" } }"
  - paragraph [ref=e32]:
    - text: "Selection events:"
    - generic [ref=e33]: "1"
  - paragraph [ref=e34]:
    - text: "Addresses available:"
    - generic [ref=e35]: "true"
```