import { List, ListItem, ListItemText, Divider } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
//import Collapse from "@material-ui/core/Collapse";

export const MenuIzquierda = ({ classes }) => (
  <div className={classes.list}>
    <List>
      <ListItem component={Link} button to="/auth/perfil">
        <i className="material-icons">account_box</i>
        <ListItemText
          classes={{ primary: classes.ListItemText }}
          primary="Perfil"
        />
      </ListItem>
    </List>
    <Divider />
    <List>
      <ListItem component={Link} button to="/caso/nuevo">
        <i className="material-icons">add_box</i>
        <ListItemText
          classes={{ primary: classes.ListItemText }}
          primary="Nuevo Caso"
        />
      </ListItem>

      <ListItem component={Link} button to="/punto/nuevo">
        <i className="material-icons">add_box</i>
        <ListItemText
          classes={{ primary: classes.ListItemText }}
          primary="Nuevo Punto"
        />
      </ListItem>

      <ListItem component={Link} button to="">
        <i className="material-icons">business</i>
        <ListItemText
          classes={{ primary: classes.ListItemText }}
          primary="Casos"
        />
      </ListItem>

      <ListItem component={Link} button to="">
        <i className="material-icons">mail_outline</i>
        <ListItemText
          classes={{ primary: classes.ListItemText }}
          primary="Mensajes"
        />
      </ListItem>

      <ListItem component={Link} button to="/lista/casos">
        <i className="material-icons">mail_outline</i>
        <ListItemText
          classes={{ primary: classes.ListItemText }}
          primary="ListaCasos"
        />
      </ListItem>

    </List>
  </div>
);
