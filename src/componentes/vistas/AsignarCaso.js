import React, { Component } from "react";
import {
  Container,
  MenuItem,
  Paper,
  Select,
  Grid,
  Breadcrumbs,
  Link,
  Typography
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
  }
};

class AsignarCaso extends Component {
  state = {
    PuntoVenta: []
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

    this.setState({
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
                <Typography color="textPrimary">Editar Caso</Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
        </Paper>

        <Paper style={style.paper2}>
          <Grid item xs={12} md={12}>
            <Select fullWidth>
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
        </Paper>
        
      </Container>
    );
  }
}

export default consumerFirebase(AsignarCaso);
