# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - heading "CommonLib component coverage examples" [level=1] [ref=e5]
  - main [ref=e6]:
    - generic [ref=e7]:
      - heading "Generic filter" [level=2] [ref=e8]
      - generic [ref=e10]:
        - generic [ref=e12]:
          - heading "Service" [level=3] [ref=e14]
          - group "Service" [ref=e16]:
            - generic [ref=e17]:
              - checkbox "Civil" [ref=e18] [cursor=pointer]
              - generic [ref=e19] [cursor=pointer]: Civil
            - generic [ref=e20]:
              - checkbox "Family" [ref=e21] [cursor=pointer]
              - generic [ref=e22] [cursor=pointer]: Family
        - generic [ref=e24]:
          - heading "Priority" [level=3] [ref=e26]
          - group "Priority" [ref=e28]:
            - generic [ref=e29]:
              - radio "Urgent" [ref=e30] [cursor=pointer]
              - generic [ref=e31] [cursor=pointer]: Urgent
            - generic [ref=e32]:
              - radio "Normal" [ref=e33] [cursor=pointer]
              - generic [ref=e34] [cursor=pointer]: Normal
        - generic [ref=e36]:
          - heading "Region" [level=3] [ref=e38]
          - combobox "Region" [ref=e40]:
            - option "London"
            - option "North"
        - separator [ref=e41]
        - generic [ref=e43]:
          - button "Apply filters" [ref=e44] [cursor=pointer]
          - button "Cancel changes" [ref=e45] [cursor=pointer]
      - status [ref=e46]: "null"
```