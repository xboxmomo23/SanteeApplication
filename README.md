# santé appli
application de santé MVP


1. Installation de PostgreSQL sur Ubuntu
Ouvrez votre terminal et exécutez ces commandes pour installer le serveur et l'outil de ligne de commande.

Bash
# Mise à jour des dépôts
sudo apt update

# Installation de PostgreSQL et des contributions
sudo apt install postgresql postgresql-contrib

# Vérifier que le service est actif
sudo systemctl status postgresql
Configuration du mot de passe et de la base
Par défaut, Postgres utilise un utilisateur système nommé postgres. Vous devez lui donner un mot de passe pour que Spring Boot puisse se connecter.

Connectez-vous à la console Postgres : sudo -u postgres psql

Changez le mot de passe : \password postgres (Saisissez votre mot de passe, ex: admin)

Créez la base de données du projet : CREATE DATABASE healdrive;

Quittez : \q

2. Commandes pour Spring Boot (Maven)
Spring Boot utilise généralement Maven pour gérer le projet. Voici les commandes essentielles à connaître.

Pour lancer l'application
Dans le dossier racine de votre projet (là où se trouve le fichier pom.xml) :

Bash
# Compiler et lancer l'application
./mvnw spring-boot:run
Pour nettoyer et compiler (en cas de bug bizarre)
Bash
./mvnw clean install
3. Configuration du fichier application.properties
Pour que Spring Boot sache qu'il doit parler à PostgreSQL (et non plus SQLite), chaque membre de l'équipe doit avoir ce contenu dans src/main/resources/application.properties :

Properties
# Connexion à la base
spring.datasource.url=jdbc:postgresql://localhost:5432/healdrive
spring.datasource.username=postgres
spring.datasource.password=VOTRE_MOT_DE_PASSE

# Configuration JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Stratégie d'héritage (Important pour votre projet)
spring.main.allow-bean-definition-overriding=true
4. Procédure de travail avec Claude & Codex
Pour que votre équipe GitHub fonctionne bien, suivez cet ordre :

Le Lead (Toi) : Crée le projet sur start.spring.io, pousse-le sur GitHub.

Claude : Génère le code. Copie-le dans ton VS Code.

Codex : Si le code de Claude affiche des soulignements rouges dans VS Code, sélectionne le code et demande à Codex : "Fix the syntax errors in this Spring Boot entity for PostgreSQL".

Test : Lancez ./mvnw spring-boot:run. Si la console affiche Started HealDriveApplication, c'est gagné !

Petite astuce pour le GitHub :
N'oubliez pas d'ajouter le fichier .gitignore (généré par Spring Initializr) pour ne pas envoyer les dossiers /target ou les fichiers de configuration personnels sur votre dépôt partagé.
