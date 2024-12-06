Pour lancer le projet:

Lancer docker desktop:

et dans le dossier vulnérable ou secure :

Lancer la commande:

docker-compose up --build

------------------------------------------------------------

Tu poura te créer un utilisateur et te loger 
Tu ne trouveras pas de produits même dans l'onglet

Pour créer un produit :

tu dois utiliser postMan:

Envoi une requête PUT : http://localhost:3000/auth/user/:id/role

avec l'id de ton utilisateur crée pour le rendre "Admin" (comme ca tu pourra te deconnecter et te reconnecter pour mettre a jour l'utilisateur et créer/editer/supprimer des produits).


NB: La base vulnérable est différente de la base sécure (due au changements de sauvegarde du mdp haché), c'est pourquoi vous devriez faire les mêmes étapes au niveau des deux dossiers. (Dans le dossier secure, l'api qui modifie le role d'un user à "admin" n'est pas sécuriser afin de pouvoir facilement la lancer sur postman sans complications).


La branche main que vous avez du cloné sur votre local, contient les vulnerabiltés "SQLi et CSRF".
Si vous lancer "git branch -r" dans votre terminal vous auriez : 

origin/BrutForce
origin/LFI
origin/XSS
origin/main -- La ou vous etes actuellement !

dans les 3 branches BrutForce / LFI / XSS vous trouveriez chaque vulnérablité dans la branche dédié.
Afin d'utiliser ces 3 branches individuellement dans d'autres branches :
Lancer :
git fetch -all
Vous pouvez ainsi acceder à ces branches en utilisant :
git branch -a
git checkout <nom de la branch>