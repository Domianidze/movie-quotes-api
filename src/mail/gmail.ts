import path from 'path'

import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'

const gmailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
})

gmailTransport.use(
  'compile',
  hbs({
    viewEngine: {
      extname: '.handlebars',
      partialsDir: path.join(`${__dirname}/views/`),
      defaultLayout: false,
    },
    viewPath: path.join(`${__dirname}/views/`),
    extName: '.handlebars',
  })
)

export default gmailTransport
