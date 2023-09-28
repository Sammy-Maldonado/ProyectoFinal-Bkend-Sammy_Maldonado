import __dirname from "../utils.js"

export default {
  welcome: {
    subject: "¡Bienvenido!",
    attachments: [
      {
        filename: 'banner.png',
        path: `${__dirname}/public/images/hello-world.png`,
        cid:"hello-world"
      }
    ]
  },
  restore: {
    subject: "Restaurar contraseña",
    attachments: [
      {
        filename: 'banner.png',
        path: `${__dirname}/public/images/hello-world.png`,
        cid:"hello-world"
      }
    ]
  },
  ticket: {
    subject: "ticket de compra",
    attachments: [
      {
        filename: 'banner.png',
        path: `${__dirname}/public/images/hello-world.png`,
        cid:"hello-world"
      }
    ]
  }
}