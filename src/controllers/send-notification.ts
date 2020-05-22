import { InstanceDocument } from 'models/Instance'
import { User } from 'models/User'
import { settings } from 'settings/settings'
import { transport } from 'init/mailer'

export const sendNotification: sendNotification = async ({ text, subject, instance }) => {
  const user = await User.findById(instance.owner.id)
  const email = user.email

  if (!email) {
    throw new Error(`Could not get an email for UID${instance.owner.id}`)
  }

  return transport.sendMail({
    from: settings.emailFrom,
    to: email,
    subject,
    text
  })
}

type sendNotification = ({
  text,
  subject
}: {
  text: string,
  subject: string,
  instance: InstanceDocument,
}) => Promise<void>
