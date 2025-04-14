import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spinner } from "react-bootstrap";
import {
  AddCard as AddCardIcon,
  FamilyRestroom as FamilyRestroomIcon,
  SupervisorAccount as SupervisorAccountIcon,
} from "@mui/icons-material";
import { getDashboardData } from "../services/dashboardApi";
import TPPLoadingSign from "../assets/TPPLoadingSign-ezgif.com-video-to-gif-converter.gif";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await getDashboardData();
      console.log("dashboard", response);
      setDashboardData(response.data);
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
          <img src={TPPLoadingSign} alt="loader"/>
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
                  <h4 className="mb-0">{dashboardData?.total_parents.count}</h4>
                </div>
                <Card.Title>Parents</Card.Title>
                <Card.Text>
                  <span className={`fw-600 ${getGrowthColor(dashboardData?.total_parents.percentage.value)}`}>
                    {dashboardData?.total_parents.percentage.value}%
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
                  <h4 className="mb-0">{dashboardData?.total_children.count}</h4>
                </div>
                <Card.Title>Children</Card.Title>
                <Card.Text>
                  <span className={`fw-600 ${getGrowthColor(dashboardData?.total_children.percentage.value)}`}>
                    {dashboardData?.total_children.percentage.value}%
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
                  <h4 className="mb-0">{dashboardData?.program_subscriptions.count}</h4>
                </div>
                <Card.Title>Program Subscriptions</Card.Title>
                <Card.Text>
                  <span className={`fw-600 ${getGrowthColor(dashboardData?.program_subscriptions.percentage.value)}`}>
                    {dashboardData?.program_subscriptions.percentage.value}%
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
                  <h4 className="mb-0">{dashboardData?.total_amount.amount}</h4>
                </div>
                <Card.Title>Revenue</Card.Title>
                <Card.Text>
                  <span className={`fw-600 ${getGrowthColor(dashboardData?.total_amount.percentage.value)}`}>
                    {dashboardData?.total_amount.percentage.value}%
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
