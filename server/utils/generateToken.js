import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {  // the id here is company id in the form of payload data
    expiresIn: "30d",
  });
};

export default generateToken;