import React from "react";
import { Alert, Button, Grid, TextField } from "@mui/material";
import { ControllerUsers } from "../controllers/ControllerUsers";
import { ResponseUserLogin } from "../../../backend/src/messages/ResponseUserLogin";
import i18next from "../i18n";

interface Props {
  onLogin: (result: ResponseUserLogin, username: string) => void;
}

interface State {
  username: string;
  password: string;
  passwordRepeat: string;
  errorMsg: string | null;
}

export default class ViewRegister extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      passwordRepeat: "",
      errorMsg: null,
    };
  }

  handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let trimmedUsername = this.state.username.trim();
    let trimmedPassword = this.state.password.trim();
    let trimmedPasswordRepeat = this.state.passwordRepeat.trim();
    let usernameRegex = new RegExp(
      "^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$"
    );
    let errorMsg = null;

    if (usernameRegex.test(trimmedUsername)) {
      if (trimmedPassword === trimmedPasswordRepeat) {
        let registerResult = await ControllerUsers.register(
          trimmedUsername,
          trimmedPassword
        );
        if (registerResult) {
          if (registerResult.is_success) {
            let loginResult = await ControllerUsers.login(
              trimmedUsername,
              trimmedPassword
            );
            if (loginResult) {
              if (loginResult.is_success) {
                this.props.onLogin(loginResult, this.state.username);
              } else {
                errorMsg = loginResult.error_msg;
              }
            } else {
              errorMsg = i18next.t("network-error");
            }
          } else {
            errorMsg = registerResult.error_msg;
          }
        } else {
          errorMsg = i18next.t("network-error");
        }
      } else {
        errorMsg = i18next.t("different-passwords");
      }
    } else {
      errorMsg = i18next.t("prohibited-username");
    }
    this.setState({ errorMsg: errorMsg });
  };

  render = () => {
    let alert = null;

    if (this.state.errorMsg) {
      alert = (
        <Grid item>
          <Alert severity="error">{this.state.errorMsg}</Alert>
        </Grid>
      );
    }

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <Grid
            container
            direction={"column"}
            alignItems={"center"}
            rowSpacing={3}
            p={3}
          >
            <Grid item>
              <TextField
                required
                id={"usernameInput"}
                label={i18next.t("username").toString()}
                onChange={(val) =>
                  this.setState({ username: val.currentTarget.value })
                }
              />
            </Grid>
            <Grid item>
              <TextField
                required
                id={"passwordInput"}
                label={i18next.t("password").toString()}
                type={"password"}
                onChange={(val) =>
                  this.setState({ password: val.currentTarget.value })
                }
              />
            </Grid>
            <Grid item>
              <TextField
                required
                id={"passwordRepeatInput"}
                label={i18next.t("password-repeat").toString()}
                type={"password"}
                onChange={(val) =>
                  this.setState({ passwordRepeat: val.currentTarget.value })
                }
              />
            </Grid>
            {alert}
            <Grid item>
              <Button type="submit" variant={"contained"}>
                {i18next.t("register").toString()}
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    );
  };
}
