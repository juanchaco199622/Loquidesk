export const initialState = {
  usuario : {
    nombre :"",
    apellido : "",
    email : "",
    telefono : "",
    id : "",
    foto : ""
  },
  autenticado : false
}

const sesionReducer = (state= initialState, action) => {
  switch (action.type) {
    case "INICIAR_SESION":
      return {
        ...state,
        usuario: action.sesion,
        autenticado: action.autenticado
      };// validado
    case "CAMBIAR_SESION":
      return {
        ...state,
        usuario: action.nuevoUsuario,
        autenticado: action.autenticado
      };// validado
      case "SALIR_SESION" :
      return {
          ...state,
          usuario : action.nuevoUsuario,
          autenticado: action.autenticado
      };// validado
      default:
          return state;
  }
};

export default sesionReducer;

// validado todo