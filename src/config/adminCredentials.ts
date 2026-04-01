export const HARDCODED_ADMIN_CREDENTIALS = {
  email: 'admin@gmail.com',
  password: 'Admin@123',
};

export const isHardcodedAdminLogin = (email: string, password: string) => {
  const normalizedEmail = email.trim().toLowerCase();
  return (
    normalizedEmail === HARDCODED_ADMIN_CREDENTIALS.email &&
    password === HARDCODED_ADMIN_CREDENTIALS.password


    
  );
};
