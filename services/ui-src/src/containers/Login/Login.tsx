import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { useFormFields } from "@/libs/hooksLib";
import { onError } from "@/libs/errorLib";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons/faSignInAlt";
import { RootStateOrAny, useSelector } from "react-redux";
import LocalLogins from "@/components/LocalLogins/LocalLogins";
import { useHistory } from "react-router-dom";
import * as Bootstrap from "react-bootstrap";
import { LoginFormProps } from "@/containers/Login/LoginFormProps";
import { FormInputProps } from "@/containers/Login/FormInputProps";
export default function Login() {
  const isAuthenticated = useSelector((state: RootStateOrAny) => state.user.attributes);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
  });
  const validateForm = () =>
    fields.email.length > 0 && fields.password.length > 0;
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    try {
      await Auth.signIn(fields.email, fields.password);
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  return (
    <Bootstrap.Container className="mt-4">
      <Bootstrap.Row>
        <Bootstrap.Col xs lg="6">
          <h3>Login (Cognito)</h3>
          <LoginForm
            isLoading={isLoading}
            fields={fields}
            handleSubmit={handleSubmit}
            handleFieldChange={handleFieldChange}
            validateForm={validateForm}
          />
        </Bootstrap.Col>
        <Bootstrap.Row className="mt-4">
          <Bootstrap.Col>{!isAuthenticated && <LocalLogins />}</Bootstrap.Col>
        </Bootstrap.Row>
      </Bootstrap.Row>
    </Bootstrap.Container>
  );
}

function LoginForm(props: LoginFormProps) {
  return (
    <section>
      <form onSubmit={() => props.handleSubmit()} className="d-grid gap-2">
        <FormInput
          label="Email"
          type="email"
          value={props.fields.email}
          handleFieldChange={props.handleFieldChange}
        />
        <FormInput
          label="Password"
          type="password"
          value={props.fields.password}
          handleFieldChange={props.handleFieldChange}
        />
        <Bootstrap.Button
          variant="primary"
          type="submit"
          // isLoading={props.isLoading}
          disabled={!props.validateForm()}
        >
          Login <FontAwesomeIcon icon={faSignInAlt} />
        </Bootstrap.Button>
      </form>
    </section>
  );
}

function FormInput(props: FormInputProps) {
  return (
    <Bootstrap.FormGroup controlId={props.type}>
      <Bootstrap.FormControl
        placeholder={props.label}
        type={props.type}
        value={props.value}
        onChange={() => props.handleFieldChange()}
      />
    </Bootstrap.FormGroup>
  );
}
