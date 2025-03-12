import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./App.layout";
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from './pages/Dashboard';
import ParentsList from "./pages/ParentsList";
import ChildList from "./pages/ChildList";
import Teacher from "./pages/Teacher";
import Login from "./pages/Login";
import Programs from "./pages/Programs";
import SubPrograms from "./pages/SubProgram";
import SubProgramFocus from "./pages/SubProgramFocus";
import ProgramSkill from "./pages/ProgramSkill";
import SkillProgression from "./pages/SkillProgression";
import PaymentPlan from "./pages/PaymentPlan";
import TimeSlots from "./pages/TimeSlots";
import AssignTeachers from "./pages/AssignTeachers";
import FacilityPaymentPlans from "./pages/FacilityPaymentPlan";
import FacilityUserPayments from "./pages/FacilityUserPayments";
import FacilitySubscriptions from "./pages/FacilitySubscriptions";
import UserBookings from "./pages/UserBookings";

const AppRouter = () => {
    return (
        <Layout>
            <Routes>
                {/* Protected Route */}
                <Route>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/perantslist" element={<ParentsList />} />
                    <Route path="/childlist" element={<ChildList />} />
                    <Route path="/teachers" element={<Teacher />} />
                    <Route path="/programs" element={<Programs />} />
                    <Route path="/subPrograms" element={<SubPrograms />} />
                    <Route path="/subProgramFocus" element={<SubProgramFocus />} />
                    <Route path="/programSkill" element={<ProgramSkill />} />
                    <Route path="/skillProgression" element={<SkillProgression />} />
                    <Route path="/paymentPlan" element={<PaymentPlan />} />
                    <Route path="/timeSlots" element={<TimeSlots />} />
                    <Route path="/assignTeachers" element={<AssignTeachers />} />
                    <Route path="/facilityPlans" element={<FacilityPaymentPlans />} />
                    <Route path="/facilityUserPayments" element={<FacilityUserPayments />} />
                    <Route path="/facilitySubscriptions" element={<FacilitySubscriptions />} />
                    <Route path="/userBookings" element={<UserBookings />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Login />} />
            </Routes>
        </Layout>
    );
};

export default AppRouter;
