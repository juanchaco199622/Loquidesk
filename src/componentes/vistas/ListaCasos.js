import React, { Component } from "react";
import {
  Paper,
  Grid,
  Typography,
  TextField,
  Container,
  Breadcrumbs,
  Link,
  CardMedia,
  Card,
  CardContent,
  CardActions,
  Button,
  ButtonGroup
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import { consumerFirebase } from "../../server";
import logo from "../../logo.svg";
import { withStyles } from "@material-ui/core/styles";
import BorderColor from "@material-ui/icons/BorderColor";
import DeleteIcon from "@material-ui/icons/Delete";
import ArrowLeft from '@material-ui/icons/ArrowLeft';
import ArrowRight from '@material-ui/icons/ArrowRight';


const style = {
  cardGrid: {
    paddingTop: 8,
    paddingBottom: 8
  },
  paper: {
    backgroundColor: "#f5f5f5",
    padding: "20px",
    minHeight: 650
  },
  link: {
    display: "flex"
  },
  gridTextfield: {
    marginTop: "20px"
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  cardMedia: {
    paddingTop: "56.25%"
  },
  cardContent: {
    flexGrow: 1
  },
  containerButton: {
    margin: "10px",
    justifyContent: "center"
  }
};

class ListaCasos extends Component {
  state = {
    casos: [],
    textoBusqueda: ""
  };

  cambiarBusquedaTexto = e => {
    const self = this;
    self.setState({
      [e.target.name]: e.target.value
    });

    if (self.state.typingTimeout) {
      clearTimeout(self.state.typingTimeout);
    }

    self.setState({
      name: e.target.value,
      typing: false,
      typingTimeout: setTimeout(goTime => {
        let objectQuery = this.props.firebase.db
          .collection("Casos")
          .orderBy("puntoVenta")
          .where(
            "keywords",
            "array-contains",
            self.state.textoBusqueda.toLowerCase()
          );

        objectQuery.get().then(snapshot => {
          const arrayCasos = snapshot.docs.map(doc => {
            let data = doc.data();
            let id = doc.id;
            return { id, ...data };
          });
          this.setState({
            casos: arrayCasos
          });
        });
      }, 500)
    });
  };

  async componentDidMount() {
    let objectQuery = this.props.firebase.db
      .collection("Casos")
      .orderBy("puntoVenta");
    const snapshot = await objectQuery.get();

    const arrayCasos = snapshot.docs.map(doc => {
      let data = doc.data();
      let id = doc.id;
      return { id, ...data };
    });

    this.setState({
      casos: arrayCasos
    });
  }

  eliminarCaso = id => {
    this.props.firebase.db
      .collection("Casos")
      .doc(id)
      .delete()
      .then(success => {
        this.eliminarCasoDeListadoEstado(id);
      });
  };

  eliminarCasoDeListadoEstado = id => {
    const casoListaNueva = this.state.casos.filter(caso => caso.id !== id);
    this.setState({
      casos: casoListaNueva
    });
  };

  editarCaso = id => {
    this.props.history.push("/lista/" + id);
  };
  asignarCaso = id =>{
    this.props.history.push("/caso/asignarcaso/"+ id );
  }

  render() {
    return (
      <Container style={style.cardGrid}>
        <Paper style={style.paper}>
          <Grid item xs={12} sm={12}>
            <Breadcrumbs arial-label="breadcrumbs">
              <Link color="inherit" style={style.link} href="/">
                <HomeIcon />
                Home
              </Link>
              <Typography color="textPrimary">Mis Casos</Typography>
            </Breadcrumbs>
          </Grid>
          <Grid item xs={12} sm={6} style={style.gridTextfield}>
            <TextField
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
              name="textoBusqueda"
              variant="outlined"
              label="Ingrese el caso a buscar ?.."
              onChange={this.cambiarBusquedaTexto}
              value={this.state.textoBusqueda}
            />
          </Grid>

          <Grid item xs={12} sm={12} style={style.barraBoton}>
              <Grid container spacing={1} direction="column" alignItems='flex-end' >
                <ButtonGroup size='small' arial-label="small outlined group">
                  <Button>
                    <ArrowLeft/>
                  </Button>
                  <Button>
                    <ArrowRight/>
                  </Button>
                </ButtonGroup>
              </Grid>
          </Grid>

          <Grid item xs={12} sm={12} style={style.gridTextfield}>
            <Grid container spacing={4}>
              {this.state.casos.map(card => (
                <Grid item key={card.id} xs={12} sm={6} md={4}>
                  <Card style={style.card}>
                    <CardMedia
                      style={style.cardMedia}
                      image={
                        card.fotos
                          ? card.fotos[0]
                            ? card.fotos[0]
                            : logo
                          : logo
                      }
                      title="Mis Casos"
                    />
                    <CardContent style={style.cardContent}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {"Titulo : " + card.titulo}
                      </Typography>
                      <Typography gutterBottom variant="h5" component="h2">
                        {card.prioridad}
                      </Typography>
                    </CardContent>

                    <Grid item xs={12} sm={12} md={12}>
                      <Button
                        type="button"
                        fullWidth
                        size="large"
                        variant="contained"
                        color="primary"
                        onClick={() => this.asignarCaso(card.id)}
                      >
                        Asignar
                      </Button>
                    </Grid>

                    <CardActions spacing={2} alingItem = 'center' >
                      <Button
                        item
                        size="small"
                        variant="contained"
                        className={this.props.classes.button2}
                        onClick={() => this.editarCaso(card.id)}
                        startIcon={<BorderColor />}
                      >
                        Editar
                      </Button>

                      <Button
                        item
                        size="small"
                        variant="contained"
                        className={this.props.classes.button}
                        startIcon={<DeleteIcon />}
                        onClick={() => this.eliminarCaso(card.id)}
                      >
                        Eliminar
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }
}

export default withStyles({
  button: {
    color: "#fff",
    backgroundColor: "#9a0036"
  },
  button2: {
    color: "#fff",
    backgroundColor: "#02c59b"
  }
})(consumerFirebase(ListaCasos));
