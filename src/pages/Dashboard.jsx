import { useEffect, useState } from "react";
import axios from "../api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import "../styles/Dashboard.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Dashboard = () => {
  const [wardrobeData, setWardrobeData] = useState([]);
  const [stats, setStats] = useState({
    totalItems: 0,
    totalSpent: 0,
    categories: {},
    genderDistribution: {},
    usageDistribution: {},
    purchaseTrends: [],
    latestItems: [],
  });

  useEffect(() => {
    const fetchWardrobeData = async () => {
      try {
        const response = await axios.get("/wardrobe");
        const wardrobe = response.data.wardrobe;

        // Compute stats
        const totalItems = wardrobe.length;
        const totalSpent = wardrobe.reduce((sum, item) => sum + (item.price || 0), 0);

        // Category breakdown
        const categories = wardrobe.reduce((acc, item) => {
          acc[item.masterCategory] = (acc[item.masterCategory] || 0) + 1;
          return acc;
        }, {});

        // Gender breakdown
        const genderDistribution = wardrobe.reduce((acc, item) => {
          acc[item.gender] = (acc[item.gender] || 0) + 1;
          return acc;
        }, {});

        // Usage breakdown
        const usageDistribution = wardrobe.reduce((acc, item) => {
          acc[item.usagetype] = (acc[item.usagetype] || 0) + 1;
          return acc;
        }, {});

        // Purchase trends (date-based)
        const purchaseTrends = wardrobe.reduce((acc, item) => {
          if (item.purchaseDate) {
            const date = item.purchaseDate; // Keeping the date as is
            acc[date] = (acc[date] || 0) + 1;
          }
          return acc;
        }, {});
        const purchaseTrendData = Object.keys(purchaseTrends).map((date) => ({
          date,
          count: purchaseTrends[date],
        }));

        const latestItems = wardrobe.slice(-5).reverse();

        setWardrobeData(wardrobe);
        setStats({
          totalItems,
          totalSpent,
          categories,
          genderDistribution,
          usageDistribution,
          purchaseTrends: purchaseTrendData,
          latestItems,
        });
      } catch (error) {
        console.error("Error fetching wardrobe data:", error);
      }
    };

    fetchWardrobeData();
  }, []);

  // Prepare data for charts
  const categoryChartData = Object.keys(stats.categories).map((key) => ({
    category: key,
    count: stats.categories[key],
  }));

  const genderChartData = Object.keys(stats.genderDistribution).map((key) => ({
    name: key,
    value: stats.genderDistribution[key],
  }));

  const usageChartData = Object.keys(stats.usageDistribution).map((key) => ({
    name: key,
    value: stats.usageDistribution[key],
  }));

  // Function to download CSV
  const downloadCSV = () => {
    if (wardrobeData.length === 0) return;

    // Filter out imageUrl from the data
    const dataWithoutImages = wardrobeData.map(({ imageUrl, ...rest }) => rest);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      Object.keys(dataWithoutImages[0]).join(",") + // Header row
      "\n" +
      dataWithoutImages.map((row) => Object.values(row).join(",")).join("\n"); // Data rows

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "wardrobe_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Wardrobe Dashboard</h1>
        <button className="download-btn" onClick={downloadCSV}>
          Download CSV
        </button>
      </header>

      {/* Statistics */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <h2>Total Items</h2>
          <p>{stats.totalItems}</p>
        </div>
        <div className="stat-card">
          <h2>Total Spent</h2>
          <p>${stats.totalSpent.toFixed(2)}</p>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="dashboard-chart">
        <h2>Category Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryChartData}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gender Distribution */}
      <div className="dashboard-chart">
        <h2>Gender Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={genderChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {genderChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Usage Distribution */}
      <div className="dashboard-chart">
        <h2>Usage Type Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={usageChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#82ca9d"
              label
            />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Purchase Trends */}
      <div className="dashboard-chart">
        <h2>Purchase Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats.purchaseTrends}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Latest Items */}
      <div className="dashboard-table">
        <h2>Latest Items</h2>
        <table>
          <thead>
            <tr>
              <th>Article</th>
              <th>Category</th>
              <th>Season</th>
              <th>Price</th>
              <th>Purchase Date</th>
            </tr>
          </thead>
          <tbody>
            {stats.latestItems.map((item) => (
              <tr key={item.id}>
                <td>{item.articleType}</td>
                <td>{item.masterCategory}</td>
                <td>{item.season}</td>
                <td>${item.price ? item.price.toFixed(2) : "N/A"}</td>
                <td>{item.purchaseDate || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
