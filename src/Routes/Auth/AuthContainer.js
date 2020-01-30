import React, { useState } from 'react';
import AuthPresneter from './AuthPresenter';
import useInput from "../../Hooks/useInput";
import { useMutation } from 'react-apollo-hooks';
import { LOG_IN, CRAETE_ACCOUNT, CONFIRM_SECRET, LOCAL_LOG_IN } from './AuthQueries';
import { toast } from 'react-toastify';

export default () => {
  const [action, setAction] = useState("logIn");
  const username = useInput("");
  const firstName = useInput("");
  const lastName = useInput("");
  const email = useInput("");
  const secret = useInput("");

  const [requestSecretMutation] = useMutation(LOG_IN, {
    variables: {email: email.value}
  });

  const [createAccountMutation] = useMutation(CRAETE_ACCOUNT, {
    variables: {
      email: email.value,
      username: username.value,
      firstName: firstName.value,
      lastName: lastName.value
    }
  });

  const [confirmSecretMutation] = useMutation(CONFIRM_SECRET, {
    variables: {
      email: email.value,
      secret: secret.value
    }
  });

  const [localLogInMutation] = useMutation(LOCAL_LOG_IN);

  const onSubmit = async e => {
    e.preventDefault();
    if(action === 'logIn') {
      if(email.value !== "") {
        try {
          const { data: { requestSecret } } = await requestSecretMutation();
          if(!requestSecret) {
            toast.error("계정이 없습니다. 가입해주세요")
            setTimeout(() => setAction('signUp'), 3000);
          } else {
            toast.success("이메일에 비밀코드를 확인해주세요!");
            setAction("confirm");
          }
        } catch {
          toast.error("다시 시도해 주세요")
        }
      } else {
        toast.error("이메일을 입력 하세요!")
      }
    } else if(action === 'signUp') {
      if(
        email.value !== "" &&
        username.value !== "" &&
        firstName.value !== "" &&
        lastName.value !== "" 
      ) {
        try {
          const { data: { createAccount } } = await createAccountMutation();
          if(!createAccount) {
            toast.error("계정 생성 실패")
          } else {
            toast.success("계정 생성 성공!!, 로그인 해 주세요");
            setTimeout(() => setAction('logIn'), 3000);
          }
        } catch (e) {
          toast.error(e.message)
        }
      } else {
        toast.error("빈칸을 전부 입력해주세요!!")
      }
    } else if(action === "confirm") {
      if(secret.value !== "") {
        try {
          const { data: { confirmSecret: token } } = await confirmSecretMutation();
          if(token !== "" && token !== undefined) {
            localLogInMutation({ variables: { token }});
          } else {
            throw Error();
          }
        } catch {
          toast.error("비밀코드가 맞이 않습니다.다시 확인해주세요!")
        }
      }
    }
  }

  return (
    <AuthPresneter
      setAction={setAction}
      action={action}
      username={username}
      firstName={firstName}
      lastName={lastName}
      secret={secret}
      email={email}
      onSubmit={onSubmit}
    />
  )
}