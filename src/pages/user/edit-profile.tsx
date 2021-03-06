import { gql, useApolloClient, useMutation } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { LOCALSTORAGE_TOKEN, LOGOUT_HASH } from "../../constants";
import { useMe } from "../../hooks/useMe";
import {
  editProfile,
  editProfileVariables,
} from "../../__generated__/editProfile";

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile($input: EditProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`;

interface IFormProps {
  email?: string;
  password?: string;
}

export const EditProfile = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();
  const onCompleted = (data: editProfile) => {
    const {
      editProfile: { ok },
    } = data;
    if (ok && userData) {
      const {
        me: { email: prevEmail, id },
      } = userData;
      const { email: newEmail } = getValues();
      if (prevEmail !== newEmail) {
        client.writeFragment({
          id: `User:${id}`,
          fragment: gql`
            fragment EditedUser on User {
              verified
              email
            }
          `,
          data: {
            email: newEmail,
            verified: false,
          },
        });
      }
    }
  };
  const [editProfile, { loading }] = useMutation<
    editProfile,
    editProfileVariables
  >(EDIT_PROFILE_MUTATION, {
    onCompleted,
  });
  const { register, handleSubmit, getValues, formState } = useForm<IFormProps>({
    mode: "onChange",
    defaultValues: {
      email: userData?.me.email,
    },
  });
  const onSubmit = () => {
    const { email, password } = getValues();
    editProfile({
      variables: {
        input: {
          email,
          ...(password !== "" && { password }),
        },
      },
    });
  };
  return (
    <div className="flex flex-col items-center justify-center mt-52">
      <Helmet>
        <title>Edit Profile | Guber Eats</title>
      </Helmet>
      <h4 className="mb-3 text-2xl font-semibold">Edit Profile</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid w-full max-w-screen-sm gap-3 mt-5 mb-5"
      >
        <input
          ref={register({
            pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          })}
          name="email"
          className="input"
          type="email"
          placeholder="Email"
        />
        <input
          ref={register}
          name="password"
          className="input"
          type="password"
          placeholder="Password"
        />
        <Button
          loading={loading}
          canClick={formState.isValid}
          actionText="Save Profile"
        />
      </form>
      <button
        className="w-full max-w-screen-sm py-4 text-lg font-medium text-white transition-colors bg-red-500 hover:bg-red-600 btn focus:outline-none"
        role="button"
        onClick={() => {
          localStorage.removeItem(LOCALSTORAGE_TOKEN);
          window.location.hash = LOGOUT_HASH;
          window.location.reload();
        }}
      >
        Logout
      </button>
    </div>
  );
};
