import React from 'react';
import { Card, Row, Col } from 'react-bootstrap'
import { AddCard as AddCardIcon, FamilyRestroom as FamilyRestroomIcon, SupervisorAccount as SupervisorAccountIcon } from '@mui/icons-material';

const Dashboard = () => {

  return (
    <>
      {/* Table */}
      <Row>
        <Col>
          <Card className='Cards border_success'>
            <Card.Body>
              <div class="d-flex align-items-center mb-3">
                <div class="rounded-2 bg-opacity-25 bg-success p-2 me-3">
                  <span class="text-success"><FamilyRestroomIcon /></span>
                </div>
                <h4 class="mb-0">30</h4>
              </div>
              <Card.Title>Total Parents</Card.Title>
              <Card.Text>
                <span className='text-black fw-600'>+09</span> last week Joined
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className='Cards border_primary'>
            <Card.Body>
              <div class="d-flex align-items-center mb-3">
                <div class="rounded-2 bg-opacity-25 bg-primary p-2 me-3">
                  <span class="text-primary"><SupervisorAccountIcon /></span>
                </div>
                <h4 class="mb-0">42</h4>
              </div>
              <Card.Title>Total childrens</Card.Title>
              <Card.Text>
                <span className='text-black fw-600'>+18</span> last week Joined
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className='Cards border_danger'>
            <Card.Body>
              <div class="d-flex align-items-center mb-3">
                <div class="rounded-2 bg-opacity-25 bg-danger p-2 me-3">
                  <span class="text-danger"><AddCardIcon /></span>
                </div>
                <h4 class="mb-0">42</h4>
              </div>
              <Card.Title>Total Slots</Card.Title>
              <Card.Text>
                <span className='text-black fw-600'>+20</span> last week bookings
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className='Cards border_info'>
            <Card.Body>
              <div class="d-flex align-items-center mb-3">
                <div class="rounded-2 bg-opacity-25 bg-info p-2 me-3">
                  <span class="text-info"><AddCardIcon /></span>
                </div>
                <h4 class="mb-0">12</h4>
              </div>
              <Card.Title>Available Slots</Card.Title>
              <Card.Text>
                <span className='text-black fw-600'>+30</span> last week bookings
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Dashboard;
