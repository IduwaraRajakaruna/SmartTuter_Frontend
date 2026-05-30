export const getToken = () => {
  return localStorage.getItem("token");
};

export const getUser = () => {
  return JSON.parse(
    localStorage.getItem("user")
  );
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};