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

export const sendConfirmAccountMail = async (
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
      filename: 'confirm-account-icon',
      path: path.join(`${__dirname}/views/icons/confirm-account.png`),
      cid: 'confirm-account-icon',
    },
  ]

  return sendMail(
    to,
    'Confirm Account',
    `confirm-account-${locale || 'en'}`,
    context,
    attachments
  )
}
