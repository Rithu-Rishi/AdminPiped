import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spinner } from "react-bootstrap";
import {
  AddCard as AddCardIcon,
  FamilyRestroom as FamilyRestroomIcon,
  SupervisorAccount as SupervisorAccountIcon,
} from "@mui/icons-material";
import { getDashboardData } from "../services/dashboardApi";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await getDashboardData();
      setDashboardData(response);
    } catch (err) {
      console.error("Failed to fetch dashboard data.");
    }
    setLoading(false);
  };

   // Function to get dynamic growth color
   const getGrowthColor = (growth) => {
    if (growth > 0) return "text-success"; // Green for positive
    if (growth < 0) return "text-danger";  // Red for negative
    return "text-dark"; // Black for neutral
  };

  return (
    <>
    {loading ? (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    ) : (
      <Row>
        {/* Total Parents */}
        <Col>
          <Card className="Cards border_success mb-3">
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-2 bg-opacity-25 bg-success p-2 me-3">
                  <span className="text-success">
                    <FamilyRestroomIcon />
                  </span>
                </div>
                <h4 className="mb-0">{dashboardData?.parents.count}</h4>
              </div>
              <Card.Title>Total Parents</Card.Title>
              <Card.Text>
                <span className={`fw-600 ${getGrowthColor(dashboardData?.parents.growth.value)}`}>
                  {dashboardData?.parents.growth.value}%
                </span>{" "}
                last month Joined
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Total Children */}
        <Col>
          <Card className="Cards border_primary mb-3">
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-2 bg-opacity-25 bg-primary p-2 me-3">
                  <span className="text-primary">
                    <SupervisorAccountIcon />
                  </span>
                </div>
                <h4 className="mb-0">{dashboardData?.children.count}</h4>
              </div>
              <Card.Title>Total Children</Card.Title>
              <Card.Text>
                <span className={`fw-600 ${getGrowthColor(dashboardData?.children.growth.value)}`}>
                  {dashboardData?.children.growth.value}%
                </span>{" "}
                last month Joined
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Total Slots */}
        <Col>
          <Card className="Cards border_danger mb-3">
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-2 bg-opacity-25 bg-danger p-2 me-3">
                  <span className="text-danger">
                    <AddCardIcon />
                  </span>
                </div>
                <h4 className="mb-0">{dashboardData?.total_slots.count}</h4>
              </div>
              <Card.Title>Total Slots</Card.Title>
              <Card.Text>
                <span className={`fw-600 ${getGrowthColor(dashboardData?.total_slots.growth.value)}`}>
                  {dashboardData?.total_slots.growth.value}%
                </span>{" "}
                last month bookings
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Booked Slots */}
        <Col>
          <Card className="Cards border_info mb-3">
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-2 bg-opacity-25 bg-info p-2 me-3">
                  <span className="text-info">
                    <AddCardIcon />
                  </span>
                </div>
                <h4 className="mb-0">{dashboardData?.booked_slots.count}</h4>
              </div>
              <Card.Title>Booked Slots</Card.Title>
              <Card.Text>
                <span className={`fw-600 ${getGrowthColor(dashboardData?.booked_slots.growth.value)}`}>
                  {dashboardData?.booked_slots.growth.value}%
                </span>{" "}
                last month bookings
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    )}
  </>
  );
}

export default Dashboard;
