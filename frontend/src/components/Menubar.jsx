import PropTypes from 'prop-types'
import { Navbar, Container, Nav, Button } from 'react-bootstrap'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { BoxArrowRight } from 'react-bootstrap-icons'

const Menubar = ({ onLogout, user }) => {
  return (
    <Navbar className='border border-top-0 rounded-bottom mb-3'>
      <Container>
        <Navbar.Brand href='#home'>FSO</Navbar.Brand>
        <Nav className='me-auto'>
          {user ? (
            <span className='text-success'>Logged in: {user?.name}</span>
          ) : (
            <span className='text-danger'>Not logged in</span>
          )}
        </Nav>
        {user ? (
          <OverlayTrigger
            placement='left'
            overlay={<Tooltip id='tooltip'>Logout</Tooltip>}
          >
            <Button id='logout' variant='info' onClick={onLogout}>
              <BoxArrowRight />
            </Button>
          </OverlayTrigger>
        ) : null}
      </Container>
    </Navbar>
  )
}

Menubar.propTypes = {
  onLogout: PropTypes.func.isRequired,
  user: PropTypes.object,
}

export default Menubar
