import React, { Component } from "react";
import { consumerFirebase } from "../../server";
import {
  Paper,
  Container,
  Grid,
  Link,
  Typography,
  Breadcrumbs,
  TextField,
  InputLabel,
  NativeSelect,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import ImageUploader from "react-images-upload";
import uuid from "uuid";
import { crearKeyword } from "../../sesion/actions/Keyword";

const style = {
  container: {
    paddingTop: "20px"
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
  submit: {
    marginTop: 15,
    marginBottom: 10
  },
  fotoCaso: {
    height: "100px"
  }
};

class EditarCaso extends Component {
  state = {
    caso: {
      puntoVenta: "",
      fecha: "",
      titulo: "",
      descripcion: "",
      estado: "",
      prioridad: "",
      fotos: []
    }
  };

  cambiarDato = e => {
    let caso = Object.assign({}, this.state.caso);
    caso[e.target.name] = e.target.value;
    this.setState({ caso });
  };

  subirImagenes = imagenes => {
    const { caso } = this.state; // importar caso de la variable estado

    const { id } = this.props.match.params; // Extraer el id de la url

    // Agregar un nombre dinamico por cada imagen que necesites subir al firestorage

    Object.keys(imagenes).forEach(key => {
      let codigoDinamico = uuid.v4();
      let nombreImagen = imagenes[key].name;
      let extension = nombreImagen.split(".").pop();
      imagenes[key].alias = (
        nombreImagen.split(".")[0] +
        "_" +
        codigoDinamico +
        "." +
        extension
      )
        .replace(/\s/g, "_")
        .toLowerCase();
    });

    this.props.firebase.guardarDocumento(imagenes).then(urlImagenes => {
      caso.fotos = urlImagenes; // imagenes almacenadas

      this.props.firebase.db
        .collection("Casos")
        .doc(id)
        .set(caso, { merge: true })
        .then(success => {
          this.setState({
            caso
          });
        });
    });
  };
  

  eliminarFoto = fotoUrl => async () => {
    console.log(fotoUrl);

    const { caso } = this.state;
    const { id } = this.props.match.params;

    let fotoID = fotoUrl.match(/[\w-]+.(jpg|png|jepg|gif|svg)/);
    fotoID = fotoID[0];

    await this.props.firebase.eliminarDocumento(fotoID);

    let fotoList = this.state.caso.fotos.filter(foto => {
      return foto !== fotoUrl;
    });

    caso.fotos = fotoList;

    this.props.firebase.db
      .collection("Casos")
      .doc(id)
      .set(caso, { merge: true })
      .then(success => {
        this.setState({ caso });
      });
  };


  
  /* Funciona cuando se carga la pagina */
  async componentDidMount() {
    /* Capturar el codigo de la url */
    const { id } = this.props.match.params;
    /* Objecto firebase */
    const casoCollection = this.props.firebase.db.collection("Casos");
    /* Se pasa el valor al collection para buscar el elemento en la base de datos */
    const casoDB = await casoCollection.doc(id).get();
    /*Actualizar todos los componentes de mi vista */
    this.setState({
      caso: casoDB.data()
    });
  }

  guardarCaso = () =>{

    const {caso} = this.state;
    const {id} = this.props.match.params;

    const textoBusqueda = caso.titulo + " " + caso.descripcion + " " + caso.prioridad;
    const keywords = crearKeyword(textoBusqueda);

    caso.keywords = keywords;

    this.props.firebase.db
    .collection("Casos")
    .doc(id)
    .set(caso, { merge: true})
    .then(success =>{
      this.props.history.push("/")
    })


  }


  render() {
    let uniqueID = uuid.v4;
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
                <Typography color="textPrimary">Editar Caso</Typography>
              </Breadcrumbs>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                name="estado"
                label="Estado del caso"
                fullWidth
                multiline
                onChange={this.cambiarDato}
                value={this.state.caso.estado}
              />
            </Grid>

            <Grid item xs={12} md={4}></Grid>

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
              >
                <option value="" />
                <option value="ALTA">Alta</option>
                <option value="MEDIA">Media</option>
                <option value="BAJA">Baja</option>
              </NativeSelect>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="puntoVenta"
                label="Punto de Venta"
                fullWidth
                onChange={this.cambiarDato}
                value={this.state.caso.puntoVenta}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="titulo"
                label="Titulo del caso"
                fullWidth
                multiline
                onChange={this.cambiarDato}
                value={this.state.caso.titulo}
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <TextField
                name="descripcion"
                label="Descripción del caso"
                fullWidth
                rowsMax="4"
                onChange={this.cambiarDato}
                value={this.state.caso.descripcion}
              />
            </Grid>
          </Grid>

          <Grid container justify="center">
            <Grid item xs={12} md={12} sm={6}>
              <ImageUploader
                key={uniqueID}
                widthIcon={true}
                buttonText="Seleccionar Imagenes"
                onChange={this.subirImagenes}
                imgExtension={[".jpg", ".gif", ".png", ".jpeg"]}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Table>
                <TableBody>
                  {this.state.caso.fotos
                    ? this.state.caso.fotos.map((foto, i) => (
                        <TableRow key={i}>
                          <TableCell align="left">
                            <img src={foto} style={style.fotoCaso} />
                          </TableCell>
                          <TableCell align="left">
                            <Button
                              variant="contained"
                              color="secondary"
                              size="small"
                              onClick={this.eliminarFoto(foto)}
                            >
                              Eliminar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    : ""}
                </TableBody>
              </Table>
            </Grid>
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
                onClick={this.guardarCaso}
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

export default consumerFirebase(EditarCaso);
