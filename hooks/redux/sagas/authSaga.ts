// redux/sagas/authSaga.js
import { call, takeLatest } from "redux-saga/effects";
import { useUserStore as userStore } from "@/hooks/store/use-store";
import { Role } from "@prisma/client";

interface LoginPayload {
  username: string;
  password: string;
}

interface LoginAction {
  type: "LOGIN_REQUEST";
  payload: LoginPayload;
}

interface ApiResponse {
  data: {
    username: string;
    id: string;
    role: Role;
    fullName: string;
  };
}

function* loginSaga(action: LoginAction) {
  try {
    const res: Response = yield call(fetch, "/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(action.payload),
    });

    if (!res.ok) throw new Error("Invalid credentials");

    const data: ApiResponse = yield res.json();
    const { username, id, role, fullName } = data?.data;

    // Update Zustand store
    userStore.getState().setUser({ username, id, role, fullName });

    // Save in sessionStorage
    sessionStorage.setItem(
      "userData",
      JSON.stringify({ username, id, role, fullName })
    );

    // Navigate
    window.location.href = "/my-books";
  } catch (error) {
    console.error(error);
    alert("Login failed");
  }
}

export function* authWatcherSaga() {
  yield takeLatest("LOGIN_REQUEST", loginSaga);
}
