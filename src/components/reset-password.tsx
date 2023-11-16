import { sendPasswordResetEmail } from "firebase/auth";
import { Error, Input, Title, Wrapper, Form } from "./auth-components";
import { useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";

export default function ResetPassword() {
  const [resetInfo, setInfo] = useState({
    email: "",
    error: "",
  });
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { email, error } = resetInfo;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
    const {
      target: { name, value },
    } = e;
    setInfo({
      ...resetInfo,
      [name]: value,
    });
  };

  const onReset = () => {
    setInfo({
      email: "",
      error: "",
    });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInfo({
      ...resetInfo,
      error: "",
    });
    if (isLoading || email === "") return;
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      navigate("/login");
      onReset();
    } catch (e) {
      if (e instanceof FirebaseError) {
        setInfo({
          ...resetInfo,
          error: e.code,
        });
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
