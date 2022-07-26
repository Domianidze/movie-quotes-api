import path from 'path'

import gmailTransport from './gmail.js'

const sendMail = (
  to: string,
  subject: string,
  template: string,
  context: { username: string; link: string },
  attachments: {
    filename: string
    path: string
    cid: string
  }[]
) => {
  const options = {
    to,
    subject,
    from: process.env.GMAIL_USER,
    template,
    context,
    attachments,
  }

  return gmailTransport.sendMail(options)
}

export const sendVerifyAccountEmail = async (
  to: string,
  token: string,
  username: string,
  backLink: string,
  locale: string
) => {
  const context = {
    username,
    link: `${backLink}/${token}`,
  }

  const attachments = [
    {
      filename: 'email-icon',
      path: path.join(`${__dirname}/views/icons/email-icon.png`),
      cid: 'email-icon',
    },
  ]

  return sendMail(
    to,
    'Verify Account',
    `verify-account-${locale || 'en'}`,
    context,
    attachments
  )
}

export const sendPasswordRecoveryEmail = async (
  to: string,
  token: string,
  username: string,
  backLink: string,
  locale: string
) => {
  const context = {
    username,
    link: `${backLink}/${token}`,
  }

  const attachments = [
    {
      filename: 'email-icon',
      path: path.join(`${__dirname}/views/icons/email-icon.png`),
      cid: 'email-icon',
    },
  ]

  return sendMail(
    to,
    'Recover Password',
    `recover-password-${locale || 'en'}`,
    context,
    attachments
  )
}
