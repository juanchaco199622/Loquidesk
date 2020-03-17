import React, { Component } from "react";
import {
  Container,
  Paper,
  Grid,
  Breadcrumbs,
  Link,
  Typography,
  TextField,
  Button,
  TableRow,
  TableCell,
  Table,
  TableBody,
  InputLabel,
  NativeSelect,
  Select,
  MenuItem,
  FormControl
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import { consumerFirebase } from "../../server";
import { openMensajePantalla } from "../../sesion/actions/snackbarAction";
import ImageUploader from "react-images-upload";
import uuid from "uuid";
import { crearKeyword } from "../../sesion/actions/Keyword";
//import Dropdown from "react-dropdown";

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
  },
  foto: {
    height: "100px"
  }
};

class NuevoCaso extends Component {
  state = {
    nuevoCaso: {
      puntoVenta: "",
      fecha: "",
      titulo: "",
      descripcion: "",
      estado: "ABIERTO",
      prioridad: "",
      fotos: []
    },
    archivos: [],
    arregloPuntoVenta: []
  };

  entraDatosEnEstado = e => {
    let nuevoCaso_ = Object.assign({}, this.state.nuevoCaso);
    nuevoCaso_[e.target.name] = e.target.value;
    this.setState({
      nuevoCaso: nuevoCaso_
    });
  };

  async componentDidMount() {
    let objectQuery = this.props.firebase.db.collection("PuntosVenta");

    const snapshot = await objectQuery.get();

    const arrayPuntos = snapshot.docs.map(doc => {
      let data = doc.data();
      let id = doc.id;
      return { id, ...data };
    });

    this.setState({
      arregloPuntoVenta: arrayPuntos
    });
  }
  

  guardarNuevoCaso = () => {
    const { archivos, nuevoCaso } = this.state;
    // crear a cada imagen o archivo un aliar, es la referencia que luego invocaras, ademas ese alias sera almacenado en la base de datos

    const fecha = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const hours = new Date().getHours();
    const min = new Date().getMinutes();
    const sec = new Date().getSeconds();

    Object.keys(archivos).forEach(function(key) {
      let valorDinamico = Math.floor(new Date().getTime() / 1000);
      let nombre = archivos[key].name;
      let extension = nombre.split(".").pop();
      archivos[key].alias = (
        nombre.split(".")[0] +
        "_" +
        valorDinamico +
        "." +
        extension
      )
        .replace(/\s/g, "_")
        .toLowerCase();
    });
    const fechafinal =
      fecha + "/" + month + "/" + year + " " + hours + ":" + min + ":" + sec;
    const textoBusqueda = nuevoCaso.puntoVenta + " " + nuevoCaso.titulo;

    let keywords = crearKeyword(textoBusqueda);

    this.props.firebase.guardarDocumento(archivos).then(arregloUrls => {
      nuevoCaso.fotos = arregloUrls;
      nuevoCaso.keywords = keywords;
      // alert(keywords);
      nuevoCaso.fecha = fechafinal;
      this.props.firebase.db
        .collection("Casos")
        .add(nuevoCaso)
        .then(success => {
          this.props.history.push("/");
        })
        .catch(error => {
          openMensajePantalla({
            open: true,
            mensaje: error
          });
        });
    });
  };

  subirFotos = documentos => {
    Object.keys(documentos).forEach(function(key) {
      documentos[key].urlTemp = URL.createObjectURL(documentos[key]);
    });

    this.setState({
      archivos: this.state.archivos.concat(documentos)
    });
  };

  eliminarFoto = nombreFoto => () => {
    this.setState({
      archivos: this.state.archivos.filter(archivo => {
        return archivo.name !== nombreFoto;
      })
    });
  };

  render() {
    //const options = ["one", "two", "three"];
    let imagenKey = uuid.v4();

    return (
      <Container style={style.container}>
        <Paper style={style.paper}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" style={style.link} href="/">
                  <HomeIcon style={style.homeIcon} />
                  Home
                </Link>
                <Typography color="textPrimary"> Nuevo Caso </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
        </Paper>

        <Paper style={style.paper2}>
          <Grid container spacing={3} justify="center">
            <Grid item xs={12} md={4}>
              <TextField
                name="estado"
                label="Estado del caso"
                fullWidth
                multiline
                onChange={this.entraDatosEnEstado}
                value={this.state.nuevoCaso.estado}
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
                onChange={this.entraDatosEnEstado}
                value={this.state.nuevoCaso.prioridad}
              >
                <option value="" />
                <option value="ALTA">Alta</option>
                <option value="MEDIA">Media</option>
                <option value="BAJA">Baja</option>
              </NativeSelect>
            </Grid>

            <Grid item xs={12} md={6}>
              <Select fullWidth onChange={this.entraDatosEnEstado} >
                {this.state.arregloPuntoVenta.map(info=>(
                  <MenuItem key={info.nombre} value={info.nombre}>
                    {info.nombre}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="titulo"
                label="Titulo del caso"
                fullWidth
                multiline
                onChange={this.entraDatosEnEstado}
                value={this.state.nuevoCaso.titulo}
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <TextField
                name="descripcion"
                label="Descripción del caso"
                fullWidth
                multiline
                onChange={this.entraDatosEnEstado}
                value={this.state.nuevoCaso.descripcion}
              />
            </Grid>
          </Grid>

          <Grid container justify="center">
            <Grid item xs={12} sm={6}>
              <ImageUploader
                key={imagenKey}
                widthIcon={true}
                buttonText="Seleccionar Imagenes"
                onChange={this.subirFotos}
                imgExtension={[".jpg", ".gif", ".png", ".jpeg"]}
                maxFileSize={5242880}
              />
            </Grid>
          </Grid>

          <Grid item xs={12} md={12}>
            <Table>
              <TableBody>
                {this.state.archivos.map((archivo, i) => (
                  <TableRow key={i}>
                    <TableCell align="left">
                      <img src={archivo.urlTemp} style={style.foto} />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={this.eliminarFoto(archivo.name)}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
                onClick={this.guardarNuevoCaso}
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

export default consumerFirebase(NuevoCaso);
