Pour lancer le projet:

Lance ton docker desktop:

et dans le dossier vulnérable ou secure :

Lance:

docker-compose up --build

------------------------------------------------------------

Tu poura te créer un utilisateur et te loger 
Tu trouveras pas de produits

Pour créer un produit :

tu dois utiliser postMan:

Envoi une requête PUT : http://localhost:3000/auth/user/:id/role

avec l'id de ton utilisateur crée pour le rendre "Admin" (comme ca tu pourra te deconnecter et te reconnecter pour mettre a jour l'utilisateur et créer des produits)