export const useSession = () => {
  const data = localStorage.getItem("session");
  const session = data ? JSON.parse(data) : null;
  return session;
};
