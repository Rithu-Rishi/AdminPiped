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
import ProgramSkill from "./pages/ProgramSkill";
import SkillProgression from "./pages/SkillProgression";
import PaymentPlan from "./pages/PaymentPlan";
import TimeSlots from "./pages/TimeSlots";
import AssignTeachers from "./pages/AssignTeachers";
import FacilityPaymentPlans from "./pages/FacilityPaymentPlan";
import FacilityUserPayments from "./pages/FacilityUserPayments";
import FacilitySubscriptions from "./pages/FacilitySubscriptions";
import UserBookings from "./pages/UserBookings";
import Transitions from "./pages/Transitions";
import Sliders from "./pages/Sliders";
import WorkShop from "./pages/Workshop";
import MembershipOffers from "./pages/MembershipOffers";
import NoticeBoard from "./pages/NoticeBoard";
import ProgramSubscriptions from "./pages/ProgramSubscriptions";
import Coupon from "./pages/Coupon";
import Cafeteria from "./pages/Cafeteria";
import Admin from "./pages/Admin";
import MenuItems from "./pages/MenuItems";
import ViewTransactions from "./pages/ViewTransactions";
import HelpSupport from "./pages/HelpSupport";
import TeacherFeedback from "./pages/TeacherFeedback";
import Unauthorized from "./pages/Unauthorized";

const AppRouter = () => {
    return (
        <Layout>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Login />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                {/* Super Admin Protected Route */}
                <Route element={<ProtectedRoute allowedRoles={['Super Admin', 'Admin']} />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/admins" element={<Admin />} />
                    <Route path="/parentlist" element={<ParentsList />} />
                    <Route path="/childlist" element={<ChildList />} />
                    <Route path="/teachers" element={<Teacher />} />
                    <Route path="/programs" element={<Programs />} />
                    <Route path="/subPrograms" element={<SubPrograms />} />
                    <Route path="/programSkill" element={<ProgramSkill />} />
                    <Route path="/skillProgression" element={<SkillProgression />} />
                    <Route path="/paymentPlan" element={<PaymentPlan />} />
                    <Route path="/timeSlots" element={<TimeSlots />} />
                    <Route path="/assignTeachers" element={<AssignTeachers />} />
                    <Route path="/facilityPlans" element={<FacilityPaymentPlans />} />
                    <Route path="/facilityUserPayments" element={<FacilityUserPayments />} />
                    <Route path="/facilitySubscriptions" element={<FacilitySubscriptions />} />
                    <Route path="/userBookings" element={<UserBookings />} />
                    <Route path="/transitions" element={<Transitions />} />
                    <Route path="/sliders" element={<Sliders />} />
                    <Route path="/workshop" element={<WorkShop />} />
                    <Route path="/offers" element={<MembershipOffers />} />
                    <Route path="/noticeboard" element={<NoticeBoard />} />
                    <Route path="/programSubscriptions" element={<ProgramSubscriptions />} />
                    <Route path="/coupons" element={<Coupon />} />
                    <Route path="/cafeteria" element={<Cafeteria />} />
                    <Route path="/helpSupport" element={<HelpSupport />} />
                    <Route path="/teacherFeecback" element={<TeacherFeedback />} />
                </Route>
                {/* Cafeteria Protected Route */}
                <Route element={<ProtectedRoute allowedRoles={['Cafeteria']} />}>
                    <Route path="/" element={<MenuItems />} />
                    <Route path="/menuItems" element={<MenuItems />} />
                    <Route path="/viewTransactions" element={<ViewTransactions />} />
                </Route>
            </Routes>
        </Layout>
    );
};

export default AppRouter;
