import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import {
  AddCard as AddCardIcon,
  FamilyRestroom as FamilyRestroomIcon,
  SupervisorAccount as SupervisorAccountIcon,
} from "@mui/icons-material";
import Spinner from "../includes/Spinner";
import { getDashboardData } from "../services/dashboardApi";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, ArcElement, BarElement, Title, Tooltip, Legend);

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

  // Prepare data for the chart
  const chartData = {
    labels: dashboardData?.monthly_revenue.map((item) => item.month) || [],
    datasets: [
      {
        label: "Monthly Revenue",
        data: dashboardData?.monthly_revenue.map((item) => parseFloat(item.revenue)) || [],
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Bar color
        borderColor: "rgba(75, 192, 192, 1)", // Border color
        borderWidth: 1, // Border width;
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "top",
        display: false,
      },
      title: {
        display: true,
        text: "Monthly Revenue",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Months",
        },
      },
      y: {
        title: {
          display: true,
          text: "Revenue",
        },
        beginAtZero: true, // Start y-axis at 0
      },
    },
  };

  // Prepare data for the Doughnut Chart
  const doughnutData = {
    labels: dashboardData?.program_wise_subscriptions.map((item) => item.program_name) || [],
    datasets: [
      {
        label: "Program Subscriptions",
        data: dashboardData?.program_wise_subscriptions.map((item) => item.total_subscriptions) || [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)", // Red
          "rgba(54, 162, 235, 0.6)", // Blue
          "rgba(255, 206, 86, 0.6)", // Yellow
          "rgba(75, 192, 192, 0.6)", // Green
          "rgba(153, 102, 255, 0.6)", // Purple
          "rgba(255, 159, 64, 0.6)", // Orange
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const centerTextPlugin = {
    id: "centerText",
    beforeDraw(chart) {
      const { width } = chart;
      const { height } = chart;
      const ctx = chart.ctx;
      ctx.restore();

      const totalSubscriptions = dashboardData?.program_wise_subscriptions.reduce(
        (sum, item) => sum + item.total_subscriptions,
        0
      );

      const fontSize = (height / 100).toFixed(2);
      ctx.font = `${fontSize}em sans-serif`;
      ctx.textBaseline = "middle";

      const text = totalSubscriptions || "0";
      const textX = Math.round((width - ctx.measureText(text).width) / 2);
      const textY = height / 2;

      ctx.fillText(text, textX, textY);
      ctx.save();
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Program-wise Subscriptions",
      },
    },
  };


  return (
    <>
      {loading ? (
        <Spinner loading={loading} />
      ) : (
        <>
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
          {/* Line Chart */}
          <Row className="mt-4">
            <Col md="8">
              <Card>
                <Card.Body className="py-2">
                  <Bar data={chartData} options={chartOptions} />
                </Card.Body>
              </Card>
            </Col>
            <Col md="4">
              <Card>
                <Card.Body className="px-2 py-3">
                  <Doughnut data={doughnutData} options={doughnutOptions} plugins={[centerTextPlugin]} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
}

export default Dashboard;
