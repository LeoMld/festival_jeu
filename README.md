# Application Web Festival des jeux de Montpellier
## Description
Ce projet est une application web réalisée en javascript (Front: React, Back: NodeJS) dans le cadre d'un projet de cours à Polytech Montpellier.  
Elle permet de gérer le festival du jeu de Montpellier qui à lieu tous les ans.  

Pour permettre cette gestion 3 types de comptes ont été établi:
- visiteur (visualisation des données du festival en cours)
- administrateur (gestion des festivals)
- organisateur (visualisation de la gestion des festivals)

## Installation

```
git clone https://github.com/LeoMld/festival_jeu.git
```

Un fichier ```.env``` contenant les variables d'environnement est nécessaire pour que l'application fonctionne correctement. (Il contient les informations pour se connecter à la base de donnée, ainsi que les clés des tokens et refresh tokens) 

## Lien vers l'application hébergée
https://festival-jeu-montpellier.herokuapp.com/Accueil

## Spécifications fonctionnelles
Voici les spécifications fonctionnelles qui nous ont permis de réaliser ce projet :

Le principe général est le suivant : pouvoir assurer le suivi et la facturation des réservations de tables par les exposants.


Un exposant réserve plusieurs emplacements (1/2 tables possibles) et sera facturé en fonction du nombre d’emplacements. Il y a 3 prix prédéfinis à la création du festival en fonction de la localisation dans le salon. Il faut, bien sûr, garder la possibilité de faire des remises.

Un exposant peut également réserver des m² si il souhaite de l’espace sans table de jeu. il y a donc aussi 3 prix pour le m².


Lors de la réservation, on affecte les tables ou m² réservés à une ou plusieurs zones. Les zones sont créées et définies au fur et à mesure. Il faut donc pouvoir les gérer. On ne peut pas supprimer une zone où des tables sont positionnées et on doit pouvoir lister les tables et les jeux d’une zone.

À chaque réservation sont associées des jeux. Les jeux ne sont pas forcément connus au moment de la réservation. Il faut pouvoir les rajouter au moment ou après la réservation. Un jeu possède un titre, un type (enfant, famille, ambiance, amateur, …), un nombre de joueurs (2 ou 2-4), un âge minimum et un éditeur. 


À part les réservation, les zones et les prix, les différentes entités : types de jeu, jeu, éditeurs, exposants ne sont pas propres à un festival mais commun à tous. On doit pouvoir les réutiliser d’un festival à l’autre.


Suivi des réservations : 

On doit pouvoir rajouter des notes à une réservation.
Il faut pouvoir effectuer un suivi suivant le workflow : pas encore contacté, contacté, discussion en cours, réservation confirmée, jeux demandés, jeux confirmés.
Pour un exposant, on doit savoir 
 - si il a besoin d’animateurs bénévoles ou pas
 - si il se déplace ou pas
 
Concernant la facturation : a-t-elle été faite, a-t-elle été réglée ?

Concernant les jeux d’un festival : sont-ils apportés par l’exposant ? Ou ont-il été reçu ? Sont-ils placés sur le plan ?

Concernant les Éditeurs : On doit pouvoir les gérer, les lister, etc.. Un éditeur possède un nom, une adresse, et des contacts dont un principal.

Les contacts : prénom, nom, adresse mel, tel fixe, tel portable, et fonction.

Concernant les jeux : on doit pouvoir les gérer : ajout, suppression, modification, liste des jeux par éditeurs, par type.

Concernant un festival : on doit pouvoir savoir différentes choses :

Tableau récapitulatif des exposants et leur statut pour le festival (contacté ou pas, réservation ou pas, etc ...). 
Très important : doit être clair et ergonomique (filtre, couleurs, etc…)


Tableau récapitulatif financier : 
 - CA prévu,
 - CA facturé, 
 - CA à facturer, 
 - CA payé avec liste des facturations correspondantes (par exposant)

Un exposant peut aussi être éditeur mais pas forcément. Un éditeur n’est pas forcément un exposant.
