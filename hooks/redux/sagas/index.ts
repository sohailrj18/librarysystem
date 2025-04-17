// redux/sagas/index.js
import { all } from "redux-saga/effects";
import { authWatcherSaga } from "./authSaga";

export default function* rootSaga() {
  yield all([authWatcherSaga()]);
}
