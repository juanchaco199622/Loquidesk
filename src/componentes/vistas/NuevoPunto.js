import React, { Component } from "react";
import {
  Container,
  Paper,
  Grid,
  Breadcrumbs,
  Link,
  Typography,
  TextField,
  Button
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import { consumerFirebase } from "../../server";
import { openMensajePantalla } from "../../sesion/actions/snackbarAction";


const style = {
  container: {
    paddingTop: "8px"
  },
  paper: {
    marginTop: 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#f5f5f5"
  },
  link: {
    display: "flex"
  },
  homeIcon: {
    width: 20,
    height: 20,
    marginRight: "4px"
  },
  submit: {
    marginTop: 15,
    marginBottom: 10
  },
  paper2: {
    marginTop: 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#f5f5f5"
  }
};


class NuevoPunto extends Component {
  state = {
    nuevoPunto: {
      ciudad: "",
      nombre: "",
      categoria: ""
    }
  };

  entraDatosEnEstado = e => {
    let nuevoPunto_ = Object.assign({}, this.state.nuevoPunto);
    nuevoPunto_[e.target.name] = e.target.value;
    this.setState({
      nuevoPunto: nuevoPunto_
    });
  };

  guardarNuevoPunto = () => {
    const { nuevoPunto } = this.state;
    this.props.firebase.db
      .collection("PuntosVenta")
      .add(nuevoPunto)
      .then(success => {
        this.props.history.push("/");
      })
      .catch(error => {
        openMensajePantalla({
          open: true,
          mensaje: error
        });
      });
  };

  render() {
    return (
      <Container style={style.container}>
        <Paper style={style.paper}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" style={style.link} href="/">
                  <HomeIcon style={style.homeIcon} />
                  Puntos
                </Link>
                <Typography color="textPrimary"> Nuevo Punto </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
        </Paper>

        <Paper style={style.paper2}>
          <Grid container spacing={3} justify="center">
            <Grid item xs={12} md={6}>
              <TextField
                name="ciudad"
                label="Ciudad"
                fullWidth
                onChange={this.entraDatosEnEstado}
                value={this.state.nuevoPunto.ciudad}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="nombre"
                label="Nombre del Punto de Venta"
                fullWidth
                multiline
                onChange={this.entraDatosEnEstado}
                value={this.state.nuevoPunto.nombre}
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <TextField
                name="categoria"
                label="Categoria del Punto"
                fullWidth
                multiline
                onChange={this.entraDatosEnEstado}
                value={this.state.nuevoPunto.categoria}
              />
            </Grid>
          </Grid>
          <Grid container justify="center">
            <Grid item xs={12} md={12}>
              <Button
                type="button"
                fullWidth
                variant="contained"
                size="large"
                color="primary"
                style={style.submit}
                onClick={this.guardarNuevoPunto}
              >
                Guardar
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }
}

export default consumerFirebase(NuevoPunto);
