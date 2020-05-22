import nodemailer from 'nodemailer'
import { settings } from 'settings/settings'

export const transport = nodemailer.createTransport(settings.smtpurl)
