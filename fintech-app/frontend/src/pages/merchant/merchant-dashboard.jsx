import React, { useMemo, useState } from "react";
import Wrapper from "@/pages/layouts/Wrapper";
import GenerateInputs from "@/components/generateInputs";

/* ---------------------- KPI Card ---------------------- */
const KpiCard = ({ label, value, icon, tint }) => (
  <div className="col-md-4">
    <div className="card shadow-sm border-0 rounded-3 h-100">
      <div className="card-body d-flex align-items-center gap-3">
        <div
          className="rounded-circle d-flex align-items-center justify-content-center"
          style={{ width: 48, height: 48, background: `${tint}22` }}
        >
          <i className={`${icon} fs-4`} style={{ color: tint }} />
        </div>
        <div>
          <div className="text-muted small mb-1">{label}</div>
          <div className="fw-semibold">{value}</div>
        </div>
      </div>
    </div>
  </div>
);

/* ---------------------- Badge Component ---------------------- */
const Badge = ({ value, kind = "status" }) => {
  if (kind === "status") {
    if (value === "Success") return <span className="badge bg-success">{value}</span>;
    if (value === "Failed") return <span className="badge bg-danger">{value}</span>;
    return <span className="badge bg-warning text-dark">{value}</span>;
  }

  if (kind === "type") {
    if (value === "Pay-in")
      return <span className="badge" style={{ backgroundColor: "#0d6efd", color: "#fff" }}>Pay-in</span>;

    if (value === "Payout")
      return <span className="badge" style={{ backgroundColor: "#20c997", color: "#fff" }}>Payout</span>;
  }

  return <span className="badge bg-info text-dark">{value}</span>;
};

/* ---------------------- SVG Line Chart ---------------------- */
function LineSVGChart({ data = [], height = 260, padding = { left: 40, right: 20, top: 20, bottom: 30 } }) {
  if (!data.length) return <div className="p-3 text-center text-muted">No Data</div>;

  const viewBoxWidth = 720;
  const width = viewBoxWidth;
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const [hover, setHover] = useState(null);
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);

  const { points, pathD, areaD } = useMemo(() => {
    const count = data.length;
    if (!count) return { points: [], pathD: "", areaD: "" };

    const pts = data.map((d, i) => {
      const x = padding.left + (i / Math.max(1, count - 1)) * innerW;
      const y = padding.top + innerH - (d.revenue / maxRevenue) * innerH;
      return { x, y, label: d.date, value: d.revenue };
    });

    const pLine = pts.map((p) => `${p.x},${p.y}`).join(" L ");
    const lineD = `M ${pLine}`;

    const first = pts[0];
    const last = pts[pts.length - 1];
    const bottomY = padding.top + innerH;

    const areaD =
      pts.length > 1
        ? `M ${first.x},${bottomY} L ${pts.map((p) => `${p.x},${p.y}`).join(" L ")} L ${last.x},${bottomY} Z`
        : "";

    return { points: pts, pathD: lineD, areaD };
  }, [data, maxRevenue, innerH, innerW, padding]);

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;

    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    let nearest = null;
    let minDist = Infinity;

    points.forEach((p) => {
      const dist = (p.x - mouseX) ** 2 + (p.y - mouseY) ** 2;
      if (dist < minDist) {
        minDist = dist;
        nearest = p;
      }
    });

    if (nearest) {
      setHover({ ...nearest, mouseX: nearest.x / scaleX, mouseY: nearest.y / scaleY });
    }
  };

  return (
    <div className="w-100" style={{ position: "relative" }}>
      {hover && (
        <div
          style={{
            position: "absolute",
            top: hover.mouseY + 10,
            left: hover.mouseX + 10,
            background: "#111827",
            color: "white",
            padding: "6px 10px",
            borderRadius: 8,
            fontSize: 12,
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          <div className="small text-muted">{hover.label}</div>
          <strong>₹{hover.value.toLocaleString()}</strong>
        </div>
      )}

      <svg
        onMouseMove={handleMove}
        onMouseLeave={() => setHover(null)}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        style={{ width: "100%", height }}
      >
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
          const y = padding.top + innerH * t;
          return <line key={i} x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke="#e5e7eb" />;
        })}

        {areaD && <path d={areaD} fill="#d1fae5" opacity="0.9" />}
        {pathD && <path d={pathD} fill="none" stroke="#16a34a" strokeWidth="2.4" />}
        {points.map((pt, idx) => (
          <circle key={idx} cx={pt.x} cy={pt.y} r="4.5" fill="#fff" stroke="#16a34a" strokeWidth="2" />
        ))}

        {hover && <circle cx={hover.x} cy={hover.y} r="7" fill="#16a34a" stroke="#fff" strokeWidth="2" />}

        {points.map((pt, idx) => (
          <text key={idx} x={pt.x} y={height - 8} textAnchor="middle" fontSize="11" fill="#6b7280">
            {pt.label}
          </text>
        ))}
      </svg>
    </div>
  );
}

