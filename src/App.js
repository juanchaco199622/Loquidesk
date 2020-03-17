import React, { useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import {Snackbar } from '@material-ui/core'; // importa en el video 43
import "./App.css";

import AppNavBar from "./componentes/layout/AppNavbar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import theme from "./theme/theme";
import RegistrarUsuario from "./componentes/seguridad/RegistrarUsuario";
import Login from "./componentes/seguridad/Login";
import { FirebaseContext } from "./server";
import { useStateValue } from "./sesion/store";// se adiciona en el video 42
import  RutaAutenticada  from "./componentes/seguridad/RutaAutenticada";

import  PerfilUsuario from "./componentes/seguridad/PerfilUsuario";
import NuevoCaso from "./componentes/vistas/NuevoCaso";
import NuevoPunto from "./componentes/vistas/NuevoPunto";
import ListaCasos from "./componentes/vistas/ListaCasos";
import EditarCaso from "./componentes/vistas/EditarCaso";
import AsignarCaso from "./componentes/vistas/AsignarCaso";



function App(props) {
  let firebase = React.useContext(FirebaseContext);
  const [autenticacionIniciada, setupFirebaseInicial] = React.useState(false);

  //const [{ openSnackbar, sesion }, dispatch] = useStateValue(); // se adiciona video 42
  const [{ openSnackbar, sesion }, dispatch] = useStateValue();

  useEffect(() => {
    firebase.estaIniciado().then(val => {
      setupFirebaseInicial(val);
    });
  });
// VALIDADO 

  return autenticacionIniciada !== false ? (
    <React.Fragment>
      <Snackbar
        anchoOrigin={{ verical: "bottom", horizontal: "center" }}
        open={openSnackbar ? openSnackbar.open : false}
        autoHideDuration={3000}
        ContentProps={{
          "aria-describedby": "message-id"
        }}
        message={
          <span id="message-id">
            {openSnackbar ? openSnackbar.mensaje : ""}
          </span>
        }
        onClose={() =>
          dispatch({
            type: "OPEN_SNACKBAR",
            openMensaje: {
              open: false,
              mensaje: ""
            }
          })
        }
      >
      </Snackbar>

      <Router>
        <MuiThemeProvider theme={theme}>
          <AppNavBar />
          <Grid container>
            <Switch>             
              <RutaAutenticada exact path="/"  component={ListaCasos} autenticadoFirebase={firebase.auth.currentUser}  />
              <RutaAutenticada exact path="/auth/perfil"  component={PerfilUsuario} autenticadoFirebase={firebase.auth.currentUser}  />
              <RutaAutenticada exact path="/caso/nuevo"  component={NuevoCaso} autenticadoFirebase={firebase.auth.currentUser}  />
              <RutaAutenticada exact path="/punto/nuevo"  component={NuevoPunto} autenticadoFirebase={firebase.auth.currentUser}  />
              <RutaAutenticada exact path="/lista/casos"  component={ListaCasos} autenticadoFirebase={firebase.auth.currentUser}  />
              <RutaAutenticada exact path="/lista/:id"  component={EditarCaso} autenticadoFirebase={firebase.auth.currentUser}  />
              <RutaAutenticada exact path="/caso/asignarcaso/:id"  component={AsignarCaso} autenticadoFirebase={firebase.auth.currentUser}  />
                <Route
                  path="/auth/registrarUsuario"
                  exact
                  component={RegistrarUsuario}
                ></Route>
              <Route path="/auth/login" exact component={Login}/>
            </Switch>
          </Grid>
        </MuiThemeProvider>
      </Router>
    </React.Fragment>
  ) : null;
}

export default App;
