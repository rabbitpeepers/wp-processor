
const checkForScheduled = (): void => {
  console.log('Checking for scheduled')
}

/**
 * Watch if there's any scheduled task
 * @returns {function} Cancel watching
 */
export const watchScheduled = (): () => void => {
  const timer = setInterval(checkForScheduled, 1000)
  return (): void => clearInterval(timer)
}
