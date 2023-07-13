# qr-generator

small browser tool for making qr codes. text, url, wifi credentials, vcard contacts.

## what it does

- four input modes via tabs: text, url, wifi, vcard
- wifi mode builds the standard `WIFI:T:WPA;S:ssid;P:pass;;` payload that ios and android both recognize
- vcard mode uses vcard 3.0

## running it

no build step.

```
open index.html
```

## stack

vanilla html, css, js. qrcode.js 1.5.3 via jsdelivr.
