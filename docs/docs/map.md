# Documentation technique 


## Implémentation 
 
Une nouvelle page a été créée pour accueillir la carte côté application mobile. Pour le voir apparaitre 
dans l’application, il suﬃt de décommenter le bloc de code dans app/routes/Navigation.js associé :  
 
 
Ensuite  vous  pouvez  allez  dans  le  composant  Map.component.js  et  faire  vos  modiﬁcations  pour 
implémenter la map. 

## Solutions Techniques 
 
### MapView 
 
https://github.com/react-native-maps/react-native-maps 
 
MapView a le mérite d’être la solution la plus couramment utilisée par les applications en React Native, 
et est aussi celle qui propose le plus de fonctionnalités. Elle se base sur l’utilisation d’une carte liée à 
Google Maps, (ou à Carte sur iOS). De nombreux tutoriels sont également disponibles et renseignent 
très bien la façon d’implémenter diﬀérentes fonctionnalités. 
Cependant MapView nécessite l’utilisation de l’API Google Maps Platiorm et de son SDK. Cela 
implique donc une facturation possible. Google Cloud Platiorm propose 300$ de crédit gratuit au 
total et Google Maps Platiorm propose 200$ de crédit gratuit par mois (en gros c’est une sorte de 
limite : au-delà d’un certain nombre de chargement de cartes, comptabilisé en « crédits », il faut 
payer). Voici une explication sur les tarifs donnée par Google : 


 
En ce qui concerne les tarifs Google Maps Platiorm, les 200$ de crédit par mois permetient 28 571 
chargements de carte gratuits par mois. Au-delà, il faut payer pour les chargement en plus. 
La solution de MapView semble donc oﬀrir une bonne base gratuite, tout en devenant payante au-
delà d’un certain cap.  
 
### MapBox 
 
https://github.com/rnmapbox/maps/blob/main/docs/GetingStarted.md 
 
De  la  même  manière,  MapBox  permet  de  construire  des  cartes  et  d’y  placer  des  points. 
L’implémentation a l’air plus simple que MapView, mais le degré de personnalisation de la carte a l’air 
moins important aussi.  
En ce qui concerne la facturation, MapBox est aussi gratuit jusqu’à un certain seuil (pas d’information 
sur le seuil mais il doit être de l’ordre de celui de Google Maps). 
 
### Autres solutions 
 
Diverses autres solutions existent aussi, qui semblent gratuites d’utilisation. Cependant, nous avons 
l’impression qu’elles ne fonctionnent pas toutes (erreurs à la compilation). Cela peut tout de même 
être des pistes à explorer :  
https://github.com/reggie3/react-native-webview-leaﬂet (erreur à la compilation) 
https://www.npmjs.com/package/react-native-yandexmapkit (non testé) 
https://docs.maptiler.com/react-native/ (erreur à la compilation) 
 
