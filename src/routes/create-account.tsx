import { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { Error, Form, Input, OrLine, Switcher, Title, Wrapper } from "../components/auth-components";
import GithubButton from "../components/github-btn";

export default function CreateAccount() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [info, setInfo] = useState({
    name: "",
    email: "",
    password: "",
    isLoading: false,
  });
  const { name, email, password, isLoading } = info;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    setInfo({
      ...info,
      [name]: value,
    });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (isLoading || name === "" || email === "" || password === "") return;
    try {
      setInfo({
        ...info,
        isLoading: true,
      });
      const credentials = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credentials.user, {
        displayName: name,
      });
      await sendEmailVerification(credentials.user);
      navigate("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setInfo({
        ...info,
        isLoading: false,
      });
    }
  };
  return (
    <Wrapper>
      <Title>Join 𝕏</Title>
      <Form onSubmit={onSubmit}>
        <Input onChange={onChange} name="name" value={name} placeholder="Name" type="text" required />
        <Input onChange={onChange} name="email" value={email} placeholder="Email" type="email" required />
        <Input onChange={onChange} name="password" value={password} placeholder="Password" type="password" required />
        <Input type="submit" value={isLoading ? "Loading..." : "Create Account"} />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        Already Have an Accoount? <Link to="/login">Log in &rarr;</Link>
      </Switcher>
      <Switcher>
        Foggot Your Password? <Link to="/reset-password">Click Here &rarr;</Link>
      </Switcher>
      <OrLine>{"——————— or ———————"}</OrLine>
      <GithubButton />
    </Wrapper>
  );
}
