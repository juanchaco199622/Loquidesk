import React, { Component } from "react";
import {
  Container,
  MenuItem,
  Paper,
  Select,
  Grid,
  Breadcrumbs,
  Link,
  Typography,
  Button,
  TextField,
  InputLabel,
  NativeSelect
} from "@material-ui/core";
import { consumerFirebase } from "../../server";
import HomeIcon from "@material-ui/icons/Home";

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
    padding: "20px",
    backgroundColor: "#f5f5f5"
  },
  homeIcon: {
    width: 20,
    height: 20,
    marginRight: "4px"
  },
  paper2: {
    marginTop: 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#f5f5f5"
  },
  paper3: {
    marginTop: 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#f5f5f5"
  }
};

class AsignarCaso extends Component {
  state = {
    caso: {
      asignado_a: "",
      fecha_asignado: "",
      fecha_fin_asignado: "",
      puntoVenta: "",
      fecha: "",
      titulo: "",
      descripcion: "",
      estado: "",
      prioridad: "",
      fotos: []
    },
    PuntoVenta: []
  };

  entraDatosEnEstado = e => {
    let caso_asignado = Object.assign({}, this.state.caso);
    caso_asignado[e.target.name] = e.target.value;
    this.setState({
      caso: caso_asignado
    });
  };

  asignarOperario = () => {
    const { caso } = this.state;
    const { id } = this.props.match.params;

    this.props.firebase.db
      .collection("Casos")
      .doc(id)
      .set(caso, { merge: true })
      .then(success => {
        this.props.history.push("/");
      });
  };

  async componentDidMount() {
    let objectQuery = this.props.firebase.db
      .collection("Users")
      .where("rol", "==", "OPERARIO");
    const snapshot = await objectQuery.get();

    const arrayPuntos = snapshot.docs.map(doc => {
      let data = doc.data();
      let id = doc.id;
      return { id, ...data };
    });

    /* Capturar el codigo de la url */
    const { id } = this.props.match.params;
    /* Objecto firebase */

    const casoCollection = this.props.firebase.db.collection("Casos");
    /* Se pasa el valor al collection para buscar el elemento en la base de datos */
    const casoDB = await casoCollection.doc(id).get();
    /*Actualizar todos los componentes de mi vista */

    this.setState({
      caso: casoDB.data(),
      PuntoVenta: arrayPuntos
    });
  }

  render() {
    return (
      <Container style={style.container}>
        <Paper style={style.paper}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <Breadcrumbs arial-label="breadcrumb">
                <Link color="inherit" style={style.link} href="/">
                  <HomeIcon style={style.homeIcon} />
                  Home
                </Link>
                <Typography color="textPrimary">Asignar Caso</Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
        </Paper>

        <Paper style={style.paper3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                name="estado"
                label="Estado del caso"
                fullWidth
                multiline
                onChange={this.cambiarDato}
                value={this.state.caso.estado}
                disabled
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <InputLabel fullWidth htmlFor="demo-customized-select-native">
                Prioridad
              </InputLabel>
              <NativeSelect
                fullWidth
                id="demo-customized-select-native"
                name="prioridad"
                onChange={this.cambiarDato}
                value={this.state.caso.prioridad}
                disabled
              >
                <option value="" />
                <option value="ALTA">Alta</option>
                <option value="MEDIA">Media</option>
                <option value="BAJA">Baja</option>
              </NativeSelect>
            </Grid>
            <Grid item xs={12} md={4}>
              <InputLabel htmlFor="name-native">Puntos de venta</InputLabel>

              <Select
                name="puntoVenta"
                fullWidth
                onChange={this.cambiarDato}
                value={this.state.caso.puntoVenta}
              >
              
              </Select>
            </Grid>
          </Grid>
        </Paper>

        <Paper style={style.paper2}>
          <Grid container spacing={2} justify="center">
            <Grid item xs={12} md={12}>
              <InputLabel>Técnicos</InputLabel>
              <Select
                fullWidth
                onChange={this.entraDatosEnEstado}
                value={this.state.caso.asignado_a}
                name="asignado_a"
              >
                {this.state.PuntoVenta.map(info => (
                  <MenuItem
                    key={info.id}
                    value={info.nombre + " " + info.apellido}
                  >
                    {info.nombre + " " + info.apellido}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12} md={6}>
              <InputLabel>Fecha Asignacion</InputLabel>
              <TextField
                fullWidth
                type="date"
                name="fecha_asignado"
                value={this.state.caso.fecha_asignado}
                onChange={this.entraDatosEnEstado}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <InputLabel>Fecha Final Asignacion</InputLabel>
              <TextField
                fullWidth
                type="date"
                name="fecha_fin_asignado"
                value={this.state.caso.fecha_fin_asignado}
                onChange={this.entraDatosEnEstado}
              />
            </Grid>

            <Grid container justify="center">
              <Grid item xs={12} sm={6}>
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  size="large"
                  color="primary"
                  style={style.submit}
                  onClick={this.asignarOperario}
                >
                  Guardar
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }
}

export default consumerFirebase(AsignarCaso);
