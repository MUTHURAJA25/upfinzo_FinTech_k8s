import Layout from "@/pages/layouts/Layout.jsx";
import React from "react";

const Wrapper = (props) => {
    return <Layout page={props.page}>
        {props.children}
    </Layout>
}

export default Wrapper;