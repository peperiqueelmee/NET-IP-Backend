# Backend aplicación de central telefónica "NET-IP"

## Descripción

Backend de aplicación web responsive que permite administrar una central telefónica de manera eficiente. Esta aplicación abarca la *gestión* de **anexos**, **troncales**, **intercomunicadores**, **multi call ringing**, así como la administración de los **usuarios** encargados de operar el sistema.

## Tecnologías utilizadas

- Node.js
- Express
- JWT (JSON Web Tokens)
- Nodemailer
- Bcrypt
- Sequelize


## Instalación

1. Clonar el repositorio: `git clone https://github.com/peperiqueelmee/NET-IP-Backend.git`
2. Navegar hasta el directorio del proyecto: `cd NET-IP-Backend`
3. Instalar las dependencias: `npm install`

## Configuración del entorno

Crea un archivo llamado ".env" siguiendo la estructura proporcionada en el archivo "example.env".

## Base de datos

Este proyecto utiliza una base de datos MySQL. Asegúrate de completar los siguientes campos en el archivo ".env" con los datos correspondientes:

- `DB_NAME`: Nombre de la base de datos.
- `DB_USER`: Usuario de la base de datos.
- `DB_PASS`: Contraseña del usuario de la base de datos.
- `DB_HOST`: Dirección del servidor de la base de datos.

Antes de iniciar la aplicación, también necesitarás ejecutar el script de inicialización de la base de datos. Este se encuentra en el archivo `database/init_db.sql`. Puedes ejecutarlo utilizando MySQL Workbench, o en la línea de comandos si tienes MySQL instalado en tu sistema operativo:

```bash
mysql -u nombreUsuario -p nombreBaseDeDatos < ruta_al_archivo/database/init_db.sql
```

## Configuración del frontend

Indica la URL donde se encuentra alojado el frontend de la aplicación asignando el valor correcto a `FRONTEND_URL` en el archivo ".env".

## Configuración de JWT

Para el manejo de autenticación, se utiliza JWT (JSON Web Tokens). Asegúrate de establecer una clave secreta segura para `JWT_SECRET` en el archivo ".env". Por ejemplo, puedes utilizar "secretkeyword" como valor temporal.

## Configuración del servicio de correo electrónico

Para el envío de correos electrónicos desde la aplicación, completa los siguientes campos en el archivo ".env" con los datos de tu servicio de correo electrónico:

- `EMAIL_USER`: Usuario del servicio de correo electrónico.
- `EMAIL_PASS`: Contraseña del usuario del servicio de correo electrónico.
- `EMAIL_HOST`: Servidor de correo electrónico (host).
- `EMAIL_PORT`: Puerto utilizado para el servicio de correo electrónico.

Asegúrate de proporcionar los datos correctos para que la aplicación pueda utilizar el servicio de correo electrónico sin problemas.

Recuerda que debes completar los valores correspondientes en el archivo ".env"

## Uso

Una vez realizadas las configuraciones anteriores, puedes arrancar el servidor utilizando el siguiente comando:
`npm run dev`
