import PropTypes from 'prop-types'
import Alert from 'react-bootstrap/Alert'

const Notification = ({ notification, onClose }) => (
  <Alert
    id='notification'
    variant={notification?.type}
    show={!!notification?.show}
    dismissible
    className='notification fixed-top w-auto m-3'
    onClose={onClose}
  >
    {notification?.title ? (
      <Alert.Heading>{notification.title}</Alert.Heading>
    ) : null}
    {notification?.messages?.length ? (
      <ul className='mb-0'>
        {notification.messages.map((message, i) => (
          <li key={i}>{message}</li>
        ))}
      </ul>
    ) : null}
  </Alert>
)

Notification.propTypes = {
  notification: PropTypes.object,
  onClose: PropTypes.func.isRequired,
}

export default Notification