/* ---------------------- Donut Chart ---------------------- */
function DonutWithTooltip({ transactions = [] }) {
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, label: "", value: "" });

  const success = transactions.filter((t) => t.status === "Success").length;
  const pending = transactions.filter((t) => t.status === "Pending").length;
  const failed = transactions.filter((t) => t.status === "Failed").length;

  const total = success + pending + failed;
  const radius = 70;
  const center = 80;

  const part = (val) => (total ? (val / total) * 360 : 0);

  const arcPath = (start, end) => {
    const x1 = center + radius * Math.cos((Math.PI / 180) * start);
    const y1 = center + radius * Math.sin((Math.PI / 180) * start);
    const x2 = center + radius * Math.cos((Math.PI / 180) * end);
    const y2 = center + radius * Math.sin((Math.PI / 180) * end);
    const largeArc = end - start > 180 ? 1 : 0;
    return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  const showTip = (e, label, count, deg) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      show: true,
      x: e.clientX - rect.left + 15,
      y: e.clientY - rect.top + 15,
      label,
      value: `${count} (${Math.round((deg / 360) * 100)}%)`,
    });
  };

  return (
    <div className="card shadow-sm border-0 rounded-4 h-100">
      <div className="card-body text-center p-4">
        <h5 className="fw-semibold mb-3">Status Breakdown</h5>

        <div style={{ position: "relative", width: 160, margin: "0 auto" }}>
          <svg width="160" height="160">
            <path
              d={arcPath(0, part(success))}
              fill="#28a745"
              onMouseMove={(e) => showTip(e, "Success", success, part(success))}
              onMouseLeave={() => setTooltip({ ...tooltip, show: false })}
            />
            <path
              d={arcPath(part(success), part(success) + part(pending))}
              fill="#ffc107"
              onMouseMove={(e) => showTip(e, "Pending", pending, part(pending))}
              onMouseLeave={() => setTooltip({ ...tooltip, show: false })}
            />
            <path
              d={arcPath(part(success) + part(pending), 360)}
              fill="#dc3545"
              onMouseMove={(e) => showTip(e, "Failed", failed, part(failed))}
              onMouseLeave={() => setTooltip({ ...tooltip, show: false })}
            />

            <circle cx="80" cy="80" r="40" fill="#fff" />

            <text x="80" y="86" textAnchor="middle" fontSize="18" fontWeight="700">
              {Math.round((success / total) * 100) || 0}%
            </text>
          </svg>

          {tooltip.show && (
            <div
              style={{
                position: "absolute",
                top: tooltip.y,
                left: tooltip.x,
                background: "#333",
                color: "#fff",
                padding: "6px 10px",
                borderRadius: 6,
                fontSize: 12,
                pointerEvents: "none",
              }}
            >
              <strong>{tooltip.label}</strong>: {tooltip.value}
            </div>
          )}
        </div>

        <div className="d-flex justify-content-center gap-3 mt-3 small">
          <div>
            <div><span className="badge bg-success me-2">&nbsp;</span>Success ({success})</div>
            <div><span className="badge bg-warning text-dark me-2">&nbsp;</span>Pending ({pending})</div>
            <div><span className="badge bg-danger me-2">&nbsp;</span>Failed ({failed})</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------- Merchant Dashboard ---------------------- */
export default function MerchantDashboard() {
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [searchMerchant, setSearchMerchant] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [errors, setErrors] = useState({});
  const [filterData, setFilterData] = useState({});

  const defaultRevenue = [
    { date: "Mon", revenue: 1200 },
    { date: "Tue", revenue: 900 },
    { date: "Wed", revenue: 1400 },
    { date: "Thu", revenue: 1100 },
    { date: "Fri", revenue: 1700 },
  ];

  const defaultTransactions = [
    { id: 7, merchant: "Reliance Fresh", amount: 850, status: "Success", type: "Pay-in", date: "2025-02-12", time: "09:20 AM" },
    { id: 8, merchant: "Big Bazaar", amount: 430, status: "Pending", type: "Payout", date: "2025-02-12", time: "01:45 PM" },
    { id: 9, merchant: "DMart India", amount: 1560, status: "Success", type: "Pay-in", date: "2025-02-11", time: "03:10 PM" },
    { id: 10, merchant: "Tata Croma", amount: 2999, status: "Failed", type: "Payout", date: "2025-02-11", time: "05:25 PM" },
    { id: 11, merchant: "Vijay Sales", amount: 1890, status: "Success", type: "Pay-in", date: "2025-02-10", time: "12:35 PM" },
    { id: 12, merchant: "More Superstore", amount: 760, status: "Pending", type: "Payout", date: "2025-02-10", time: "02:50 PM" },
    { id: 13, merchant: "Star Bazaar", amount: 540, status: "Success", type: "Pay-in", date: "2025-02-09", time: "11:15 AM" },
    { id: 14, merchant: "Apollo Pharmacy", amount: 320, status: "Failed", type: "Pay-in", date: "2025-02-09", time: "06:40 PM" },
    { id: 15, merchant: "Spencer's Retail", amount: 920, status: "Success", type: "Payout", date: "2025-02-08", time: "08:55 AM" },
    { id: 16, merchant: "Heritage Fresh", amount: 1440, status: "Pending", type: "Pay-in", date: "2025-02-08", time: "10:30 AM" },
  ];

  const handleFilterChange = (e) => {
    if (!e?.target) return;

    const { name, value } = e.target;

    setFilterData((prev) => ({ ...prev, [name]: value }));

    switch (name) {
      case "status":
        setStatusFilter(value);
        break;
      case "type":
        setTypeFilter(value);
        break;
      case "search":
        setSearchMerchant(value);
        break;
      case "minAmount":
        setMinAmount(value);
        break;
      case "maxAmount":
        setMaxAmount(value);
        break;
      case "startDate":
        setDateFrom(value);
        break;
      case "endDate":
        setDateTo(value);
        break;
      default:
        break;
    }
  };

  const parseDateMidnight = (val) => {
    if (!val) return null;
    const [y, m, d] = val.split("-").map(Number);
    return new Date(y, m - 1, d);
  };

  const filteredTransactions = useMemo(() => {
    const from = parseDateMidnight(dateFrom);
    const to = parseDateMidnight(dateTo);

    return defaultTransactions.filter((tx) => {
      if (statusFilter && statusFilter !== "All" && tx.status !== statusFilter) return false;
      if (typeFilter && tx.type !== typeFilter) return false;
      if (searchMerchant && !tx.merchant.toLowerCase().includes(searchMerchant.toLowerCase())) return false;
      if (minAmount && tx.amount < Number(minAmount)) return false;
      if (maxAmount && tx.amount > Number(maxAmount)) return false;

      const txDate = new Date(tx.date);

      if (from && txDate < from) return false;
      if (to && txDate > new Date(to.getTime() + 86399999)) return false;

      return true;
    });
  }, [statusFilter, typeFilter, searchMerchant, minAmount, maxAmount, dateFrom, dateTo]);

  const exportCSV = () => {
    const headers = ["S.No", "Txn ID", "Merchant", "Amount", "Type", "Date", "Time", "Status"];
    const rows = filteredTransactions.map((t, i) => [
      i + 1,
      `TXN${t.id}2456`,
      t.merchant,
      t.amount,
      t.type,
      t.date,
      t.time,
      t.status,
    ]);

    const csvBody = [headers, ...rows]
      .map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF", csvBody], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();

    URL.revokeObjectURL(url);
  };

  const kpiData = [
    { label: "Total Pay-ins", value: "₹12,40,000", icon: "ri-download-cloud-line", tint: "#0d6efd" },
    { label: "Total Payouts", value: "₹7,80,000", icon: "ri-upload-cloud-line", tint: "#20c997" },
    { label: "Active Merchants", value: 32, icon: "ri-store-2-line", tint: "#6f42c1" },
  ];

  const formatAmount = (v) => (v ? `₹${Number(v).toLocaleString()}` : "₹0");

  return (
    <Wrapper page="Merchant Dashboard">
      <div className="card border-0 bg-transparent">
        <div className="card shadow-sm border-0 rounded-4 mb-4">
          <div
            className="card-header text-primary fw-semibold fs-5 py-3 d-flex align-items-center"
            style={{ background: "#f3f6ff" }}
          >
            <i className="ri-dashboard-3-line me-2 fs-4"></i>
            <span>Merchant Dashboard</span>
          </div>
        </div>

        <div className="card-body p-4">
          {/* KPI Cards */}
          <div className="row g-4 mb-4">
            {kpiData.map((k, idx) => (
              <KpiCard key={idx} {...k} />
            ))}
          </div>

          {/* Charts Section */}
          <div className="row g-4 mb-4">
            <div className="col-md-8">
              <div className="card shadow-sm border-0 rounded-4 h-100">
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between mb-3">
                    <h5 className="fw-semibold">Daily Revenue</h5>
                    <div className="small text-muted">{defaultRevenue.length} days</div>
                  </div>

                  <LineSVGChart data={defaultRevenue} height={260} />

                  <div className="d-flex justify-content-between mt-3">
                    <div className="small text-muted">Max: {formatAmount(Math.max(...defaultRevenue.map((r) => r.revenue)))}</div>
                    <div>
                      <span className="badge bg-success me-2">Revenue</span>
                      <small className="text-muted">Demo values</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Donut Chart */}
            <div className="col-md-4">
              <DonutWithTooltip transactions={defaultTransactions} />
            </div>
          </div>

          {/* Filters */}
          <div className="card shadow-sm border-0 rounded-4 p-4 mb-4">
            <div className="d-flex justify-content-between mb-3">
              <h5 className="fw-semibold">Filters</h5>

              <div>
                <button
                  className="btn btn-outline-secondary me-2"
                  onClick={() => {
                    setStatusFilter("");
                    setTypeFilter("");
                    setSearchMerchant("");
                    setMinAmount("");
                    setMaxAmount("");
                    setDateFrom("");
                    setDateTo("");
                    setFilterData({});
                  }}
                >
                  Reset
                </button>

                <button className="btn btn-dark" onClick={exportCSV}>
                  Export
                </button>
              </div>
            </div>

            <div className="row g-3">
              {["startDate", "endDate", "status", "search"].map((key) => {
                const mapField = {
                  key,
                  name: key,
                  id: key,
                  onChange: handleFilterChange,
                  error: errors[key] || "",
                  value:
                    key === "status" ? filterData?.[key] || "All" : filterData?.[key] || "",
                  type:
                    key.includes("Date")
                      ? "date"
                      : key === "status"
                      ? "dropdown"
                      : "text",
                  dropdownOptions:
                    key === "status"
                      ? { All: "All", Success: "Success", Pending: "Pending", Failed: "Failed" }
                      : {},
                  placeholder: key === "search" ? "Search ..." : undefined,
                };

                return (
                  <div className="col-md-3" key={key}>
                    <GenerateInputs mapField={mapField} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Transactions Table */}
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between mb-3">
                <h5 className="fw-semibold">Recent Transactions</h5>
                <div className="small text-muted">{filteredTransactions.length} rows</div>
              </div>

              <div className="table-responsive" style={{ maxHeight: 320 }}>
                <table className="table table-hover table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th className="text-center">S.No</th>
                      <th className="text-center">Txn ID</th>
                      <th>Merchant</th>
                      <th className="text-center">Amount</th>
                      <th className="text-center">Type</th>
                      <th className="text-center">Date</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredTransactions.length ? (
                      filteredTransactions.map((tx, idx) => (
                        <tr key={tx.id}>
                          <td className="text-center">{idx + 1}</td>
                          <td className="text-center text-primary fw-semibold">
                            TXN{tx.id}2456
                          </td>
                          <td>{tx.merchant}</td>
                          <td className="text-center fw-semibold">{tx.amount.toLocaleString()}</td>
                          <td className="text-center">
                            <Badge value={tx.type} kind="type" />
                          </td>
                          <td className="text-center text-muted small">
                            {tx.date}
                            <br />
                            <span className="text-secondary">{tx.time}</span>
                          </td>
                          <td className="text-center">
                            <Badge value={tx.status} kind="status" />
                          </td>
                          <td className="text-center">
                            <button className="btn btn-sm btn-outline-primary rounded-pill px-3">
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center py-4">
                          No transactions found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Wrapper>
  );
}
