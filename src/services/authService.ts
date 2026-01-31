// Mock auth service - no backend connections
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: "student" | "teacher";
  subject?: string;
  qualification?: string;
  experience?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Mock users database
const mockUsers = [
  { email: "student@test.com", password: "123456", role: "student", name: "John Smith" },
  { email: "teacher@test.com", password: "123456", role: "teacher", name: "Dr. Sarah Johnson" },
  { email: "admin@test.com", password: "123456", role: "admin", name: "Admin User" },
];

// Mock register user
export const registerUser = async (data: RegisterData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Check if user already exists
  const existingUser = mockUsers.find(u => u.email === data.email);
  if (existingUser) {
    return { error: "User already exists" };
  }
  
  // Add new user to mock database
  mockUsers.push({
    email: data.email,
    password: data.password,
    role: data.role,
    name: data.name
  });
  
  return { 
    token: "mock-jwt-token-" + Date.now(),
    message: "Registration successful"
  };
};

// Mock login user
export const loginUser = async (data: LoginData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Find user in mock database
  const user = mockUsers.find(u => u.email === data.email && u.password === data.password);
  
  if (!user) {
    return { error: "Invalid credentials" };
  }
  
  return { 
    token: "mock-jwt-token-" + Date.now(),
    user: user,
    message: "Login successful"
  };
};
