export default {
  jwt: {
    secret: (process.env.JWT_SECRET as string) || "default",
    expiresIn: "1d",
  },
};
