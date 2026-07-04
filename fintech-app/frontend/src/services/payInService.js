import axios from "axios";

const base = import.meta.env.VITE_API_BASE;
const envVersion = import.meta.env.VITE_API_VERSION;

// Build Authorization + User Header
const authHeader = () => {
    const token = localStorage.getItem("token");
    const rawUser = localStorage.getItem("user");

    let parsedUser = null;
    try {
        parsedUser = rawUser ? JSON.parse(rawUser) : null;
    } catch (_) {
        parsedUser = null; // invalid JSON → ignore
    }

    const userHeader = parsedUser
        ? `{id: '${parsedUser.id}', email: '${parsedUser.email}', role: '${parsedUser.role}'}`
        : "";

    return {
        headers: {
            user: userHeader,
            Authorization: `Bearer ${token}`,
        },
    };
};

// ---------- PAY-IN MODULE APIS ---------- //

// GET Transactions (safe)
export const getTransactions = (params = {}) => {
    return axios.get(`${base}/${envVersion}/user/transactions`, {
        ...authHeader(),
        params,
    });
};
