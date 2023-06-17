import BasicContainer from "../components/BasicContainer/BasicContainer";
import Lectures from "../components/Lectrures/Lectures";
import SingleLecture from "../components/Lectrures/SingleLecture/SingleLecture";
import Login from "../components/Login/Login";
import Main from "../components/Main/Main";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import Reports from "../components/Reports/Reports";
import Specfic from "../components/Reports/Specific/Specfic";

export const RoutesArray = [
    {
        name: 'Login',
        path: '/login',
        nav: false,
        component: <Login/>,
    },
    {
        name: 'Aktualnosci',
        path: '/',
        nav: true,
        component: 
            <ProtectedRoute>
                <BasicContainer>
                    <Main/>
                </BasicContainer>
            </ProtectedRoute>
    },
    {
        name: 'Sprawozdania',
        path: '/sprawozdania',
        adminVisibility: false,
        nav: true,
        component:
            <ProtectedRoute>
                <BasicContainer>
                    <Reports/>
                </BasicContainer>
            </ProtectedRoute>

    },
    {
        name: 'Sprawozdania',
        path: '/sprawozdania/:userID/:lectureID/:taskID',
        nav: false,
        component:
            <ProtectedRoute>
                <BasicContainer>
                    <Specfic/>
                </BasicContainer>
            </ProtectedRoute>

    },
    {
        name: 'Zajęcia',
        path: '/zajecia',
        nav: true,
        component:
            <ProtectedRoute>
                <BasicContainer>
                    <Lectures/>
                </BasicContainer>
            </ProtectedRoute>
    },
    {
        name: 'Zajęcia',
        path: '/zajecia/:id',
        nav: false,
        component:
            <ProtectedRoute>
                <BasicContainer>
                    <SingleLecture/>
                </BasicContainer>
            </ProtectedRoute>
    }
];