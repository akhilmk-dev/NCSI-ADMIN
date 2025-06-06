import React from "react"
import { Container, Row, Col } from "reactstrap"

const Footer = () => {
  return (
    <React.Fragment>
      <footer className="footer" style={{backgroundColor:"white"}}>
        <Container fluid={true}>
          <Row>
            <div className="col-12">
            National Centre For Statistics & Information © 2025 - The content of this website is licensed under the Open Government License - Sultanate of Oman.
            </div>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  )
}

export default Footer
