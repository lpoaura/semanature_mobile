
# LPO Mobile App

PING 2023 


## Documentation

[Documentation](https://devops.telecomste.fr/antoine.axel/lpo-mobapp/-/wikis/Documentation)


![Logos](https://auvergne-rhone-alpes.lpo.fr/wp-content/uploads/LPO_AuRA.svg)


Project developped for [LPO Auvergne-Rhône-Alpes](https//auvergne-rhone-alpes.lpo.fr/)


## Realease et déploiement mobile

Pour déployer l'application, il est nécessaire de générer un .aab avec la même clé que le projet.

Pour cela, nous utilisons un compte ExpoGo combiné avec eas.

Étapes à suivre :
- Installer le module eas.
```bash
$ npm install -g eas-cli
```
- Se connecter au compte develloper de la lpo sur expo avec eas (demander à béatrice les logins mdp de l'app mobile, sinon demander à Tibo Preher).
```bash
$ eas login
```
- Builder le projet sur Expo :
```bash
$ eas build --platform android
```

L'utilisateur obtient alors un lien pour télécharger le .aab qu'il faudra mettre en ligne sur le compte
Google PlayStore. Il est important que chaque version mise en ligne ait un numéro de build
différent:
- Connexion à la console google playstore avec le compte devlpo : https://play.google.com/console/u/1/developers/7483810268087091411/app-list
- Choisir l'application Scrute la Nature
- Production -> Realease -> Modifier la version
- Uploader le fichier .aab telecharger aver le lien a la fin du build expo.
- Pousser la realease en prod, google va l'examiner (2 jours).
- Pousser la realease sur le playstore en confirmant.



## Contributors

- [@antoine.axel](https://devops.telecomste.fr/antoine.axel)
- [@thuel-chassaigne.mathis](https://devops.telecomste.fr/thuel-chassaigne.mathis)
- [@noiton.tanguy](https://devops.telecomste.fr/noiton.tanguy)
- [@van-den-bogaert.hugo](https://devops.telecomste.fr/van-den-bogaert.hugo)
- [@celotto.raphael](https://devops.telecomste.fr/celotto.raphael)
- Sarah-Marie Jules
- Houda Sbai
- Chems Jouaiti
- Mariam Khanfri
- Mathis Thuel-Chassaigne
- Tibo Preher
- Valentin Pontiggia
- Matthieu d'Hoop
- Romuald Dubois
- Cole Stannard
- Mickael Osorio
- Niels Kristen

