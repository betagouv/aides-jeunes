## Modifier le logo

La source du logo est un SVG contenant du texte. Pour le rendre accessible à tous les utilisateurs, il importe de le transformer en un SVG contenant des `path`.

Cela peut être fait à la ligne de commande avec [Inkscape](https://inkscape.org/fr/) :

```shell
cd mes-aides-ui
inkscape --export-text-to-path `pwd`/public/img/sources/logo.svg -l `pwd`/public/img/logo.svg  # absolute paths are mandatory
svgo --multipass public/img/logo.svg  # optimisation, cf. https://jakearchibald.github.io/svgomg/
```
