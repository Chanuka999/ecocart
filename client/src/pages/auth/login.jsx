import CommonForm from "../../components/common/form";
import { registerFormControls } from "../../config";
import { useState } from "react";
import { Link } from "react-router-dom";

const initialState = {
  email: "",
  password: "",
};

const onSubmit = () => {};

const AuthLogin = () => {
  const [formData, setFormData] = useState(initialState);
  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-account">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          create new account
        </h1>
        <p className="mt-2">
          Already have an account
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/login"
          >
            Login
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={registerFormControls}
        buttonText={"Sign Up"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default AuthLogin;
