import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import BarSession from "./bar/BarSession";
import { withStyles } from "@material-ui/styles";
import { compose } from "recompose"; // video 47
import { consumerFirebase } from "../../server"; // video 47
import { StateContext } from "../../sesion/store";

const styles = theme => ({
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex"
    }
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  }
});
// video 47
class AppNavbar extends Component {
  static contextType = StateContext;

  state = {
    firebase: null
  };

  componentDidMount() {
    const { firebase } = this.state; // local state video 48
    const [{ sesion }, dispatch] = this.context; // global state video 48

    if (firebase.auth.currentUser !== null && !sesion) {
      firebase.db
        .collection("Users")
        .doc(firebase.auth.currentUser.uid)
        .get()
        .then(doc => {
          const usuarioDB = doc.data(); // video 49
          dispatch({
            type: "INICIAR_SESION",
            sesion: usuarioDB,
            autenticado: true
          });
        }); // video 49
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let nuevosObjetos = {};
    if (nextProps.firebase !== prevState.firebase) {
      nuevosObjetos.firebase = nextProps.firebase;
    }
    return nuevosObjetos;
  } // video 47

  render() {
    const [{ sesion }, dispatch] = this.context;

    return sesion ? (
      sesion.autenticado ? (
        <div>
          <AppBar position="static">
            <BarSession />
          </AppBar>
        </div>
      ) : null
    ) : null;
  }
}

export default compose(withStyles(styles), consumerFirebase)(AppNavbar);
// validado 