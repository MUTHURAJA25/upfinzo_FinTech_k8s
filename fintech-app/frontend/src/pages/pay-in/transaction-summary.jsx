import React, { useEffect, useState, useMemo } from "react";
import Wrapper from "@/pages/layouts/Wrapper";
import { getTransactions } from "@/services/payInService";
import GenerateInputs from "@/components/generateInputs";

// ---------------------- Helper: Flatten Object ----------------------
const flattenObject = (obj, prefix = "") => {
    const result = {};

    for (let key in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

        const newKey = prefix ? `${prefix}_${key}` : key;
        const value = obj[key];

        if (value && typeof value === "object" && !Array.isArray(value)) {
            Object.assign(result, flattenObject(value, newKey));
        } else {
            result[newKey] = value ?? "";
        }
    }

    return result;
};

// ---------------------- CSV Export ----------------------
const exportCsv = (rows) => {
    if (!rows.length) {
        alert("No records to export");
        return;
    }

    const flatRows = rows.map(r => flattenObject(r));
    const headers = Object.keys(flatRows[0]).join(",");
    const body = flatRows.map(r => Object.values(r).join(",")).join("\n");

    const csv = `${headers}\n${body}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    link.click();
};

// ===================================================================
//                         MAIN COMPONENT
// ===================================================================

export default function TransactionSummary() {
    const [transactionList, setTransactionList] = useState([]);
    const [loading, setLoading] = useState(true);

    const [pagination, setPagination] = useState({
        totalRecords: 0,
        page: 1,
        limit: 5,
    });

    const [filters, setFilters] = useState({
        dateFrom: "",
        dateTo: "",
        status: "",
        method: "",
        searchText: "",
    });

    // ---------------------- Fetch API ----------------------
    useEffect(() => {
        loadTransactions();
    }, [pagination.page]);

    const loadTransactions = async () => {
        setLoading(true);

        try {
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                status: filters.status,
                payment_method: filters.method,
                date_from: filters.dateFrom,
                date_to: filters.dateTo,
            };

            const res = await getTransactions(params);

            setTransactionList(res?.data?.data || []);
            setPagination(res?.data?.meta);
        } catch (error) {
            console.error("Failed to fetch transactions", error);
        }

        setLoading(false);
    };

    // Debounced filter effect
    useEffect(() => {
        const timer = setTimeout(loadTransactions, 300);
        return () => clearTimeout(timer);
    }, [filters]);

    // ---------------------- Client Search ----------------------
    const filteredList = useMemo(() => {
        if (!filters.searchText) return transactionList;

        const search = filters.searchText.toLowerCase();

        return transactionList.filter((row) =>
            row.customer?.name?.toLowerCase().includes(search) ||
            row.customer?.email?.toLowerCase().includes(search) ||
            row.txn_id?.toLowerCase().includes(search) ||
            row.amount?.toString().includes(search)
        );
    }, [transactionList, filters.searchText]);

    const total = Number(pagination?.total) || 0;
    const limit = Number(pagination?.limit) || 1;

    const totalPages = Math.ceil(total / limit);

    const handleRefund = (txnId) => {
        alert(`Refund request for transaction: ${txnId}`);
    };

    // ---------------------- UI ----------------------
    return (
        <Wrapper page="Transaction Summary">
            <div className="card shadow-sm border-0 rounded-4 mb-4">

                {/* HEADER */}
                <div className="card-header py-2 px-4 d-flex justify-content-between align-items-center"
                    style={{ background: "#eef3ff" }}>
                    <div className="fs-5 fw-semibold text-primary">
                        <i className="ri-bar-chart-2-line me-2"></i>
                        Transaction Summary
                    </div>

                    <button className="btn btn-success btn-sm"
                        onClick={() => exportCsv(filteredList)}>
                        <i className="ri-file-download-line me-1"></i> Export CSV
                    </button>
                </div>

                <div className="card-body p-4">

                    {/* FILTERS */}
                    <div className="row g-3 mb-4">
                        {[
                            { key: "dateFrom", type: "date" },
                            { key: "dateTo", type: "date" },
                            {
                                key: "status",
                                type: "dropdown",
                                options: {
                                    "": "All",
                                    success: "Success",
                                    pending: "Pending",
                                    failed: "Failed",
                                }
                            },
                            {
                                key: "method",
                                type: "dropdown",
                                options: {
                                    "": "All",
                                    upi: "UPI",
                                    card: "Card",
                                    bank: "Net Banking",
                                }
                            },
                            { key: "searchText", type: "text", placeholder: "Name, email, txn-id, amount" }
                        ].map((item) => (
                            <div className={item.key === "searchText" ? "col-md-4" : "col-md-2"} key={item.key}>
                                <GenerateInputs
                                    mapField={{
                                        key: item.key,
                                        id: item.key,
                                        name: item.key,
                                        type: item.type,
                                        value: filters[item.key],
                                        placeholder: item.placeholder || "",
                                        dropdownOptions: item.options || {},
                                        onChange: (e) =>
                                            setFilters({ ...filters, [item.key]: e.target.value }),
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* TABLE */}
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped align-middle">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Date</th>
                                    <th>Txn ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Amount</th>
                                    <th>Method</th>
                                    <th>Status</th>
                                    <th>Refund</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading && (
                                    <tr>
                                        <td colSpan="9" className="text-center py-3">Loading...</td>
                                    </tr>
                                )}

                                {!loading && filteredList.length === 0 && (
                                    <tr>
                                        <td colSpan="9" className="text-center py-3">No records found</td>
                                    </tr>
                                )}

                                {!loading &&
                                    filteredList.map((row, index) => (
                                        <tr key={row._id}>
                                            <td>{(pagination.page - 1) * pagination.limit + index + 1}</td>
                                            <td>{row.createdAt?.split("T")[0] || "-"}</td>
                                            <td>{row.txn_id}</td>
                                            <td>{row.customer?.name}</td>
                                            <td>{row.customer?.email}</td>
                                            <td>₹{row.amount}</td>
                                            <td>{row.payment_method?.toUpperCase()}</td>

                                            <td>
                                                <span
                                                    className={
                                                        row.status === "success"
                                                            ? "badge bg-success"
                                                            : row.status === "pending"
                                                                ? "badge bg-warning text-dark"
                                                                : "badge bg-danger"
                                                    }
                                                >
                                                    {row.status?.toUpperCase()}
                                                </span>
                                            </td>

                                            <td>
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    disabled={row.status !== "success"}
                                                    onClick={() => handleRefund(row.txn_id)}
                                                >
                                                    Refund
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION */}
                    <div className="d-flex justify-content-between align-items-center mt-3">

                        <div>
                            Showing page {pagination.page} of {totalPages}
                        </div>

                        <div className="d-flex gap-2">
                            <button
                                className="btn btn-outline-primary btn-sm"
                                disabled={pagination.page <= 1}
                                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                            >
                                Prev
                            </button>

                            <button
                                className="btn btn-outline-primary btn-sm"
                                disabled={pagination.page >= totalPages}
                                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                            >
                                Next
                            </button>
                        </div>

                    </div>

                </div>
            </div>
        </Wrapper>
    );
}
