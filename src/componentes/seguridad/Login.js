import React, { Component } from "react";
import {
  Container,
  Avatar,
  Typography,
  TextField,
  Button,
  Link
} from "@material-ui/core";
import LockoutLineIcon from "@material-ui/icons/LockOutlined";
import { compose } from "recompose";
import { consumerFirebase } from "../../server";
import { iniciarSesion } from "../../sesion/actions/sesionAction"; // video 44
import { StateContext } from "../../sesion/store"; // video 44
import { openMensajePantalla } from "../../sesion/actions/snackbarAction"; // video 45
//import logo from "../../logosonrisa.png";

const style = {
  paper: {
    marginTop: 9,
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: 5,
    backgroundColor: "red"
  },
  form: {
    width: "100%",
    marginTop: 8
  },
  text : {
    marginTop : '50px'
  }
};

class Login extends Component {
  static contextType = StateContext; // video 44, se corrige en el video 45
  state = {
    firebase: null,
    usuario: {
      email: "",
      password: ""
    }
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.firebase === prevState.firebase) {
      return null;
    }

    return {
      firebase: nextProps.firebase
    };
  }

  onChange = e => {
    let usuario = Object.assign({}, this.state.usuario);
    usuario[e.target.name] = e.target.value;

    this.setState({
      usuario: usuario
    });
  };

  login = async e => {
    e.preventDefault();

    const [{ sesion }, dispatch] = this.context;
    const { firebase, usuario } = this.state;
    const { email, password } = usuario;

    let callback = await iniciarSesion(dispatch, firebase, email, password);
    // se adiciona todo esto en el video 44
    if (callback.status) {
      this.props.history.push("/");
    } else {
      openMensajePantalla(dispatch, {
        open: true,
        mensaje: callback.mensaje.message
      });// adicionado video 45 
    }
  };

  render() {
    return (
      <Container maxWidth="xs">
        <div style={style.paper}>
          <Avatar style={style.avatar}>
            <LockoutLineIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Ingrese Usuario
          </Typography>
          <form style={style.form}>
            <TextField
              variant="outlined"
              label="E-Mail"
              name="email"
              type="email"
              fullWidth
              margin="dense"
              onChange={this.onChange}
              value={this.state.usuario.email}
            />
            <TextField
              variant="outlined"
              label="Password"
              type="Password"
              name="password"
              fullWidth
              margin="dense"
              onChange={this.onChange}
              value={this.state.usuario.password}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={this.login}
            >
              Ingresar
            </Button>
          </form>
        </div>
        <Typography style={style.text} variant="body2" align="center">
          {"Copyright © "}
          <Link color="inherit" href="#">
            JDMUNOZ - PRODUCTOS ALIMENTICIOS LA LOCURA
          </Link>{" "}
          {new Date().getFullYear()}
          {"."}
        </Typography>
      </Container>
    );
  }
}

export default compose(consumerFirebase)(Login);
