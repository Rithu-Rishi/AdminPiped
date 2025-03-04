import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./App.layout";
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from './pages/Dashboard';
import ParentsList from "./pages/ParentsList";
import ChildList from "./pages/ChildList";
import Teacher from "./pages/Teacher";
import Login from "./pages/Login";

const AppRouter = () => {
    return (
        <Layout>
            <Routes>
                {/* Protected Route */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/perantslist" element={<ParentsList />} />
                    <Route path="/childlist" element={<ChildList />} />
                    <Route path="/teachers" element={<Teacher />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Login />} />
            </Routes>
        </Layout>
    );
};

export default AppRouter;
