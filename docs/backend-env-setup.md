# Backend Service Environment Setup

## Prerequisite
| Tech Stack    | Name       | Version |
| ------------- |:-------------:| :------: |
| Language    | [Java](https://www.oracle.com/ca-en/java/technologies/downloads/) | JDK17 |
| Build Tool  | [Maven](https://maven.apache.org/install.html) | 3.9.0 or higher |
| SQL | [MySQL](https://www.mysql.com/downloads/) | |
| Containerization | [Docker](https://www.docker.com/products/docker-desktop/) |  |
| IDE | Intellij or Eclipse |  |
<!--
|  |  |  |
-->

## 1. Clone the Repo
Use HTTPS or SSH to clone this repo to your local.
HTTPS:
```
git clone https://github.com/Weilei424/leafwheels.git
```

SSH:

```
git clone git@github.com:Weilei424/leafwheels.git
```

<br>

## 2. Import Maven Project
Depending on which IDE you use this step might be slightly different.

1. Go to Spring Boot Application root folder `leafwheels/leafwheels`
2. Right click on `pom.xml` 
3. Click `import as Maven project`

<br>

> Notes: It's a good habbit that to run `mvn clean` or `mvn clean install` before you run the application, especially you added or removed a Maven dependency.

> If you run into project with project build/structure, most likely it is something went run with pom.xml. Could be the config itself not working, or your IDE not reading the config file properly. Try `mvn clean install` first, if still not work try re-import the Maven project.
<br>

## 3. Run the Spring Boot Application
There are multiple ways to run a Spring Boot application:
* Run `leafwheels/leafwheels/src/main/java/com/yorku4413s25/leafwheels/LeafwheelsApplication.java` from your IDE
* Or run `mvn spring-boot:run`
