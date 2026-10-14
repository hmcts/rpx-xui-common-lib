# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - heading "CommonLib component coverage examples" [level=1] [ref=e5]
  - main [ref=e6]:
    - generic [ref=e7]:
      - heading "Navigation" [level=2] [ref=e8]
      - navigation "Primary demo navigation" [ref=e10]:
        - list [ref=e12]:
          - listitem [ref=e13]:
            - link "Coverage examples" [ref=e14] [cursor=pointer]:
              - /url: /coverage
          - listitem [ref=e15]:
            - link "Home demo" [ref=e16] [cursor=pointer]:
              - /url: /home
      - navigation "Secondary demo navigation" [ref=e18]:
        - list [ref=e19]:
          - listitem [ref=e20]:
            - link "Current section 2" [ref=e21] [cursor=pointer]:
              - /url: /coverage
              - text: Current section
              - generic [ref=e22] [cursor=pointer]: "2"
          - listitem [ref=e23]:
            - link "Other section" [ref=e24] [cursor=pointer]:
              - /url: /home
```