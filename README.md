Voici le document réécrit en version "travail d'équipe", avec un ton collaboratif et des rôles clairement définis :

---

#  HealDrive — Guide de mise en place (Équipe)

## Application de santé MVP

---

## 1. Installation de PostgreSQL sur Ubuntu

**Responsable suggéré : n'importe quel membre qui configure son poste**

Chaque membre de l'équipe doit installer PostgreSQL localement. Ouvrez votre terminal et exécutez les commandes suivantes :

```bash
# Mise à jour des dépôts
sudo apt update

# Installation de PostgreSQL et des contributions
sudo apt install postgresql postgresql-contrib

# Vérifier que le service est actif
sudo systemctl status postgresql
```

### Configuration du mot de passe et de la base

Par défaut, Postgres utilise un utilisateur système nommé `postgres`. Pour que Spring Boot puisse s'y connecter, chacun doit lui attribuer un mot de passe **local** :

```bash
# Se connecter à la console Postgres
sudo -u postgres psql
```

Dans la console Postgres :
```sql
-- Changer le mot de passe (ex: admin)
\password postgres

-- Créer la base de données commune du projet
CREATE DATABASE healdrive;

-- Quitter
\q
```

>  **Note d'équipe :** Le mot de passe que vous choisissez est **local à votre machine**. Il ne sera jamais poussé sur GitHub — chacun définit le sien librement.

---

## 2. Commandes Maven pour Spring Boot

**À connaître par toute l'équipe**

Depuis le dossier racine du projet (là où se trouve `pom.xml`) :

```bash
# Compiler et lancer l'application
./mvnw spring-boot:run

# Nettoyer et recompiler (en cas de comportement étrange)
./mvnw clean install
```

---

## 3. Configuration de `application.properties`

**Chaque membre configure ce fichier sur sa machine**

Fichier à modifier : `src/main/resources/application.properties`

```properties
# Connexion à la base
spring.datasource.url=jdbc:postgresql://localhost:5432/healdrive
spring.datasource.username=postgres
spring.datasource.password=VOTRE_MOT_DE_PASSE_LOCAL

# Configuration JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Stratégie d'héritage
spring.main.allow-bean-definition-overriding=true
```

>  **Important :** Ce fichier contient votre mot de passe personnel. **Il ne doit pas être commité sur GitHub.** Vérifiez qu'il est bien listé dans le `.gitignore`.

---

## 4. Workflow de l'équipe avec Claude & Codex

Voici la procédure que l'équipe suit ensemble, étape par étape :

| Étape | Qui | Action |
|-------|-----|--------|
| **1. Initialisation** | **Lead** | Crée le projet sur [start.spring.io](https://start.spring.io) et le pousse sur GitHub |
| **2. Génération du code** | **Claude** | Génère les entités, services et contrôleurs Spring Boot |
| **3. Correction syntaxique** | **Codex** | Si VS Code affiche des soulignements rouges, sélectionner le code et demander : *"Fix the syntax errors in this Spring Boot entity for PostgreSQL"* |
| **4. Test collectif** | **Toute l'équipe** | Lancer `./mvnw spring-boot:run` — succès si la console affiche `Started HealDriveApplication`  |

---

## 5. Bonnes pratiques GitHub (pour toute l'équipe)

- **Ne jamais commiter** `application.properties` avec un vrai mot de passe — utilisez `application.properties.example` comme modèle vide à partager.
- **Toujours exclure** le dossier `/target` via le `.gitignore` fourni par Spring Initializr.
- **Travailler sur des branches** séparées et faire des Pull Requests pour intégrer les changements.
