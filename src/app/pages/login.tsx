import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/app/components/ui/button";
import { FormField } from "@/app/components/form-field";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { GraduationCap } from "lucide-react";
import { useAuth } from "@/app/context/auth-context";
import axios from "axios";
import { User } from "@/app/lib/mock-data";

export function LoginPage() {
  const [role, setRole] = useState<"student" | "teacher" | "admin">("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setSession } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/login",
        formData,
      );
      const responseUser = response.data?.user;
      const token = response.data?.token;

      if (!responseUser || !token) {
        setError("Login failed. Missing user details.");
        return;
      }

      if (responseUser.role !== role) {
        setError(`Please select the ${responseUser.role} role to continue.`);
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(responseUser));

      const normalizedUser: User = {
        id: responseUser.id,
        name: responseUser.fullName || responseUser.name || responseUser.email,
        email: responseUser.email,
        role: responseUser.role,
        status: responseUser.status || "active",
        joinedDate: responseUser.joinedDate || new Date().toISOString(),
      };

      setSession(normalizedUser);

      if (responseUser.role === "admin") {
        navigate("/admin/dashboard");
      } else if (responseUser.role === "teacher") {
        navigate("/teacher/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (error) {
      console.error(error);
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/10 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              TuitionHub
            </span>
          </Link>
          <h1 className="text-3xl mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        <Card className="border-none shadow-xl">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Select your role and enter your credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={role}
              onValueChange={(v) => setRole(v as any)}
              className="mb-6"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="student">Student</TabsTrigger>
                <TabsTrigger value="teacher">Teacher</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={handleLogin} className="space-y-4">
              <FormField
                id="email"
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(email) => setFormData({ ...formData, email })}
              />

              <FormField
                id="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(password) => setFormData({ ...formData, password })}
              />

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="text-sm text-center">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Register here
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
