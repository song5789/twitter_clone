import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = auth.currentUser;
  if (user === null) {
    return <Navigate to="/login" />;
  } else if (user.emailVerified === false && !user.providerData) {
    return <Navigate to="/vertification" />;
  }
  return children;
}
