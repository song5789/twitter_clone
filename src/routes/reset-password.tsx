import { sendPasswordResetEmail } from "firebase/auth";
import { Error, Input, Title, Wrapper, Form } from "../components/auth-components";
import { useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";

export default function ResetPassword() {
  const [resetInfo, setInfo] = useState({
    email: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { email } = resetInfo;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    setInfo({
      ...resetInfo,
      [name]: value,
    });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (isLoading || email === "") return;
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      navigate("/login");
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>Reset Your Password</Title>
      <Form onSubmit={onSubmit}>
        <Input onChange={onChange} name="email" value={email} placeholder="Enter Your Email" type="email" required />
        <Input type="submit" value={isLoading ? "Loading..." : "Send Reset Email"} />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
    </Wrapper>
  );
}
