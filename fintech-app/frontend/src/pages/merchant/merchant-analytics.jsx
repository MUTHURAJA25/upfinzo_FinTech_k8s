import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import Wrapper from "@/pages/layouts/Wrapper";
import generateInputs from "@/components/generateInputs";

// ----------------------------------------------
// Fake Data Generator
// ----------------------------------------------
const createSampleAnalytics = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const daysCount = Math.max(
    Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1,
    1
  );

  const result = [];

  for (let i = 0; i < daysCount; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    const revenue = Math.round(3000 + Math.random() * 9000);
    const refunds = Math.round(revenue * (0.01 + Math.random() * 0.08));
    const success = Math.floor(200 + Math.random() * 900);
    const failed = Math.floor(10 + Math.random() * 40);

    result.push({
      date: date.toISOString().slice(0, 10),
      revenue,
      refunds,
      refundRatio: +(refunds / revenue).toFixed(3),
      success,
      failed,
      totalTransactions: success + failed,
      successRate: +(success / (success + failed)).toFixed(3),
      netRevenue: revenue - refunds,
    });
  }
  return result;
};

// ----------------------------------------------
// Component
// ----------------------------------------------
export default function MerchantAnalytics({ initialStart, initialEnd }) {
  const today = new Date();
  const defaultEndDate = initialEnd || today.toISOString().slice(0, 10);
  const defaultStartDate =
    initialStart ||
    new Date(today.getFullYear(), today.getMonth(), 1)
      .toISOString()
      .slice(0, 10);

  const [filter, setFilter] = useState({
    startDate: defaultStartDate,
    endDate: defaultEndDate,
  });

  const [errors, setErrors] = useState({});
  const [data, setData] = useState(() =>
    createSampleAnalytics(defaultStartDate, defaultEndDate)
  );

  const [loading, setLoading] = useState(false);

  // ----------------------------------------------
  // Handlers
  // ----------------------------------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateFilters = () => {
    const newErrors = {};

    if (!filter.startDate) newErrors.startDate = "Start date required";
    if (!filter.endDate) newErrors.endDate = "End date required";

    if (filter.startDate && filter.endDate && filter.startDate > filter.endDate) {
      newErrors.endDate = "End date must be after Start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const applyFilters = async () => {
    if (!validateFilters()) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 250));

    setData(createSampleAnalytics(filter.startDate, filter.endDate));
    setLoading(false);
  };

  // ----------------------------------------------
  // CSV Export
  // ----------------------------------------------
  const exportToCSV = () => {
    const headers = [
      "date",
      "revenue",
      "refunds",
      "refundRatio",
      "success",
      "failed",
      "totalTransactions",
      "successRate",
      "netRevenue",
    ];

    const rows = data.map((row) => headers.map((h) => row[h]));
    const csvData = [headers, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `merchant_analytics_${filter.startDate}_${filter.endDate}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  // ----------------------------------------------
  return (
    <Wrapper page="Merchant Analytics">
      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div
          className="card-header py-2 px-4 d-flex justify-content-between align-items-center"
          style={{ background: "#eef3ff" }}
        >
          <div className="fs-5 fw-semibold text-primary">
            <i className="ri-pie-chart-2-line me-2"></i>
            Merchant Analytics
          </div>

          <button onClick={exportToCSV} className="btn btn-outline-primary">
            Export CSV
          </button>
        </div>

        <div className="card-body p-4">
          {/* Filters */}
          <div className="card shadow-sm p-3 mb-4">
            <div className="row g-3 align-items-end">
              {["startDate", "endDate"].map((field) => (
                <div className="col-auto" key={field}>
                  <generateInputs
                    mapField={{
                      key: field,
                      name: field,
                      id: field,
                      type: "date",
                      label: field === "startDate" ? "Start Date" : "End Date",
                      value: filter[field],
                      onChange: handleInputChange,
                      error: errors[field],
                      required: true,
                    }}
                  />
                </div>
              ))}

              <div className="col-auto">
                <button
                  onClick={applyFilters}
                  disabled={loading}
                  className="btn btn-primary px-4"
                >
                  {loading ? "Loading..." : "Apply"}
                </button>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="row g-4 mb-4">
            {/* Revenue Chart */}
            <div className="col-md-6">
              <div className="card p-3 shadow-sm" style={{ height: 300 }}>
                <h6 className="fw-semibold mb-2">Revenue Trend</h6>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#0d6efd"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Refund Chart */}
            <div className="col-md-6">
              <div className="card p-3 shadow-sm" style={{ height: 300 }}>
                <h6 className="fw-semibold mb-2">Refunds & Ratio</h6>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="refunds" fill="#198754" yAxisId="left" />
                    <Line
                      type="monotone"
                      dataKey="refundRatio"
                      stroke="#dc3545"
                      yAxisId="right"
                      dot={false}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="card p-3 shadow-sm">
            <h6 className="fw-semibold mb-3">Detailed Data Table</h6>

            <div className="table-responsive" style={{ maxHeight: 320 }}>
              <table className="table table-sm table-bordered align-middle">
                <thead className="table-light sticky-top">
                  <tr>
                    <th className="text-center">S.No</th>
                    <th>Date</th>
                    <th>Revenue</th>
                    <th>Refunds</th>
                    <th>Refund Ratio</th>
                    <th>Success Txn</th>
                    <th>Failed Txn</th>
                    <th>Total Txn</th>
                    <th>Success Rate</th>
                    <th>Net Revenue</th>
                  </tr>
                </thead>

                <tbody>
                  {data.map((row, index) => (
                    <tr key={row.date}>
                      <td className="text-center">{index + 1}</td>
                      <td>{row.date}</td>
                      <td>₹{row.revenue}</td>
                      <td>₹{row.refunds}</td>
                      <td>{row.refundRatio}</td>
                      <td>{row.success}</td>
                      <td>{row.failed}</td>
                      <td>{row.totalTransactions}</td>
                      <td>{row.successRate}</td>
                      <td>₹{row.netRevenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
