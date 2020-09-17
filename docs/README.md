# Create a favicon with multiple image size
```
convert -background transparent \
icon-630x630.png \
-define icon:auto-resize=32,128,152,167,180,192,196 \
favicon.ico
```

```
$ convert icon-630x630.png -resize 72x72 icon-72x72.png
$ convert icon-630x630.png -resize 96x96 icon-96x96.png
$ convert icon-630x630.png -resize 128x128 icon-128x128.png
$ convert icon-630x630.png -resize 144x144 icon-144x144.png
$ convert icon-630x630.png -resize 152x152 icon-152x152.png
$ convert icon-630x630.png -resize 192x192 icon-192x192.png
$ convert icon-630x630.png -resize 384x384 icon-384x384.png
$ convert icon-630x630.png -resize 512x512 icon-512x512.png
```
