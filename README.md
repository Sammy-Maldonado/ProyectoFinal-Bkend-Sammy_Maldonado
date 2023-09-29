# e-commerce Programa-T

Este proyecto fue creado co NodeJS v18.15.0 y express v4.18.2.

## IMPORTANTE

Para la correcta ejecución de esta aplicación, se recomienda desactivar cualquier tipo de antivirus durante todo el proceso, ya que al momento de enviar correos electronicos, puede que la app sea bloqueada por este, entorpeciendo la experiencia de compra del usuario.

Hay un pequeño detalle en el logout en el cual intentamos dilucidar con el profesor la razón de porqué cuando se intenta desloguear al usuario en el proyecto deployado este hace el proceso de deslogueo pero posteriormente se recupera la cookie cuando se redirecciona a home. Lo revisamos detenidamente e incluso cambie la estrategia de peticiones de mi frontend de fetch a axios, logrando el mismo resultado. Este detalle solo ocurre cuando el proyecto esta deployado y no ocurre cuando se ejecuta la app de manera local,  Concluimos que puede ser algo externo referente a render, por lo cual, la única forma de desloguear al usuario de momento es eliminando la cookie de manera manual.

## Descripción

"Programa-T" es una plataforma de comercio electrónico que permite a los usuarios comprar y promocionar cursos en línea. Este repositorio contiene el código fuente del backend de la aplicación, que gestiona la lógica de negocio, la base de datos y la comunicación con el frontend.

## Inicio rápido

### Clona este repositorio en tu máquina local.
git clone https://github.com/Sammy-Maldonado/ProyectoFinal-Bkend-Sammy_Maldonado.git
cd ProyectoFinal-Bkend-Sammy_Maldonado

### Instala las dependencias utilizando npm
npm install

### Inicia el servidor en modo de desarrollo.
npm run dev

## Rutas API
El backend proporciona las siguientes rutas API:

/api/carts: Maneja la gestión de carritos de compra.
/api/orders: Administra la creación y gestión de pedidos.
/api/products: Gestiona la información de productos disponibles.
/api/sessions: Maneja las sesiones de usuario y la autenticación.
/api/users: Administra los perfiles de usuario y sus roles.
/api/views: Proporciona rutas relacionadas con las vistas y la interfaz de usuario.

## Tecnologías Utilizadas
Para el desarrollo de este e-commerce se integraron conocimientos extensos en el backend. Algunas de las tecnologías y conceptos más relevantes que se utilizaron fueron:

- Programación sincrónica y asincrónica
- Administrador de paquetes NPM
- Servidores web
- Express avanzado
- Router y Multer
- Websockets
- MongoDB avanzado, CRUD y BD
- Mongoose
- Cookies, Sessions & Storages
- Autorización y autenticación con Passport y JWT
- Ruteo avanzado
- Arquitectura avanzada de un servidor, diseño y persistencias
- Conexión con frontend externo (React JS)
- Mailing y mensajería
- Test y Mocks con "mocha y chai"
- Logging con "winston"
- Clusters y escalabilidad
- Orquestación de contenedores con Docker
- Seguridad en el servidor
- Documentación de API con "Swagger"
- Testing unitarios con Mocha y Chai
- Deploy usando "render.com"

## Licencia
Todos los derechos reservados © 2023 Sammy Maldonado Prado

Este proyecto y su código fuente están protegidos por las leyes de derechos de autor. No se permite la reproducción, distribución o modificación sin el permiso expreso por escrito del autor, Sammy Maldonado.

## Contacto
Si tienes alguna pregunta, problema, o deseas que colaboremos juntos en un trabajo, no dudes en ponerte en contacto conmigo:

- Correo electrónico: [sammy.maldodev@gmail.com](mailto:sammy.maldodev@gmail.com)

¡Gracias por tu interés en el proyecto "Programa-T"!